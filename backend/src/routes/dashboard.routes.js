const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const { getStats } = require('../controllers/dashboard.controller');

router.get('/stats', auth(['HR', 'RECRUITER']), getStats);

module.exports = router;
