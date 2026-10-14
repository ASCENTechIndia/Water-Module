const { executeQuery } = require("../../db/queryExecutor");
const { executeProcedure } = require('../../db/procedureExecutor');
const oracledb = require("oracledb");

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

async function getUlbDropdown() {
  const sql = `
    select CORPORATIONNAME,
           CORPORATIONID
      from prop.vw_corporation
     order by CORPORATIONNAME
  `;

  const result = await executeQuery(sql);
  return result.rows || [];
}

async function getUserList(payload) {
  const { ulbid, deptid } = payload;

  if (!ulbid || !deptid) {
    throw new Error("ulbid and deptid are required");
  }

  const sql = `
    select ulbid,
           USERNAME,
           USERID,
           DEPTNAME,
           DESIGNAME,
           MOBNO,
           OTPENABLED
      from prop.VW_USERDEF
     where ulbid = :ulbid
       and deptid = :deptid
  `;

  const binds = {
    ulbid: Number(ulbid),
    deptid: Number(deptid),
  };

  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function getWardList(payload) {
  const { ulbid } = payload;

  if (!ulbid) {
    throw new Error("ulbid is required");
  }

  const sql = `
    select num_ward_id,
           var_ward_name,
           num_ward_ulbid,
           var_corporation_name,
           var_ward_code,
           case var_ward_activeflag
             when 'Y' then 'Yes'
             else 'No'
           end as activeflag
      from aowt_ward_mas
      inner join admins.aoma_corporation_mas
        on num_corporation_id = num_ward_ulbid
     where num_ward_ulbid = :ulbid
     order by num_ward_id
  `;

  const binds = {
    ulbid: Number(ulbid),
  };

  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function aowt_ward_ins(payload) {
  const statement = `
    BEGIN
      aowt_ward_ins(
        :in_userid,
        :in_wardid,
        :in_wardname,
        :in_ulbid,
        :in_wardcode,
        :in_wardactiveflag,
        :in_ipaddress,
        :in_source,
        :in_mode,
        :out_errorcode,
        :out_errormsg
      );
    END;
  `;

  const binds = {
    in_userid: payload.in_userid,
    in_wardid: payload.in_wardid !== null ? Number(payload.in_wardid) : null,
    in_wardname: payload.in_wardname,
    in_ulbid: Number(payload.in_ulbid),
    in_wardcode: payload.in_wardcode,
    in_wardactiveflag: payload.in_wardactiveflag,
    in_ipaddress: payload.in_ipaddress,
    in_source: payload.in_source,
    in_mode: Number(payload.in_mode),
    out_errorcode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    out_errormsg: {
      dir: oracledb.BIND_OUT,
      type: oracledb.STRING,
      maxSize: 1000,
    },
  };

  const result = await executeProcedure({ statement, binds, useTx: false });
  return result.outBinds;
}

module.exports = {
  getMenuList,
  getUlbDropdown,
  getUserList,
  getWardList,
  aowt_ward_ins,
};
