const nodemailer = require('nodemailer');
const { logger } = require('./logger'); 

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
  port: process.env.SMTP_PORT || 2525,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Global function to send an email with an HTML template.
 * @param {Object} options Email options
 * @param {string} options.to Recipient email address
 * @param {string} options.subject Email subject
 * @param {string} options.html HTML content of the email
 * @returns {Promise<boolean>} True if sent successfully, false otherwise
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Water module" <${process.env.SMTP_FROM || 'noreply@example.com'}>`,
      to,
      subject,
      html,
    });
    
    logger.info(`Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error(`Error sending email to ${to}: ${error.message}`);
    return false;
  }
};

/**
 * Template for the forgot password email.
 * This can be used as a reference for creating other email templates.
 * @param {string} resetLink The link to reset the password
 * @returns {string} HTML string
 */
const getForgotPasswordTemplate = (resetLink) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
      <p style="color: #555; line-height: 1.5;">
        You recently requested to reset your password for your Water Module account. 
        Click the button below to set a new password.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #0056b3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p style="color: #555; line-height: 1.5;">
        If you did not request a password reset, please ignore this email or reply to let us know. 
        This password reset link is only valid for a limited time.
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="color: #999; font-size: 12px; text-align: center;">
        Water Module Team
      </p>
    </div>
  `;
};

module.exports = {
  sendEmail,
  getForgotPasswordTemplate,
};
