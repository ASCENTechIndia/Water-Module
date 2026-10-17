const {
    getULBDropdownRepo,
    getPremiseTypeDataRepo,
    getPremiseTypeDataStatusRepo,
    premiseTypeConfigSubmitRepo,
    getUsageTypeTableDataRepo,
    getUsageTypeTableDataStatusRepo,
    usageTypeConfigSubmitRepo,
    getUsageTypeDropdownRepo,
    getUsageSubTypeTableDataRepo,
    usageSubTypeConfigSubmitRepo,
    getUsageSubTypeTableDataStatusRepo,
    getBillingMethodTableDataRepo,
    getBillingMethodTableDataStatusRepo,
    billingMethodConfigSubmitRepo,
    getConsumerTypeTableDataRepo,
    getConsumerTypeTableDataStatusRepo,
    consumerTypeConfigDataSubmitRepo,
    getConnCodeTableDataRepo,
    getConnCodeTableeDataStatusRepo,
    connCodeConfigDataSubmitRepo,
    getMeterOwnerTableDataRepo,
    getMeterOwnerTableDataStatusRepo,
    meterOwnerConfigDataSubmitRepo,
    getBankTableDataRepo,
    getBankTableDataStatusRepo,
    bankConfigDataSubmitRepo,
    getBillingFrequencyTableDataRepo,
    getBillingFrequencyTableDataStatusRepo,
    billingFrequencyDataSubmitRepo,
    getConnectionSizeTableDataRepo,
    getConnectionSizeTableDataStatusRepo,
    connectionSizeDataSubmitRepo,
    getConnectionStatusTableDataRepo,
    getConnectionStatusTableDataStatusRepo,
    connectionStatusDataSubmitRepo,
    getMeterGapCodeTableDataRepo,
    getMeterGapCodeTableDataStatusRepo,
    meterGapCodeDataSubmitRepo,
    getTaxConfigTableDataRepo,
    getTaxConfigTableDataStatusRepo,
    taxConfigDataSubmitRepo,
    getConnectionTypeTableDataRepo,
    getConnectionTypeTableDataStatusRepo,
    connectionTypeDataSubmitRepo,
    getCollectionCenterTableDataRepo,
    getCollectionCenterTableDataStatusRepo,
    collectionCenterDataSubmitRepo
} = require("./config.repo");

async function getULBDropdownService() {
    return getULBDropdownRepo();
}

// Premise Type Services

async function getPremiseTypeDataService(payload) {
    return getPremiseTypeDataRepo(payload);
}

async function getPremiseTypeDataStatusService(payload) {
    return getPremiseTypeDataStatusRepo(payload);
}

async function premiseTypeConfigSubmitService(payload) {
    return premiseTypeConfigSubmitRepo(payload);
}

// Usage Type services

async function getUsageTypeTableDataService(payload) {
    return getUsageTypeTableDataRepo(payload);
}

async function getUsageTypeTableDataStatusService(payload) {
    return getUsageTypeTableDataStatusRepo(payload);
}

async function usageTypeConfigSubmitService(payload) {
    return usageTypeConfigSubmitRepo(payload);
}

// Usage Sub Type Config

async function getUsageTypeDropdownService() {
    return getUsageTypeDropdownRepo();
}

async function getUsageSubTypeTableDataService(payload) {
    return getUsageSubTypeTableDataRepo(payload);
}

async function getUsageSubTypeTableDataStatusService(payload) {
    return getUsageSubTypeTableDataStatusRepo(payload);
}

async function usageSubTypeDataSubmitService(payload) {
    return usageSubTypeConfigSubmitRepo(payload);
}

// Billing Method Config

async function getBillingMethodTableDataService(payload) {
    return getBillingMethodTableDataRepo(payload);
}

async function getBillingMethodTableDataStatusService(payload) {
    return getBillingMethodTableDataStatusRepo(payload);
}

async function billingMethodConfigSubmitService(payload) {
    return billingMethodConfigSubmitRepo(payload);
}

async function getConsumerTypeTableDataService(payload) {
    return getConsumerTypeTableDataRepo(payload);
}

async function getConsumerTypeTableDataStatusService(payload) {
    return getConsumerTypeTableDataStatusRepo(payload);
}

async function consumerTypeConfigDataSubmitService(payload) {
    return consumerTypeConfigDataSubmitRepo(payload);
}

// Conn Code Config

async function getConnCodeTableDataService(payload) {
    return getConnCodeTableDataRepo(payload);
}

async function getConnCodeTableeDataStatusService(payload) {
    return getConnCodeTableeDataStatusRepo(payload);
}

async function connCodeConfigDataSubmitService(payload) {
    return connCodeConfigDataSubmitRepo(payload);
}

// Meter Owner Config

async function getMeterOwnerTableDataService(payload) {
    return getMeterOwnerTableDataRepo(payload);
}

async function getMeterOwnerTableDataStatusService(payload){
    return getMeterOwnerTableDataStatusRepo(payload);
}

