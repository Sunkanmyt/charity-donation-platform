const sendEmail = require("../utils/mail");
const emailTemplates = require("../templates/emails/emailTemplates");
const verifyAccountEmail = require("../templates/emails/verifyAccountEmail");

const sendVerificationEmail = async (user, verificationToken) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-account/${verificationToken}`;

  const email = verifyAccountEmail({
    firstName: user.firstName,
    verificationUrl,
  });

  await sendEmail({
    to: user.email,
    subject: email.subject,
    html: email.html,
  });
};

const sendLoginAlertEmail = async (user) => {
  const html = emailTemplates.loginAlert(
    user.firstName,
    user.lastLogin
  );

  await sendEmail({
    to: user.email,
    subject: "New Login to Your Account",
    html,
  });
};

const sendProfileUpdateEmail = async (user) => {
  const html = emailTemplates.profileUpdate(user.firstName);

  await sendEmail({
    to: user.email,
    subject: "Account Information Updated",
    html,
  });
};

const sendPasswordChangeEmail = async (user) => {
  const html = emailTemplates.passwordChange(user.firstName);

  await sendEmail({
    to: user.email,
    subject: "Password Changed Successfully",
    html,
  });
};

module.exports = {
  sendEmail,
  emailTemplates,
  sendVerificationEmail,
  sendLoginAlertEmail,
  sendProfileUpdateEmail,
  sendPasswordChangeEmail,
};