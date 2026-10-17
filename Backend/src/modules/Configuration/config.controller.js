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
    getUsageSubTypeTableDataStatusService,
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
    getBillingFrequencyTableDataStatusService,
    billingFrequencyDataSubmitService,
    getBillingFrequencyTableDataService,
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

// Billing Method Config

async function getBillingMethodTableDataController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getBillingMethodTableDataService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Billing Method Table Data successfully fetched`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Billing Method Table Data fetch error");
        return next(error);
    }
}

async function getBillingMethodTableDataStatusController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getBillingMethodTableDataStatusService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Billing Method Table Status Data successfully fetched`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Billing Method Table Status Data fetch error");
        return next(error);
    }
}

async function billingMethodConfigSubmitController(req, res, next) {
    try {
        const payload = req.body;
        const rows = await billingMethodConfigSubmitService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Billing Method Config Data Submitted successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Billing Method Config Data submit error");
        return next(error);
    }
}

async function getConsumerTypeTableDataController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getConsumerTypeTableDataService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Consumer Type Table Data successfully fetched`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Consumer Type Table Data fetch error");
        return next(error);
    }
}

async function getConsumerTypeTableDataStatusController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getConsumerTypeTableDataStatusService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Consumer Type Table Data Status successfully fetched`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Consumer Type Table Data Status fetch error");
        return next(error);
    }
}

async function consumerTypeConfigSubmitController(req, res, next) {
    try {
        const payload = req.body;
        const rows = await consumerTypeConfigDataSubmitService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Consumer Type Config Data Submitted successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Consumer Type Config Data submit error");
        return next(error);
    }
}

// Conn Code Config

async function getConnCodeTableDataController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getConnCodeTableDataService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Conn Code Table Data successfully fetched`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Conn Code Table Data fetch error");
        return next(error);
    }
}

async function getConnCodeTableDataStatusController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getConnCodeTableeDataStatusService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Conn Code Table Data Status successfully fetched`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Conn Code Table Data Status fetch error");
        return next(error);
    }
}

async function connCodeConfigSubmitController(req, res, next) {
    try {
        const payload = req.body;
        const rows = await connCodeConfigDataSubmitService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Conn Code Config Data Submitted successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Conn Code Config Data submit error");
        return next(error);
    }
}

// Meter Owner Config

async function getMeterOwnerTableDataController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getMeterOwnerTableDataService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Meter Owner Table Data successfully fetched`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Meter Owner Table Data fetch error");
        return next(error);
    }
}

async function getMeterOwnerTableDataStatusController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getMeterOwnerTableDataStatusService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Meter Owner Table Data Status successfully fetched`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Meter Owner Table Data Status fetch error");
        return next(error);
    }
}

async function meterOwnerConfigSubmitController(req, res, next) {
    try {
        const payload = req.body;
        const rows = await meterOwnerConfigDataSubmitService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Meter Owner Config Data Submitted successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Meter Owner Config Data submit error");
        return next(error);
    }
}

// Bank Config

async function getBankTableDataController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getBankTableDataService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Bank Table Data successfully fetched`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Bank Table Data fetch error");
        return next(error);
    }
}

async function getBankTableDataStatusController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getBankTableDataStatusService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Bank Table Data Status successfully fetched`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Bank Table Data Status fetch error");
        return next(error);
    }
}

async function bankConfigSubmitController(req, res, next) {
    try {
        const payload = req.body;
        const rows = await bankConfigDataSubmitService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Bank Config Data Submitted successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Bank Config Data submit error");
        return next(error);
    }
}

// Billing Frequency 

async function getBillingFrequecyTableDataController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getBillingFrequencyTableDataService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Billing Frequency Table Data successfully fetched`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Billing Frequency Data fetch error");
        return next(error);
    }
}

async function getBillingFrequencyTableDataStatusController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getBillingFrequencyTableDataStatusService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Billing Frequency Table Data Status successfully fetched`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Billing Frequency Table Data Status fetch error");
        return next(error);
    }
}

async function billingFrequencyConfigSubmitController(req, res, next) {
    try {
        const payload = req.body;
        const rows = await billingFrequencyDataSubmitService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Billing Frequency Config Data Submitted successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Billing Frequency Config Data submit error");
        return next(error);
    }
}

// Connection Size controller

