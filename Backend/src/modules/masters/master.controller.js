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
  getBlockListService,
  getZoneDropdownByWardService,
  blockInsService,
  getBankListService,
  bankInsService,
  getRateListService,
  getUsageTypeDropdownService,
  getUsageSubTypeDropdownService,
  getConnTypeDropdownService,
  getConnSizeDropdownService,
  getTaxDropdownService,
  rateInsService,
  getRateDetailsService,
  getUlbTipListService,
  ulbTipInsService,
  getUlbTipDetailsService,
  getUsageTypeListService,
  usageTypeInsService,
  getConsumerTypeListService,
  consumerTypeInsService,
  getBillFreqListService,
  billFreqInsService,
  getUsageTypeDropdownMasService,
  getUsageSubTypeListService,
  usageSubTypeInsService,
  getGapCodeListService,
  gapCodeInsService,
  getPlumberListService,
  plumberInsService,
  getConnectionListService,
  connStatusInsService,
  getTaxListService,
  getApplyOnDropdownService,
  taxInsService,
  getTaxDetailsService,
  getMeterOwnerListService,
  meterOwnerInsService,
  getConnTypeListService,
  connTypeInsService,
  getConnCodeListService,
  connCodeInsService,
  getConnSizeListService,
  connSizeInsService,
  getBillingMethodListService,
  billingMethodInsService,
  getPremiseTypeListService,
  premiseTypeInsService,
  getCollCenterListService,
  collCentreInsService,
  getServiceListService,
  serviceMasInsService,
  getChargeListService,
  chargeTypeInsService,
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

async function getBlockListController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getBlockListService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Block list retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Block list error");
    return next(err);
  }
}

async function getZoneDropdownByWardController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getZoneDropdownByWardService(payload);

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

async function blockInsController(req, res, next) {
  try {
    const payload = req.body;
    const out = await blockInsService(payload);

    const isSuccess = Number(out.out_errorcode) === 9999;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        { blockId: payload.in_blockid },
        out.out_errormsg || "Block saved successfully",
      );
    } else {
      logApiError(req, 400, out.out_errormsg, "Block insert failed");
    }

    auditLog({
      action: payload.in_mode === 2 ? "BLOCK_UPDATE" : "BLOCK_CREATE",
      actor: req.user?.userId || payload.in_userid || "system",
      module: "block",
      entityId: payload.in_blockid || null,
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
    logApiError(req, 500, err.message, "Block insert error");
    return next(err);
  }
}

async function getBankListController(req, res, next) {
  try {
    const rows = await getBankListService();

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Bank list retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Bank list error");
    return next(err);
  }
}

async function bankInsController(req, res, next) {
  try {
    const payload = req.body;
    const out = await bankInsService(payload);

    const isSuccess = Number(out.Out_errorCode) === 9999;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        { bankId: payload.in_bankid },
        out.Out_ErrorMsg || "Bank saved successfully",
      );
    } else {
      logApiError(req, 400, out.Out_ErrorMsg, "Bank insert failed");
    }

    auditLog({
      action: payload.in_Mode === 2 ? "BANK_UPDATE" : "BANK_CREATE",
      actor: req.user?.userId || payload.in_UserId || "system",
      module: "bank",
      entityId: payload.in_bankid || null,
      status: isSuccess ? "SUCCESS" : "FAILED",
      details: {
        outErrorCode: out.Out_errorCode,
        outErrorMsg: out.Out_ErrorMsg,
        mode: payload.in_Mode,
      },
      requestMeta: {
        ip: req.ip,
        method: req.method,
        path: req.originalUrl,
      },
    });

    return res.ok(out);
  } catch (err) {
    logApiError(req, 500, err.message, "Bank insert error");
    return next(err);
  }
}

