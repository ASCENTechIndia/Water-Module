const { logApiSuccess, logApiError } = require("../../utils/log");
const { auditLog } = require("../../utils/audit-log");
const {
  getWardDropdownService,
  getZoneDropdownService,
  getBlockDropdownService,
  searchMeterConnectionsService,
  getGapCodeDropdownService,
  meterReadingInsService,
} = require("./transaction.service");

function requestMeta(req) {
  return {
    ip: req.ip,
    method: req.method,
    path: req.originalUrl,
  };
}

async function getWardDropdownController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getWardDropdownService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Ward dropdown retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Ward dropdown error");
    return next(err);
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
      `Zone dropdown retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Zone dropdown error");
    return next(err);
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
      `Block dropdown retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Block dropdown error");
    return next(err);
  }
}

async function searchMeterConnectionsController(req, res, next) {
  try {
    const payload = req.body;
    const data = await searchMeterConnectionsService(payload);

    const count = data.connections?.length || 0;

    if (count > 0) {
      logApiSuccess(
        req,
        200,
        { count, mode: payload.mode },
        `Meter connections retrieved`,
      );
    } else {
      logApiSuccess(
        req,
        200,
        { count: 0, mode: payload.mode },
        `No meter connections found`,
      );
    }

    return res.ok(data);
  } catch (err) {
    logApiError(req, 400, err.message, "Meter connection search error");
    return next(err);
  }
}

async function getGapCodeDropdownController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getGapCodeDropdownService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Gap code dropdown retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Gap code dropdown error");
    return next(err);
  }
}

async function meterReadingInsController(req, res, next) {
  try {
    const payload = req.body;
    const out = await meterReadingInsService(payload);

    const isSuccess = Number(out.Out_errorCode) === 9999;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        { ulbId: payload.in_mtrreading_ulbid },
        out.Out_ErrorMsg || "Meter reading saved successfully",
      );
    } else {
      logApiError(req, 400, out.Out_ErrorMsg, "Meter reading insert failed");
    }

    auditLog({
      action: "METERREADING_CREATE",
      actor: req.user?.userId || payload.in_UserId || "system",
      module: "meterreading",
      entityId: null,
      status: isSuccess ? "SUCCESS" : "FAILED",
      details: {
        outErrorCode: out.Out_errorCode,
        outErrorMsg: out.Out_ErrorMsg,
        ulbId: payload.in_mtrreading_ulbid,
        readingMonth: payload.in_RedingEntryMonth,
        rowCount: payload.in_mtrreading_Str.split("$").length,
      },
      requestMeta: {
        ip: req.ip,
        method: req.method,
        path: req.originalUrl,
      },
    });

    return res.ok(out);
  } catch (err) {
    logApiError(req, 500, err.message, "Meter reading insert error");
    return next(err);
  }
}

module.exports = {
  getWardDropdownController,
  getZoneDropdownController,
  getBlockDropdownController,
  searchMeterConnectionsController,
  getGapCodeDropdownController,
  meterReadingInsController,
};
