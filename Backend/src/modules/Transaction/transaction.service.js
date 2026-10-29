const {
  getWardDropdown,
  getZoneDropdown,
  getBlockDropdown,
  queryConnectionsByArea,
  resolveConnNoToId,
  queryConnectionsByRange,
  getActiveBillingCycleForUlb,
  getGapCodeDropdown,
  aowt_mtrreading_ins,
  getZoneDropdownWithUlbId,
  aowt_billgen_ins,
  getBankDropdown,
  getReasonDropdown,
  aowt_chequebounce_ins,
  getChequeBounceDetails,
  getReceiptDeleteAuthList,
  getYearDropdownRepo,
  getReceiptDeleteWardDropdownRepo,
  getReceiptDeleteZoneDropdownRepo,
  getReceiptDeleteListDetailsRepo,
  getReceiptDeleteMstDetailsRepo,
  getReceiptDeleteReasonDropdownRepo,
  getReceiptDeletePaymentDropdownRepo,
  getReceiptDeleteBankDropdownRepo,
  getReceiptDeleteBlockDropdownRepo,
  receiptDeleteMstSubmitRepo,
  getPayTypeDropdown,
  getReceiptDeleteReasonDropdown,
  getReceiptDeleteBankDropdown,
  fetchDelRecAuthDetails,
  getCheckPaymodeRepo,
  aowt_rec_delauth,
  getConnZoneBlock,
  getBillDeleteDetails,
  getVasuliChallanTableDataRepo,
  generateChallanNumberRepo,
  billDeleteInsRepo,
  getOwnershipAuthList,
  getOwnershipDoc,
  fetchOwnershipDetailsRepo,
  getServiceDropdownRepo,
  getChangeOwnerConnectionDtlsRepo,
  getUsageSubUsageConnectionDtlsRepo,
  getChargesTableDataRepo,
  changeOwnershipDataSubmitRepo,
  changeOwnershipDocumentSubmitRepo,
  getOwnershipServiceDropdown,
  getOwnershipCharges,
  aowt_serviceapprovalauth_ins,
  getAcknowledgementDetailsRepo,
  getGenModAuthList,
  fetchGenAuthDetails,
  aowt_connectiongenericauth_ins,
} = require("./transaction.repo");

async function getWardDropdownService(payload) {
  return getWardDropdown(payload);
}

async function getZoneDropdownService(payload) {
  return getZoneDropdown(payload);
}

async function getBlockDropdownService(payload) {
  return getBlockDropdown(payload);
}

async function searchMeterConnectionsService(payload) {
  const { mode, ulbId, wardId, zoneId, blockId, fromConnNo, toConnNo } =
    payload;

  if (!ulbId) {
    throw new Error("ulbId is required");
  }

  let connections = [];

  if (mode === "area") {
    if (!wardId || !zoneId || !blockId) {
      throw new Error("Ward, Zone and Block are required");
    }
    connections = await queryConnectionsByArea(ulbId, wardId, zoneId, blockId);
  } else if (mode === "range") {
    if (!fromConnNo) {
      throw new Error("From Connection No is required");
    }

    const fromConId = await resolveConnNoToId(ulbId, fromConnNo);
    if (!fromConId) {
      throw new Error("Invalid From Connection No");
    }

    let toConId = null;
    if (toConnNo) {
      toConId = await resolveConnNoToId(ulbId, toConnNo);
      if (!toConId) {
        throw new Error("Invalid To Connection No");
      }
    }

    connections = await queryConnectionsByRange(ulbId, fromConId, toConId);
  } else {
    throw new Error("Invalid search mode");
  }

  let billingCycle = null;
  if (connections.length > 0) {
    billingCycle = await getActiveBillingCycleForUlb(ulbId);
  }

  return { connections, billingCycle };
}

async function getGapCodeDropdownService(payload) {
  return getGapCodeDropdown(payload);
}

async function meterReadingInsService(payload) {
  return aowt_mtrreading_ins(payload);
}

async function getZoneDropdownWithUlbIdService(payload) {
  return getZoneDropdownWithUlbId(payload);
}

async function billGenInsService(payload) {
  return aowt_billgen_ins(payload);
}

async function getBankDropdownService(payload) {
  return getBankDropdown(payload);
}

async function getReasonDropdownService() {
  return getReasonDropdown();
}

async function chequeBounceSearchService(payload) {
  return getChequeBounceDetails(payload);
}

async function chequeBounceInsService(payload) {
  return aowt_chequebounce_ins(payload);
}

async function getReceiptDeleteAuthListService(payload) {
  return getReceiptDeleteAuthList(payload);
}

async function getYearDropdownService() {
  return getYearDropdownRepo();
}

async function getReceiptDeleteWardDropdownService(payload) {
  return getReceiptDeleteWardDropdownRepo(payload);
}

async function getReceiptDeleteZoneDropdownService(payload) {
  return getReceiptDeleteZoneDropdownRepo(payload);
}

