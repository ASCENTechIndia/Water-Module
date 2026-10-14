const {
  getULBDropdownRepo,
  getPremiseTypeDataRepo,
  getPremiseTypeDataStatusRepo,
  premiseTypeConfigSubmitRepo,
} = require("./config.repo");

async function getULBDropdownService() {
  return getULBDropdownRepo();
}

async function getPremiseTypeDataService(payload) {
  return getPremiseTypeDataRepo(payload);
}

async function getPremiseTypeDataStatusService(payload) {
  return getPremiseTypeDataStatusRepo(payload);
}

async function premiseTypeConfigSubmitService(payload) {
  return premiseTypeConfigSubmitRepo(payload);
}

module.exports = {
  getULBDropdownService,
  getPremiseTypeDataService,
  getPremiseTypeDataStatusService,
  premiseTypeConfigSubmitService,
};
