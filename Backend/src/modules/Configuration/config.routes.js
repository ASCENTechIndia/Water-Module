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
    consumerTypeConfigSubmitController,
    getConnCodeTableDataController,
    getConnCodeTableDataStatusController,
    connCodeConfigSubmitController,
    getMeterOwnerTableDataController,
    getMeterOwnerTableDataStatusController,
    meterOwnerConfigSubmitController,
    getBankTableDataController,
    getBankTableDataStatusController,
    bankConfigSubmitController,
    getBillingFrequecyTableDataController,
    billingFrequencyConfigSubmitController,
    getBillingFrequencyTableDataStatusController,
    getConnectionSizeTableDataController,
    getConnectionSizeTableDataStatusController,
    connectionSizeConfigSubmitController,
    getConnectionStatusTableDataController,
    getConnectionStatusTableDataStatusController,
    connectionStatusConfigSubmitController,
    getMeterGapCodeTableDataController,
    getMeterGapCodeTableDataStatusController,
    meterGapCodeConfigSubmitController,
    getTaxConfigTableDataController,
    getTaxConfigTableDataStatusController,
    taxConfigSubmitController,
    getConnectionTypeTableDataController,
    getConnectionTypeTableDataStatusController,
    connectionTypeSubmitController,
    getCollectionCenterTableDataController,
    getCollectionCenterTableDataStatusController,
    collectionCenterSubmitController,
    getServiceConfigTableDataController,
    getServiceConfigTableDataStatusController,
    serviceConfigSubmitController
} = require("./config.controller");
const { getConnectionTypeTableDataService } = require("./config.service");

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

// Conn Code Config
router.get("/getConnCodeTableData", getConnCodeTableDataController);
router.get("/getConnCodeTableDataStatus", getConnCodeTableDataStatusController);
router.post("/conn-code", connCodeConfigSubmitController);

// Meter Owner Config
router.get("/getMeterOwnerTableData", getMeterOwnerTableDataController);
router.get("/getMeterOwnerTableDataStatus", getMeterOwnerTableDataStatusController);
router.post("/meter-owner", meterOwnerConfigSubmitController);

// Bank Config
router.get("/getBankTableData", getBankTableDataController);
router.get("/getBankTableDataStatus", getBankTableDataStatusController);
router.post("/bank-config", bankConfigSubmitController);

// Billing Frequency Config
router.get("/getBillingFreqTableData", getBillingFrequecyTableDataController);
router.get("/getBillingFrequencyTableDataStatus", getBillingFrequencyTableDataStatusController);
router.post("/billing-frequency", billingFrequencyConfigSubmitController);

// Connection Size Config
router.get("/getConnectionSizeTableData", getConnectionSizeTableDataController);
router.get("/getConnectionSizeTableDataStatus", getConnectionSizeTableDataStatusController);
router.post("/connection-size", connectionSizeConfigSubmitController);

// Connection Status Config
router.get("/getConnectionStatusTableData", getConnectionStatusTableDataController);
router.get("/getConnectionStatusTableDataStatus", getConnectionStatusTableDataStatusController);
router.post("/connection-status", connectionStatusConfigSubmitController);

// Meter Gap Code Config
router.get("/getMeterGapCodeTableData", getMeterGapCodeTableDataController);
router.get("/getMeterGapCodeTableDataStatus", getMeterGapCodeTableDataStatusController);
router.post("/meter-gap-code", meterGapCodeConfigSubmitController);

// Tax Config
router.get("/getTaxConfigTableData", getTaxConfigTableDataController);
router.get("/getTaxConfigTableDataStatus", getTaxConfigTableDataStatusController);
router.post("/tax-config", taxConfigSubmitController);

// Connection Type Config
router.get("/getConnectionTypeTableData", getConnectionTypeTableDataController);
router.get("/getConnectionTypeTableDataStatus", getConnectionTypeTableDataStatusController);
router.post("/connection-type", connectionTypeSubmitController);

// Collection Center Config
router.get("/getCollectionCenterTableData", getCollectionCenterTableDataController);
router.get("/getCollectionCenterTableDataStatus", getCollectionCenterTableDataStatusController);
router.post("/collection-center", collectionCenterSubmitController);

// Service Config
router.get("/getServiceConfigTableData", getServiceConfigTableDataController);
router.get("/getServiceConfigTableDataStatus", getServiceConfigTableDataStatusController);
router.post("/service-config", serviceConfigSubmitController);

module.exports = router;