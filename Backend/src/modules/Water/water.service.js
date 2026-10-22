const {
    getConnectionSearchRepo,
    getWardDropdownRepo,
    getConnectionTypeDropdownRepo,
    getConnectionStatusDropdownRepo,
    getConnectionCodeDropdownRepo,
    getConnectionCodeMBMCDropdownRepo,
    getTankDropdownRepo,
    getConnectionSizeDropdownRepo,
    getUsageTypeDropdownRepo,
    getConsumerTypeDropdownRepo,
    getMeterOwnerDropdownRepo,
    getPlumberDropdownRepo,
    getBillFrequencyDropdownRepo,
    getBillingMethodDropdownKNPRepo,
    getBillingMethodDropdownRepo,
    getZoneDropdownRepo,
    getSubUsageTypeDropdownRepo,
    getULBCodeRepo,
    getBlockDropdownRepo,
    getConnectionNumberGenRepo,
    getConnectionDetailsRepo,
    connectionNumberDetailsSubmitRepo
} = require("./water.repo");

// Water Connection Master

// Search

async function getConnectionSearchService(payload) {
    return getConnectionSearchRepo(payload);
}

// Master

async function getULBCodeService(payload) {
    return getULBCodeRepo(payload);
}

async function getWardDropdownService(payload) {
    return getWardDropdownRepo(payload);
}

async function getZoneDropdownService(payload) {
    return getZoneDropdownRepo(payload);
}

async function getBlockDropdownService(payload) {
    return getBlockDropdownRepo(payload);
}

async function getConnectionTypeDropdownService(payload) {
    return getConnectionTypeDropdownRepo(payload);
}

async function getConnectionStatusDropdownService(payload) {
    return getConnectionStatusDropdownRepo(payload);
}

async function getConnectionCodeDropdownService(payload) {
    return getConnectionCodeDropdownRepo(payload);
}

async function getConnectionCodeDropdownMBMCService() {
    return getConnectionCodeMBMCDropdownRepo();
}

async function getTankDropdownService() {
    return getTankDropdownRepo();
}

async function getConnectionSizeDropdownService(payload) {
    return getConnectionSizeDropdownRepo(payload);
}

async function getUsageTypeDropdownService(payload) {
    return getUsageTypeDropdownRepo(payload);
}

async function getSubUsageTypeDropdownService(payload) {
    return getSubUsageTypeDropdownRepo(payload);
}

async function getConsumerTypeDropdownService(payload) {
    return getConsumerTypeDropdownRepo(payload);
}

async function getMeterOwnerDropdownService(payload) {
    return getMeterOwnerDropdownRepo(payload);
}

async function getPlumberDropdownService() {
    return getPlumberDropdownRepo();
}

async function getBillFrequencyDropdownService(payload) {
    return getBillFrequencyDropdownRepo(payload);
}

async function getBillingMethodDropdownKNPService(payload) {
    return getBillingMethodDropdownKNPRepo(payload);
}

async function getBillingMethodDropdownService(payload) {
    return getBillingMethodDropdownRepo(payload);
}

async function getConnectionNumberGenService(payload) {
    return getConnectionNumberGenRepo(payload);
}

async function getConnectionDetailsService(payload) {
    return getConnectionDetailsRepo(payload);
}

async function connectionMasterSubmitService(payload) {
    return connectionNumberDetailsSubmitRepo(payload);
}

module.exports = {
    getULBCodeService,
    getConnectionSearchService,
    getWardDropdownService,
    getZoneDropdownService,
    getBlockDropdownService,
    getConnectionTypeDropdownService,
    getConnectionStatusDropdownService,
    getConnectionCodeDropdownService,
    getConnectionCodeDropdownMBMCService,
    getTankDropdownService,
    getConnectionSizeDropdownService,
    getUsageTypeDropdownService,
    getSubUsageTypeDropdownService,
    getConsumerTypeDropdownService,
    getMeterOwnerDropdownService,
    getPlumberDropdownService,
    getBillFrequencyDropdownService,
    getBillingMethodDropdownService,
    getBillingMethodDropdownKNPService,
    getConnectionNumberGenService,
    getConnectionDetailsService,
    connectionMasterSubmitService
}