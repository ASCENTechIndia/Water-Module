const express = require("express");
const multer = require("multer");
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
  meterNumberUpdateDataSubmitController,
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
  serviceApprovalAuthInsSchema,
  connGenAuthInsSchema,
  connGenericModifySchema,
  provRecApprSchema,
  provRecRejectSchema,
  fineGenerationSchema,
  meterNumberUpdateSchema,
} = require("./transaction.validation");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "application/pdf"];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, JPEG, and PDF files are allowed."));
    }
  },
});

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
router.post(
  "/generate-challan-number",
  validate(vasulichallanGenerationSchema),
  generateChallanNumberController,
);

// Change ownership auth
router.get("/getOwnershipAuthList", getOwnershipAuthListController);
router.get("/getOwnershipDoc", getOwnershipDocController);
router.get("/fetchOwnershipDetails", fetchOwnershipDetailsController);
router.get(
  "/getOwnershipServiceDropdown",
  getOwnershipServiceDropdownController,
);
router.get("/getOwnershipCharges", getOwnershipChargesController);
router.post(
  "/aowt_serviceapprovalauth_ins",
  validate(serviceApprovalAuthInsSchema),
  serviceApprovalAuthInsController,
);

// Change Ownership
router.get("/getServiceMenu", getServiceDropdownController);
router.get("/getChangeOwnerDetails", getChangeOwnerConnectionDtlsController);
router.get("/getUsageSubUsage", getUsageSubUsageConnectionDtlsController);
router.get("/getChargesTableData", getChargesTableDtlsController);
router.get("/getAcknowledgementDetails", getAcknowledgementDetailsController);
router.post("/change-ownership", changeOwnershipDataSubmitController);
router.post(
  "/update-ownership-document",
  upload.single("file"),
  changeOwnershipDocumentController,
);

// Conn Generic Modify
router.get("/getConnAuthStatus", getConnAuthStatusController);
router.get("/getGenericModifyListDtls", getGenericModifyListDtlsController);
router.get("/getConnectionSize", getConnectionSizeController);
router.get("/getConnectionType", getConnectionTypeController);
router.post(
  "/conn-generic-modify",
  validate(connGenericModifySchema),
  connGenericModifyDataSubmitController,
);

// Connection generic modify auth
router.get("/getGenModAuthList", getGenModAuthListController);
router.get("/fetchGenAuthDetails", fetchGenAuthDetailsController);
router.post(
  "/aowt_Connectiongenericauth_ins",
  validate(connGenAuthInsSchema),
  connGenAuthInsController,
);

// Provisinal cheque receipt approval
router.get("/getProvCheqRecApprDetails", getProvCheqRecApprDetailsController);
router.post(
  "/aowt_provrecapprMultiple_ins",
  validate(provRecApprSchema),
  provRecApprController,
);
router.post(
  "/aowt_provrecreject_ins",
  validate(provRecRejectSchema),
  provRecRejectController,
);

// Meter reading update
router.get("/getMeterReadingUpdateList", getMeterReadingUpdateListController);
router.get("/getMeterReadingGapCode", getMeterReadingGapCodeController);

// Fine Generation
router.post("/fine-generation", validate(fineGenerationSchema), fineGenerationDataSubmitController);

// Meter No Update
router.get("/getMeterUpdateConnDetails", getMeterNumberUpdateConnectionDtlsController);
router.post("/meter-number-update", validate(meterNumberUpdateSchema), meterNumberUpdateDataSubmitController);

module.exports = router;
