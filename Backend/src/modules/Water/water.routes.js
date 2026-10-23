const express = require("express");
const { 
    getConnectionSearchController, 
    getWardDropdownController, 
    getConnectionTypeDropdownController,
    getConnectionStatusDropdownController,
    getConnectionCodeDropdownController,
    getConnectionCodeDropdownMBMCController,
    getTankDropdownController,
    getConnectionSizeDropdownController,
    getUsageTypeDropdownController,
    getConsumerTypeDropdownController,
    getMeterOwnerDropdownController,
    getPlumberDropdownController,
    getBillFrequencyDropdownController,
    getBillingMethodKNPDropdownController,
    getBillingMethodDropdownController,
    getZoneDropdownController,
    getSubUsageTypeDropdownController,
    getULBCodeController,
    getBlockDropdownController,
    getConnectionNumberGenController,
    getConnectionDetailsController,
    connectionMasterSubmitController,
    getConnTypeCodeController
} = require("./water.controller");
const validateMiddleware = require("../../middleware/validate.middleware");
const { connectionMstSchema } = require("./water.validation");
const router = express.Router();

// Water Connection Search

router.get("/getConnectionSearchDtls", getConnectionSearchController);

// Dropdowns
router.get("/ulbcode", getULBCodeController);
router.get("/wardDropdown", getWardDropdownController);
router.get("/zoneDropdown", getZoneDropdownController);
router.get("/blockDropdown", getBlockDropdownController);
router.get("/connectionTypeDropdown", getConnectionTypeDropdownController);
router.get("/connectionStatusDropdown", getConnectionStatusDropdownController);
router.get("/connectionCodeDropdown", getConnectionCodeDropdownController);
router.get("/connectionCodeMBMCDropdown", getConnectionCodeDropdownMBMCController);
router.get("/tankDropdown", getTankDropdownController);
router.get("/connectionSizeDropdown", getConnectionSizeDropdownController);
router.get("/usageTypeDropdown", getUsageTypeDropdownController);
router.get("/subUsageTypeDropdown", getSubUsageTypeDropdownController);
router.get("/consumerTypeDropdown", getConsumerTypeDropdownController);
router.get("/meterOwnerDropdown", getMeterOwnerDropdownController);
router.get("/plumberDropdown", getPlumberDropdownController);
router.get("/billFreqDropdown", getBillFrequencyDropdownController);
router.get("/billMethodKNPDropdown", getBillingMethodKNPDropdownController);
router.get("/billMethodDropdown", getBillingMethodDropdownController);
router.get("/connectionnogen", getConnectionNumberGenController);
router.get("/getConnectionDetails", getConnectionDetailsController);
router.get("/getConnTypeCode", getConnTypeCodeController);
router.post("/water-connnection-master", validateMiddleware(connectionMstSchema), connectionMasterSubmitController);

module.exports = router;