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
  getReceiptDeleteAuthListService,
  getYearDropdownService,
  getReceiptDeleteWardDropdownService,
  getReceiptDeleteZoneDropdownService,
  getReceiptDeleteListDetailsService,
  getReceiptDeleteMstDetailsService,
  getReceiptDeleteReasonDropdownService,
  getReceiptDeletePaymentDropdownService,
  getReceiptDeleteBankDropdownService,
  getReceiptDeleteBlockDropdownService,
  receiptDeleteMstSubmitService,
  getPayTypeDropdownService,
  getRecDelReasonDropdownService,
  getRecDeleteBankDropdownService,
  fetchDelRecAuthDetailsService,
  getCheckPaymodeService,
  recDelAuthInsService,
  getConnZoneBlockService,
  getBillDeleteDetailsService,
  getVasuliChallanTableDataService,
  generateChallanNumberService,
  billDeleteInsService,
  getServiceDropdownService,
  getChangeOwnerConnectionDtlsService,
  getUsageSubUsageConnectionDtlsService,
  getChargesTableDataService,
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

async function getReceiptDeleteAuthListController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getReceiptDeleteAuthListService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0, ulbId: payload.ulbId },
      rows?.length > 0
        ? `Receipt delete auth list retrieved`
        : `No pending delete auth receipts found`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 400, err.message, "Receipt delete auth list error");
    return next(err);
  }
}

// Reciept Delete List

async function getYearDropdownController(req, res, next) {
  try {
    const rows = await getYearDropdownService();

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Year dropdown retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Year dropdown error");
    return next(err);
  }
}

async function getReceiptDeleteWardDropdownController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getReceiptDeleteWardDropdownService(payload);

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

async function getReceiptDeleteZoneDropdownController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getReceiptDeleteZoneDropdownService(payload);

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

async function getReceiptDeleteBlockDropdownController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getReceiptDeleteBlockDropdownService(payload);

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

async function getReceiptDeleteListDetailsController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getReceiptDeleteListDetailsService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Receipt Delete List retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Receipt Delete List fetch error");
    return next(err);
  }
}

async function getReceiptDeleteReasonDropdownController(req, res, next) {
  try {
    const rows = await getReceiptDeleteReasonDropdownService();

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Reason Dropdown retrieved successfully`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Reason Dropdown fetch error");
    return next(err);
  }
}

async function getReceiptDeletePaymentDropdownController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getReceiptDeletePaymentDropdownService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Payment Dropdown retrieved successfully`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Payment Dropdown fetch error");
    return next(err);
  }
}

async function getReceiptDeleteBankDropdownController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getReceiptDeleteBankDropdownService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Bank Dropdown retrieved successfully`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Bank Dropdown fetch error");
    return next(err);
  }
}

async function getReceiptDeleteMstDetailsController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getReceiptDeleteMstDetailsService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Receipt Details retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Receipt Details fetch error");
    return next(err);
  }
}

async function getCheckPaymodeController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getCheckPaymodeService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Paymode type retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Paymode type fetch error");
    return next(err);
  }
}

async function receiptDeleteMstDataSubmitController(req, res, next) {
  try {
    const payload = req.body;
    const rows = await receiptDeleteMstSubmitService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Receipt Details Delete Data submit successfully`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(
      req,
      500,
      err.message,
      "Receipt Details Delete Data submit error",
    );
    return next(err);
  }
}

async function getPayTypeDropdownController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getPayTypeDropdownService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Pay type dropdown retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Pay type dropdown error");
    return next(err);
  }
}

async function getRecDelReasonDropdownController(req, res, next) {
  try {
    const rows = await getRecDelReasonDropdownService();

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Receipt delete reason dropdown retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Receipt delete reason dropdown error");
    return next(err);
  }
}

async function getRecDelBankDropdownController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getRecDeleteBankDropdownService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Receipt delete bank dropdown retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Receipt delete bank dropdown error");
    return next(err);
  }
}

async function fetchDelRecAuthDetailsController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await fetchDelRecAuthDetailsService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0, receiptId: payload.receiptId },
      rows?.length > 0
        ? `Receipt delete auth details retrieved`
        : `Receipt delete auth details not found`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 400, err.message, "Receipt delete auth details error");
    return next(err);
  }
}

async function recDelAuthInsController(req, res, next) {
  try {
    const payload = req.body;
    const out = await recDelAuthInsService(payload);

    const isSuccess = Number(out.out_errorcode) === 9999;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        {
          connId: payload.in_connid,
          recId: payload.in_recid,
          status: payload.in_status,
        },
        out.out_errormssg || "Receipt delete authorization processed",
      );
    } else {
      logApiError(
        req,
        400,
        out.out_errormssg,
        "Receipt delete authorization failed",
      );
    }

    auditLog({
      action:
        payload.in_status === "A"
          ? "RECEIPT_DELETE_APPROVE"
          : "RECEIPT_DELETE_REJECT",
      actor: req.user?.userId || payload.in_userid || "system",
      module: "receiptdeleteauth",
      entityId: payload.in_recid,
      status: isSuccess ? "SUCCESS" : "FAILED",
      details: {
        outErrorCode: out.out_errorcode,
        outErrorMsg: out.out_errormssg,
        ulbId: payload.in_ulbid,
        connId: payload.in_connid,
      },
      requestMeta: {
        ip: req.ip,
        method: req.method,
        path: req.originalUrl,
      },
    });

    return res.ok(out);
  } catch (err) {
    logApiError(req, 500, err.message, "Receipt delete auth insert error");
    return next(err);
  }
}