async function meterOwnerConfigDataSubmitService(payload) {
    return meterOwnerConfigDataSubmitRepo(payload);
}

// Bank Config

async function getBankTableDataService(payload) {
    return getBankTableDataRepo(payload);
}

async function getBankTableDataStatusService(payload) {
    return getBankTableDataStatusRepo(payload);
}

async function bankConfigDataSubmitService(payload) {
    return bankConfigDataSubmitRepo(payload);
}

// Billing Frequency

async function getBillingFrequencyTableDataService(payload) {
    return getBillingFrequencyTableDataRepo(payload);
}

async function getBillingFrequencyTableDataStatusService(payload) {
    return getBillingFrequencyTableDataStatusRepo(payload);
}

async function billingFrequencyDataSubmitService(payload) {
    return billingFrequencyDataSubmitRepo(payload);
}

// Connection Size

async function getConnectionSizeTableDataService(payload) {
    return getConnectionSizeTableDataRepo(payload);
}

async function getConnectionSizeTableDataStatusService(payload) {
    return getConnectionSizeTableDataStatusRepo(payload);
}

async function connectionSizeDataSubmitService(payload) {
    return connectionSizeDataSubmitRepo(payload);
}

// Connection Status Config

async function getConnectionStatusTableDataService(payload) {
    return getConnectionStatusTableDataRepo(payload);
}

async function getConnectionStatusTableDataStatusService(payload) {
    return getConnectionStatusTableDataStatusRepo(payload);
}

async function connectionStatusDataSubmitService(payload) {
    return connectionStatusDataSubmitRepo(payload);
}

// Meter Gap Code Config

async function getMeterGapCodeTableDataService(payload) {
    return getMeterGapCodeTableDataRepo(payload);
}

async function getMeterGapCodeTableStatusService(payload) {
    return getMeterGapCodeTableDataStatusRepo(payload);
}

async function meterGapCodeDataSubmitService(payload) {
    return meterGapCodeDataSubmitRepo(payload);
}

// Tax Config

async function getTaxConfigTableDataService(payload) {
    return getTaxConfigTableDataRepo(payload);
}

async function getTaxConfigTableDataStatusService(payload) {
    return getTaxConfigTableDataStatusRepo(payload);
}

async function taxConfigDataSubmitService (payload) {
    return taxConfigDataSubmitRepo(payload);
}

// Connection Type Config

async function getConnectionTypeTableDataService(payload) {
    return getConnectionTypeTableDataRepo(payload);
}

async function getConnectionTypeTableDataStatusService(payload) {
    return getConnectionTypeTableDataStatusRepo(payload);
}

async function connectionTypeDataSubmitService(payload) {
    return connectionTypeDataSubmitRepo(payload);
}

// Collection Center Config

async function getCollectionCenterTableDataService(payload) {
    return getCollectionCenterTableDataRepo(payload);
}

async function getCollectionCenterTableDataStatusService(payload) {
    return getCollectionCenterTableDataStatusRepo(payload);
}

async function collectionCenterDataSubmitService(payload) {
    return collectionCenterDataSubmitRepo(payload);
}

module.exports = {
    getULBDropdownService,
    getPremiseTypeDataService,
    getPremiseTypeDataStatusService,
    premiseTypeConfigSubmitService,
    getUsageTypeTableDataService,
    getUsageTypeTableDataStatusService,
    usageTypeConfigSubmitService,
    getUsageTypeDropdownService,
    getUsageSubTypeTableDataService,
    getUsageSubTypeTableDataStatusService,
    usageSubTypeDataSubmitService,
    getBillingMethodTableDataService,
    getBillingMethodTableDataStatusService,
    billingMethodConfigSubmitService,
    getConsumerTypeTableDataService,
    getConsumerTypeTableDataStatusService,
    consumerTypeConfigDataSubmitService,
    getConnCodeTableDataService,
    getConnCodeTableeDataStatusService,
    connCodeConfigDataSubmitService,
    getMeterOwnerTableDataService,
    getMeterOwnerTableDataStatusService,
    meterOwnerConfigDataSubmitService,
    getBankTableDataService,
    getBankTableDataStatusService,
    bankConfigDataSubmitService,
    getBillingFrequencyTableDataService,
    getBillingFrequencyTableDataStatusService,
    billingFrequencyDataSubmitService,
    getConnectionSizeTableDataService,
    getConnectionSizeTableDataStatusService,
    connectionSizeDataSubmitService,
    getConnectionStatusTableDataService,
    getConnectionStatusTableDataStatusService,
    connectionStatusDataSubmitService,
    getMeterGapCodeTableDataService,
    getMeterGapCodeTableStatusService,
    meterGapCodeDataSubmitService,
    getTaxConfigTableDataService,
    getTaxConfigTableDataStatusService,
    taxConfigDataSubmitService,
    getConnectionTypeTableDataService,
    getConnectionTypeTableDataStatusService,
    connectionTypeDataSubmitService,
    getCollectionCenterTableDataService,
    getCollectionCenterTableDataStatusService,
    collectionCenterDataSubmitService
};
