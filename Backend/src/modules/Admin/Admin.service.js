const {
  getUserLocationTracking,
  getUserLastLogin,
  bucketSetter,
  fetchUsersWithPincodes,
  unassignCases,
  matrixDistanceInsertion,
  getaccCount,
  accountAllocation,
  fetchCorporationDetails,
} = require("./Admin.repo");

async function locationTrackingService(userId, cDate) {
  return getUserLocationTracking(userId, cDate);
}

async function lastLoginService(userId) {
  return getUserLastLogin(userId);
}

async function bucketSetterService() {
  return bucketSetter();
}

async function getUsersWithPincodesService() {
  return fetchUsersWithPincodes();
}

async function unassignCasesService(selections) {
  return unassignCases(selections);
}

async function matrixDistanceInsertionService() {
  return matrixDistanceInsertion();
}

async function accCountService() {
  return getaccCount();
}

async function allocateAccService() {
  return accountAllocation();
}

async function fetchCorporationDetailsService(payload) {
  return fetchCorporationDetails(payload);
}

module.exports = {
  locationTrackingService,
  lastLoginService,
  bucketSetterService,
  getUsersWithPincodesService,
  unassignCasesService,
  matrixDistanceInsertionService,
  accCountService,
  allocateAccService,
  fetchCorporationDetailsService,
};
