const express = require("express");
const { getMenuListController } = require("./master.controller");

const router = express.Router();

router.get("/getMenuList", getMenuListController);

module.exports = router;
