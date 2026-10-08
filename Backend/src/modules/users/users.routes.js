const express = require('express');
const validate = require('../../middleware/validate.middleware');
const { authRequired } = require('../../middleware/auth');
const {
  createUserSchema,
  updateUserSchema,
  userStatusSchema,
  userRoleSchema,
  userSearchSchema, branchSchema,
  agentSchema,
  userFormOptionsSchema,
  userRegionLookupSchema,
  userBranchLookupSchema,
  userWebSchema,
  mobileUserSubmitSchema,
  userModifyStatusSubmitSchema,
  userIdLookupSchema,
  pageAccessQuerySchema,
  pageAccessUpdateSchema,
  agentSchemaNew,
  userLookupSchema
} = require('./users.validation');
const {
  createUserHandler,
  updateUserHandler,
  updateUserStatusHandler,
  updateRoleHandler,
  searchHandler, branchListHandler,
  agentListHandler,
  getUserFormOptionsHandler,
  getRegionsHandler,
  getBranchesHandler,
  branchListforInsertHandler,
  rolesHandler,
  userDeviceHandler,
  createWebUserHandler,
  mobileUserSubmitHandler,
  submitUserModifyStatusHandler,
  searchByUserIdHandler,
  getPageAccessHandler,
  updatePageAccessHandler,
  agentListHandlerNew,
  searchByUserNameId
} = require('./users.controller');

const router = express.Router();

router.post('/', validate(createUserSchema), createUserHandler);
router.put('/', validate(updateUserSchema), updateUserHandler);
router.patch('/status', validate(userStatusSchema), updateUserStatusHandler);
router.patch('/role', validate(userRoleSchema), updateRoleHandler);
router.get('/search', validate(userSearchSchema, { source: 'query' }), searchHandler);
router.get('/mobile-form-options', validate(userFormOptionsSchema, { source: 'query' }), getUserFormOptionsHandler);
router.get('/regions', validate(userRegionLookupSchema, { source: 'query' }), getRegionsHandler);
router.get('/branches', validate(userBranchLookupSchema, { source: 'query' }), getBranchesHandler);
router.get('/getBranches', validate(branchSchema, { source: 'query' }), branchListHandler);
router.get('/getAgents', validate(agentSchema, {source: 'query'}), agentListHandler)
router.get('/getUsercreationbranches', validate(branchSchema, { source: 'query' }), branchListforInsertHandler);
router.get('/getRoles', rolesHandler);
router.get('/getUserDevices', userDeviceHandler);
router.post('/createWebUser', validate(userWebSchema), createWebUserHandler)
router.post('/add-mobile-user', validate(mobileUserSubmitSchema), mobileUserSubmitHandler);
router.get('/search-by-userid', validate(userIdLookupSchema, { source: 'query' }), searchByUserIdHandler);
router.post('/modify-status-submit', validate(userModifyStatusSubmitSchema), submitUserModifyStatusHandler);
router.get('/get-page-access', validate(pageAccessQuerySchema, { source: 'query' }), getPageAccessHandler);
router.post('/update-page-access', validate(pageAccessUpdateSchema), updatePageAccessHandler);
router.get('/getAgentsNew', validate(agentSchemaNew, { source: 'query' }), agentListHandlerNew);
router.get('/search-user-by-name-id', validate(userLookupSchema, { source: 'query' }), searchByUserNameId);

module.exports = router;

