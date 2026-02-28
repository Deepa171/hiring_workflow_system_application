const Candidate = require('../models/candidate.model');
const User = require('../models/user.model');
const { sendShortlistedEmail, sendInterviewScheduledEmail, sendSelectedEmail, sendRejectedEmail } = require('../services/email.service');
const { logActivity } = require('../services/activityLog.service');

/**
 * CREATE CANDIDATE
 * HR / Recruiter adds new candidate
 */
exports.createCandidate = async (req, res) => {
  
  try {
    const candidate = new Candidate({
      ...req.body,
      timeline: [
        {
          action: 'CREATED',
          message: 'Candidate added',
          performedBy: req.user?.role || 'SYSTEM'
        }
      ]
    });
    await candidate.save();
    res.status(201).json({
  success: true,
  message: 'Candidate created successfully',
  data: candidate
});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE CANDIDATE STATUS
 * HR / Recruiter changes pipeline stage
 */
exports.updateStatus = async (req, res) => {
  try {
    // 🔐 Only HR & RECRUITER can change status
if (req.user.role !== "HR" && req.user.role !== "RECRUITER") {
  return res.status(403).json({
    message: "You are not authorized to change status"
  });
}

    const { status } = req.body;

    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

    const oldStatus = candidate.currentStatus;

    // ✅ Allow all status transitions for dropdown
    candidate.currentStatus = status;
     candidate.timeline.push({
      action: 'STATUS_CHANGED',
      message: `Moved to ${status}`,
      performedBy: req.user?.role || 'SYSTEM'
    });
    await candidate.save();

    // Log activity
    await logActivity(
      'STATUS_CHANGED',
      req.user.id,
      candidate._id,
      `Changed status from ${oldStatus} to ${status}`
    );

    // Send email notifications
    if (candidate.email) {
      console.log(`Sending email to ${candidate.email} for status: ${status}`);
      if (status === 'SHORTLISTED') {
        await sendShortlistedEmail(candidate.email, candidate.name);
      } else if (status === 'SELECTED') {
        await sendSelectedEmail(candidate.email, candidate.name);
      } else if (status === 'REJECTED') {
        await sendRejectedEmail(candidate.email, candidate.name);
      }
    } else {
      console.log('No email found for candidate:', candidate.name);
    }

    res.json({ 
      message: 'Status updated successfully',
      candidate: candidate 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ADD NOTE
 * HR / Recruiter adds notes to candidate
 */
exports.addNote = async (req, res) => {
  try {
    if (req.user.role !== "HR" && req.user.role !== "RECRUITER") {
  return res.status(403).json({
    message: "You are not authorized to add notes"
  });
}

    const { note } = req.body;
    if (!note || note.trim().length < 3) {
      return res.status(400).json({ message: 'Note must be at least 3 characters' });
    }

    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

    candidate.notes.push(note);
     // ✅ TIMELINE ENTRY
    candidate.timeline.push({
      action: 'NOTE_ADDED',
      message: note,
      performedBy: req.user?.role || 'SYSTEM'
    });
    await candidate.save();

    // Log activity
    await logActivity(
      'NOTE_ADDED',
      req.user.id,
      candidate._id,
      `Added note: ${note}`
    );

    res.json({ success: true, data: candidate });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTags = async (req, res) => {
  try {
    if (req.user.role !== "HR" && req.user.role !== "RECRUITER") {
  return res.status(403).json({
    message: "You are not authorized to update tags"
  });
}

    const { tags } = req.body;
    if (!Array.isArray(tags) || !tags.length) {
      return res.status(400).json({ message: 'Tags must be a non-empty array' });
    }

    const candidate = await Candidate.findById(req.params.id);
    if (!candidate)
      return res.status(404).json({ message: 'Candidate not found' });

    // Add new tags to existing tags (avoid duplicates)
    const existingTags = candidate.tags || [];
    const newTags = tags.filter(tag => !existingTags.includes(tag));
    candidate.tags = [...existingTags, ...newTags];

    candidate.timeline.push({
      action: 'TAGS_UPDATED',
      message: newTags.join(', '),
      performedBy: req.user?.role || 'SYSTEM'
    });

    await candidate.save();

    res.json({ success: true, data: candidate });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * SCHEDULE INTERVIEW
 */
exports.scheduleInterview = async (req, res) => {
  try {
    if (req.user.role !== "HR") {
      return res.status(403).json({ message: "Only HR can schedule interviews" });
    }

    const { interviewDate, interviewerId } = req.body;
    if (!interviewDate || !interviewerId) {
      return res.status(400).json({ message: 'Interview date and interviewer ID are required' });
    }

    const interviewer = await User.findById(interviewerId);
    if (!interviewer) {
      return res.status(404).json({ message: 'Interviewer not found' });
    }

    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    candidate.interviewDate = new Date(interviewDate);
    candidate.assignedInterviewer = interviewerId;
    candidate.currentStatus = 'INTERVIEW_SCHEDULED';

    candidate.timeline.push({
      action: 'INTERVIEW_SCHEDULED',
      message: `Interview scheduled on ${new Date(interviewDate).toDateString()} with ${interviewer.email}`,
      performedBy: req.user?.role || 'SYSTEM'
    });

    await candidate.save();

    // Log activity
    await logActivity(
      'INTERVIEW_SCHEDULED',
      req.user.id,
      candidate._id,
      `Interview scheduled on ${new Date(interviewDate).toDateString()} with ${interviewer.email}`
    );

    // Send email notification
    if (candidate.email) {
      console.log(`Sending interview email to ${candidate.email}`);
      await sendInterviewScheduledEmail(candidate.email, candidate.name, interviewDate);
    } else {
      console.log('No email found for candidate:', candidate.name);
    }

    res.json({ success: true, data: candidate });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};