const express = require("express");
const {
  getMenuListController,
  getUlbDropdownController,
  getUserListController,
  getWardListController,
  wardInsController,
  getZoneListController,
  getZoneDetailsController,
  zoneInsController,
  getWardDropdownByUlbController,
  getBlockListController,
  getZoneDropdownByWardController,
  blockInsController,
  getBankListController,
  bankInsController,
  getRateListController,
  getUsageTypeDropdownController,
  getUsageSubTypeDropdownController,
  getConnTypeDropdownController,
  getConnSizeDropdownController,
  getTaxDropdownController,
  rateInsController,
  getRateDetailsController,
  getUlbTipListController,
  ulbTipInsController,
  getUlbTipDetailsController,
  getUsageTypeListController,
  usageTypeInsController,
  getConsumerTypeListController,
  consumerTypeInsController,
  getBillFreqListController,
  billFreqInsController,
  getUsageTypeDropdownMasController,
  getUsageSubTypeListController,
  usageSubTypeInsController,
  getGapCodeListController,
  gapCodeInsController,
  getPlumberListController,
  plumberInsController,
  getConnectionListController,
  connStatusInsController,
  getTaxListController,
  getApplyOnDropdownController,
  taxInsController,
  getTaxDetailsController,
} = require("./master.controller");
const validate = require("../../middleware/validate.middleware");
const {
  wardInsSchema,
  zoneInsSchema,
  blockInsSchema,
  bankInsSchema,
  rateInsSchema,
  ulbTipInsSchema,
  usageTypeInsSchema,
  consumerTypeInsSchema,
  billFreqInsSchema,
  usageSubTypeInsSchema,
  gapCodeInsSchema,
  plumberInsSchema,
  connStatusInsSchema,
  taxInsSchema,
} = require("./master.validation");

const router = express.Router();

router.get("/getMenuList", getMenuListController);
router.get("/getUserList", getUserListController);

// Ward Master
router.get("/getUlbDropdownController", getUlbDropdownController);
router.get("/getWardList", getWardListController);
router.post("/aowt_ward_ins", validate(wardInsSchema), wardInsController);

// Zone master
router.get("/getZoneList", getZoneListController);
router.get("/getZoneDetails", getZoneDetailsController);
router.get("/getWardName", getWardDropdownByUlbController);
router.post("/aowt_zone_ins", validate(zoneInsSchema), zoneInsController);

// Block master
router.get("/getBlockList", getBlockListController);
router.get("/getZoneDropdown", getZoneDropdownByWardController);
router.post("/aowt_block_ins", validate(blockInsSchema), blockInsController);

// Bank master
router.get("/getBankList", getBankListController);
router.post("/aowt_bank_ins", validate(bankInsSchema), bankInsController);

// Rate master
router.get("/getRateList", getRateListController);
router.get("/getUsageTypeDropdown", getUsageTypeDropdownController);
router.get("/getUsageSubTypeDropdown", getUsageSubTypeDropdownController);
router.get("/getConnectionTypeDropdown", getConnTypeDropdownController);
router.get("/getConnectionSize", getConnSizeDropdownController);
router.get("/getTaxDropdown", getTaxDropdownController);
router.get("/getRateDetails", getRateDetailsController);
router.post("/aowt_rate_ins", validate(rateInsSchema), rateInsController);

// ULB Tip master
router.get("/getUlbTipList", getUlbTipListController);
router.get("/getUlbTipDetails", getUlbTipDetailsController);
router.post("/aowt_ulbtip_ins", validate(ulbTipInsSchema), ulbTipInsController);

// Usage Type master
router.get("/usageTypeList", getUsageTypeListController);
router.post(
  "/aowt_usagetype_ins",
  validate(usageTypeInsSchema),
  usageTypeInsController,
);

// Consumer type master
router.get("/getConsumerTypeList", getConsumerTypeListController);
router.post(
  "/aowt_consumertype_ins",
  validate(consumerTypeInsSchema),
  consumerTypeInsController,
);

// Bill frequency master
router.get("/getBillFrequencyList", getBillFreqListController);
router.post(
  "/aowt_billfreq_ins",
  validate(billFreqInsSchema),
  billFreqInsController,
);

// Usage sub type master
router.get("/getUsageTypeDd", getUsageTypeDropdownMasController);
router.get("/getUsageSubTypeList", getUsageSubTypeListController);
router.post(
  "/aowt_usagesubtype_ins",
  validate(usageSubTypeInsSchema),
  usageSubTypeInsController,
);

// Gap code master
router.get("/getGapCodeList", getGapCodeListController);
router.post(
  "/aowt_gapcode_ins",
  validate(gapCodeInsSchema),
  gapCodeInsController,
);

// Plumber master
router.get("/getPlumberList", getPlumberListController);
router.post(
  "/aowt_plumber_ins",
  validate(plumberInsSchema),
  plumberInsController,
);

// Connection List
router.get("/getConnectionList", getConnectionListController);
router.post(
  "/aowt_connstatus_ins",
  validate(connStatusInsSchema),
  connStatusInsController,
);

// Tax Master
router.get("/getTaxList", getTaxListController);
router.get("/getApplyOnDropdown", getApplyOnDropdownController);
router.get("/getTaxDetails", getTaxDetailsController);
router.post("/aowt_tax_ins", validate(taxInsSchema), taxInsController);
module.exports = router;
