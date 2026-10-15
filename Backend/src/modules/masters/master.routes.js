const express = require("express");
const {
  getMenuListController,
  getUlbDropdownController,
  getUserListController,
  getWardListController,
  wardInsController,
  getZoneListController,
  getZoneDetailsController,
  zoneInsController,
  getWardDropdownByUlbController,
} = require("./master.controller");
const validate = require("../../middleware/validate.middleware");
const { wardInsSchema, zoneInsSchema } = require("./master.validation");

const router = express.Router();

router.get("/getMenuList", getMenuListController);
router.get("/getUserList", getUserListController);

// Ward Master
router.get("/getUlbDropdownController", getUlbDropdownController);
router.get("/getWardList", getWardListController);
router.post("/aowt_ward_ins", validate(wardInsSchema), wardInsController);

// Zone master
router.get("/getZoneList", getZoneListController);
router.get("/getZoneDetails", getZoneDetailsController);
router.get("/getWardName", getWardDropdownByUlbController);
router.post("/aowt_zone_ins", validate(zoneInsSchema), zoneInsController);
module.exports = router;
