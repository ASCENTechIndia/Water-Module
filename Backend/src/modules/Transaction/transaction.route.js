const express = require("express");
const validate = require("../../middleware/validate.middleware");
const {
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
  getReceiptDeleteListDetailsController,
  getReceiptDeleteMstDetailsController,
  getReceiptDeleteBlockDropdownController,
  getReceiptDeleteReasonDropdownController,
  getReceiptDeletePaymentDropdownController,
  getReceiptDeleteBankDropdownController,
  receiptDeleteMstDataSubmitController,
  getPayTypeDropdownController,
  getRecDelReasonDropdownController,
  getRecDelBankDropdownController,
  fetchDelRecAuthDetailsController,
  getCheckPaymodeController,
  recDelAuthInsController,
  getConnZoneBlockController,
  getBillDeleteDetailsController,
  getVasuliChallanTableDataController,
  generateChallanNumberController,
  billDeleteInsController,
} = require("./transaction.controller");
const {
  meterReadingInsSchema,
  billGenInsSchema,
  chequeBounceInsSchema,
  receiptDeleteMstInsSchema,
  recDelAuthInsSchema,
  billDeleteDetailsSchema,
  billDeleteInsSchema,
  vasulichallanGenerationSchema,
} = require("./transaction.validation");

const router = express.Router();

// Meter reading entry
router.get("/getWardDropdown", getWardDropdownController);
router.get("/getZoneDropdown", getZoneDropdownController);
router.get("/getBlockDropdown", getBlockDropdownController);
router.get("/getGapCodeDropdown", getGapCodeDropdownController);
router.post("/searchMeterConnections", searchMeterConnectionsController);
router.post(
  "/aowt_mtrreading_ins",
  validate(meterReadingInsSchema),
  meterReadingInsController,
);

// Bill generation
router.get("/getZoneDropdownWithUlbId", getZoneDropdownWithUlbIdController);
router.post(
  "/aowt_billgen_ins",
  validate(billGenInsSchema),
  billGenInsController,
);

//Cheque bounce
router.get("/getBankDropdown", getBankDropdownController);
router.get("/getReasonDropdown", getReasonDropdownController);
router.post("/searchChequeBounce", chequeBounceSearchController);
router.post(
  "/aowt_chequebounce_ins",
  validate(chequeBounceInsSchema),
  chequeBounceInsController,
);

// Receipt Delete List
router.get("/getYearDropdown", getYearDropdownController);
router.get("/getWardMenu", getReceiptDeleteWardDropdownController);
router.get("/getZoneMenu", getReceiptDeleteZoneDropdownController);
router.get("/getReceiptDeleteList", getReceiptDeleteListDetailsController);
// Receipt Delete Mst
router.get("/getBlockMenu", getReceiptDeleteBlockDropdownController);
router.get("/getReasonMenu", getReceiptDeleteReasonDropdownController);
router.get("/getPaymentMenu", getReceiptDeletePaymentDropdownController);
router.get("/getBankMenu", getReceiptDeleteBankDropdownController);
router.get("/getReceiptDeleteMstDetails", getReceiptDeleteMstDetailsController);
router.get("/getCheckPaymode", getCheckPaymodeController);
router.post(
  "/receipt-delete-mst",
  validate(receiptDeleteMstInsSchema),
  receiptDeleteMstDataSubmitController,
);

//Receipt delete authorization list
router.get("/getReceiptDeleteAuthList", getReceiptDeleteAuthListController);
router.get("/getPayTypeDropdown", getPayTypeDropdownController);
router.get(
  "/getReceiptDeleteReasonDropdown",
  getRecDelReasonDropdownController,
);
router.get("/getReceiptDeleteBankDropdown", getRecDelBankDropdownController);
router.get("/fetchDelRecAuthDetails", fetchDelRecAuthDetailsController);
router.post(
  "/aowt_rec_delauth",
  validate(recDelAuthInsSchema),
  recDelAuthInsController,
);

// Bill delete
router.get("/getConnZoneBlock", getConnZoneBlockController);
router.post(
  "/getBillDeleteDetails",
  validate(billDeleteDetailsSchema),
  getBillDeleteDetailsController,
);
router.post(
  "/aowt_billdel_ins",
  validate(billDeleteInsSchema),
  billDeleteInsController,
);

// Vasuli challan
router.get("/getVasuliChallanTableData", getVasuliChallanTableDataController);
router.post("/generate-challan-number", validate(vasulichallanGenerationSchema), generateChallanNumberController);
module.exports = router;
