const express = require("express");
const {
  getMenuListController,
  getUlbDropdownController,
  getUserListController,
  getWardListController,
  wardInsController,
} = require("./master.controller");
const validate = require("../../middleware/validate.middleware");
const { wardInsSchema } = require("./master.validation");

const router = express.Router();

router.get("/getMenuList", getMenuListController);
router.get("/getUlbDropdownController", getUlbDropdownController);
router.get("/getUserList", getUserListController);
router.get("/getWardList", getWardListController);
router.post("/aowt_ward_ins", validate(wardInsSchema), wardInsController);

module.exports = router;
