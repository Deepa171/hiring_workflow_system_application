const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const Candidate = require('../models/candidate.model');
const { uploadResume, deleteResume, downloadResume } = require('../controllers/resume.controller');

const {
  createCandidate,
  updateStatus,
  addNote,
  updateTags,
  scheduleInterview
} = require('../controllers/candidate.controller');

/**
 * ===============================
 * GET ALL CANDIDATES (REAL FLOW)
 * ===============================
 */
router.get(
  '/',
  auth(['HR', 'RECRUITER', 'INTERVIEWER']),
  async (req, res) => {
    try {
      const candidates = await Candidate.find().sort({ createdAt: -1 });

      res.json({
        success: true,
        data: candidates
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/**
 * ===============================
 * ADD NEW CANDIDATE
 * ===============================
 */
router.post(
  '/',
  auth(['HR', 'RECRUITER']),
  createCandidate
);

/**
 * ===============================
 * UPDATE PIPELINE STATUS
 * ===============================
 */
router.put(
  '/:id/status',
  auth(['HR', 'RECRUITER']),
  updateStatus
);

/**
 * ===============================
 * ADD NOTE
 * ===============================
 */
router.patch(
  '/:id/add-note',
  auth(['HR', 'RECRUITER']),
  addNote
);

/**
 * ===============================
 * UPDATE TAGS
 * ===============================
 */
router.patch(
  '/:id/update-tags',
  auth(['HR', 'RECRUITER']),
  updateTags
);

/**
 * ===============================
 * SCHEDULE INTERVIEW
 * ===============================
 */
router.patch(
  '/:id/schedule-interview',
  auth(['HR', 'RECRUITER']),
  scheduleInterview
);

router.put(
  '/:id/schedule',
  auth(['HR']),
  scheduleInterview
);

/**
 * ===============================
 * SUBMIT FEEDBACK
 * ===============================
 */
router.post('/:id/feedback', auth(['INTERVIEWER']), async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate)
      return res.status(404).json({ message: 'Candidate not found' });

    if (candidate.feedbackLocked)
      return res.status(400).json({ message: 'Feedback already submitted' });

    candidate.feedback = {
      rating: req.body.rating,
      comments: req.body.comments,
      recommendation: req.body.recommendation,
      interviewer: req.user.email,
      submittedAt: new Date()
    };

    candidate.feedbackLocked = true;

    await candidate.save();

    res.json({
      success: true,
      data: candidate
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * ===============================
 * UPLOAD RESUME
 * ===============================
 */
router.post(
  '/:id/upload-resume',
  auth(['HR', 'RECRUITER']),
  upload.single('resume'),
  uploadResume
);

/**
 * ===============================
 * DOWNLOAD RESUME
 * ===============================
 */
router.get(
  '/:id/resume',
  auth(['HR', 'RECRUITER', 'INTERVIEWER']),
  downloadResume
);

/**
 * ===============================
 * DELETE RESUME
 * ===============================
 */
router.delete(
  '/:id/resume',
  auth(['HR', 'RECRUITER']),
  deleteResume
);

/**
 * ===============================
 * DELETE CANDIDATE (HR ONLY)
 * ===============================
 */
router.delete(
  '/:id',
  auth(['HR']),
  async (req, res) => {
    try {
      const candidate = await Candidate.findByIdAndDelete(req.params.id);
      if (!candidate) {
        return res.status(404).json({ message: 'Candidate not found' });
      }
      res.json({
        success: true,
        message: 'Candidate deleted successfully'
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/**
 * ===============================
 * GET CANDIDATE BY ID
 * ===============================
 */
router.get(
  '/:id',
  auth(['HR', 'RECRUITER', 'INTERVIEWER']),
  async (req, res) => {
    try {
      const candidate = await Candidate.findById(req.params.id);
      if (!candidate) {
        return res.status(404).json({ message: 'Candidate not found' });
      }

      res.json({
        success: true,
        data: candidate
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);


module.exports = router;
