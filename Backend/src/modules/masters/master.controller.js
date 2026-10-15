const {
  getMenuListService,
  getUlbDropdownService,
  getUserListService,
  getWardListService,
  wardInsService,
  getZoneListService,
  getZoneDetailsService,
  zoneInsService,
  getWardDropdownByUlbService,
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

async function getZoneListController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getZoneListService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Zone list retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Zone list error");
    return next(err);
  }
}

async function getZoneDetailsController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getZoneDetailsService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Zone details retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Zone details error");
    return next(err);
  }
}

async function getWardDropdownByUlbController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getWardDropdownByUlbService(payload);

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

async function zoneInsController(req, res, next) {
  try {
    const payload = req.body;
    const out = await zoneInsService(payload);

    const isSuccess = Number(out.out_errorcode) === 9999;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        { zoneId: payload.in_zoneid },
        out.out_errormsg || "Zone saved successfully",
      );
    } else {
      logApiError(req, 400, out.out_errormsg, "Zone insert failed");
    }

    auditLog({
      action: payload.in_mode === 2 ? "ZONE_UPDATE" : "ZONE_CREATE",
      actor: req.user?.userId || payload.in_userid || "system",
      module: "zone",
      entityId: payload.in_zoneid || null,
      status: isSuccess ? "SUCCESS" : "FAILED",
      details: {
        outErrorCode: out.out_errorcode,
        outErrorMsg: out.out_errormsg,
        mode: payload.in_mode,
      },
      requestMeta: {
        ip: req.ip,
        method: req.method,
        path: req.originalUrl,
      },
    });

    return res.ok(out);
  } catch (err) {
    logApiError(req, 500, err.message, "Zone insert error");
    return next(err);
  }
}

module.exports = {
  getMenuListController,
  getUlbDropdownController,
  getUserListController,
  getWardListController,
  wardInsController,
  getZoneListController,
  getZoneDetailsController,
  getWardDropdownByUlbController,
  zoneInsController,
};
