const {
  getMenuList,
  getUlbDropdown,
  getUserList,
  getWardList,
  aowt_ward_ins,
  getZoneList,
  getZoneDetails,
  aowt_zone_ins,
  getWardDropdownByUlb,
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

async function getZoneListService(payload) {
  return getZoneList(payload);
}

async function getZoneDetailsService(payload) {
  return getZoneDetails(payload);
}

async function getWardDropdownByUlbService(payload) {
  return getWardDropdownByUlb(payload);
}

async function zoneInsService(payload) {
  return aowt_zone_ins(payload);
}

module.exports = {
  getMenuListService,
  getUlbDropdownService,
  getUserListService,
  getWardListService,
  wardInsService,
  getZoneListService,
  getZoneDetailsService,
  getWardDropdownByUlbService,
  zoneInsService,
};
