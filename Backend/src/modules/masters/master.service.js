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
  getBlockList,
  getZoneDropdownByWard,
  aowt_block_ins,
  getBankList,
  aowt_bank_ins,
  getRateList,
  getUsageTypeDropdown,
  getUsageSubTypeDropdown,
  getConnTypeDropdown,
  getConnSizeDropdown,
  getTaxDropdown,
  aowt_rate_ins,
  getRateDetails,
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

async function getBlockListService(payload) {
  return getBlockList(payload);
}

async function getZoneDropdownByWardService(payload) {
  return getZoneDropdownByWard(payload);
}

async function blockInsService(payload) {
  return aowt_block_ins(payload);
}

async function getBankListService() {
  return getBankList();
}

async function bankInsService(payload) {
  return aowt_bank_ins(payload);
}

async function getRateListService(payload) {
  return getRateList(payload);
}

async function getUsageTypeDropdownService(payload) {
  return getUsageTypeDropdown(payload);
}

async function getUsageSubTypeDropdownService(payload) {
  return getUsageSubTypeDropdown(payload);
}

async function getConnTypeDropdownService(payload) {
  return getConnTypeDropdown(payload);
}

async function getConnSizeDropdownService(payload) {
  return getConnSizeDropdown(payload);
}

async function getTaxDropdownService(payload) {
  return getTaxDropdown(payload);
}

async function getRateDetailsService(payload) {
  return getRateDetails(payload);
}

async function rateInsService(payload) {
  return aowt_rate_ins(payload);
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
  getBlockListService,
  getZoneDropdownByWardService,
  blockInsService,
  getBankListService,
  bankInsService,
  getRateListService,
  getUsageTypeDropdownService,
  getUsageSubTypeDropdownService,
  getConnTypeDropdownService,
  getConnSizeDropdownService,
  getTaxDropdownService,
  rateInsService,
  getRateDetailsService,
};
