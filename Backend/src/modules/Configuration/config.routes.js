const express = require("express");
const {
    getULBDropdownController,
    getPremiseTypeDataController,
    getPremiseTypeDataStatusController,
    premiseTypeConfigSubmitController
} = require("./config.controller");

const router = express.Router();

router.get("/getULBDropdown", getULBDropdownController);

// Premise Type Config
router.post("/getPremiseTypeData", getPremiseTypeDataController);
router.post("/getPremiseTypeDataStatus", getPremiseTypeDataStatusController);
router.post("/premise-type", premiseTypeConfigSubmitController);

module.exports = router;