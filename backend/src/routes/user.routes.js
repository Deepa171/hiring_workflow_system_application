const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const User = require('../models/user.model');

router.get('/', auth(['HR', 'RECRUITER']), async (req, res) => {
  try {
    const users = await User.find({ role: 'INTERVIEWER' }).select('_id email role');
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