async function getReceiptDeleteBlockDropdownService(payload) {
  return getReceiptDeleteBlockDropdownRepo(payload);
}

async function getReceiptDeleteListDetailsService(payload) {
  return getReceiptDeleteListDetailsRepo(payload);
}

// Receipt Delete Master

async function getReceiptDeleteReasonDropdownService() {
  return getReceiptDeleteReasonDropdownRepo();
}

async function getReceiptDeletePaymentDropdownService(payload) {
  return getReceiptDeletePaymentDropdownRepo(payload);
}

async function getReceiptDeleteBankDropdownService() {
  return getReceiptDeleteBankDropdownRepo();
}

async function getReceiptDeleteMstDetailsService(payload) {
  return getReceiptDeleteMstDetailsRepo(payload);
}

async function getCheckPaymodeService(payload) {
  return getCheckPaymodeRepo(payload);
}

async function receiptDeleteMstSubmitService(payload) {
  return receiptDeleteMstSubmitRepo(payload);
}

async function getPayTypeDropdownService(payload) {
  return getPayTypeDropdown(payload);
}

async function getRecDelReasonDropdownService() {
  return getReceiptDeleteReasonDropdown();
}

async function getRecDeleteBankDropdownService(payload) {
  return getReceiptDeleteBankDropdown(payload);
}

async function fetchDelRecAuthDetailsService(payload) {
  return fetchDelRecAuthDetails(payload);
}

async function recDelAuthInsService(payload) {
  return aowt_rec_delauth(payload);
}

async function getConnZoneBlockService(payload) {
  return getConnZoneBlock(payload);
}

async function getBillDeleteDetailsService(payload) {
  return getBillDeleteDetails(payload);
}

async function getVasuliChallanTableDataService() {
  return getVasuliChallanTableDataRepo();
}

async function generateChallanNumberService(payload) {
  return generateChallanNumberRepo(payload);
}

async function billDeleteInsService(payload) {
  return billDeleteInsRepo(payload);
}

async function getOwnershipAuthListService(payload) {
  return getOwnershipAuthList(payload);
}

async function getOwnershipDocService(payload) {
  return getOwnershipDoc(payload);
}

async function fetchOwnershipDetailsService(payload) {
  return fetchOwnershipDetailsRepo(payload);
}

async function getServiceDropdownService(payload) {
  return getServiceDropdownRepo(payload);
}

async function getChangeOwnerConnectionDtlsService(payload) {
  return getChangeOwnerConnectionDtlsRepo(payload);
}

async function getUsageSubUsageConnectionDtlsService(payload) {
  return getUsageSubUsageConnectionDtlsRepo(payload);
}

async function getChargesTableDataService(payload) {
  return getChargesTableDataRepo(payload);
}

async function changeOwnershipSubmitService(payload) {
  return changeOwnershipDataSubmitRepo(payload);
}

async function changeOwnershipDocumentService(payload) {
  const { outDocStr, file } = payload;

  if (!outDocStr || !file?.buffer) {
    throw new Error("Document string or uploaded file is missing.");
  }

  const docRows = outDocStr
    .split("$")
    .map((row) => row.trim())
    .filter(Boolean);

  const results = [];

  for (const row of docRows) {
    const docValues = row.split("#");

    if (docValues.length !== 3) {
      throw new Error(`Invalid document row: ${row}`);
    }

    const [applicationId, documentRecordId, documentId] = docValues;

    const result = await changeOwnershipDocumentSubmitRepo({
      applicationId,
      documentRecordId,
      documentId,
      document: file.buffer,
    });

    results.push(result);
  }

  return results;
}

async function getOwnershipServiceDropdownService() {
  return getOwnershipServiceDropdown();
}

async function getOwnershipChargesService(payload) {
  return getOwnershipCharges(payload);
}

async function serviceApprovalAuthInsService(payload) {
  return aowt_serviceapprovalauth_ins(payload);
}

async function getAcknowledgmentReportDetailsService(payload) {
  return getAcknowledgementDetailsRepo(payload);
}

async function getGenModAuthListService(payload) {
  return getGenModAuthList(payload);
}

async function fetchGenAuthDetailsService(payload) {
  return fetchGenAuthDetails(payload);
}

async function connGenAuthInsService(payload) {
  return aowt_connectiongenericauth_ins(payload);
}

module.exports = {
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
  getReceiptDeleteBlockDropdownService,
  getReceiptDeleteListDetailsService,
  getReceiptDeleteReasonDropdownService,
  getReceiptDeletePaymentDropdownService,
  getReceiptDeleteBankDropdownService,
  getReceiptDeleteMstDetailsService,
  receiptDeleteMstSubmitService,
  getPayTypeDropdownService,
  getRecDelReasonDropdownService,
  getRecDeleteBankDropdownService,
  fetchDelRecAuthDetailsService,
  getCheckPaymodeService,
  receiptDeleteMstSubmitService,
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
};
