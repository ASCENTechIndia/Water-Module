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
    getUsageSubTypeTableDataStatusRepo
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
    usageSubTypeDataSubmitService
};
