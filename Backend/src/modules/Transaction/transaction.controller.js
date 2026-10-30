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
  getOwnershipAuthListService,
  getOwnershipDocService,
  fetchOwnershipDetailsService,
  getServiceDropdownService,
  getChangeOwnerConnectionDtlsService,
  getUsageSubUsageConnectionDtlsService,
  getChargesTableDataService,
  changeOwnershipSubmitService,
  changeOwnershipDocumentService,
  getOwnershipServiceDropdownService,
  getOwnershipChargesService,
  serviceApprovalAuthInsService,
  getAcknowledgmentReportDetailsService,
  getGenModAuthListService,
  fetchGenAuthDetailsService,
  connGenAuthInsService,
  getConnAuthStatusService,
  getGenericModifyListDtlsService,
  getConnectionSizeService,
  getConnectionTypeService,
  connGenericModifyDataSubmitService,
  getProvCheqRecApprDetailsService,
  provRecApprService,
  provRecRejectService,
  getMeterReadingUpdateListService,
  getMeterReadingGapCodeService,
  fineGenerationDataSubmitService,
  getMeterNumberUpdateConnectionDtlsService,
  meterNumberUpdateDataSubmitService,
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

async function getOwnershipAuthListController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getOwnershipAuthListService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0, applicationNo: payload.applicationNo },
      rows?.length > 0
        ? "Ownership authorization list retrieved"
        : "Application not found",
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 400, err.message, "Ownership authorization list error");
    return next(err);
  }
}

async function getOwnershipDocController(req, res, next) {
  try {
    const payload = req.query;
    const docs = await getOwnershipDocService(payload);

    logApiSuccess(
      req,
      200,
      {
        count: docs?.length || 0,
        applicationId: payload.applicationId,
        applicationNo: payload.applicationNo,
      },
      docs?.length > 0 ? "Ownership documents retrieved" : "No documents found",
    );

    return res.ok(docs);
  } catch (err) {
    logApiError(req, 400, err.message, "Ownership document fetch error");
    return next(err);
  }
}

async function fetchOwnershipDetailsController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await fetchOwnershipDetailsService(payload);

    logApiSuccess(
      req,
      200,
      {
        count: rows?.length || 0,
        applicationNo: payload.applicationNo,
        applicationId: payload.applicationId,
      },
      rows?.length > 0 ? "Ownership details retrieved" : "No records found",
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 400, err.message, "Ownership details error");
    return next(err);
  }
}

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
    logApiError(
      req,
      500,
      err.message,
      "Usage and Sub Usage Details fetch error",
    );
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

async function changeOwnershipDataSubmitController(req, res, next) {
  try {
    const payload = req.body;
    const out = await changeOwnershipSubmitService(payload);

    const isSuccess = Number(out.Out_errorCode) === 9999;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        { ulbId: payload.in_ULBID },
        out.Out_ErrorMsg || "Change Ownership Details saved successfully",
      );
    } else {
      logApiError(
        req,
        400,
        out.Out_ErrorMsg,
        "Change Ownership Details saved failed",
      );
    }

    auditLog({
      action: "CHANGEOWNERSHIP_INSERT",
      actor: req.user?.userId || payload.in_UserId || "system",
      module: "changeOwnership",
      entityId: null,
      status: isSuccess ? "SUCCESS" : "FAILED",
      details: {
        outErrorCode: out.Out_errorCode,
        outErrorMsg: out.Out_ErrorMsg,
        ulbId: payload.in_ULBID,
        connectionNumber: payload.in_connno,
        connectionId: payload.in_connid,
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

async function changeOwnershipDocumentController(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a JPG, JPEG, or PDF document.",
      });
    }

    const payload = {
      ...req.body,
      file: req.file,
    };

    const rows = await changeOwnershipDocumentService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      "Document Submitted Successfully",
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Document Submit error");
    return next(err);
  }
}

async function getOwnershipServiceDropdownController(req, res, next) {
  try {
    const rows = await getOwnershipServiceDropdownService();

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Ownership service dropdown retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Ownership service dropdown error");
    return next(err);
  }
}

async function getAcknowledgementDetailsController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getAcknowledgmentReportDetailsService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Acknowledgement Report Details retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(
      req,
      500,
      err.message,
      "Acknowledgement Report Details fetch error",
    );
    return next(err);
  }
}

