// index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Import routes
const candidateRoutes = require('./src/routes/candidate.routes');
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const dashboardRoutes = require('./src/routes/dashboard.routes');
const activityLogRoutes = require('./src/routes/activityLog.routes');

app.use('/api/candidates', candidateRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/activity-logs', activityLogRoutes);

app.get('/', (req, res) => {
  res.send('Backend API is running 🚀');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
}).then(() => {})
  .catch(err => {});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {});
