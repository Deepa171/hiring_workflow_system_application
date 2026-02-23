# Deployment Guide

## 📦 Database (Already Done ✅)
Your MongoDB Atlas is already configured and working.

## 🚀 Step 1: GitHub Upload

```bash
cd "e:\Hiring workflow system Application\Hiring_Workflow_System_Application"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hiring-workflow-system.git
git push -u origin main
```

## 🖥️ Step 2: Backend Deployment (Render)

1. Go to https://render.com
2. Sign up/Login with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: hiring-workflow-backend
   - **Root Directory**: backend
   - **Build Command**: npm install
   - **Start Command**: npm start
   - **Environment**: Node

6. Add Environment Variables (ek saath copy-paste karo):
   ```
   MONGO_URI=mongodb+srv://itsdk4838_db_user:e6SyWWWk3IspErLr@cluster0.xoymdew.mongodb.net/hiring_workflow?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=my_super_secret_key_123
   EMAIL_USER=dkan6406@gmail.com
   EMAIL_PASS=gewp vrul xshv knsw
   CLOUDINARY_CLOUD_NAME=dpooy85mi
   CLOUDINARY_API_KEY=426875285213151
   CLOUDINARY_API_SECRET=N1Sx9GoHIen45kzJwdeDNdwRcsM
   PORT=5000
   ```
   **Note**: Render pe "Add from .env" option hai, ya ek-ek karke add karo

7. Click "Create Web Service"
8. Copy your backend URL (e.g., https://hiring-workflow-backend.onrender.com)

## 🌐 Step 3: Frontend Deployment (Vercel)

1. Update API URLs in frontend services with your Render backend URL
2. Go to https://vercel.com
3. Sign up/Login with GitHub
4. Click "Add New" → "Project"
5. Import your GitHub repository
6. Configure:
   - **Framework Preset**: Angular
   - **Root Directory**: frontend
   - **Build Command**: npm run build
   - **Output Directory**: dist/frontend/browser

7. Click "Deploy"

## ✅ Post-Deployment

1. Update frontend services to use production backend URL
2. Test all features
3. Create test users using /api/auth/register endpoint

## 🔑 Test Credentials
Create users via API or use existing ones from your database.
