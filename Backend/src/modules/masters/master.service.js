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
  getUlbTipList,
  aowt_ulbtip_ins,
  getUlbTipDetails,
  getUsageTypeList,
  aowt_usagetype_ins,
  getConsumerTypeList,
  aowt_consumertype_ins,
  getBillFreqList,
  aowt_billfreq_ins,
  getUsageTypeDropdownMas,
  getUsageSubTypeList,
  aowt_usagesubtype_ins,
  getGapCodeList,
  aowt_gapcode_ins,
  getPlumberList,
  aowt_plumber_ins,
  getConnectionList,
  aowt_connstatus_ins,
  getTaxList,
  getApplyOnDropdown,
  aowt_tax_ins,
  getTaxDetails,
  getMeterOwnerList,
  aowt_meterowner_ins,
  getConnTypeList,
  aowt_conntype_ins,
  getConnCodeList,
  aowt_conncode_ins,
  getConnSizeList,
  aowt_connsize_ins,
  getBillingMethodList,
  aowt_billingmethod_ins,
  getPremiseTypeList,
  aowt_premisetype_ins,
  getCollCenterList,
  aowt_collcentre_ins,
  getServiceList,
  aowt_servicemas_ins,
  getChargeList,
  aowt_chargestype_ins,
  getAccTaxConfigList,
  getTaxNameDropdown,
  getUsageTypeNameDropdown,
  aowt_acctax_ins,
  getAccTaxConfigDetails,
  getMicrCodeList,
  aowt_micrcode_ins,
  getBillScheduleList,
  getBillFreqDropdown,
  getFromMonthDropdown,
  aowt_billschedule_ins,
  getBillScheduleDetails,
  getConnAutoGerateList,
  getConnAutoGerateDetails,
  aowt_connectionnoconfig_ins,
  getProvChequeList,
  getProvChequeDetails,
  aowt_provchequeconfig_ins,
  getAllUserList,
  aowt_userallconfig_ins,
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

async function getUlbTipListService(payload) {
  return getUlbTipList(payload);
}

async function getUlbTipDetailsService(payload) {
  return getUlbTipDetails(payload);
}

async function ulbTipInsService(payload) {
  return aowt_ulbtip_ins(payload);
}

async function getUsageTypeListService() {
  return getUsageTypeList();
}

async function usageTypeInsService(payload) {
  return aowt_usagetype_ins(payload);
}

async function getConsumerTypeListService() {
  return getConsumerTypeList();
}

async function consumerTypeInsService(payload) {
  return aowt_consumertype_ins(payload);
}

async function getBillFreqListService() {
  return getBillFreqList();
}

async function billFreqInsService(payload) {
  return aowt_billfreq_ins(payload);
}

async function getUsageTypeDropdownMasService() {
  return getUsageTypeDropdownMas();
}

async function getUsageSubTypeListService(payload) {
  return getUsageSubTypeList(payload);
}

async function usageSubTypeInsService(payload) {
  return aowt_usagesubtype_ins(payload);
}

async function getGapCodeListService() {
  return getGapCodeList();
}

async function gapCodeInsService(payload) {
  return aowt_gapcode_ins(payload);
}

async function getPlumberListService() {
  return getPlumberList();
}

async function plumberInsService(payload) {
  return aowt_plumber_ins(payload);
}

async function getConnectionListService() {
  return getConnectionList();
}

async function connStatusInsService(payload) {
  return aowt_connstatus_ins(payload);
}

async function getTaxListService() {
  return getTaxList();
}

async function getApplyOnDropdownService() {
  return getApplyOnDropdown();
}

async function getTaxDetailsService(payload) {
  return getTaxDetails(payload);
}

async function taxInsService(payload) {
  return aowt_tax_ins(payload);
}

async function getMeterOwnerListService() {
  return getMeterOwnerList();
}

async function meterOwnerInsService(payload) {
  return aowt_meterowner_ins(payload);
}

async function getConnTypeListService() {
  return getConnTypeList();
}

async function connTypeInsService(payload) {
  return aowt_conntype_ins(payload);
}

async function getConnCodeListService() {
  return getConnCodeList();
}

async function connCodeInsService(payload) {
  return aowt_conncode_ins(payload);
}

async function getConnSizeListService() {
  return getConnSizeList();
}

async function connSizeInsService(payload) {
  return aowt_connsize_ins(payload);
}

async function getBillingMethodListService() {
  return getBillingMethodList();
}