async function getOwnershipChargesController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getOwnershipChargesService(payload);

    logApiSuccess(
      req,
      200,
      {
        count: rows?.length || 0,
        serviceId: payload.serviceId,
        connNo: payload.connectionNo,
      },
      rows?.length > 0
        ? `Ownership charges retrieved`
        : `No charges found for this connection + service`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 400, err.message, "Ownership charges error");
    return next(err);
  }
}

async function serviceApprovalAuthInsController(req, res, next) {
  try {
    const payload = req.body;
    const out = await serviceApprovalAuthInsService(payload);

    const isSuccess = Number(out.Out_errorCode) === 9999;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        {
          ulbId: payload.in_ULBID,
          rowCount: payload.in_str.split("#").length,
        },
        out.Out_ErrorMsg || "Ownership authorization processed",
      );
    } else {
      logApiError(req, 400, out.Out_ErrorMsg, "Ownership authorization failed");
    }

    auditLog({
      action: "OWNERSHIP_AUTH_PROCESS",
      actor: req.user?.userId || payload.in_UserId || "system",
      module: "ownershipauth",
      entityId: null,
      status: isSuccess ? "SUCCESS" : "FAILED",
      details: {
        outErrorCode: out.Out_errorCode,
        outErrorMsg: out.Out_ErrorMsg,
        ulbId: payload.in_ULBID,
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
    logApiError(req, 500, err.message, "Ownership auth insert error");
    return next(err);
  }
}

async function getConnAuthStatusController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getConnAuthStatusService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Conn Auth Status retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Conn Auth Status fetch error");
    return next(err);
  }
}

async function getGenericModifyListDtlsController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getGenericModifyListDtlsService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Generic Modify List Details retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(
      req,
      500,
      err.message,
      "Generic Modify List Details fetch error",
    );
    return next(err);
  }
}

async function getConnectionSizeController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getConnectionSizeService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Connection Size Details retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Connection Size Details fetch error");
    return next(err);
  }
}

async function getConnectionTypeController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getConnectionTypeService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Connection Type Details retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Connection Type Details fetch error");
    return next(err);
  }
}

async function connGenericModifyDataSubmitController(req, res, next) {
  try {
    const payload = req.body;
    const out = await connGenericModifyDataSubmitService(payload);

    const isSuccess = Number(out.Out_errorCode) === 9999;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        { ulbId: payload.in_ULBID },
        out.Out_ErrorMsg ||
        "Connection Generic Modify Details saved successfully",
      );
    } else {
      logApiError(
        req,
        400,
        out.Out_ErrorMsg,
        "Connection Generic Modify Details saved failed",
      );
    }

    auditLog({
      action: "CONN_GENERIC_MODIFY_INSERT",
      actor: req.user?.userId || payload.in_UserId || "system",
      module: "connGenericModify",
      entityId: null,
      status: isSuccess ? "SUCCESS" : "FAILED",
      details: {
        outErrorCode: out.Out_errorCode,
        outErrorMsg: out.Out_ErrorMsg,
        ulbId: payload.in_ULBID,
      },
      requestMeta: {
        ip: req.ip,
        method: req.method,
        path: req.originalUrl,
      },
    });

    return res.ok(out);
  } catch (err) {
    logApiError(req, 500, err.message, "Conn Generic Modify insert error");
    return next(err);
  }
}

async function getGenModAuthListController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getGenModAuthListService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0, ulbId: payload.ulbId },
      rows?.length > 0
        ? `Connection generic modify auth list retrieved`
        : `No pending generic modify auth records found`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 400, err.message, "Generic modify auth list error");
    return next(err);
  }
}

async function fetchGenAuthDetailsController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await fetchGenAuthDetailsService(payload);

    logApiSuccess(
      req,
      200,
      {
        count: rows?.length || 0,
        connId: payload.connId,
        connGenModId: payload.connGenModId,
      },
      rows?.length > 0
        ? `Generic modify auth details retrieved`
        : `No generic modify auth details found`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 400, err.message, "Generic modify auth details error");
    return next(err);
  }
}

