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
    consumerTypeConfigDataSubmitRepo
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
    consumerTypeConfigDataSubmitService
};
