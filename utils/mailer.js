const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendConfirmationEmail = (toEmail) => {
  return transporter.sendMail({
    from: `"Wisdom of Ashtavakra" <${process.env.EMAIL_FROM}>`,
    to: toEmail,
    subject: "🧘 You're subscribed to Ashtavakra's Wisdom",
    html: `
      <h2>🕉️ Thank you for subscribing</h2>
      <p>You'll receive weekly reflections from the timeless wisdom of Ashtavakra Gita.</p>
    `,
  });
};

const sendDigestEmail = async (toEmail, subject, html) => {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject,
    html,
  });
};

module.exports = { sendConfirmationEmail, sendDigestEmail };
