const { logApiSuccess, logApiError } = require("../../utils/log");
const { getULBDropdownService, getPremiseTypeDataService, getPremiseTypeDataStatusService, premiseTypeConfigSubmitService, getUsageTypeTableDataService, getUsageTypeTableDataStatusService, usageTypeConfigSubmitService } = require("./config.service");

async function getULBDropdownController(req, res, next) {
    try {
        const rows = await getULBDropdownService();

        logApiSuccess(
            req,
            200,
            { count: rows.length || 0 },
            "ULB Dropdown fetched"
        );

        return res.ok(rows);
    } catch (error) {
        console.error(error);
        logApiError(req, 500, error.message, "ULB Dropdown error");
        return next(error);
    }
};

async function getPremiseTypeDataController(req, res, next) {
    try {
        const payload = req.body;
        const rows = await getPremiseTypeDataService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Premise Type List retrieved`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Premise Type list error");
        return next(error);
    }
}

async function getPremiseTypeDataStatusController(req, res, next) {
    try {
        const payload = req.body;
        const rows = await getPremiseTypeDataStatusService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Premise Type Data Status retrieved`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Premise Type Data Status list error");
        return next(error);
    }
}

async function premiseTypeConfigSubmitController(req, res, next) {
    try {
        const payload = req.body;
        const rows = await premiseTypeConfigSubmitService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Premise Type Config Submitted successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Premise Type Config submit error");
        return next(error);
    }
}

// Usage Type Controllers

async function getUsageTypeTableDataController(req, res, next) {
    try {
        const payload = req.body;

        const rows = await getUsageTypeTableDataService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Usage Type Data fetched successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Usage Type Config List error");
        return next(error);
    }
}

async function getUsageTypeTableDataStatusController(req, res, next) {
    try {
        const payload = req.body;

        const rows = await getUsageTypeTableDataStatusService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Usage Type Status Data fetched successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Usage Type Config List Status error");
        return next(error);
    }
}

async function usageTypeConfigSubmitController(req, res, next) {
    try {
        const payload = req.body;
        const rows = await usageTypeConfigSubmitService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Usage Type Config Submitted successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Usage Type Config submit error");
        return next(error);
    }
}

module.exports = {
    getULBDropdownController,
    getPremiseTypeDataController,
    getPremiseTypeDataStatusController,
    premiseTypeConfigSubmitController,
    getUsageTypeTableDataController,
    getUsageTypeTableDataStatusController,
    usageTypeConfigSubmitController
};