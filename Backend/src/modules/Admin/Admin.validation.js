const { z } = require('zod');


const userTracLocationSchema = z.object({
  userId: z.string().min(1, "UserId is required"),
  cDate: z.string().min(1, "Date is required"),
});

const lastLoginSchema = z.object({
  userId: z.string().min(1, "UserId is required"),
});

const unassignCasesSchema = z.object({
  selections: z.array(
    z.object({
      userId: z.string().min(1, 'userId is required'),
      pincodes: z.array(z.string().min(1, 'pincode is required')).min(1, 'At least one pincode is required'),
    })
  ).min(1, 'At least one user selection is required'),
});

module.exports = {
  userTracLocationSchema,
  lastLoginSchema,
  unassignCasesSchema,
}