async function getRateListController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getRateListService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Rate list retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Rate list error");
    return next(err);
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
      `Usage type dropdown retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Usage type dropdown error");
    return next(err);
  }
}

async function getUsageSubTypeDropdownController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getUsageSubTypeDropdownService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Usage sub type dropdown retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Usage sub type dropdown error");
    return next(err);
  }
}

async function getConnTypeDropdownController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getConnTypeDropdownService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Connection type dropdown retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Connection type dropdown error");
    return next(err);
  }
}

async function getConnSizeDropdownController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getConnSizeDropdownService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Connection size dropdown retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Connection size dropdown error");
    return next(err);
  }
}

async function getTaxDropdownController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getTaxDropdownService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Tax dropdown retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Tax dropdown error");
    return next(err);
  }
}

async function getRateDetailsController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getRateDetailsService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Rate details retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Rate details error");
    return next(err);
  }
}

async function rateInsController(req, res, next) {
  try {
    const payload = req.body;
    const out = await rateInsService(payload);

    const isSuccess = Number(out.Out_errorCode) === 9999;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        { ulbId: payload.in_ulbid },
        out.Out_ErrorMsg || "Rate saved successfully",
      );
    } else {
      logApiError(req, 400, out.Out_ErrorMsg, "Rate insert failed");
    }

    auditLog({
      action: payload.in_Mode === 2 ? "RATE_UPDATE" : "RATE_CREATE",
      actor: req.user?.userId || payload.in_UserId || "system",
      module: "rate",
      entityId: null,
      status: isSuccess ? "SUCCESS" : "FAILED",
      details: {
        outErrorCode: out.Out_errorCode,
        outErrorMsg: out.Out_ErrorMsg,
        mode: payload.in_Mode,
      },
      requestMeta: {
        ip: req.ip,
        method: req.method,
        path: req.originalUrl,
      },
    });

    return res.ok(out);
  } catch (err) {
    logApiError(req, 500, err.message, "Rate insert error");
    return next(err);
  }
}

async function getUlbTipListController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getUlbTipListService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Ulb tip list retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Ulb tip list error");
    return next(err);
  }
}

async function getUlbTipDetailsController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getUlbTipDetailsService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Ulb tip details retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Ulb tip details error");
    return next(err);
  }
}

async function ulbTipInsController(req, res, next) {
  try {
    const payload = req.body;
    const out = await ulbTipInsService(payload);

    const isSuccess = Number(out.out_errorcode) === 9999;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        { tipId: payload.in_ulbtipid },
        out.out_errormsg || "Ulb tip saved successfully",
      );
    } else {
      logApiError(req, 400, out.out_errormsg, "Ulb tip insert failed");
    }

    auditLog({
      action: payload.in_mode === 2 ? "ULBTIP_UPDATE" : "ULBTIP_CREATE",
      actor: req.user?.userId || payload.in_userid || "system",
      module: "ulbtip",
      entityId: payload.in_ulbtipid || null,
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
    logApiError(req, 500, err.message, "Ulb tip insert error");
    return next(err);
  }
}

async function getUsageTypeListController(req, res, next) {
  try {
    const rows = await getUsageTypeListService();

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Usage type list retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Usage type list error");
    return next(err);
  }
}

async function usageTypeInsController(req, res, next) {
  try {
    const payload = req.body;
    const out = await usageTypeInsService(payload);

    const isSuccess = Number(out.Out_ErrorCode) === 9999;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        { usageTypeId: payload.in_Usagetypeid },
        out.Out_ErrorMsg || "Usage type saved successfully",
      );
    } else {
      logApiError(req, 400, out.Out_ErrorMsg, "Usage type insert failed");
    }

    auditLog({
      action: payload.in_Mode === 2 ? "USAGETYPE_UPDATE" : "USAGETYPE_CREATE",
      actor: req.user?.userId || payload.in_Userid || "system",
      module: "usagetype",
      entityId: payload.in_Usagetypeid || null,
      status: isSuccess ? "SUCCESS" : "FAILED",
      details: {
        outErrorCode: out.Out_ErrorCode,
        outErrorMsg: out.Out_ErrorMsg,
        mode: payload.in_Mode,
      },
      requestMeta: {
        ip: req.ip,
        method: req.method,
        path: req.originalUrl,
      },
    });

    return res.ok(out);
  } catch (err) {
    logApiError(req, 500, err.message, "Usage type insert error");
    return next(err);
  }
}

async function getConsumerTypeListController(req, res, next) {
  try {
    const rows = await getConsumerTypeListService();

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Consumer type list retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Consumer type list error");
    return next(err);
  }
}

async function consumerTypeInsController(req, res, next) {
  try {
    const payload = req.body;
    const out = await consumerTypeInsService(payload);

    const isSuccess = Number(out.Out_ErrorCode) === 9999;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        { consumerTypeId: payload.in_ConsumerTypeTd },
        out.Out_ErrorMsg || "Consumer type saved successfully",
      );
    } else {
      logApiError(req, 400, out.Out_ErrorMsg, "Consumer type insert failed");
    }

    auditLog({
      action:
        payload.in_Mode === 2 ? "CONSUMERTYPE_UPDATE" : "CONSUMERTYPE_CREATE",
      actor: req.user?.userId || payload.in_UserId || "system",
      module: "consumertype",
      entityId: payload.in_ConsumerTypeTd || null,
      status: isSuccess ? "SUCCESS" : "FAILED",
      details: {
        outErrorCode: out.Out_ErrorCode,
        outErrorMsg: out.Out_ErrorMsg,
        mode: payload.in_Mode,
      },
      requestMeta: {
        ip: req.ip,
        method: req.method,
        path: req.originalUrl,
      },
    });

    return res.ok(out);
  } catch (err) {
    logApiError(req, 500, err.message, "Consumer type insert error");
    return next(err);
  }
}

async function getBillFreqListController(req, res, next) {
  try {
    const rows = await getBillFreqListService();

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Bill frequency list retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Bill frequency list error");
    return next(err);
  }
}

async function billFreqInsController(req, res, next) {
  try {
    const payload = req.body;
    const out = await billFreqInsService(payload);

    const isSuccess = Number(out.Out_errorCode) === 9999;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        { billFreqId: payload.in_billfreqid },
        out.Out_ErrorMsg || "Bill frequency saved successfully",
      );
    } else {
      logApiError(req, 400, out.Out_ErrorMsg, "Bill frequency insert failed");
    }

    auditLog({
      action: payload.in_Mode === 2 ? "BILLFREQ_UPDATE" : "BILLFREQ_CREATE",
      actor: req.user?.userId || payload.in_UserId || "system",
      module: "billfreq",
      entityId: payload.in_billfreqid || null,
      status: isSuccess ? "SUCCESS" : "FAILED",
      details: {
        outErrorCode: out.Out_errorCode,
        outErrorMsg: out.Out_ErrorMsg,
        mode: payload.in_Mode,
      },
      requestMeta: {
        ip: req.ip,
        method: req.method,
        path: req.originalUrl,
      },
    });

    return res.ok(out);
  } catch (err) {
    logApiError(req, 500, err.message, "Bill frequency insert error");
    return next(err);
  }
}

async function getUsageTypeDropdownMasController(req, res, next) {
  try {
    const rows = await getUsageTypeDropdownMasService();

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Usage type dropdown retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Usage type dropdown error");
    return next(err);
  }
}

async function getUsageSubTypeListController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getUsageSubTypeListService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Usage sub type list retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Usage sub type list error");
    return next(err);
  }
}

async function usageSubTypeInsController(req, res, next) {
  try {
    const payload = req.body;
    const out = await usageSubTypeInsService(payload);

    const isSuccess = Number(out.Out_ErrorCode) === 9999;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        { usageSubTypeId: payload.in_Usagesubtypeid },
        out.Out_ErrorMsg || "Usage sub type saved successfully",
      );
    } else {
      logApiError(req, 400, out.Out_ErrorMsg, "Usage sub type insert failed");
    }

    auditLog({
      action:
        payload.in_mode === 2 ? "USAGESUBTYPE_UPDATE" : "USAGESUBTYPE_CREATE",
      actor: req.user?.userId || payload.in_UserId || "system",
      module: "usagesubtype",
      entityId: payload.in_Usagesubtypeid || null,
      status: isSuccess ? "SUCCESS" : "FAILED",
      details: {
        outErrorCode: out.Out_ErrorCode,
        outErrorMsg: out.Out_ErrorMsg,
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
    logApiError(req, 500, err.message, "Usage sub type insert error");
    return next(err);
  }
}

async function getGapCodeListController(req, res, next) {
  try {
    const rows = await getGapCodeListService();

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Gap code list retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Gap code list error");
    return next(err);
  }
}

async function gapCodeInsController(req, res, next) {
  try {
    const payload = req.body;
    const out = await gapCodeInsService(payload);

    const isSuccess = Number(out.Out_ErrorCode) === 9999;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        { gapCodeId: payload.in_GapcodeId },
        out.Out_ErrorMsg || "Gapcode saved successfully",
      );
    } else {
      logApiError(req, 400, out.Out_ErrorMsg, "Gapcode insert failed");
    }

    auditLog({
      action: payload.in_Mode === 2 ? "GAPCODE_UPDATE" : "GAPCODE_CREATE",
      actor: req.user?.userId || payload.in_UserId || "system",
      module: "gapcode",
      entityId: payload.in_GapcodeId || null,
      status: isSuccess ? "SUCCESS" : "FAILED",
      details: {
        outErrorCode: out.Out_ErrorCode,
        outErrorMsg: out.Out_ErrorMsg,
        mode: payload.in_Mode,
      },
      requestMeta: {
        ip: req.ip,
        method: req.method,
        path: req.originalUrl,
      },
    });

    return res.ok(out);
  } catch (err) {
    logApiError(req, 500, err.message, "Gapcode insert error");
    return next(err);
  }
}

async function getPlumberListController(req, res, next) {
  try {
    const rows = await getPlumberListService();

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Plumber list retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Plumber list error");
    return next(err);
  }
}

async function plumberInsController(req, res, next) {
  try {
    const payload = req.body;
    const out = await plumberInsService(payload);

    const isSuccess = Number(out.Out_ErrorCode) === 9999;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        { plumberId: payload.in_PlumberId },
        out.Out_ErrorMsg || "Plumber saved successfully",
      );
    } else {
      logApiError(req, 400, out.Out_ErrorMsg, "Plumber insert failed");
    }

    auditLog({
      action: payload.in_Mode === 2 ? "PLUMBER_UPDATE" : "PLUMBER_CREATE",
      actor: req.user?.userId || payload.in_UserId || "system",
      module: "plumber",
      entityId: payload.in_PlumberId || null,
      status: isSuccess ? "SUCCESS" : "FAILED",
      details: {
        outErrorCode: out.Out_ErrorCode,
        outErrorMsg: out.Out_ErrorMsg,
        mode: payload.in_Mode,
      },
      requestMeta: {
        ip: req.ip,
        method: req.method,
        path: req.originalUrl,
      },
    });

    return res.ok(out);
  } catch (err) {
    logApiError(req, 500, err.message, "Plumber insert error");
    return next(err);
  }
}

async function getConnectionListController(req, res, next) {
  try {
    const rows = await getConnectionListService();

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Connection status list retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Connection status list error");
    return next(err);
  }
}

async function connStatusInsController(req, res, next) {
  try {
    const payload = req.body;
    const out = await connStatusInsService(payload);

    const isSuccess = Number(out.Out_ErrorCode) === 9999;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        { connStatusId: payload.in_Connstatusid },
        out.Out_ErrorMsg || "Connection status saved successfully",
      );
    } else {
      logApiError(
        req,
        400,
        out.Out_ErrorMsg,
        "Connection status insert failed",
      );
    }

    auditLog({
      action: payload.in_Mode === 2 ? "CONNSTATUS_UPDATE" : "CONNSTATUS_CREATE",
      actor: req.user?.userId || payload.in_Userid || "system",
      module: "connstatus",
      entityId: payload.in_Connstatusid || null,
      status: isSuccess ? "SUCCESS" : "FAILED",
      details: {
        outErrorCode: out.Out_ErrorCode,
        outErrorMsg: out.Out_ErrorMsg,
        mode: payload.in_Mode,
      },
      requestMeta: {
        ip: req.ip,
        method: req.method,
        path: req.originalUrl,
      },
    });

    return res.ok(out);
  } catch (err) {
    logApiError(req, 500, err.message, "Connection status insert error");
    return next(err);
  }
}

async function getTaxListController(req, res, next) {
  try {
    const rows = await getTaxListService();

    logApiSuccess(req, 200, { count: rows?.length || 0 }, `Tax list retrieved`);

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Tax list error");
    return next(err);
  }
}

async function getApplyOnDropdownController(req, res, next) {
  try {
    const rows = await getApplyOnDropdownService();

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Tax apply-on dropdown retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Tax apply-on dropdown error");
    return next(err);
  }
}

async function getTaxDetailsController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getTaxDetailsService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Tax details retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Tax details error");
    return next(err);
  }
}

async function taxInsController(req, res, next) {
  try {
    const payload = req.body;
    const out = await taxInsService(payload);

    const isSuccess = Number(out.Out_errorCode) === 9999;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        { taxId: payload.in_taxid },
        out.Out_ErrorMsg || "Tax saved successfully",
      );
    } else {
      logApiError(req, 400, out.Out_ErrorMsg, "Tax insert failed");
    }

    auditLog({
      action: payload.in_Mode === 2 ? "TAX_UPDATE" : "TAX_CREATE",
      actor: req.user?.userId || payload.in_UserId || "system",
      module: "tax",
      entityId: payload.in_taxid || null,
      status: isSuccess ? "SUCCESS" : "FAILED",
      details: {
        outErrorCode: out.Out_errorCode,
        outErrorMsg: out.Out_ErrorMsg,
        mode: payload.in_Mode,
      },
      requestMeta: {
        ip: req.ip,
        method: req.method,
        path: req.originalUrl,
      },
    });

    return res.ok(out);
  } catch (err) {
    logApiError(req, 500, err.message, "Tax insert error");
    return next(err);
  }
}

async function getMeterOwnerListController(req, res, next) {
  try {
    const rows = await getMeterOwnerListService();

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Meter owner list retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Meter owner list error");
    return next(err);
  }
}

async function meterOwnerInsController(req, res, next) {
  try {
    const payload = req.body;
    const out = await meterOwnerInsService(payload);

    const isSuccess = Number(out.Out_errorCode) === 9999;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        { meterOwnerId: payload.in_MeterOwnerid },
        out.Out_ErrorMsg || "Meter owner saved successfully",
      );
    } else {
      logApiError(req, 400, out.Out_ErrorMsg, "Meter owner insert failed");
    }

    auditLog({
      action: payload.in_Mode === 2 ? "METEROWNER_UPDATE" : "METEROWNER_CREATE",
      actor: req.user?.userId || payload.in_UserId || "system",
      module: "meterowner",
      entityId: payload.in_MeterOwnerid || null,
      status: isSuccess ? "SUCCESS" : "FAILED",
      details: {
        outErrorCode: out.Out_errorCode,
        outErrorMsg: out.Out_ErrorMsg,
        mode: payload.in_Mode,
      },
      requestMeta: {
        ip: req.ip,
        method: req.method,
        path: req.originalUrl,
      },
    });

    return res.ok(out);
  } catch (err) {
    logApiError(req, 500, err.message, "Meter owner insert error");
    return next(err);
  }
}

async function getConnTypeListController(req, res, next) {
  try {
    const rows = await getConnTypeListService();

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Connection type list retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Connection type list error");
    return next(err);
  }
}

async function connTypeInsController(req, res, next) {
  try {
    const payload = req.body;
    const out = await connTypeInsService(payload);

    const isSuccess = Number(out.Out_ErrorCode) === 9999;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        { connTypeId: payload.in_ConntypeId },
        out.Out_ErrorMsg || "Connection type saved successfully",
      );
    } else {
      logApiError(req, 400, out.Out_ErrorMsg, "Connection type insert failed");
    }

    auditLog({
      action: payload.in_Mode === 2 ? "CONNTYPE_UPDATE" : "CONNTYPE_CREATE",
      actor: req.user?.userId || payload.in_UserId || "system",
      module: "conntype",
      entityId: payload.in_ConntypeId || null,
      status: isSuccess ? "SUCCESS" : "FAILED",
      details: {
        outErrorCode: out.Out_ErrorCode,
        outErrorMsg: out.Out_ErrorMsg,
        mode: payload.in_Mode,
      },
      requestMeta: {
        ip: req.ip,
        method: req.method,
        path: req.originalUrl,
      },
    });

    return res.ok(out);
  } catch (err) {
    logApiError(req, 500, err.message, "Connection type insert error");
    return next(err);
  }
}

async function getConnCodeListController(req, res, next) {
  try {
    const rows = await getConnCodeListService();

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Connection code list retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Connection code list error");
    return next(err);
  }
}

async function connCodeInsController(req, res, next) {
  try {
    const payload = req.body;
    const out = await connCodeInsService(payload);

    const isSuccess = Number(out.Out_ErrorCode) === 9999;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        { connCodeId: payload.in_ConncodeId },
        out.Out_ErrorMsg || "Connection code saved successfully",
      );
    } else {
      logApiError(req, 400, out.Out_ErrorMsg, "Connection code insert failed");
    }

    auditLog({
      action: payload.in_Mode === 2 ? "CONNCODE_UPDATE" : "CONNCODE_CREATE",
      actor: req.user?.userId || payload.in_UserId || "system",
      module: "conncode",
      entityId: payload.in_ConncodeId || null,
      status: isSuccess ? "SUCCESS" : "FAILED",
      details: {
        outErrorCode: out.Out_ErrorCode,
        outErrorMsg: out.Out_ErrorMsg,
        mode: payload.in_Mode,
      },
      requestMeta: {
        ip: req.ip,
        method: req.method,
        path: req.originalUrl,
      },
    });

    return res.ok(out);
  } catch (err) {
    logApiError(req, 500, err.message, "Connection code insert error");
    return next(err);
  }
}

async function getConnSizeListController(req, res, next) {
  try {
    const rows = await getConnSizeListService();

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Connection size list retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Connection size list error");
    return next(err);
  }
}

async function connSizeInsController(req, res, next) {
  try {
    const payload = req.body;
    const out = await connSizeInsService(payload);

    const isSuccess = Number(out.Out_ErrorCode) === 9999;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        { connSizeId: payload.in_Connsizeid },
        out.Out_ErrorMsg || "Connection size saved successfully",
      );
    } else {
      logApiError(req, 400, out.Out_ErrorMsg, "Connection size insert failed");
    }

    auditLog({
      action: payload.in_Mode === 2 ? "CONNSIZE_UPDATE" : "CONNSIZE_CREATE",
      actor: req.user?.userId || payload.in_UserId || "system",
      module: "connsize",
      entityId: payload.in_Connsizeid || null,
      status: isSuccess ? "SUCCESS" : "FAILED",
      details: {
        outErrorCode: out.Out_ErrorCode,
        outErrorMsg: out.Out_ErrorMsg,
        mode: payload.in_Mode,
      },
      requestMeta: {
        ip: req.ip,
        method: req.method,
        path: req.originalUrl,
      },
    });

    return res.ok(out);
  } catch (err) {
    logApiError(req, 500, err.message, "Connection size insert error");
    return next(err);
  }
}

async function getBillingMethodListController(req, res, next) {
  try {
    const rows = await getBillingMethodListService();

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Billing method list retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Billing method list error");
    return next(err);
  }
}

async function billingMethodInsController(req, res, next) {
  try {
    const payload = req.body;
    const out = await billingMethodInsService(payload);

    const isSuccess = Number(out.Out_ErrorCode) === 9999;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        { billingMethodId: payload.in_BillingMethodId },
        out.Out_ErrorMsg || "Billing method saved successfully",
      );
    } else {
      logApiError(req, 400, out.Out_ErrorMsg, "Billing method insert failed");
    }

    auditLog({
      action:
        payload.in_Mode === 2 ? "BILLINGMETHOD_UPDATE" : "BILLINGMETHOD_CREATE",
      actor: req.user?.userId || payload.in_UserId || "system",
      module: "billingmethod",
      entityId: payload.in_BillingMethodId || null,
      status: isSuccess ? "SUCCESS" : "FAILED",
      details: {
        outErrorCode: out.Out_ErrorCode,
        outErrorMsg: out.Out_ErrorMsg,
        mode: payload.in_Mode,
      },
      requestMeta: {
        ip: req.ip,
        method: req.method,
        path: req.originalUrl,
      },
    });

    return res.ok(out);
  } catch (err) {
    logApiError(req, 500, err.message, "Billing method insert error");
    return next(err);
  }
}

async function getPremiseTypeListController(req, res, next) {
  try {
    const rows = await getPremiseTypeListService();

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Premise type list retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Premise type list error");
    return next(err);
  }
}

async function premiseTypeInsController(req, res, next) {
  try {
    const payload = req.body;
    const out = await premiseTypeInsService(payload);

    const isSuccess = Number(out.Out_ErrorCode) === 9999;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        { premiseTypeId: payload.in_PremiseTypeId },
        out.Out_ErrorMsg || "Premise type saved successfully",
      );
    } else {
      logApiError(req, 400, out.Out_ErrorMsg, "Premise type insert failed");
    }

    auditLog({
      action:
        payload.in_Mode === 2 ? "PREMISETYPE_UPDATE" : "PREMISETYPE_CREATE",
      actor: req.user?.userId || payload.in_UserId || "system",
      module: "premisetype",
      entityId: payload.in_PremiseTypeId || null,
      status: isSuccess ? "SUCCESS" : "FAILED",
      details: {
        outErrorCode: out.Out_ErrorCode,
        outErrorMsg: out.Out_ErrorMsg,
        mode: payload.in_Mode,
      },
      requestMeta: {
        ip: req.ip,
        method: req.method,
        path: req.originalUrl,
      },
    });

    return res.ok(out);
  } catch (err) {
    logApiError(req, 500, err.message, "Premise type insert error");
    return next(err);
  }
}

async function getCollCenterListController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getCollCenterListService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Collection centre list retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Collection centre list error");
    return next(err);
  }
}

async function collCentreInsController(req, res, next) {
  try {
    const payload = req.body;
    const out = await collCentreInsService(payload);

    const isSuccess = Number(out.out_errorcode) === 9999;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        { collCentreId: payload.in_collcentreid },
        out.out_errormsg || "Collection centre saved successfully",
      );
    } else {
      logApiError(
        req,
        400,
        out.out_errormsg,
        "Collection centre insert failed",
      );
    }

    auditLog({
      action: payload.in_mode === 2 ? "COLLCENTRE_UPDATE" : "COLLCENTRE_CREATE",
      actor: req.user?.userId || payload.in_userid || "system",
      module: "collcentre",
      entityId: payload.in_collcentreid || null,
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
    logApiError(req, 500, err.message, "Collection centre insert error");
    return next(err);
  }
}

async function getServiceListController(req, res, next) {
  try {
    const rows = await getServiceListService();

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Service list retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Service list error");
    return next(err);
  }
}

async function serviceMasInsController(req, res, next) {
  try {
    const payload = req.body;
    const out = await serviceMasInsService(payload);

    const isSuccess = Number(out.out_errorcode) === 9999;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        { serviceId: payload.in_service_id },
        out.out_errormsg || "Service saved successfully",
      );
    } else {
      logApiError(req, 400, out.out_errormsg, "Service insert failed");
    }

    auditLog({
      action: payload.in_mode === 2 ? "SERVICE_UPDATE" : "SERVICE_CREATE",
      actor: req.user?.userId || payload.in_userid || "system",
      module: "service",
      entityId: payload.in_service_id || null,
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
    logApiError(req, 500, err.message, "Service insert error");
    return next(err);
  }
}

async function getChargeListController(req, res, next) {
  try {
    const rows = await getChargeListService();

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Charge list retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Charge list error");
    return next(err);
  }
}

async function chargeTypeInsController(req, res, next) {
  try {
    const payload = req.body;
    const out = await chargeTypeInsService(payload);

    const isSuccess = Number(out.Out_errorCode) === 9999;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        { chargeTypeId: payload.in_chargestypeid },
        out.Out_ErrorMsg || "Charge type saved successfully",
      );
    } else {
      logApiError(req, 400, out.Out_ErrorMsg, "Charge type insert failed");
    }

    auditLog({
      action: payload.in_Mode === 2 ? "CHARGETYPE_UPDATE" : "CHARGETYPE_CREATE",
      actor: req.user?.userId || payload.in_UserId || "system",
      module: "chargetype",
      entityId: payload.in_chargestypeid || null,
      status: isSuccess ? "SUCCESS" : "FAILED",
      details: {
        outErrorCode: out.Out_errorCode,
        outErrorMsg: out.Out_ErrorMsg,
        mode: payload.in_Mode,
      },
      requestMeta: {
        ip: req.ip,
        method: req.method,
        path: req.originalUrl,
      },
    });

    return res.ok(out);
  } catch (err) {
    logApiError(req, 500, err.message, "Charge type insert error");
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
  getBlockListController,
  getZoneDropdownByWardController,
  blockInsController,
  getBankListController,
  bankInsController,
  getRateListController,
  getUsageTypeDropdownController,
  getUsageSubTypeDropdownController,
  getConnTypeDropdownController,
  getConnSizeDropdownController,
  getTaxDropdownController,
  getRateDetailsController,
  rateInsController,
  getUlbTipListController,
  getUlbTipDetailsController,
  ulbTipInsController,
  getUsageTypeListController,
  usageTypeInsController,
  getConsumerTypeListController,
  consumerTypeInsController,
  getBillFreqListController,
  billFreqInsController,
  getUsageTypeDropdownMasController,
  getUsageSubTypeListController,
  usageSubTypeInsController,
  getGapCodeListController,
  gapCodeInsController,
  getPlumberListController,
  plumberInsController,
  getConnectionListController,
  connStatusInsController,
  getTaxListController,
  getApplyOnDropdownController,
  taxInsController,
  getTaxDetailsController,
  getMeterOwnerListController,
  meterOwnerInsController,
  getConnTypeListController,
  connTypeInsController,
  getConnCodeListController,
  connCodeInsController,
  getConnSizeListController,
  connSizeInsController,
  getBillingMethodListController,
  billingMethodInsController,
  getPremiseTypeListController,
  premiseTypeInsController,
  getCollCenterListController,
  collCentreInsController,
  getServiceListController,
  serviceMasInsController,
  getChargeListController,
  chargeTypeInsController,
};
