const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    });
  } catch (error) {
  }
};

const sendShortlistedEmail = (candidateEmail, candidateName) => {
  const subject = '🎉 Congratulations! You have been Shortlisted';
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
        <h2 style="color: #075e22;">Congratulations ${candidateName}!</h2>
        <p>We are pleased to inform you that you have been shortlisted for the next round.</p>
        <p>Our team will contact you soon with further details.</p>
        <p style="margin-top: 30px;">Best regards,<br><strong>Recruitment Team</strong></p>
      </div>
    </div>
  `;
  return sendEmail(candidateEmail, subject, html);
};

const sendInterviewScheduledEmail = (candidateEmail, candidateName, interviewDate) => {
  const subject = '📅 Interview Scheduled';
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
        <h2 style="color: #060749;">Interview Scheduled</h2>
        <p>Dear ${candidateName},</p>
        <p>Your interview has been scheduled for:</p>
        <div style="background: #e8eaf6; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <strong>📅 Date: ${new Date(interviewDate).toLocaleDateString()}</strong>
        </div>
        <p>Please be prepared and join on time.</p>
        <p style="margin-top: 30px;">Best regards,<br><strong>Recruitment Team</strong></p>
      </div>
    </div>
  `;
  return sendEmail(candidateEmail, subject, html);
};

const sendSelectedEmail = (candidateEmail, candidateName) => {
  const subject = '🎊 Congratulations! You are Selected';
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
        <h2 style="color: #0db84a;">🎉 Congratulations ${candidateName}!</h2>
        <p>We are thrilled to inform you that you have been selected!</p>
        <p>Welcome to our team. Our HR will contact you with the offer letter and next steps.</p>
        <p style="margin-top: 30px;">Best regards,<br><strong>Recruitment Team</strong></p>
      </div>
    </div>
  `;
  return sendEmail(candidateEmail, subject, html);
};

const sendRejectedEmail = (candidateEmail, candidateName) => {
  const subject = 'Application Status Update';
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
        <h2 style="color: #333;">Application Status Update</h2>
        <p>Dear ${candidateName},</p>
        <p>Thank you for your interest in our company. After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.</p>
        <p>We encourage you to apply for future opportunities that match your skills.</p>
        <p style="margin-top: 30px;">Best regards,<br><strong>Recruitment Team</strong></p>
      </div>
    </div>
  `;
  return sendEmail(candidateEmail, subject, html);
};

module.exports = {
  sendShortlistedEmail,
  sendInterviewScheduledEmail,
  sendSelectedEmail,
  sendRejectedEmail
};
