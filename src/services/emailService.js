const transporter = require('../config/sendgrid'); // Gmail SMTP under the hood (free)
const logger = require('../utils/logger');

async function sendMail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
  } catch (err) {
    // Don't crash the request flow if email fails - just log it
    logger.error(`Email send failed to ${to}: ${err.message}`);
  }
}

function welcomeTemplate(name) {
  return `<h2>Welcome, ${name}! 🎉</h2><p>Thanks for signing up. Start exploring our products!</p>`;
}

function orderConfirmationTemplate(order) {
  return `
    <h2>Order Confirmed! ✅</h2>
    <p>Your order <b>${order.order_number}</b> has been placed successfully.</p>
    <p>Total: ₹${order.total_amount}</p>
    <p>We'll notify you once it ships.</p>
  `;
}

function passwordResetTemplate(resetLink) {
  return `
    <h2>Password Reset Requested</h2>
    <p>Click the link below to reset your password. This link expires in 1 hour.</p>
    <a href="${resetLink}">${resetLink}</a>
    <p>If you didn't request this, please ignore this email.</p>
  `;
}

module.exports = {
  sendMail,
  welcomeTemplate,
  orderConfirmationTemplate,
  passwordResetTemplate,
};
