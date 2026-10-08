const { z } = require('zod');

const nullableString = z.string().trim().optional().nullable();

const userBaseSchema = z.object({
  in_brid: z.number().int(),
  in_userid: nullableString,
  in_username: z.string().trim().min(1),
  in_mobno: z.number().int(),
  in_email: z.string().email(),
  in_usertypeid: z.number().int(),
  in_DOB: nullableString,
  in_proofno: nullableString,
  in_desgid: z.number().int(),
  in_roleid: z.number().int(),
  in_compcode: z.number().int(),
  in_workid: z.number().int(),
  in_empid: z.number().int().optional().nullable(),
  in_collectionid: z.number().int(),
  in_categoryid: z.number().int(),
  in_mode: z.number().int(),
  in_status: z.string().trim().min(1),
  in_Empcode: z.string().trim().min(1),
  in_firstname: nullableString,
  in_lastname: nullableString,
  in_prooftype: z.number().int(),
  in_compid: z.number().int(),
  in_insby: z.string().trim().min(1),
});

const createUserSchema = userBaseSchema.extend({
  in_Requeststatus: z.string().trim().default('A'),
  in_pincode: z.number().int().optional().nullable(),
});

const createWebUserSchema = createUserSchema;

const updateUserSchema = userBaseSchema.extend({
  in_Requeststatus: nullableString,
});

const userStatusSchema = z.object({
  in_UserId: z.string().trim().min(1),
  in_ddlstatus: z.string().trim().min(1),
  in_reason: nullableString,
  in_insby: z.string().trim().min(1),
});

const userRoleSchema = z.object({
  userId: z.string().trim().min(1),
  roleId: z.number().int(),
  mode: z.number().int().optional(),
});

const userSearchSchema = z.object({
  brid: z.string().trim().optional(),
  userId: z.string().trim().optional(),
  empCode: z.string().trim().optional(),
  status: z.string().trim().optional(),
  roleId: z.string().trim().optional(),
});

const userDetailSchema = z.object({
  userId: z.string().trim().min(1),
});

const userFormOptionsSchema = z.object({
  type: z.string().trim().optional(),
  workingForId: z.string().trim().optional(),
  branchId: z.string().trim().optional(),
  zoneId: z.string().trim().optional(),
  regionId: z.string().trim().optional(),
});

const userRegionLookupSchema = z.object({
  zoneId: z.string().trim().min(1),
});

const userBranchLookupSchema = z.object({
  regionId: z.string().trim().min(1),
});

const branchSchema = z.object({
  brcategory:z.string().trim().min(1),
  userLevel : z.string().trim().min(1)
})

const agentSchema = z.object({
  brid:z.string().trim().min(1)
})

const agentSchemaNew = z.object({
  brid: z.string().optional(),
  status: z.enum(['A', 'I']).optional(),   // Active / Inactive
  roleId: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional()
});

const numericString = z.string().trim().regex(/^\d+$/, 'Only numeric value allowed');

const mobileUserSubmitSchema = z.object({
  // UI visible required fields
  workingForId: z.coerce.number().int().positive(),
  pincode: numericString,
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  mobileNo: z.string().trim().regex(/^[1-9][0-9]{9}$/, 'Enter valid mobile no'),
  mdmId: z.string().trim().min(1),
  designationId: z.coerce.number().int().optional(),
  zoneId: z.coerce.number().int().optional(),
  regionId: z.coerce.number().int().optional(),
  branchId: z.coerce.number().int().positive(),
  roleId: z.union([z.coerce.number().int().optional(), z.string().trim().min(1)]).default(1),
  userDeviceId: z.union([z.coerce.number().int().optional(), z.string().trim().min(1)]).default(1),

  // non-UI / legacy optional fields
  dob: nullableString,
  employerId: z.coerce.number().int().nonnegative().default(0),
  collectionTeamId: z.coerce.number().int().nonnegative().default(0),
  categoryId: z.coerce.number().int().nonnegative().default(0),
  companyCodeId: z.coerce.number().int().nonnegative().default(0),
  idProofType: z.coerce.number().int().nonnegative().default(0),
  idProofNo: nullableString,
  mode: z.coerce.number().int().default(1),
  compId: z.coerce.number().int().default(10001),
  requestStatus: z.string().trim().default('A'),
});


const userWebSchema = z.object({
  in_brid: z.number().int(),
  in_userid: z.string().trim().min(1),
  in_username: z.string().trim().min(1),
  in_userpwd: nullableString, 
  in_mobno: z.number().int(),
  in_empid: z.number().int().optional().nullable(),
  in_usertypeid: z.number().int(),
  in_DOB: nullableString,
  in_proofno: nullableString,
  in_desgid: z.number().int(),
  in_roleid: z.number().int(),
  in_compcode: z.number().int(),
  in_workid: z.number().int(),
  in_empid: z.number().int().optional().nullable(),
  in_collectionid: z.number().int(),
  in_categoryid: z.number().int(),
  in_mode: z.number().int(),
  in_status: z.string().trim().min(1),
  in_Empcode: z.string().trim().min(1),
  in_firstname: z.string().trim().min(1),
  in_lastname:z.string().trim().min(1),
  in_prooftype: z.number().int(),
  in_compid: z.number().int(),
  in_insby: z.string().trim().min(1),
});

const userIdLookupSchema = z.object({
  userId: z.string().trim().min(1),
});

const userModifyStatusSubmitSchema = z.object({
  userId: z.string().trim().min(1),
  newStatus: z.string().trim().min(1),
  reason: nullableString,
  insby: z.string().trim().min(1).optional(),
});

const pageAccessQuerySchema = z.object({
  userId: z.string().trim().min(1),
});

const pageAccessUpdateSchema = z.object({
  userId: z.string().trim().min(1),
  menuIds: z.array(z.union([z.coerce.number().int(), z.string().trim().min(1)])).default([]),
});

const userLookupSchema = z.object({
  search: z
    .string()
    .trim()
    .min(1, "Search value is required")
    .max(50, "Too long input"),
});

module.exports = {
  createUserSchema,
  createWebUserSchema,
  updateUserSchema,
  userStatusSchema,
  userRoleSchema,
  userSearchSchema,
  userDetailSchema,
  userFormOptionsSchema,
  userRegionLookupSchema,
  userBranchLookupSchema,
  branchSchema,
  agentSchema,
  mobileUserSubmitSchema,
  userWebSchema,
  userIdLookupSchema,
  userModifyStatusSubmitSchema,
  pageAccessQuerySchema,
  pageAccessUpdateSchema,
  agentSchemaNew,
  userLookupSchema
};
