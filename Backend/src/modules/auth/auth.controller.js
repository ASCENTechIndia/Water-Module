const { loginUser } = require('./auth.service');
const { logApiSuccess, logApiError } = require('../../utils/log');
const { decryptPassword } = require('../../utils/login-password-crypto');
const jwt = require('jsonwebtoken');
const { config } = require('../../config/env');
const { sendEmail, getForgotPasswordTemplate } = require('../../utils/email');
const { generateResetToken, resetPasswordWithDbToken } = require('./auth.repo');

async function login(req, res, next) {
  try {
    const payload = req.body;

    // let decryptedPassword;
    // try {
    //   decryptedPassword = decryptPassword(payload.password);
    // } catch (_error) {
    //   logApiError(req, 400, 'Invalid encrypted password', 'Login failed: invalid encrypted password payload');
    //   return res.fail('Invalid encrypted password', 400);
    // }

    const normalizedUserId = payload.userId.startsWith('E')
      ? payload.userId
      : `E${payload.userId}`;

    const result = await loginUser(normalizedUserId, payload.password);

    if (!result.success) {
      logApiError(req, 401, result.message, `Login failed for user: ${normalizedUserId}`);
      return res.fail(result.message, 401, { errorCode: result.errorCode });
    }

    logApiSuccess(req, 200, { userId: result.user.userId, userName: result.user.userName }, `Login successful for user: ${result.user.userName}`);

    return res.ok({ token: result.token, user: result.user });
  } catch (error) {
    logApiError(req, 500, error.message, 'Login controller error');
    return next(error);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    
    // 1. Generate reset token from DB procedure
    const result = await generateResetToken(email);
    
    // Check if procedure returned an error
    // In this Oracle DB, success can be 0, -100, or it might return a success message in errorMsg
    const isSuccessMessage = result.errorMsg && result.errorMsg.toLowerCase().includes('successfully');
    const isSuccessCode = result.errorCode === 0 || result.errorCode === -100 || String(result.errorCode) === '0' || String(result.errorCode) === '-100';

    if (!isSuccessCode && !isSuccessMessage) {
      logApiError(req, 400, result.errorMsg || 'Error generating token', `Forgot password failed: ${email}. ErrorCode: ${result.errorCode}`);
      return res.ok({ message: 'If the email exists, a reset link will be sent.' }); 
    }

    if (!result.token) {
      logApiError(req, 404, 'No token generated', `Forgot password failed: no token for ${email}`);
      return res.ok({ message: 'If the email exists, a reset link will be sent.' }); 
    }

    // 2. Use DB token and userId for the link
    const token = result.token;
    const userId = result.userId;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendUrl}/auth/reset-password?userId=${userId}&token=${token}`;
    
    // TEMPORARY LOG FOR TESTING: 
    console.log('\n--- TEMPORARY TESTING LINK ---');
    console.log(`UserId: ${userId}`);
    console.log(`Token: ${token}`);
    console.log(`Reset Link: ${resetLink}`);
    console.log('------------------------------\n');

    const htmlTemplate = getForgotPasswordTemplate(resetLink);
    
    // 3. Send email
    const emailSent = await sendEmail({
      to: email,
      subject: 'Password Reset Request',
      html: htmlTemplate
    });

    if (!emailSent) {
      return res.fail('Failed to send reset email. Please try again later.', 500);
    }

    logApiSuccess(req, 200, { email }, `Forgot password email sent to ${email}`);
    return res.ok({ message: 'If the email exists, a reset link will be sent.' });
  } catch (error) {
    logApiError(req, 500, error.message, 'Forgot password controller error');
    return next(error);
  }
}

async function resetPasswordWithToken(req, res, next) {
  try {
    const { userId, token, newPassword } = req.body;

    if (!userId || !token || !newPassword) {
      return res.fail('Missing required fields: userId, token, or newPassword.', 400);
    }

    // 1. Update password using DB procedure
    const result = await resetPasswordWithDbToken(userId, token, newPassword);

    const isSuccessMessage = result.errorMsg && result.errorMsg.toLowerCase().includes('successfully');
    const isSuccessCode = result.errorCode === 0 || result.errorCode === -100 || String(result.errorCode) === '0' || String(result.errorCode) === '-100';

    if (!isSuccessCode && !isSuccessMessage) {
      logApiError(req, 400, result.errorMsg || 'Error resetting password', `Reset password failed for ${userId}`);
      return res.fail(result.errorMsg || 'Invalid or expired reset token.', 400);
    }

    logApiSuccess(req, 200, { userId }, `Password reset successful for ${userId}`);
    return res.ok({ message: 'Password has been reset successfully.' });
  } catch (error) {
    logApiError(req, 500, error.message, 'Reset password controller error');
    return next(error);
  }
}

module.exports = {
  login,
  forgotPassword,
  resetPasswordWithToken,
};
