const {
  getMenuList,
  getUlbDropdown,
  getUserList,
  getWardList,
  aowt_ward_ins,
} = require("./master.repo");

async function getMenuListService(payload) {
  return getMenuList(payload);
}

async function getUlbDropdownService() {
  return getUlbDropdown();
}

async function getUserListService(payload) {
  return getUserList(payload);
}

async function getWardListService(payload) {
  return getWardList(payload);
}

async function wardInsService(payload) {
  return aowt_ward_ins(payload);
}

module.exports = {
  getMenuListService,
  getUlbDropdownService,
  getUserListService,
  getWardListService,
  wardInsService
};
