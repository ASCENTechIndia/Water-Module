const express = require("express");
const validate = require("../../middleware/validate.middleware");
const {
  getWardDropdownController,
  getZoneDropdownController,
  getBlockDropdownController,
  searchMeterConnectionsController,
  getGapCodeDropdownController,
  meterReadingInsController,
} = require("./transaction.controller");
const { meterReadingInsSchema } = require("./transaction.validation");

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
module.exports = router;
