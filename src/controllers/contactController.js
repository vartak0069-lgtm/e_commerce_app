const asyncHandler = require('../middleware/asyncHandler');
const emailService = require('../services/emailService');
const { ValidationError } = require('../utils/errors');
const { isValidEmail } = require('../utils/validators');

// POST /api/contact
const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !message) throw new ValidationError('Name and message are required');
  if (!isValidEmail(email)) throw new ValidationError('Please provide a valid email');

  const html = `
    <h3>New Contact Form Submission</h3>
    <p><strong>From:</strong> ${name} (${email})</p>
    <p><strong>Message:</strong></p>
    <p>${message.replace(/\n/g, '<br>')}</p>
  `;

  // Sends to your own support inbox (set via EMAIL_USER in .env - free Gmail SMTP)
  await emailService.sendMail(process.env.EMAIL_USER, `Contact Form: ${name}`, html);

  res.json({ success: true, message: 'Your message has been sent. We will get back to you soon.' });
});

module.exports = { submitContactForm };