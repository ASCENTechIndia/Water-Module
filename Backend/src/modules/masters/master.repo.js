const { executeQuery } = require("../../db/queryExecutor");
const { executeProcedure } = require("../../db/procedureExecutor");
const oracledb = require("oracledb");

async function getMenuList(payload) {
  const { deptId } = payload;
  if (!deptId) {
    throw new Error("Dept Id is required");
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

async function getZoneList(payload) {
  const { ulbId } = payload;

  if (!ulbId) {
    throw new Error("ULBId is required");
  }

  const sql = `
    select num_zone_id,
           var_zone_name,
           num_zone_wardid,
           var_ward_name,
           var_zone_code,
           case var_zone_activeflag
             when 'Y' then 'Yes'
             else 'No'
           end as activeflag
      from aowt_zone_mas
      inner join aowt_ward_mas
        on num_ward_id = num_zone_wardid
     where num_ward_ulbid = :ulbId
     order by num_zone_id desc
  `;

  const binds = {
    ulbId: Number(ulbId),
  };

  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function getZoneDetails(payload) {
  const { zoneId, wardId } = payload;

  if (!zoneId || !wardId) {
    throw new Error("zoneId and wardId are required");
  }

  const sql = `
    select num_zone_id,
           num_ward_ulbid,
           var_zone_name,
           num_zone_wardid,
           var_ward_name,
           var_zone_code,
           var_zone_activeflag
      from aowt_zone_mas
      inner join aowt_ward_mas
        on num_ward_id = num_zone_wardid
     where num_zone_id = :zoneId
       and num_zone_wardid = :wardId
  `;

  const binds = {
    zoneId: Number(zoneId),
    wardId: Number(wardId),
  };

  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function getWardDropdownByUlb(payload) {
  const { ulbid } = payload;

  if (!ulbid) {
    throw new Error("ulbid is required");
  }

  const sql = `
    select var_ward_name,
           num_ward_id
      from aowt_ward_mas
     where var_ward_activeflag = 'Y'
       and num_ward_ulbid = :ulbid
     order by var_ward_name
  `;

  const binds = {
    ulbid: Number(ulbid),
  };

  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function aowt_zone_ins(payload) {
  const statement = `
    BEGIN
      aowt_zone_ins(
        :in_userid,
        :in_zoneid,
        :in_zonename,
        :in_wardid,
        :in_zonecode,
        :in_activeflag,
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
    in_zoneid: payload.in_zoneid !== null ? Number(payload.in_zoneid) : null,
    in_zonename: payload.in_zonename,
    in_wardid: payload.in_wardid != null ? Number(payload.in_wardid) : null,
    in_zonecode: payload.in_zonecode,
    in_activeflag: payload.in_activeflag,
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

async function getBlockList(payload) {
  const { ulbId } = payload;

  if (!ulbId) {
    throw new Error("ulbId is required");
  }

  const sql = `
    select num_block_id,
           var_block_name,
           num_block_zoneid,
           var_zone_name,
           num_zone_wardid,
           var_ward_name,
           var_block_code,
           case var_block_activeflag
             when 'Y' then 'Yes'
             else 'No'
           end as activeflag
      from aowt_block_mas
      inner join aowt_zone_mas
        on num_zone_id = num_block_zoneid
      inner join aowt_ward_mas
        on num_ward_id = num_zone_wardid
     where num_ward_ulbid = :ulbId
     order by num_block_id desc
  `;

  const binds = {
    ulbId: Number(ulbId),
  };

  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function getZoneDropdownByWard(payload) {
  const { wardId } = payload;

  if (!wardId) {
    throw new Error("wardId is required");
  }

  const sql = `
    select var_zone_name,
           num_zone_id
      from aowt_zone_mas
     where var_zone_activeflag = 'Y'
       and num_zone_wardid = :wardId
     order by var_zone_name
  `;

  const binds = {
    wardId: Number(wardId),
  };

  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function aowt_block_ins(payload) {
  const statement = `
    BEGIN
      aowt_block_ins(
        :in_userid,
        :in_blockid,
        :in_blockname,
        :in_zoneid,
        :in_blockcode,
        :in_activeflag,
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
    in_blockid: payload.in_blockid != null ? Number(payload.in_blockid) : null,
    in_blockname: payload.in_blockname,
    in_zoneid: Number(payload.in_zoneid),
    in_blockcode: payload.in_blockcode,
    in_activeflag: payload.in_activeflag,
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

async function getBankList() {
  const sql = `
    select num_bank_id,
           var_bank_name
      from aowt_bank_mas
     order by var_bank_name
  `;

  const result = await executeQuery(sql);
  return result.rows || [];
}

async function aowt_bank_ins(payload) {
  const statement = `
    BEGIN
      aowt_bank_ins(
        :in_UserId,
        :in_bankid,
        :in_bankname,
        :in_Orgid,
        :in_ipaddress,
        :in_source,
        :in_Mode,
        :Out_errorCode,
        :Out_ErrorMsg
      );
    END;
  `;

  const binds = {
    in_UserId: payload.in_UserId,
    in_bankid: payload.in_bankid != null ? Number(payload.in_bankid) : null,
    in_bankname: payload.in_bankname,
    in_Orgid: Number(payload.in_Orgid),
    in_ipaddress: payload.in_ipaddress,
    in_source: payload.in_source,
    in_Mode: Number(payload.in_Mode),

    Out_errorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    Out_ErrorMsg: {
      dir: oracledb.BIND_OUT,
      type: oracledb.STRING,
      maxSize: 1000,
    },
  };

  const result = await executeProcedure({ statement, binds, useTx: false });
  return result.outBinds;
}

async function getRateList(payload) {
  const { ulbId } = payload;

  if (!ulbId) {
    throw new Error("ulbId is required");
  }

  const sql = `
    select num_rate_rateid rateid,
           var_usagetype_name usagetype,
           var_usagesubtype_name usagesubtype,
           var_conntype_name conntype,
           var_connsize_name connsize,
           case var_rate_valuetype
             when 'F' then 'Fixed'
             when 'S' then 'Slab'
           end valuetype,
           dat_rate_frmdt fromdate,
           dat_rate_todt todate,
           num_rate_frmvalue fromvalue,
           num_rate_tovalue tovalue,
           num_rate_rateamt rate,
           num_rate_minamt minamt,
           var_tax_ename tax
      from aowt_rate_mas
      inner join aowt_rate_det
        on num_rate_ratemstid = num_rate_rateid
      inner join aowt_usagetype_mas
        on num_usagetype_id = num_rate_usageid
      inner join aowt_usagesubtype_mas
        on num_usagesubtype_id = num_rate_usagesubid
       and num_usagesubtype_usagetypeid = num_rate_usageid
      inner join aowt_conntype_mas
        on num_conntype_id = num_rate_conntypeid
      inner join aowt_connsize_mas
        on num_connsize_id = num_rate_connsizeid
      inner join aowt_tax_mas
        on num_tax_id = num_rate_taxid
     where num_rate_ulbid = :ulbId
     order by num_rate_rateid desc
  `;

  const binds = {
    ulbId: Number(ulbId),
  };

  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function getUsageTypeDropdown(payload) {
  const { ulbId } = payload;

  if (!ulbId) {
    throw new Error("ulbId is required");
  }

  const sql = `
    select usagetypename,
           usagetypeid
      from vw_usagetypemas
     where ulbid = :ulbId
  `;

  const binds = {
    ulbId: Number(ulbId),
  };

  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function getUsageSubTypeDropdown(payload) {
  const { ulbId, usageTypeId } = payload;

  if (!ulbId || !usageTypeId) {
    throw new Error("ulbId and usageTypeId are required");
  }

  const sql = `
    select usagesubtypename,
           usagesubtypeid
      from vw_usagesubtypemas
     where ulbid = :ulbId
       and usagetypeid = :usageTypeId
  `;

  const binds = {
    ulbId: Number(ulbId),
    usageTypeId: Number(usageTypeId),
  };

  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function getConnTypeDropdown(payload) {
  const { ulbId } = payload;

  if (!ulbId) {
    throw new Error("ulbId is required");
  }

  const sql = `
    select conntype,
           conntypeid
      from vw_conntypeconfig
     where ulbid = :ulbId
  `;

  const binds = {
    ulbId: Number(ulbId),
  };

  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function getConnSizeDropdown(payload) {
  const { ulbId } = payload;

  if (!ulbId) {
    throw new Error("ulbId is required");
  }

  const sql = `
    select connsizename,
           connsizeid
      from vw_connsizeconfigmas
     where ulbid = :ulbId
  `;

  const binds = {
    ulbId: Number(ulbId),
  };

  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function getTaxDropdown(payload) {
  const { ulbId } = payload;

  if (!ulbId) {
    throw new Error("ulbId is required");
  }

  const sql = `
    select var_tax_ename,
           num_tax_id
      from aowt_tax_mas
      inner join aowt_taxconfig_mas
        on num_taxconfig_taxid = num_tax_id
     where num_taxconfig_ulbid = :ulbId
  `;

  const binds = {
    ulbId: Number(ulbId),
  };

  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function getRateDetails(payload) {
  const { rateId } = payload;

  if (!rateId) {
    throw new Error("rateId is required");
  }

  const sql = `
    select num_rate_detid,
           num_rate_usageid,
           num_rate_usagesubid,
           num_rate_conntypeid,
           num_rate_connsizeid,
           var_rate_valuetype,
           dat_rate_frmdt,
           num_rate_frmvalue,
           num_rate_tovalue,
           num_rate_taxid,
           num_rate_rateamt,
           num_rate_minamt
      from aowt_rate_mas
      inner join aowt_rate_det
        on num_rate_ratemstid = num_rate_rateid
     where num_rate_rateid = :rateId
  `;

  const binds = {
    rateId: Number(rateId),
  };

  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function aowt_rate_ins(payload) {
  const statement = `
    BEGIN
      aowt_rate_ins(
        :in_UserId,
        :in_UsageTypeId,
        :in_UsageSubTypeId,
        :in_conntypeid,
        :in_connsizeid,
        :in_valuetype,
        :in_frmdt,
        :in_todt,
        :in_ulbid,
        :in_Rate_Str,
        :in_Mode,
        :in_TaxId,
        :in_ipaddr,
        :in_source,
        :Out_errorCode,
        :Out_ErrorMsg
      );
    END;
  `;

  const binds = {
    in_UserId: payload.in_UserId,
    in_UsageTypeId: Number(payload.in_UsageTypeId),
    in_UsageSubTypeId: Number(payload.in_UsageSubTypeId),
    in_conntypeid: Number(payload.in_conntypeid),
    in_connsizeid: Number(payload.in_connsizeid),
    in_valuetype: payload.in_valuetype,
    in_frmdt: new Date(payload.in_frmdt),
    in_todt: new Date(payload.in_todt),
    in_ulbid: Number(payload.in_ulbid),
    in_Rate_Str: payload.in_Rate_Str,
    in_Mode: Number(payload.in_Mode),
    in_TaxId: Number(payload.in_TaxId),
    in_ipaddr: payload.in_ipaddr,
    in_source: payload.in_source,

    Out_errorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    Out_ErrorMsg: {
      dir: oracledb.BIND_OUT,
      type: oracledb.STRING,
      maxSize: 1000,
    },
  };

  const result = await executeProcedure({ statement, binds, useTx: false });
  return result.outBinds;
}

async function getUlbTipList(payload) {
  const { ulbId } = payload;

  if (!ulbId) {
    throw new Error("ulbId is required");
  }

  const sql = `
    select num_ulbtip_id,
           num_ulbtip_ulbid,
           var_ulbtip_tip,
           var_ulbtip_slogan,
           var_ulbtip_active,
           var_ulbtip_insby,
           dat_ulbtip_insdate,
           var_ulbtip_updby,
           dat_ulbtip_upddate
      from aowt_ulbtip_det
     where num_ulbtip_ulbid = :ulbId
       and var_ulbtip_active = 'Y'
  `;

  const binds = {
    ulbId: Number(ulbId),
  };

  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function getUlbTipDetails(payload) {
  const { tipId } = payload;

  if (!tipId) {
    throw new Error("tipId is required");
  }

  const sql = `
    select num_ulbtip_id,
           num_ulbtip_ulbid,
           var_ulbtip_tip,
           var_ulbtip_slogan,
           var_ulbtip_active,
           var_ulbtip_insby,
           dat_ulbtip_insdate,
           var_ulbtip_updby,
           dat_ulbtip_upddate,
           var_ulbtip_type
      from aowt_ulbtip_det
     where var_ulbtip_active = 'Y'
       and num_ulbtip_id = :tipId
  `;

  const binds = {
    tipId: Number(tipId),
  };

  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function aowt_ulbtip_ins(payload) {
  const statement = `
    BEGIN
      aowt_ulbtip_ins(
        :in_userid,
        :in_ulbid,
        :in_ulbtipid,
        :in_tip,
        :in_slogan,
        :in_status,
        :in_ipaddress,
        :in_source,
        :in_mode,
        :in_type,
        :out_errorcode,
        :out_errormsg
      );
    END;
  `;

  const binds = {
    in_userid: payload.in_userid,
    in_ulbid: Number(payload.in_ulbid),
    in_ulbtipid:
      payload.in_ulbtipid != null ? Number(payload.in_ulbtipid) : null,
    in_tip: payload.in_tip,
    in_slogan: payload.in_slogan,
    in_status: payload.in_status,
    in_ipaddress: payload.in_ipaddress,
    in_source: payload.in_source,
    in_mode: Number(payload.in_mode),
    in_type: payload.in_type,

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

async function getUsageTypeList() {
  const sql = `
    select num_usagetype_id,
           var_usagetype_name,
           dat_usagetype_insdt,
           var_usagetype_insby,
           dat_usagetype_updt,
           var_usagetype_updby
      from aowt_usagetype_mas
  `;

  const result = await executeQuery(sql);
  return result.rows || [];
}

async function aowt_usagetype_ins(payload) {
  const statement = `
    BEGIN
      aowt_usagetype_ins(
        :in_Userid,
        :in_Usagetypeid,
        :in_Mode,
        :in_Usagetypename,
        :in_ipaddress,
        :in_source,
        :Out_ErrorCode,
        :Out_ErrorMsg
      );
    END;
  `;

  const binds = {
    in_Userid: payload.in_Userid,
    in_Usagetypeid:
      payload.in_Usagetypeid != null ? Number(payload.in_Usagetypeid) : null,
    in_Mode: Number(payload.in_Mode),
    in_Usagetypename: payload.in_Usagetypename,
    in_ipaddress: payload.in_ipaddress,
    in_source: payload.in_source,

    Out_ErrorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    Out_ErrorMsg: {
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
  getZoneList,
  getZoneDetails,
  getWardDropdownByUlb,
  aowt_zone_ins,
  getBlockList,
  getZoneDropdownByWard,
  aowt_block_ins,
  getBankList,
  aowt_bank_ins,
  getRateList,
  getUsageTypeDropdown,
  getUsageSubTypeDropdown,
  getConnTypeDropdown,
  getConnSizeDropdown,
  getTaxDropdown,
  aowt_rate_ins,
  getRateDetails,
  getUlbTipList,
  aowt_ulbtip_ins,
  getUlbTipDetails,
  getUsageTypeList,
  aowt_usagetype_ins,
};
