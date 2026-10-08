const express = require('express');
const { login, forgotPassword, resetPasswordWithToken } = require('./auth.controller');
const validate = require('../../middleware/validate.middleware');
const { loginSchema, forgotPasswordSchema, resetPasswordWithTokenSchema } = require('./auth.validation');

const router = express.Router();

router.post('/login', validate(loginSchema), login);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password-with-token', validate(resetPasswordWithTokenSchema), resetPasswordWithToken);

module.exports = router;