async function connGenAuthInsController(req, res, next) {
  try {
    const payload = req.body;
    const out = await connGenAuthInsService(payload);

    const isSuccess = Number(out.Out_errorCode) === 9999;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        { ulbId: payload.in_ULBID },
        out.Out_ErrorMsg || "Generic modify authorization processed",
      );
    } else {
      logApiError(
        req,
        400,
        out.Out_ErrorMsg,
        "Generic modify authorization failed",
      );
    }

    auditLog({
      action: "CONNGENMOD_AUTH_PROCESS",
      actor: req.user?.userId || payload.in_UserId || "system",
      module: "conngenmodauth",
      entityId: null,
      status: isSuccess ? "SUCCESS" : "FAILED",
      details: {
        outErrorCode: out.Out_errorCode,
        outErrorMsg: out.Out_ErrorMsg,
        ulbId: payload.in_ULBID,
      },
      requestMeta: {
        ip: req.ip,
        method: req.method,
        path: req.originalUrl,
      },
    });

    return res.ok(out);
  } catch (err) {
    logApiError(req, 500, err.message, "Generic modify auth insert error");
    return next(err);
  }
}

async function getProvCheqRecApprDetailsController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getProvCheqRecApprDetailsService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0, receiptNo: payload.receiptNo },
      rows?.length > 0
        ? `Provisional cheque receipt approval details retrieved`
        : `No provisional cheque receipt found`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(
      req,
      400,
      err.message,
      "Provisional cheque receipt approval details error",
    );
    return next(err);
  }
}

async function provRecApprController(req, res, next) {
  try {
    const payload = req.body;
    const out = await provRecApprService(payload);

    const isSuccess = Number(out.Out_ErrorCode) === 9999;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        {
          ulbId: payload.In_ULBID,
          provRecNo: payload.in_ProvRecNo,
        },
        out.Out_ErrorMsg || "Provisional receipts approved",
      );
    } else {
      logApiError(
        req,
        400,
        out.Out_ErrorMsg,
        "Provisional receipt approval failed",
      );
    }

    auditLog({
      action: "PROVREC_APPROVE",
      actor: req.user?.userId || payload.In_UserId || "system",
      module: "provrecapproval",
      entityId: payload.in_ProvRecNo,
      status: isSuccess ? "SUCCESS" : "FAILED",
      details: {
        outErrorCode: out.Out_ErrorCode,
        outErrorMsg: out.Out_ErrorMsg,
        outReceiptNo: out.Out_ReceiptNo,
        ulbId: payload.In_ULBID,
      },
      requestMeta: {
        ip: req.ip,
        method: req.method,
        path: req.originalUrl,
      },
    });

    return res.ok(out);
  } catch (err) {
    logApiError(req, 500, err.message, "Provisional receipt approval error");
    return next(err);
  }
}

async function provRecRejectController(req, res, next) {
  try {
    const payload = req.body;
    const out = await provRecRejectService(payload);

    // Here reject procedure returning -100 for success or reject status code
    const isSuccess = Number(out.Out_ErrorCode) === -100;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        {
          ulbId: payload.In_ULBID,
          provRecNo: payload.In_ProvRecNo,
        },
        out.Out_ErrorMsg || "Provisional receipt rejected",
      );
    } else {
      logApiError(
        req,
        400,
        out.Out_ErrorMsg,
        "Provisional receipt rejection failed",
      );
    }

    auditLog({
      action: "PROVREC_REJECT",
      actor: req.user?.userId || payload.In_UserId || "system",
      module: "provrecrejection",
      entityId: payload.In_ProvRecNo,
      status: isSuccess ? "SUCCESS" : "FAILED",
      details: {
        outErrorCode: out.Out_ErrorCode,
        outErrorMsg: out.Out_ErrorMsg,
        ulbId: payload.In_ULBID,
        provRecNo: payload.In_ProvRecNo,
      },
      requestMeta: {
        ip: req.ip,
        method: req.method,
        path: req.originalUrl,
      },
    });

    return res.ok(out);
  } catch (err) {
    logApiError(req, 500, err.message, "Provisional receipt rejection error");
    return next(err);
  }
}

async function getMeterReadingUpdateListController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getMeterReadingUpdateListService(payload);

    logApiSuccess(
      req,
      200,
      {
        count: rows?.length || 0,
        connectionNo: payload.connectionNo,
        ulbId: payload.ulbId,
      },
      rows?.length > 0
        ? `Meter reading update list retrieved`
        : `No meter reading found for this connection`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 400, err.message, "Meter reading update list error");
    return next(err);
  }
}

