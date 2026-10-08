const {
  callUserInsNew,
  callUserIns,
  callUserStatusUpdate,
  searchUsers,
  updateUserRole, branchListbyCategory, agentDetailsbyBrid,
  getUserDetails,
  getUserFormOptions,
  getBranchusercreation,
  getRoles,
  getUserDevice,
  callUserWebIns,
  findUserByUserId,
  getPageAccessByUserId,
  updatePageAccessByUserId,
  agentDetailsbyBridNew,
  findUserByNameId
} = require('./users.repo');

async function createUser(payload) {
  return callUserInsNew(payload);
}

async function createWebUser(payload) {
  return callUserInsNew(payload);
}

async function updateUser(payload) {
  return callUserIns(payload);
}

async function updateUserStatus(payload) {
  return callUserStatusUpdate(payload);
}

async function updateRole(payload) {
  return updateUserRole(payload);
}

async function search(payload) {
  return searchUsers(payload);
}

async function getUserDetailsById(userId) {
  return getUserDetails(userId);
}

async function getFormOptions(payload) {
  return getUserFormOptions(payload);
}

async function getRegions(zoneId) {
  return getUserFormOptions({ type: 'region', zoneId });
}

async function getBranches(regionId) {
  return getUserFormOptions({ type: 'branch', regionId });
}

async function branchList(payload) {
  return branchListbyCategory(payload);
}

async function agentList(payload) {
  return agentDetailsbyBrid(payload);
}

async function agentListNew(payload) {
  return agentDetailsbyBridNew(payload);
}

function computeStatus(roleId, userDeviceId) {
  if (Number(roleId) === 1) {
    return 'U';
  }
  if (Number(roleId) === 2) {
    return Number(userDeviceId) === 1 ? 'A' : 'U';
  }
  return 'A';
}

function normalizeRoleId(roleId) {
  if (typeof roleId === 'number') {
    return roleId;
  }
  const value = String(roleId || '').trim().toUpperCase();
  if (value === 'FOS') {
    return 1;
  }
  if (value === 'BRANCHOPERATIONS' || value === 'BRANCH OPERATIONS') {
    return 2;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function normalizeDeviceId(userDeviceId) {
  if (typeof userDeviceId === 'number') {
    return userDeviceId;
  }
  const value = String(userDeviceId || '').trim().toUpperCase();
  if (value === 'MOBILITY' || value === 'MOBILE') {
    return 1;
  }
  if (value === 'WEB') {
    return 3;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

async function submitMobileUser(payload, actor) {
  const normalizedRoleId = normalizeRoleId(payload.roleId);
  const normalizedDeviceId = normalizeDeviceId(payload.userDeviceId);

  const inPayload = {
    in_brid: Number(payload.branchId),
    in_userid: null,
    in_username: `${payload.firstName} ${payload.lastName}`.trim().toUpperCase(),
    in_mobno: Number(payload.mobileNo),
    in_email: payload.mdmId,
    in_usertypeid: normalizedDeviceId,
    in_DOB: payload.dob || null,
    in_proofno: payload.idProofNo || null,
    in_desgid: Number(payload.designationId || 0),
    in_roleid: normalizedRoleId,
    in_compcode: Number(payload.companyCodeId || 0),
    in_workid: Number(payload.workingForId),
    in_empid: Number(payload.employerId || 0),
    in_collectionid: Number(payload.collectionTeamId || 0),
    in_categoryid: Number(payload.categoryId || 0),
    in_mode: Number(payload.mode || 1),
    in_status: computeStatus(normalizedRoleId, normalizedDeviceId),
    in_Empcode: payload.pincode,
    in_firstname: payload.firstName.toUpperCase(),
    in_lastname: payload.lastName.toUpperCase(),
    in_prooftype: Number(payload.idProofType || 0),
    in_compid: Number(payload.compId || 10001),
    in_insby: actor,
    in_Requeststatus: payload.requestStatus || 'A',
    in_pincode: Number(payload.pincode),
  };

  return callUserInsNew(inPayload);
}

async function branchListforInsert(payload) {
  return getBranchusercreation(payload);
}

async function Roles() {
  return getRoles();
}

async function UserDevice() {
  return getUserDevice();
}

async function createWebUser(payload) {
  return callUserWebIns(payload);
}

async function searchByUserId(userId) {
  return findUserByUserId(userId);
}

async function submitUserStatusChange(payload) {
  const inPayload = {
    in_UserId: payload.userId.startsWith('E') ? payload.userId : `E${payload.userId}`,
    in_ddlstatus: payload.newStatus,
    in_reason: payload.reason || null,
    in_insby: payload.insby || 'SYSTEM'
  };

  return callUserStatusUpdate(inPayload);
}

async function getPageAccess(userId) {
  return getPageAccessByUserId(userId);
}

async function updatePageAccess(payload) {
  return updatePageAccessByUserId(payload);
}

async function searchByUserNameIdService(search) {
  return findUserByNameId(search);
}

module.exports = {
  createUser,
  createWebUser,
  updateUser,
  updateUserStatus,
  updateRole,
  search,
  getUserDetails: getUserDetailsById,
  getFormOptions,
  getRegions,
  getBranches,
  branchList,
  agentList,
  submitMobileUser,
  branchListforInsert, Roles,
  UserDevice,
  searchByUserId,
  submitUserStatusChange,
  getPageAccess,
  updatePageAccess,
  agentListNew,
  searchByUserNameIdService
};
