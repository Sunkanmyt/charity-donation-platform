const { BrevoClient } = require("@getbrevo/brevo");

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const response = await brevo.transactionalEmails.sendTransacEmail({
      subject,
      htmlContent: html,
      textContent: text,
      sender: {
        name: "Hope Share Platform",
        email: process.env.EMAIL_USER,
      },
      to: [{ email: to }],
    });

    console.log(
      `Email successfully delivered to ${to} (Message ID: ${response.messageId})`,
    );
    return response;
  } catch (error) {
    console.error(`Brevo delivery failed to ${to}:`, error.message);
    throw error;
  }
};

module.exports = sendEmail;