async function getMeterReadingGapCodeController(req, res, next) {
  try {
    const rows = await getMeterReadingGapCodeService();

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Meter reading gap code dropdown retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Meter reading gap code dropdown error");
    return next(err);
  }
}

// Fine Generation

async function fineGenerationDataSubmitController(req, res, next) {
  try {
    const payload = req.body;
    const out = await fineGenerationDataSubmitService(payload);

    const isSuccess = Number(out.Out_errorCode) === 9999;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        { ulbId: payload.in_ulbid },
        out.Out_ErrorMsg ||
        "Fine Generated Successfully",
      );
    } else {
      logApiError(
        req,
        400,
        out.Out_ErrorMsg,
        "Fine Generation failed",
      );
    }

    auditLog({
      action: "FINE_GENERATION_INSERT",
      actor: req.user?.userId || payload.in_UserId || "system",
      module: "fineGenerationIns",
      entityId: null,
      status: isSuccess ? "SUCCESS" : "FAILED",
      details: {
        outErrorCode: out.Out_errorCode,
        outErrorMsg: out.Out_ErrorMsg,
        ulbId: payload.in_ulbid,
      },
      requestMeta: {
        ip: req.ip,
        method: req.method,
        path: req.originalUrl,
      },
    });

    return res.ok(out);
  } catch (err) {
    logApiError(req, 500, err.message, "Fine Generation error");
    return next(err);
  }
}

// Meter No Update

async function getMeterNumberUpdateConnectionDtlsController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getMeterNumberUpdateConnectionDtlsService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Meter Number Connection Details retrieved`,
    );

    return res.ok(rows);
  } catch (err) {
    logApiError(req, 500, err.message, "Meter Number Connection Details fetch error");
    return next(err);
  }
}

async function meterNumberUpdateDataSubmitController(req, res, next) {
  try {
    const payload = req.body;
    const out = await meterNumberUpdateDataSubmitService(payload);

    const isSuccess = Number(out.out_errcode) === 9999;

    if (isSuccess) {
      logApiSuccess(
        req,
        200,
        { ulbId: payload.in_ulbid },
        out.out_errmsg ||
        "Meter Number Updated Successfully",
      );
    } else {
      logApiError(
        req,
        400,
        out.out_errmsg,
        "Meter Number Updation failed",
      );
    }

    auditLog({
      action: "METER_NUMBER_UPDATE",
      actor: req.user?.userId || payload.in_userid || "system",
      module: "meterNumberUpdate",
      entityId: null,
      status: isSuccess ? "SUCCESS" : "FAILED",
      details: {
        outErrorCode: out.out_errcode,
        outErrorMsg: out.out_errmsg,
        ulbId: payload.in_ulbid,
      },
      requestMeta: {
        ip: req.ip,
        method: req.method,
        path: req.originalUrl,
      },
    });

    return res.ok(out);
  } catch (err) {
    logApiError(req, 500, err.message, "Meter Number Update error");
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
  getOwnershipAuthListController,
  getOwnershipDocController,
  fetchOwnershipDetailsController,
  getServiceDropdownController,
  getChangeOwnerConnectionDtlsController,
  getUsageSubUsageConnectionDtlsController,
  getChargesTableDtlsController,
  changeOwnershipDataSubmitController,
  changeOwnershipDocumentController,
  getOwnershipServiceDropdownController,
  getOwnershipChargesController,
  serviceApprovalAuthInsController,
  getAcknowledgementDetailsController,
  getGenModAuthListController,
  fetchGenAuthDetailsController,
  connGenAuthInsController,
  getConnAuthStatusController,
  getGenericModifyListDtlsController,
  getConnectionSizeController,
  getConnectionTypeController,
  connGenericModifyDataSubmitController,
  getProvCheqRecApprDetailsController,
  provRecApprController,
  provRecRejectController,
  getMeterReadingUpdateListController,
  getMeterReadingGapCodeController,
  fineGenerationDataSubmitController,
  getMeterNumberUpdateConnectionDtlsController,
  meterNumberUpdateDataSubmitController
};
