const express = require("express");
const {
    getULBDropdownController,
    getPremiseTypeDataController,
    getPremiseTypeDataStatusController,
    premiseTypeConfigSubmitController,
    getUsageTypeTableDataController,
    getUsageTypeTableDataStatusController,
    usageTypeConfigSubmitController
} = require("./config.controller");

const router = express.Router();

router.get("/getULBDropdown", getULBDropdownController);

// Premise Type Config
router.post("/getPremiseTypeData", getPremiseTypeDataController);
router.post("/getPremiseTypeDataStatus", getPremiseTypeDataStatusController);
router.post("/premise-type", premiseTypeConfigSubmitController);

// Usage Type Config
router.post("/getUsageTypeData", getUsageTypeTableDataController);
router.post("/getUsageTypeDataStatus", getUsageTypeTableDataStatusController);
router.post("/usage-type", usageTypeConfigSubmitController);

module.exports = router;