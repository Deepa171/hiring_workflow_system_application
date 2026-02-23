const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const ActivityLog = require('../models/activityLog.model');

router.get('/', auth(['HR', 'RECRUITER']), async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate('user', 'email role')
      .populate('candidate', 'name email')
      .sort({ date: -1 })
      .limit(50);
    
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/candidate/:id', auth(['HR', 'RECRUITER', 'INTERVIEWER']), async (req, res) => {
  try {
    const logs = await ActivityLog.find({ candidate: req.params.id })
      .populate('user', 'email role')
      .sort({ date: -1 });
    
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