async function billingMethodInsService(payload) {
  return aowt_billingmethod_ins(payload);
}

async function getPremiseTypeListService() {
  return getPremiseTypeList();
}

async function premiseTypeInsService(payload) {
  return aowt_premisetype_ins(payload);
}

async function getCollCenterListService(payload) {
  return getCollCenterList(payload);
}

async function collCentreInsService(payload) {
  return aowt_collcentre_ins(payload);
}

async function getServiceListService() {
  return getServiceList();
}

async function serviceMasInsService(payload) {
  return aowt_servicemas_ins(payload);
}

async function getChargeListService() {
  return getChargeList();
}

async function chargeTypeInsService(payload) {
  return aowt_chargestype_ins(payload);
}

async function getAccTaxConfigListService(payload) {
  return getAccTaxConfigList(payload);
}

async function getTaxNameDropdownService(payload) {
  return getTaxNameDropdown(payload);
}

async function getUsageTypeNameDropdownService(payload) {
  return getUsageTypeNameDropdown(payload);
}

async function accTaxInsService(payload) {
  return aowt_acctax_ins(payload);
}

async function getAccTaxConfigDetailsService(payload) {
  return getAccTaxConfigDetails(payload);
}

async function getMicrCodeListService(payload) {
  return getMicrCodeList(payload);
}

async function micrCodeInsService(payload) {
  return aowt_micrcode_ins(payload);
}

async function getBillScheduleListService(payload) {
  return getBillScheduleList(payload);
}

async function getBillFreqDropdownService(payload) {
  return getBillFreqDropdown(payload);
}

async function getFromMonthDropdownService() {
  return getFromMonthDropdown();
}

async function getBillScheduleDetailsService(payload) {
  return getBillScheduleDetails(payload);
}

async function billScheduleInsService(payload) {
  return aowt_billschedule_ins(payload);
}

async function getConnAutoGerateListService() {
  return getConnAutoGerateList();
}

async function getConnAutoGerateDetailsService(payload) {
  return getConnAutoGerateDetails(payload);
}

async function connNoConfigInsService(payload) {
  return aowt_connectionnoconfig_ins(payload);
}

async function getProvChequeListService() {
  return getProvChequeList();
}

async function getProvChequeDetailsService(payload) {
  return getProvChequeDetails(payload);
}

async function provChequeConfigInsService(payload) {
  return aowt_provchequeconfig_ins(payload);
}

async function getAllUserListService(payload) {
  return getAllUserList(payload);
}

async function userAllConfigInsService(payload) {
  return aowt_userallconfig_ins(payload);
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
  getUlbTipListService,
  getUlbTipDetailsService,
  ulbTipInsService,
  getUsageTypeListService,
  usageTypeInsService,
  getConsumerTypeListService,
  consumerTypeInsService,
  getBillFreqListService,
  billFreqInsService,
  getUsageTypeDropdownMasService,
  getUsageSubTypeListService,
  usageSubTypeInsService,
  getGapCodeListService,
  gapCodeInsService,
  getPlumberListService,
  plumberInsService,
  getConnectionListService,
  connStatusInsService,
  getTaxListService,
  getApplyOnDropdownService,
  getTaxDetailsService,
  taxInsService,
  getMeterOwnerListService,
  meterOwnerInsService,
  getConnTypeListService,
  connTypeInsService,
  getConnCodeListService,
  connCodeInsService,
  getConnSizeListService,
  connSizeInsService,
  getBillingMethodListService,
  billingMethodInsService,
  getPremiseTypeListService,
  premiseTypeInsService,
  getCollCenterListService,
  collCentreInsService,
  getServiceListService,
  serviceMasInsService,
  getChargeListService,
  chargeTypeInsService,
  getAccTaxConfigListService,
  getTaxNameDropdownService,
  getUsageTypeNameDropdownService,
  accTaxInsService,
  getAccTaxConfigDetailsService,
  getMicrCodeListService,
  micrCodeInsService,
  getBillScheduleListService,
  getBillFreqDropdownService,
  getFromMonthDropdownService,
  billScheduleInsService,
  getBillScheduleDetailsService,
  getConnAutoGerateListService,
  getConnAutoGerateDetailsService,
  connNoConfigInsService,
  getProvChequeListService,
  getProvChequeDetailsService,
  provChequeConfigInsService,
  getAllUserListService,
  userAllConfigInsService,
};
