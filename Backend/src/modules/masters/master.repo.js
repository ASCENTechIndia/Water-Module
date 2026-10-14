const { executeQuery } = require("../../db/queryExecutor");

async function getMenuList(payload) {
  const { deptId } = payload;
  if (!deptId) {
    return {
      success: false,
      message: "Dept Id is required",
    };
  }
  let sql = `
    select distinct menuid,
           menutilte,
           parent,
           pagetype,
           pagepath
      from prop.vw_menulist
     where deptid = :deptId
  `;

  const binds = {
    deptId: Number(deptId),
  };

  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

module.exports = { getMenuList };
