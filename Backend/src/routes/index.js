const express = require("express");
const authRoutes = require("../modules/auth/auth.routes");
const adminRoutes = require("../modules/Admin/Admin.routes");
const masterRoutes = require("../modules/masters/master.routes")
const router = express.Router();

router.get("/health", (req, res) => {
  return res.ok(null, "ok");
});

router.get("/ready", (req, res) => {
  return res.ok(null, "ready");
});

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use('/master', masterRoutes);

module.exports = router;