async function getConnZoneBlockController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getConnZoneBlockService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0, connNo: payload.connNo },
      rows?.length > 0
        ? `Connection zone/block retrieved`
        : `Connection not found`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 400, err.message, "Connection zone/block error");
    return next(err);
  }
}

async function getBillDeleteDetailsController(req, res, next) {
  try {
    const payload = req.body;
    const rows = await getBillDeleteDetailsService(payload);

    logApiSuccess(
      req,
      200,
      {
        count: rows?.length || 0,
        connNo: payload.connNo,
        ulbId: payload.ulbId,
      },
      rows?.length > 0
        ? `Bill delete details retrieved`
        : `Connection not found`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 400, err.message, "Bill delete details error");
    return next(err);
  }
}

async function getVasuliChallanTableDataController(req, res, next) {
  try {
    const rows = await getVasuliChallanTableDataService();

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Vasuli Challan Table Data retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Vasuli Challan Table Data fetch error");
    return next(err);
  }
}

async function generateChallanNumberController(req, res, next) {
  try {
    const payload = req.body;
    const rows = await generateChallanNumberService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Challan Number generated successfully`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Challan Number generation error");
    return next(err);
  }
}

async function billDeleteInsController(req, res, next) {
  try {
    const payload = req.body;
    const out = await billDeleteInsService(payload);

    const isSuccess = Number(out.out_errorcode) === 9999;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        {
          connId: payload.in_Connid,
          connNo: payload.in_Connno,
          ulbId: payload.in_ulbid,
        },
        out.out_errormsg || "Bill deleted successfully",
      );
    } else {
      logApiError(req, 400, out.out_errormsg, "Bill delete failed");
    }

    auditLog({
      action: "BILL_DELETE",
      actor: req.user?.userId || payload.in_userid || "system",
      module: "billdelete",
      entityId: payload.in_Connid,
      status: isSuccess ? "SUCCESS" : "FAILED",
      details: {
        outErrorCode: out.out_errorcode,
        outErrorMsg: out.out_errormsg,
        ulbId: payload.in_ulbid,
        zoneId: payload.in_zoneid,
        blockNo: payload.in_Blockno,
        connNo: payload.in_Connno,
        flatNo: payload.in_flatno ?? null,
      },
      requestMeta: {
        ip: req.ip,
        method: req.method,
        path: req.originalUrl,
      },
    });

    return res.ok(out);
  } catch (err) {
    logApiError(req, 500, err.message, "Bill delete insert error");
    return next(err);
  }
}

// Change Ownership 

async function getServiceDropdownController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getServiceDropdownService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Service dropdown retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Service dropdown fetch error");
    return next(err);
  }
}

async function getChangeOwnerConnectionDtlsController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getChangeOwnerConnectionDtlsService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Connection Details retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Connection Details fetch error");
    return next(err);
  }
}

async function getUsageSubUsageConnectionDtlsController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getUsageSubUsageConnectionDtlsService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Usage and Sub Usage Details retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Usage and Sub Usage Details fetch error");
    return next(err);
  }
}

async function getChargesTableDtlsController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getChargesTableDataService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Charges Table Details retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Charges Table Details fetch error");
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
  getReceiptDeleteAuthListController,
  getYearDropdownController,
  getReceiptDeleteWardDropdownController,
  getReceiptDeleteZoneDropdownController,
  getReceiptDeleteBlockDropdownController,
  getReceiptDeleteListDetailsController,
  getReceiptDeleteReasonDropdownController,
  getReceiptDeletePaymentDropdownController,
  getReceiptDeleteBankDropdownController,
  getReceiptDeleteMstDetailsController,
  receiptDeleteMstDataSubmitController,
  getPayTypeDropdownController,
  getRecDelReasonDropdownController,
  getRecDelBankDropdownController,
  fetchDelRecAuthDetailsController,
  getCheckPaymodeController,
  receiptDeleteMstDataSubmitController,
  recDelAuthInsController,
  getConnZoneBlockController,
  getBillDeleteDetailsController,
  getVasuliChallanTableDataController,
  generateChallanNumberController,
  billDeleteInsController,
  getServiceDropdownController,
  getChangeOwnerConnectionDtlsController,
  getUsageSubUsageConnectionDtlsController,
  getChargesTableDtlsController
};
