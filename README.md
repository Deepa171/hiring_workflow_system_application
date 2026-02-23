# Hiring Workflow System Application

A role-based recruitment management system built with Angular 24 (Standalone), Node.js, Express, and MongoDB. Features drag-and-drop candidate pipelines, interview scheduling, activity timelines, and secure authentication with role-based access control.

## Features

- **Role-Based Access Control**: HR, Recruiter, and Interviewer roles with specific permissions
- **Candidate Pipeline Management**: Drag-and-drop interface for moving candidates through hiring stages
- **Interview Scheduling**: Schedule interviews and assign interviewers
- **Resume Management**: Upload, download, and delete candidate resumes
- **Activity Timeline**: Track all actions performed on candidates
- **Email Notifications**: Automated emails for status changes
- **Feedback System**: Interviewers can submit feedback and recommendations

## Tech Stack

**Frontend:**
- Angular 24 (Standalone Components)
- Angular CDK (Drag & Drop)
- TypeScript
- RxJS

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Nodemailer
- Multer (File uploads)

## Installation

### Prerequisites
- Node.js (v18+)
- MongoDB
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
PORT=5000
```

Start server:
```bash
node index.js
```

### Frontend Setup

```bash
cd frontend
npm install
ng serve
```

Access at `http://localhost:4200`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Candidates
- `GET /api/candidates` - Get all candidates
- `GET /api/candidates/:id` - Get candidate by ID
- `POST /api/candidates` - Create candidate
- `PUT /api/candidates/:id/status` - Update status
- `PATCH /api/candidates/:id/add-note` - Add note
- `PATCH /api/candidates/:id/update-tags` - Update tags
- `PATCH /api/candidates/:id/schedule-interview` - Schedule interview
- `POST /api/candidates/:id/feedback` - Submit feedback
- `DELETE /api/candidates/:id` - Delete candidate

### Resume
- `POST /api/candidates/:id/upload-resume` - Upload resume
- `GET /api/candidates/:id/resume` - Download resume
- `DELETE /api/candidates/:id/resume` - Delete resume

### Dashboard
- `GET /api/dashboard/stats` - Get statistics

### Users
- `GET /api/users` - Get interviewers

### Activity Logs
- `GET /api/activity-logs` - Get all logs
- `GET /api/activity-logs/candidate/:id` - Get logs by candidate

## User Roles

**HR:**
- Full access to all features
- Can delete candidates
- Can schedule interviews

**Recruiter:**
- Manage candidates
- Update status, add notes, tags
- Schedule interviews

**Interviewer:**
- View assigned candidates
- Submit feedback
- View candidate details

## Candidate Status Flow

1. APPLIED
2. SHORTLISTED
3. INTERVIEW_SCHEDULED
4. INTERVIEWED
5. SELECTED / REJECTED

## License

MIT