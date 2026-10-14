const { getMenuList } = require("./master.repo");

async function getMenuListService(payload) {
  return getMenuList(payload);
}

module.exports = { getMenuListService };
