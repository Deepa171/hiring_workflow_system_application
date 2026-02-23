const Candidate = require('../models/candidate.model');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const { logActivity } = require('../services/activityLog.service');

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    const uploadsDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${req.file.originalname}`;
    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, req.file.buffer);

    if (candidate.resume?.fileName) {
      const oldPath = path.join(uploadsDir, candidate.resume.fileName);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    candidate.resume = {
      url: `/uploads/${fileName}`,
      fileName: fileName
    };

    await candidate.save();

    await logActivity(
      'RESUME_UPLOADED',
      req.user.id,
      candidate._id,
      `Resume uploaded: ${req.file.originalname}`
    );

    res.json({ success: true, data: candidate });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    if (candidate.resume?.fileName) {
      const filePath = path.join(__dirname, '../../uploads', candidate.resume.fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    candidate.resume = undefined;
    await candidate.save();

    res.json({ success: true, message: 'Resume deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.downloadResume = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate || !candidate.resume?.fileName) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const filePath = path.join(__dirname, '../../uploads', candidate.resume.fileName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.download(filePath);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
