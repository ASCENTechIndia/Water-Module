const { logApiSuccess, logApiError } = require("../../utils/log");
const { 
    getConnectionSearchService, 
    getWardDropdownService,
    getConnectionTypeDropdownService,
    getConnectionStatusDropdownService,
    getConnectionCodeDropdownService,
    getConnectionCodeDropdownMBMCService,
    getTankDropdownService,
    getConnectionSizeDropdownService,
    getUsageTypeDropdownService,
    getConsumerTypeDropdownService,
    getMeterOwnerDropdownService,
    getPlumberDropdownService,
    getBillFrequencyDropdownService,
    getBillingMethodDropdownKNPService,
    getBillingMethodDropdownService,
    getZoneDropdownService,
    getSubUsageTypeDropdownService,
    getULBCodeService,
    getBlockDropdownService,
    getConnectionNumberGenService,
    getConnectionDetailsService,
    connectionMasterSubmitService,
    getConnTypeCodeService
} = require("./water.service");

// Connection Search

async function getConnectionSearchController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getConnectionSearchService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Connection Search Details retrieved successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Connection Search Details fetch error");
        return next(error);
    }
}

// Connection Master

async function getWardDropdownController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getWardDropdownService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Ward Dropdown menu retrieved successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Ward Dropdown menu fetch error");
        return next(error);
    }
}

async function getZoneDropdownController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getZoneDropdownService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Zone Dropdown menu retrieved successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Zone Dropdown menu fetch error");
        return next(error);
    }
}

async function getBlockDropdownController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getBlockDropdownService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Block Dropdown menu retrieved successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Block Dropdown menu fetch error");
        return next(error);
    }
}

async function getConnectionTypeDropdownController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getConnectionTypeDropdownService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Connection Type Dropdown menu retrieved successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Connection Type menu fetch error");
        return next(error);
    }
}

async function getConnectionStatusDropdownController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getConnectionStatusDropdownService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Connection Status Dropdown menu retrieved successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Connection Status menu fetch error");
        return next(error);
    }
}

async function getConnectionCodeDropdownController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getConnectionCodeDropdownService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Connection Code Dropdown menu retrieved successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Connection Code menu fetch error");
        return next(error);
    }
}

async function getConnectionCodeDropdownMBMCController(req, res, next) {
    try {
        const rows = await getConnectionCodeDropdownMBMCService();

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Connection Code Dropdown menu retrieved successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Connection Code menu fetch error");
        return next(error);
    }
}

async function getTankDropdownController(req, res, next) {
    try {
        const rows = await getTankDropdownService();

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Tank Dropdown menu retrieved successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Tank dropdown menu fetch error");
        return next(error);
    }
}

async function getConnectionSizeDropdownController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getConnectionSizeDropdownService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Connection Size menu retrieved successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Connection Size dropdown menu fetch error");
        return next(error);
    }
}

async function getUsageTypeDropdownController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getUsageTypeDropdownService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Usage Type menu retrieved successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Usage Type dropdown menu fetch error");
        return next(error);
    }
}

async function getSubUsageTypeDropdownController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getSubUsageTypeDropdownService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Sub Usage Type menu retrieved successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Sub Usage Type dropdown menu fetch error");
        return next(error);
    }
}

async function getConsumerTypeDropdownController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getConsumerTypeDropdownService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Consumer Type menu retrieved successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Consumer Type dropdown menu fetch error");
        return next(error);
    }
}

async function getMeterOwnerDropdownController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getMeterOwnerDropdownService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Meter Owner menu retrieved successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Meter Owner dropdown menu fetch error");
        return next(error);
    }
}

async function getPlumberDropdownController(req, res, next) {
    try {
        const rows = await getPlumberDropdownService();

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Plumber dropdown menu retrieved successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Plumber dropdown menu fetch error");
        return next(error);
    }
}

async function getBillFrequencyDropdownController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getBillFrequencyDropdownService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Bill Frequency dropdown menu retrieved successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Bill Frequency dropdown menu fetch error");
        return next(error);
    }
}

async function getBillingMethodKNPDropdownController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getBillingMethodDropdownKNPService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Billing Method dropdown menu retrieved successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Billing Method dropdown menu fetch error");
        return next(error);
    }
}

async function getBillingMethodDropdownController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getBillingMethodDropdownService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Billing Method dropdown menu retrieved successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Billing Method dropdown menu fetch error");
        return next(error);
    }
}

async function getULBCodeController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getULBCodeService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `ULB Code retrieved successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "ULB Code fetch error");
        return next(error);
    }
}

async function getConnectionNumberGenController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getConnectionNumberGenService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Connection gen Details retrieved successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Connection gen Details fetch error");
        return next(error);
    }
}

async function getConnectionDetailsController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getConnectionDetailsService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Connection Number Details retrieved successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Connection Number Details fetch error");
        return next(error);
    }
}

async function getConnTypeCodeController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getConnTypeCodeService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Connection Type Code retrieved successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Connection Type Code fetch error");
        return next(error);
    }
}

async function connectionMasterSubmitController(req, res, next) {
    try {
        const payload = req.body;
        const rows = await connectionMasterSubmitService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Connection Master Data Submitted successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Connection Master Data submit error");
        return next(error);
    }
}

module.exports = {
    getULBCodeController,
    getConnectionSearchController,
    getWardDropdownController,
    getZoneDropdownController,
    getBlockDropdownController,
    getConnectionTypeDropdownController,
    getConnectionStatusDropdownController,
    getConnectionCodeDropdownController,
    getConnectionCodeDropdownMBMCController,
    getTankDropdownController,
    getConnectionSizeDropdownController,
    getUsageTypeDropdownController,
    getSubUsageTypeDropdownController,
    getConsumerTypeDropdownController,
    getMeterOwnerDropdownController,
    getPlumberDropdownController,
    getBillFrequencyDropdownController,
    getBillingMethodKNPDropdownController,
    getBillingMethodDropdownController,
    getConnectionNumberGenController,
    getConnectionDetailsController,
    getConnTypeCodeController,
    connectionMasterSubmitController
};
