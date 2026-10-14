const { getMenuListService } = require("./master.service");
const { logApiSuccess, logApiError } = require("../../utils/log");

async function getMenuListController(req, res, next) {
  try {
    const payload = req.query;
    const rows = await getMenuListService(payload);

    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      `Menu list retrieved`,
    );

    return res.ok(rows);
  } catch (error) {
    logApiError(req, 500, error.message, "Menu list error");
    return next(error);
  }
}

module.exports = { getMenuListController };
