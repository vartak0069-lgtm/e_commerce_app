const nodemailer = require('nodemailer');
require('dotenv').config();

// NOTE: Named sendgrid.js to match the folder structure guide, but implemented with
// FREE Gmail SMTP + App Password instead of paid SendGrid, so no credit card needed.
// Steps: Google Account -> Security -> 2-Step Verification -> App Passwords -> generate one.

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = transporter;
