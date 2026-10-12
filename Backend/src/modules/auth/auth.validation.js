const { z } = require('zod');

const loginSchema = z.object({
  in_UserId: z.string().trim().min(1, 'in_UserId is required'),
  in_password: z.string().min(1, 'in_password is required'),
  in_macaddr: z.string().optional(),
  in_ipaddr: z.string().optional(),
  in_hostname: z.string().optional(),
  in_source: z.string().optional(),
  in_deptid: z.union([z.number(), z.string()]).optional(),
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
