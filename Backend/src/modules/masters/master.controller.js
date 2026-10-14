const {
  getMenuListService,
  getUlbDropdownService,
  getUserListService,
  getWardListService,
  wardInsService,
} = require("./master.service");
const { logApiSuccess, logApiError } = require("../../utils/log");
const { auditLog } = require("../../utils/audit-log");

function requestMeta(req) {
  return {
    ip: req.ip,
    method: req.method,
    path: req.originalUrl,
  };
}

async function getMenuListController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getMenuListService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Menu list retrieved`,
    );

    return res.ok(rows);
  } catch (error) {
    logApiError(req, 500, error.message, "Menu list error");
    return next(error);
  }
}

async function getUlbDropdownController(req, res, next) {
  try {
    const rows = await getUlbDropdownService();

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `ULB dropdown retrieved`,
    );
    return res.ok(rows);
  } catch (error) {
    logApiError(req, 500, error.message, "ULB dropdown error");
    return next(error);
  }
}

async function getUserListController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getUserListService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `User list retrieved`,
    );

    return res.ok(rows);
  } catch (error) {
    logApiError(req, 500, error.message, "User list error");
    return next(error);
  }
}

async function getWardListController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getWardListService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Ward list retrieved`,
    );

    return res.ok(rows);
  } catch (error) {
    logApiError(req, 500, error.message, "Ward list error");
    return next(error);
  }
}

async function wardInsController(req, res, next) {
  try {
    const payload = req.body;
    const out = await wardInsService(payload);

    const isSuccess = String(out.OUT_ERRORCODE) === "9999";

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        { wardId: payload.in_wardid },
        out.OUT_ERRORMSG || "Ward saved successfully",
      );
    } else {
      logApiError(req, 400, out.OUT_ERRORMSG, "Ward insert failed");
    }

    auditLog({
      action: payload.in_mode === 2 ? "WARD_UPDATE" : "WARD_CREATE",
      actor: req.user?.userId || payload.in_userid || "system",
      module: "ward",
      entityId: payload.in_wardid || null,
      status: isSuccess ? "SUCCESS" : "FAILED",
      details: {
        outErrorCode: out.OUT_ERRORCODE,
        outErrorMsg: out.OUT_ERRORMSG,
        mode: payload.in_mode,
      },
      requestMeta: requestMeta(req),
    });

    return res.ok(out);
  } catch (error) {
    logApiError(req, 500, error.message, "Ward insert error");
    return next(error);
  }
}

module.exports = {
  getMenuListController,
  getUlbDropdownController,
  getUserListController,
  getWardListController,
  wardInsController,
};
