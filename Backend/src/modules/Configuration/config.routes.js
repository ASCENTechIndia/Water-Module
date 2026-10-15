const express = require("express");
const {
    getULBDropdownController,
    getPremiseTypeDataController,
    getPremiseTypeDataStatusController,
    premiseTypeConfigSubmitController,
    getUsageTypeTableDataController,
    getUsageTypeTableDataStatusController,
    usageTypeConfigSubmitController,
    getUsageTypeDropdownController,
    getUsageSubTypeTableDataController,
    usageSubTypeConfigSubmitController,
    getUsageSubTypeTableDataStatusController,
    getBillingMethodTableDataController,
    getBillingMethodTableDataStatusController,
    billingMethodConfigSubmitController,
    getConsumerTypeTableDataController,
    getConsumerTypeTableDataStatusController,
    consumerTypeConfigSubmitController
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

// Usage Sub Type Config
router.get("/getUsageTypeDropdown", getUsageTypeDropdownController);
router.get("/getUsageSubTypeData", getUsageSubTypeTableDataController);
router.get("/getUsageSubTypeDataStatus", getUsageSubTypeTableDataStatusController);
router.post("/usage-sub-type", usageSubTypeConfigSubmitController);

// Billing Method Config
router.get("/getBillingMethodData", getBillingMethodTableDataController);
router.get("/getBillingMethodDataStatus", getBillingMethodTableDataStatusController);
router.post("/billing-method", billingMethodConfigSubmitController);

// Consumer Type Configuration
router.get("/getConsumerTypeData", getConsumerTypeTableDataController);
router.get("/getConsumerTypeDataStatus", getConsumerTypeTableDataStatusController);
router.post("/consumer-type", consumerTypeConfigSubmitController);

module.exports = router;