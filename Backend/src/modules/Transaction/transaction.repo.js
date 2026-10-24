const { executeQuery } = require("../../db/queryExecutor");
const { executeProcedure } = require("../../db/procedureExecutor");
const oracledb = require("oracledb");

function normalizeNullable(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  return value;
}

async function getWardDropdown(payload) {
  const { ulbId } = payload;

  if (!ulbId) {
    throw new Error("ulbId is required");
  }

  const sql = `
    select distinct var_ward_name,
                    num_ward_id
      from aowt_ward_mas
     where num_ward_ulbid = :ulbId
  `;

  const binds = {
    ulbId: Number(ulbId),
  };

  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function getZoneDropdown(payload) {
  const { wardId } = payload;

  if (!wardId) {
    throw new Error("wardId is required");
  }

  const sql = `
    select distinct var_zone_name,
                    num_zone_id
      from aowt_zone_mas
     where num_zone_wardid = :wardId
  `;

  const binds = {
    wardId: Number(wardId),
  };

  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function getBlockDropdown(payload) {
  const { zoneId } = payload;

  if (!zoneId) {
    throw new Error("zoneId is required");
  }

  const sql = `
    select distinct var_block_name,
                    num_block_id
      from aowt_block_mas
     where num_block_zoneid = :zoneId
  `;

  const binds = {
    zoneId: Number(zoneId),
  };

  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function resolveConnNoToId(ulbId, connNo) {
  const sql = `
    select num_conn_connid connid
      from aowt_conn_mas
     where num_conn_ulbid = :ulbId
       and var_conn_connno = :connNo
  `;

  const result = await executeQuery(sql, {
    ulbId: Number(ulbId),
    connNo: String(connNo),
  });
  return result.rows?.[0]?.CONNID || null;
}

async function queryConnectionsByArea(ulbId, wardId, zoneId, blockId) {
  const sql = `
    select var_conn_connno connno,
           var_conn_ownername name,
           var_conn_meterno meterno,
           num_mtrreading_prevreading lastreading,
           num_mtrreading_currreading currreading,
           num_conn_intilreading intilreading,
           var_mtrreading_period period
      from aowt_conn_mas
      left join aowt_mtrreading_mas
        on num_mtrreading_connid = num_conn_connid
       and num_mtrreading_ulbid  = num_conn_ulbid
     where num_conn_wardid  = :wardId
       and num_conn_zoneid  = :zoneId
       and num_conn_blockid = :blockId
       and num_conn_ulbid   = :ulbId
  `;

  const result = await executeQuery(sql, {
    ulbId: Number(ulbId),
    wardId: Number(wardId),
    zoneId: Number(zoneId),
    blockId: Number(blockId),
  });
  return result.rows || [];
}

async function queryConnectionsByRange(ulbId, fromConId, toConId) {
  let sql = `
    select var_conn_connno connno,
           var_conn_ownername name,
           var_conn_meterno meterno,
           num_mtrreading_prevreading lastreading,
           num_mtrreading_currreading currreading,
           num_conn_intilreading intilreading,
           var_mtrreading_period period
      from aowt_conn_mas
      left join aowt_mtrreading_mas
        on num_mtrreading_connid = num_conn_connid
       and num_mtrreading_ulbid  = num_conn_ulbid
     where num_conn_ulbid = :ulbId
  `;

  const binds = { ulbId: Number(ulbId) };

  if (toConId != null) {
    sql += ` and num_conn_connid >= :fromConId
             and num_conn_connid <= :toConId`;
    binds.fromConId = Number(fromConId);
    binds.toConId = Number(toConId);
  } else {
    sql += ` and num_conn_connid = :fromConId`;
    binds.fromConId = Number(fromConId);
  }

  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function getActiveBillingCycleForUlb(ulbId) {
  const sql = `
    select var_bilsched_frommname frommname,
           var_bilsched_tomname   tomname
      from aowt_billschedule_mas
     where num_bilsched_ulbid = :ulbId
       and var_bilsched_cyclestatus = 'Y'
  `;

  const result = await executeQuery(sql, { ulbId: Number(ulbId) });
  const row = result.rows?.[0];
  if (!row) return null;

  return {
    fromMonth: row.FROMMNAME,
    toMonth: row.TOMNAME,
  };
}

async function getGapCodeDropdown(payload) {
  const { ulbId } = payload;

  if (!ulbId) {
    throw new Error("ulbId is required");
  }

  const sql = `
    select case
             when var_gapcode_name = 'MOK' then 'METER OK'
             when var_gapcode_name = 'HLK' then 'HOUSE LOCK'
             else var_gapcode_name
           end as var_gapcode_name,
           num_gapcode_id
      from aowt_gapcode_mas
      inner join aowt_gapcodeconfig_mas
        on num_gapcodeconfig_gapid = num_gapcode_id
     where num_gapcodeconfig_ulbid = :ulbId
  `;

  const binds = {
    ulbId: Number(ulbId),
  };

  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function aowt_mtrreading_ins(payload) {
  const statement = `
    BEGIN
      aowt_mtrreading_ins(
        :in_UserId,
        :in_mtrreading_Str,
        :in_mtrreading_ulbid,
        :in_Mode,
        :in_RedingEntryMonth,
        :in_ipaddr,
        :in_source,
        :Out_errorCode,
        :Out_ErrorMsg
      );
    END;
  `;

  const binds = {
    in_UserId: payload.in_UserId,
    in_mtrreading_Str: payload.in_mtrreading_Str,
    in_mtrreading_ulbid: Number(payload.in_mtrreading_ulbid),
    in_Mode: Number(payload.in_Mode),
    in_RedingEntryMonth: new Date(payload.in_RedingEntryMonth),
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

async function getZoneDropdownWithUlbId(payload) {
  const { ulbId } = payload;

  if (!ulbId) {
    throw new Error("ulbId is required");
  }

  const sql = `
    select distinct var_zone_name,
                    num_zone_id
      from vw_zonemas
     where num_zone_wardid in (
        select num_ward_id
          from vw_wardmas
         where num_ward_ulbid = :ulbId
     )
  `;

  const binds = {
    ulbId: Number(ulbId),
  };

  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function aowt_billgen_ins(payload) {
  const statement = `
    BEGIN
      aowt_billgen_ins(
        :in_userid,
        :in_ULBId,
        :in_zoneid,
        :in_blockno,
        :in_conno,
        :in_billdate,
        :in_duedate,
        :in_ipaddress,
        :in_source,
        :out_errorcode,
        :out_errormsg
      );
    END;
  `;

  const binds = {
    in_userid: payload.in_userid,
    in_ULBId: Number(payload.in_ULBId),
    in_zoneid: Number(payload.in_zoneid),
    in_blockno: Number(payload.in_blockno),
    in_conno: normalizeNullable(payload.in_conno),
    in_billdate: new Date(payload.in_billdate),
    in_duedate: new Date(payload.in_duedate),
    in_ipaddress: payload.in_ipaddress,
    in_source: payload.in_source,

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

async function getBankDropdown(payload) {
  const { chequeNo } = payload;

  if (!chequeNo) {
    throw new Error("chequeNo is required");
  }

  const sql = `
    select var_rec_banknm,
           num_rec_bankid
      from aowt_rec_mas
     where var_rec_instruno = :chequeNo
     order by var_rec_banknm
  `;

  const binds = {
    chequeNo: String(chequeNo),
  };

  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function getReasonDropdown() {
  // In .net code num_deletereason_id is passing hard coded value that is 4
  const sql = `
    select var_deletereason_reason,
           num_deletereason_id
      from aowt_deletereason_mas
     where num_deletereason_id = '4'
  `;

  const result = await executeQuery(sql);
  return result.rows || [];
}

async function getChequeBounceDetails(payload) {
  const {
    ulbId,
    chequeNo,
    bankId,
    zoneId,
    chequeAmount,
    receiptDate,
    mobileNo,
  } = payload;

  if (!chequeNo) {
    throw new Error("chequeNo is required");
  }

  let sql = `
    select num_zone_id zoneid,
           var_zone_name zonename,
           num_ward_id wardno,
           num_conn_connid connid,
           num_rec_id rec_id,
           var_rec_recno receiptno,
           var_rec_bookno bookno,
           num_rec_ownername ownername,
           num_rec_amount amount,
           dat_rec_receiptdt receiptdate,
           num_rec_mobile mobile
      from aowt_rec_mas
      inner join aowt_conn_mas
        on num_rec_connid = num_conn_connid
       and num_rec_ulbid  = num_conn_ulbid
      inner join aowt_block_mas
        on num_block_zoneid = num_conn_zoneid
       and num_block_id     = num_conn_blockid
      inner join aowt_zone_mas
        on num_zone_id = num_block_zoneid
      inner join aowt_ward_mas
        on num_ward_id    = num_zone_wardid
       and num_ward_ulbid = num_rec_ulbid
     where var_rec_instruno = :chequeNo
  `;

  const binds = {
    chequeNo: String(chequeNo),
  };

  if (bankId) {
    sql += ` and num_rec_bankid = :bankId`;
    binds.bankId = Number(bankId);
  }

  if (zoneId) {
    sql += ` and num_zone_id = :zoneId`;
    binds.zoneId = Number(zoneId);
  }

  if (chequeAmount) {
    sql += ` and num_rec_amount = :amount`;
    binds.amount = Number(chequeAmount);
  }

  if (receiptDate) {
    sql += ` and trunc(dat_rec_receiptdt) = to_date(:recDate, 'YYYY-MM-DD')`;
    binds.recDate = String(receiptDate);
  }

  if (mobileNo) {
    sql += ` and num_rec_mobile = :mobileNo`;
    binds.mobileNo = String(mobileNo);
  }

  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function aowt_chequebounce_ins(payload) {
  const statement = `
    BEGIN
      aowt_chequebounce_ins(
        :in_userid,
        :in_ulbid,
        :in_zoneid,
        :in_chequeno,
        :in_bankid,
        :in_proprecstr,
        :in_remark,
        :in_ipaddress,
        :in_source,
        :in_FinYear,
        :out_errorcode,
        :out_errormssg
      );
    END;
  `;

  const binds = {
    in_userid: payload.in_userid,
    in_ulbid: Number(payload.in_ulbid),
    in_zoneid: Number(payload.in_zoneid),
    in_chequeno: Number(payload.in_chequeno),
    in_bankid: Number(payload.in_bankid),
    in_proprecstr: payload.in_proprecstr,
    in_remark: payload.in_remark,
    in_ipaddress: payload.in_ipaddress,
    in_source: payload.in_source,
    in_FinYear: payload.in_FinYear,
    out_errorcode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    out_errormssg: {
      dir: oracledb.BIND_OUT,
      type: oracledb.STRING,
      maxSize: 2000,
    },
  };

  const result = await executeProcedure({ statement, binds, useTx: false });
  return result.outBinds;
}

async function getReceiptDeleteAuthList(payload) {
  const { ulbId } = payload;

  if (!ulbId) {
    throw new Error("ulbId is required");
  }

  const sql = `
    select num_rec_ulbid uldbid,
           var_corporation_name corpname,
           num_rec_id recid,
           num_ward_id wardid,
           var_ward_name wardname,
           num_zone_id zoneid,
           var_zone_name zonename,
           num_block_id blockid,
           var_block_name blockname,
           num_rec_connid connid,
           var_conn_connno connno,
           var_rec_recno recno,
           dat_rec_receiptdt recdate,
           num_rec_amount recamount,
           var_rec_ownername ownername,
           '-' ocpname,
           num_rec_mobile mobileno,
           num_rec_collcenterid collcenid,
           var_rec_insby insby,
           '-' subject,
           '-' narration,
           var_conn_address address,
           '-' remarks
      from aowt_rec_mas_hst
      inner join aowt_conn_mas
        on num_conn_ulbid = num_rec_ulbid
       and num_conn_connid = num_rec_connid
      inner join prop.vw_recmodeconfig
        on ulbid = num_conn_ulbid
       and recmodeid = num_rec_amttype
      inner join admins.aoma_corporation_mas
        on num_corporation_id = num_rec_ulbid
      inner join admins.aoma_user_def
        on num_user_ulbid = num_rec_ulbid
       and num_user_userid = var_rec_insby
      inner join aowt_block_mas
        on num_block_zoneid = num_conn_zoneid
       and num_block_id = num_conn_blockid
      inner join aowt_zone_mas
        on num_zone_id = num_block_zoneid
      inner join aowt_ward_mas
        on num_ward_id = num_zone_wardid
       and num_ward_ulbid = num_rec_ulbid
     where num_corporation_id = :ulbId
       and var_rec_authflag = 'P'
  `;

  const binds = {
    ulbId: Number(ulbId),
  };

  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

// Receipt Delete List

async function getYearDropdownRepo() {
  const sql = `
    select var_year_yearname,num_year_id from aoms_year_mas order by num_year_id
  `;

  const result = await executeQuery(sql);
  return result.rows || [];
}

async function getReceiptDeleteWardDropdownRepo(payload) {
  const { ulbId } = payload;

  if (!ulbId) {
    throw new Error("ulbId is required");
  }

  const sql = `
    select 
      var_ward_name,
      num_ward_id
    from vw_wardmas
    where num_ward_ulbid=:ulbId
    order by var_ward_name
  `;

  const binds = {
    ulbId: Number(ulbId),
  };

  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function getReceiptDeleteZoneDropdownRepo(payload) {
  const { wardId } = payload;

  if (!wardId) {
    throw new Error("Ward ID is required");
  }

  const sql = `
      select 
        var_zone_name, 
        num_zone_id  
      from vw_zonemas 
      where num_zone_wardid =:wardId
  `;

  const binds = {
    wardId: Number(wardId),
  };

  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function getReceiptDeleteBlockDropdownRepo(payload) {
  const { zoneId } = payload;

  if (!zoneId) {
    throw new Error("Zone ID is required");
  }

  const sql = `
       select 
        var_block_name,
        num_block_id
      from vw_blockmas
      where num_block_zoneid=:zoneId
      order by var_block_name
  `;

  const binds = {
    zoneId: Number(zoneId),
  };

  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function getReceiptDeleteListDetailsRepo(payload) {
  const {
    ulbId,
    connectionNumber,
    receiptNumber,
    wardId,
    zoneId,
    flatNumber,
    fromDate,
    toDate
  } = payload;

  const binds = {
    ulbId
  };

  if (!ulbId) {
    throw new Error("ULB ID is required");
  }


  let sql = `
    select * from view_receiptdet  
    where 1=1 and uldbid = :ulbId
  `;

  if (connectionNumber) {
    sql += ` and  connno = :connectionNumber`;
    binds.connectionNumber = connectionNumber;
  }

  if (receiptNumber) {
    sql += ` and  RECNO = :receiptNumber`;
    binds.receiptNumber = receiptNumber;
  }

  if (wardId) {
    sql += ` and  wardid = :wardId`;
    binds.wardId = wardId;
  }

  if (zoneId) {
    sql += ` and  zoneid = :zoneId`
    binds.zoneId = zoneId;
  }

  if (flatNumber) {
    sql += ` and  var_rec_flatno = :flatNumber`;
    binds.flatNumber = flatNumber;
  }

  if (fromDate && toDate) {
    sql += ` and  trunc(RECDATE) >= :fromDate  and trunc(RECDATE) <= :toDate`
    binds.fromDate = fromDate;
    binds.toDate = toDate;
  }

  sql += `  order by RECNO desc`

  const result = await executeQuery(sql, binds);
  return result.rows || [];

}

async function getReceiptDeleteReasonDropdownRepo(payload) {
  let sql = `
    select 
      var_deletereason_reason,
      num_deletereason_id
    from aowt_deletereason_mas
    where num_deletereason_id not in ('4')
    order by var_deletereason_reason
  `
  const result = await executeQuery(sql);
  return result.rows || [];
}

async function getReceiptDeletePaymentDropdownRepo(payload) {
  const {
    ulbId
  } = payload;

  if (!ulbId) {
    throw new Error("ULB ID is required");
  }

  let sql = `
    select 
      recmodname,
      recmodeid
    from prop.vw_recmodeconfig
    where ulbid=:ulbId
    order by recmodname
  `;

  const binds = {
    ulbId
  }

  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function getReceiptDeleteBankDropdownRepo() {
  let sql = `
    select 
      bank_name,
      bank_id
    from prop.vw_bankconfig
    where ulbid='1'
    order by bank_name
  `;

  const result = await executeQuery(sql);
  return result.rows || [];
}

async function getReceiptDeleteMstDetailsRepo(payload) {
  const {
    connectionNumber,
    receiptNumber
  } = payload

  let sql = `
    select connno,BILLNO,recno,address,rectype,bookno,rec_refno,recdate,amttype,instruno,instrudate,NUM_REC_BANKID,micrcode,instrutype,totalamt,dpc,rebate,amount,wardid,zoneid,blockid,ownername,PAIDBY 
    from view_receiptdet where 1=1
    and recno=:receiptNumber
    and connno=:connectionNumber
  `;

  const binds = {
    connectionNumber,
    receiptNumber
  };

  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function receiptDeleteMstSubmitRepo(payload) {
  const statement = `
    BEGIN
      aowt_rec_del(
        :in_userid,
        :in_ulbid,
        :in_wardid,
        :in_zoneid,
        :in_blockno,
        :in_connid,
        :in_recid,
        :in_recno,
        :in_remark,
        :in_ipaddress,
        :in_source,
        :out_errorcode,
        :out_errormssg
      );
    END;
  `;

  const binds = {
    in_userid: payload.in_userid,
    in_ulbid: Number(payload.in_ulbid),
    in_wardid: Number(payload.in_wardid),
    in_zoneid: Number(payload.in_zoneid),
    in_blockno: Number(payload.in_blockno),
    in_connid: Number(payload.in_connid),
    in_recid: Number(payload.in_recid),
    in_recno: payload.in_recno,
    in_remark: payload.in_remark,
    in_ipaddress: payload.in_ipaddress,
    in_source: payload.in_source,

    out_errorcode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    out_errormssg: {
      dir: oracledb.BIND_OUT,
      type: oracledb.STRING,
      maxSize: 1000,
    },
  };

  const result = await executeProcedure({ statement, binds, useTx: false });
  return result.outBinds;
}


module.exports = {
  getWardDropdown,
  getZoneDropdown,
  getBlockDropdown,
  getActiveBillingCycleForUlb,
  resolveConnNoToId,
  queryConnectionsByArea,
  queryConnectionsByRange,
  getGapCodeDropdown,
  aowt_mtrreading_ins,
  getZoneDropdownWithUlbId,
  aowt_billgen_ins,
  getBankDropdown,
  getReasonDropdown,
  aowt_chequebounce_ins,
  getChequeBounceDetails,
  getReceiptDeleteAuthList,
  getYearDropdownRepo,
  getReceiptDeleteWardDropdownRepo,
  getReceiptDeleteZoneDropdownRepo,
  getReceiptDeleteBlockDropdownRepo,
  getReceiptDeleteListDetailsRepo,
  getReceiptDeleteReasonDropdownRepo,
  getReceiptDeletePaymentDropdownRepo,
  getReceiptDeleteBankDropdownRepo,
  getReceiptDeleteMstDetailsRepo,
  receiptDeleteMstSubmitRepo
};
