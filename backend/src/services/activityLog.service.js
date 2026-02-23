const ActivityLog = require('../models/activityLog.model');

const logActivity = async (action, userId, candidateId, details = '') => {
  try {
    await ActivityLog.create({
      action,
      user: userId,
      candidate: candidateId,
      details
    });
  } catch (error) {
  }
};

module.exports = { logActivity };
