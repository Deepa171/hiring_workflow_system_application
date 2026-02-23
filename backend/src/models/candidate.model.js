const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  roleApplied: { type: String, required: true },
  resume: {
    url: { type: String },
    fileName: { type: String }
  },
  currentStatus: {
    type: String,
    enum: ['APPLIED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'INTERVIEWED', 'SELECTED', 'REJECTED'],
    default: 'APPLIED'
  },
  assignedRecruiter: { type: String },  
  
assignedInterviewer: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
},     
  notes: [{ type: String }],                 
  tags: [{ type: String }],                  
  interviewDate: { type: Date },
  timeline: [
  {
    action: { type: String, required: true },
    message: { type: String },
    performedBy: { type: String }, // HR / Recruiter / Interviewer
    createdAt: { type: Date, default: Date.now }
  },
  
],
// 🔥 STEP-13: Interview Feedback
  feedback: {
    rating: { type: Number },
    comments: { type: String },
    recommendation: {
      type: String,
      enum: ['HIRE', 'HOLD', 'REJECT']
    },
    interviewer: { type: String }, // user id or name
    submittedAt: { type: Date, default: Date.now }
  },

  feedbackLocked: {
    type: Boolean,
    default: false
  }

            
}, { timestamps: true });                    

module.exports = mongoose.model('Candidate', candidateSchema);
