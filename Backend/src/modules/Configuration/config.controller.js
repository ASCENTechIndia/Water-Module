const { logApiSuccess, logApiError } = require("../../utils/log");
const {
    getULBDropdownService,
    getPremiseTypeDataService,
    getPremiseTypeDataStatusService,
    premiseTypeConfigSubmitService,
    getUsageTypeTableDataService,
    getUsageTypeTableDataStatusService,
    usageTypeConfigSubmitService,
    getUsageTypeDropdownService,
    getUsageSubTypeTableDataService,
    usageSubTypeDataSubmitService,
    getUsageSubTypeTableDataStatusService
} = require("./config.service");

async function getULBDropdownController(req, res, next) {
    try {
        const rows = await getULBDropdownService();

        logApiSuccess(
            req,
            200,
            { count: rows.length || 0 },
            "ULB Dropdown fetched",
        );

        return res.ok(rows);
    } catch (error) {
        console.error(error);
        logApiError(req, 500, error.message, "ULB Dropdown error");
        return next(error);
    }
}

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

// Usage Sub Type Config

async function getUsageTypeDropdownController(req, res, next) {
    try {
        const rows = await getUsageTypeDropdownService();

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Usage Type Dropdown successfully fetched`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Usage Type Dropdown fetch error");
        return next(error);
    }
}

async function getUsageSubTypeTableDataController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getUsageSubTypeTableDataService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Usage Sub Type Data successfully fetched`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Usage Sub Type Data fetch error");
        return next(error);
    }
}

async function getUsageSubTypeTableDataStatusController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getUsageSubTypeTableDataStatusService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Usage Sub Type Data Status successfully fetched`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Usage Sub Type Status Data fetch error");
        return next(error);
    }
}

async function usageSubTypeConfigSubmitController(req, res, next) {
    try {
        const payload = req.body;
        const rows = await usageSubTypeDataSubmitService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Usage Sub Type Configuration submitted successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Usage Sub Type Config Data Submit  error");
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
    usageTypeConfigSubmitController,
    getUsageTypeDropdownController,
    getUsageSubTypeTableDataController,
    getUsageSubTypeTableDataStatusController,
    usageSubTypeConfigSubmitController,
};