async function getConnectionSizeTableDataController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getConnectionSizeTableDataService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Connection Size Table Data successfully fetched`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Connection Size Data fetch error");
        return next(error);
    }
}

async function getConnectionSizeTableDataStatusController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getConnectionSizeTableDataStatusService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Connection Size Table Data Status successfully fetched`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Connection Size Table Data Status fetch error");
        return next(error);
    }
}

async function connectionSizeConfigSubmitController(req, res, next) {
    try {
        const payload = req.body;
        const rows = await connectionSizeDataSubmitService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Connection Size Config Data Submitted successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Connection Size Config Data submit error");
        return next(error);
    }
}

// Connection Status Config 

async function getConnectionStatusTableDataController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getConnectionStatusTableDataService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Connection Status Table Data successfully fetched`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Connection Status Data fetch error");
        return next(error);
    }
}

async function getConnectionStatusTableDataStatusController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getConnectionStatusTableDataStatusService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Connection Status Table Data Status successfully fetched`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Connection Status Table Data Status fetch error");
        return next(error);
    }
}

async function connectionStatusConfigSubmitController(req, res, next) {
    try {
        const payload = req.body;
        const rows = await connectionStatusDataSubmitService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Connection Status Config Data Submitted successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Connection Status Config Data submit error");
        return next(error);
    }
}

// Meter Gap Code Config

async function getMeterGapCodeTableDataController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getMeterGapCodeTableDataService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Meter Gap Code Table Data successfully fetched`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Meter Gap Code Data fetch error");
        return next(error);
    }
}

async function getMeterGapCodeTableDataStatusController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getMeterGapCodeTableStatusService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Meter Gap Code Table Data Status successfully fetched`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Meter Gap Code Table Data Status fetch error");
        return next(error);
    }
}

async function meterGapCodeConfigSubmitController(req, res, next) {
    try {
        const payload = req.body;
        const rows = await meterGapCodeDataSubmitService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Meter Gap Code Config Data Submitted successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Meter Gap Code Config Data submit error");
        return next(error);
    }
}

// Tax Config

async function getTaxConfigTableDataController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getTaxConfigTableDataService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Tax Config Table Data successfully fetched`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Tax Config Data fetch error");
        return next(error);
    }
}

async function getTaxConfigTableDataStatusController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getTaxConfigTableDataStatusService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Tax Config Table Data Status successfully fetched`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Tax Config Table Data Status fetch error");
        return next(error);
    }
}

async function taxConfigSubmitController(req, res, next) {
    try {
        const payload = req.body;
        const rows = await taxConfigDataSubmitService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Tax Config Data Submitted successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Tax Config Data submit error");
        return next(error);
    }
}

// Connection Type Controller

async function getConnectionTypeTableDataController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getConnectionTypeTableDataService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Connection Type Table Data successfully fetched`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Connection Type Table Data fetch error");
        return next(error);
    }
}

async function getConnectionTypeTableDataStatusController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getConnectionTypeTableDataStatusService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Connection Type Table Data Status successfully fetched`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Connection Type Table Data Status fetch error");
        return next(error);
    }
}

async function connectionTypeSubmitController(req, res, next) {
    try {
        const payload = req.body;
        const rows = await connectionTypeDataSubmitService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Connection Type Data Submitted successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Connection Type Data submit error");
        return next(error);
    }
}

// Collection Center Config

async function getCollectionCenterTableDataController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getCollectionCenterTableDataService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Collection Center Table Data successfully fetched`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Collection Center Table Data fetch error");
        return next(error);
    }
}

async function getCollectionCenterTableDataStatusController(req, res, next) {
    try {
        const payload = req.query;
        const rows = await getCollectionCenterTableDataStatusService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Collection Center Table Data Status successfully fetched`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Collection Center Table Data Status fetch error");
        return next(error);
    }
}

async function collectionCenterSubmitController(req, res, next) {
    try {
        const payload = req.body;
        const rows = await collectionCenterDataSubmitService(payload);

        logApiSuccess(
            req,
            200,
            { count: rows?.length || 0 },
            `Collection Center Data Submitted successfully`,
        );

        return res.ok(rows);
    } catch (error) {
        // console.error(error);
        logApiError(req, 500, error.message, "Collection Center Data submit error");
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
    getBillingFrequencyTableDataStatusController,
    billingFrequencyConfigSubmitController,
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
    collectionCenterSubmitController
};
