const Candidate = require('../models/candidate.model');

exports.getStats = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    
    const stats = {
      totalCandidates: candidates.length,
      applied: candidates.filter(c => c.currentStatus === 'APPLIED').length,
      shortlisted: candidates.filter(c => c.currentStatus === 'SHORTLISTED').length,
      scheduled: candidates.filter(c => c.currentStatus === 'INTERVIEW_SCHEDULED').length,
      interviewed: candidates.filter(c => c.currentStatus === 'INTERVIEWED').length,
      selected: candidates.filter(c => c.currentStatus === 'SELECTED').length,
      rejected: candidates.filter(c => c.currentStatus === 'REJECTED').length
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
