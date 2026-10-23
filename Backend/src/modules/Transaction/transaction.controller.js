const { logApiSuccess, logApiError } = require("../../utils/log");
const { auditLog } = require("../../utils/audit-log");
const {
  getWardDropdownService,
  getZoneDropdownService,
  getBlockDropdownService,
  searchMeterConnectionsService,
  getGapCodeDropdownService,
  meterReadingInsService,
  getZoneDropdownWithUlbIdService,
  billGenInsService,
  getBankDropdownService,
  getReasonDropdownService,
  chequeBounceInsService,
  chequeBounceSearchService,
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

async function getZoneDropdownWithUlbIdController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getZoneDropdownWithUlbIdService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Zone dropdown (by ULB) retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Zone dropdown (by ULB) error");
    return next(err);
  }
}

async function billGenInsController(req, res, next) {
  try {
    const payload = req.body;
    const out = await billGenInsService(payload);

    // here i check in procedure, -100 is success error code for this procedure instead of 9999 like other procedure does
    const isSuccess = Number(out.out_errorcode) === -100;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        {
          ulbId: payload.in_ULBId,
          zoneId: payload.in_zoneid,
          blockId: payload.in_blockno,
        },
        out.out_errormsg || "Bill generated successfully",
      );
    } else {
      logApiError(req, 400, out.out_errormsg, "Bill generation failed");
    }

    auditLog({
      action: "BILL_GENERATE",
      actor: req.user?.userId || payload.in_userid || "system",
      module: "billgeneration",
      entityId: null,
      status: isSuccess ? "SUCCESS" : "FAILED",
      details: {
        outErrorCode: out.out_errorcode,
        outErrorMsg: out.out_errormsg,
        ulbId: payload.in_ULBId,
        zoneId: payload.in_zoneid,
        blockId: payload.in_blockno,
        connNo: payload.in_conno || null,
        billDate: payload.in_billdate,
        dueDate: payload.in_duedate,
      },
      requestMeta: {
        ip: req.ip,
        method: req.method,
        path: req.originalUrl,
      },
    });

    return res.ok(out);
  } catch (err) {
    logApiError(req, 500, err.message, "Bill generation error");
    return next(err);
  }
}

async function getBankDropdownController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getBankDropdownService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Bank dropdown retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Bank dropdown error");
    return next(err);
  }
}

async function getReasonDropdownController(req, res, next) {
  try {
    const rows = await getReasonDropdownService();

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Reason dropdown retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Reason dropdown error");
    return next(err);
  }
}

async function chequeBounceInsController(req, res, next) {
  try {
    const payload = req.body;
    const out = await chequeBounceInsService(payload);

    const isSuccess = Number(out.out_errorcode) === 9999;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        {
          ulbId: payload.in_ulbid,
          zoneId: payload.in_zoneid,
          chequeNo: payload.in_chequeno,
          rowCount: payload.in_proprecstr.split("#").length,
        },
        out.out_errormssg || "Cheque bounce processed successfully",
      );
    } else {
      logApiError(req, 400, out.out_errormssg, "Cheque bounce insert failed");
    }

    auditLog({
      action: "CHEQUEBOUNCE_CREATE",
      actor: req.user?.userId || payload.in_userid || "system",
      module: "chequebounce",
      entityId: null,
      status: isSuccess ? "SUCCESS" : "FAILED",
      details: {
        outErrorCode: out.out_errorcode,
        outErrorMsg: out.out_errormssg,
        ulbId: payload.in_ulbid,
        zoneId: payload.in_zoneid,
        chequeNo: payload.in_chequeno,
        bankId: payload.in_bankid,
        remark: payload.in_remark,
        finYear: payload.in_FinYear,
        rowCount: payload.in_proprecstr.split("#").length,
      },
      requestMeta: {
        ip: req.ip,
        method: req.method,
        path: req.originalUrl,
      },
    });

    return res.ok(out);
  } catch (err) {
    logApiError(req, 500, err.message, "Cheque bounce insert error");
    return next(err);
  }
}

async function chequeBounceSearchController(req, res, next) {
  try {
    const payload = req.body;
    const rows = await chequeBounceSearchService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0, chequeNo: payload.chequeNo },
      rows?.length > 0
        ? `Cheque bounce records retrieved`
        : `No cheque bounce records found`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 400, err.message, "Cheque bounce search error");
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
  getZoneDropdownWithUlbIdController,
  billGenInsController,
  getBankDropdownController,
  getReasonDropdownController,
  chequeBounceInsController,
  chequeBounceSearchController,
};
