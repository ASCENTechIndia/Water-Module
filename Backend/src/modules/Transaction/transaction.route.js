const express = require("express");
const validate = require("../../middleware/validate.middleware");
const {
  getWardDropdownController,
  getZoneDropdownController,
  getBlockDropdownController,
  searchMeterConnectionsController,
  getGapCodeDropdownController,
  meterReadingInsController,
  getZoneDropdownWithUlbIdController,
  billGenInsController,
  getBankDropdownController,
  getReasonDropdownController,
  chequeBounceInsController,
  chequeBounceSearchController,
} = require("./transaction.controller");
const {
  meterReadingInsSchema,
  billGenInsSchema,
  chequeBounceInsSchema,
} = require("./transaction.validation");

const router = express.Router();

// Meter reading entry
router.get("/getWardDropdown", getWardDropdownController);
router.get("/getZoneDropdown", getZoneDropdownController);
router.get("/getBlockDropdown", getBlockDropdownController);
router.get("/getGapCodeDropdown", getGapCodeDropdownController);
router.post("/searchMeterConnections", searchMeterConnectionsController);
router.post(
  "/aowt_mtrreading_ins",
  validate(meterReadingInsSchema),
  meterReadingInsController,
);

// Bill generation
router.get("/getZoneDropdownWithUlbId", getZoneDropdownWithUlbIdController);
router.post(
  "/aowt_billgen_ins",
  validate(billGenInsSchema),
  billGenInsController,
);

//Cheque bounce
router.get("/getBankDropdown", getBankDropdownController);
router.get("/getReasonDropdown", getReasonDropdownController);
router.post("/searchChequeBounce", chequeBounceSearchController);
router.post(
  "/aowt_chequebounce_ins",
  validate(chequeBounceInsSchema),
  chequeBounceInsController,
);
module.exports = router;
