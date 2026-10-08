const { z } = require('zod');

const loginSchema = z.object({
  userId: z.string().trim().min(1),
  password: z.string().min(1),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordWithTokenSchema = z.object({
  userId: z.string().min(1),
  token: z.string().min(1),
  newPassword: z.string().min(8),
});

module.exports = {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordWithTokenSchema,
};
