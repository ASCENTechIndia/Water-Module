const express = require("express");
const validate = require("../../middleware/validate.middleware");
const { lastLoginSchema } = require("./Admin.validation");
const {
  lastLoginHandler,
  fetchCorporationDetailsController,
} = require("./Admin.controller");

const router = express.Router();

router.get(
  "/getLastLogin",
  validate(lastLoginSchema, { source: "query" }),
  lastLoginHandler,
);

router.post("/textLogo", fetchCorporationDetailsController);

module.exports = router;
