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

// Bill frequency list
router.get("/getBillFrequencyList", getBillFreqListController);
router.post(
  "/aowt_billfreq_ins",
  validate(billFreqInsSchema),
  billFreqInsController,
);
module.exports = router;
