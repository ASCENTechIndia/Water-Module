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

async function getReceiptDeleteReasonDropdownService(payload) {
  return getReceiptDeleteReasonDropdownRepo(payload);
}

async function getReceiptDeletePaymentDropdownService(payload) {
  return getReceiptDeletePaymentDropdownRepo(payload);
}

async function getReceiptDeleteBankDropdownService(payload) {
  return getReceiptDeleteBankDropdownRepo(payload);
}

async function getReceiptDeleteMstDetailsService(payload) {
  return getReceiptDeleteMstDetailsRepo(payload);
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
};
