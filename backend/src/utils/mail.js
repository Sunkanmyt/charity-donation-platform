const nodemailer = require("nodemailer");

// Configure transporter with IPv4 and socket timeouts to prevent Render hanging
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use SSL/TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // 16-character Google App Password (no spaces)
  },
  family: 4, // CRITICAL: Force IPv4 to bypass Render's IPv6 DNS routing issue
  connectionTimeout: 10000, // 10 seconds max to establish socket connection
  greetingTimeout: 10000, // 10 seconds max for SMTP handshake
  socketTimeout: 15000, // 15 seconds max for message transmission
});

// Verify SMTP connection on server startup
transporter.verify((error) => {
  if (error) {
    console.error("Nodemailer SMTP Connection Error:", error.message);
  } else {
    console.log("Nodemailer SMTP is ready to deliver messages");
  }
});

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Hope Share Platform" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
    });

    console.log(
      `Email sent successfully to ${to} (Message ID: ${info.messageId})`,
    );
    return info;
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error.message);
    throw error;
  }
};

module.exports = sendEmail;
