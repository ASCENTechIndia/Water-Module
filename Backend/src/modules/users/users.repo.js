const oracledb = require('oracledb');
const { executeQuery } = require('../../db/queryExecutor');
const { executeProcedure } = require('../../db/procedureExecutor');

function normalizeNullable(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  return value;
}

async function callUserInsNew(payload) {
  const statement = `
    BEGIN
      aoup_user_ins_New(
        :in_brid,
        :in_userid,
        :in_username,
        :in_userpwd,
        :in_mobno,
        :in_email,
        :in_usertypeid,
        :in_DOB,
        :in_proofno,
        :in_desgid,
        :in_roleid,
        :in_compcode,
        :in_workid,
        :in_empid,
        :in_collectionid,
        :in_categoryid,
        :in_status,
        :in_Empcode,
        :in_firstname,
        :in_lastname,
        :in_prooftype,
        :in_mode,
        :in_compid,
        :in_insby,
        :in_Requeststatus,
        :in_pincode,
        :Out_User,
        :Out_errorCode,
        :Out_ErrorMsg
      );
    END;
  `;

  const binds = {
    in_brid: payload.in_brid,
    in_userid: normalizeNullable(payload.in_userid),
    in_username: payload.in_username,
    in_userpwd: null,
    in_mobno: payload.in_mobno,
    in_email: payload.in_email,
    in_usertypeid: payload.in_usertypeid,
    in_DOB: normalizeNullable(payload.in_DOB),
    in_proofno: normalizeNullable(payload.in_proofno),
    in_desgid: payload.in_desgid,
    in_roleid: payload.in_roleid,
    in_compcode: payload.in_compcode,
    in_workid: payload.in_workid,
    in_empid: payload.in_empid ?? null,
    in_collectionid: payload.in_collectionid,
    in_categoryid: payload.in_categoryid,
    in_status: payload.in_status,
    in_Empcode: payload.in_Empcode,
    in_firstname: normalizeNullable(payload.in_firstname),
    in_lastname: normalizeNullable(payload.in_lastname),
    in_prooftype: payload.in_prooftype,
    in_mode: payload.in_mode,
    in_compid: payload.in_compid,
    in_insby: payload.in_insby,
    in_Requeststatus: normalizeNullable(payload.in_Requeststatus) || 'A',
    in_pincode: payload.in_pincode ?? null,
    Out_User: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 },
    Out_errorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    Out_ErrorMsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 10000 },
  };

  const result = await executeProcedure({ statement, binds, useTx: false });
  return result.outBinds;
}

async function callUserIns(payload) {
  const statement = `
    BEGIN
      aoup_user_ins(
        :in_brid,
        :in_Requeststatus,
        :in_userid,
        :in_username,
        :in_userpwd,
        :in_mobno,
        :in_email,
        :in_usertypeid,
        :in_DOB,
        :in_proofno,
        :in_desgid,
        :in_roleid,
        :in_compcode,
        :in_workid,
        :in_empid,
        :in_collectionid,
        :in_categoryid,
        :in_mode,
        :in_status,
        :in_Empcode,
        :in_firstname,
        :in_lastname,
        :in_prooftype,
        :in_compid,
        :in_insby,
        :Out_errorCode,
        :Out_ErrorMsg,
        :Out_User
      );
    END;
  `;

  const binds = {
    in_brid: payload.in_brid,
    in_Requeststatus: normalizeNullable(payload.in_Requeststatus),
    in_userid: normalizeNullable(payload.in_userid),
    in_username: payload.in_username,
    in_userpwd: null,
    in_mobno: payload.in_mobno,
    in_email: payload.in_email,
    in_usertypeid: payload.in_usertypeid,
    in_DOB: normalizeNullable(payload.in_DOB),
    in_proofno: normalizeNullable(payload.in_proofno),
    in_desgid: payload.in_desgid,
    in_roleid: payload.in_roleid,
    in_compcode: payload.in_compcode,
    in_workid: payload.in_workid,
    in_empid: payload.in_empid ?? null,
    in_collectionid: payload.in_collectionid,
    in_categoryid: payload.in_categoryid,
    in_mode: payload.in_mode,
    in_status: payload.in_status,
    in_Empcode: payload.in_Empcode,
    in_firstname: normalizeNullable(payload.in_firstname),
    in_lastname: normalizeNullable(payload.in_lastname),
    in_prooftype: payload.in_prooftype,
    in_compid: payload.in_compid,
    in_insby: payload.in_insby,
    Out_errorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    Out_ErrorMsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 1000 },
    Out_User: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 },
  };

  const result = await executeProcedure({ statement, binds, useTx: false });
  return result.outBinds;
}

async function callUserStatusUpdate(payload) {
  const statement = `
    BEGIN
      aoup_userstatus_upd(
        :in_UserId,
        :in_ddlstatus,
        :in_reason,
        :in_insby,
        :out_ErrorCode,
        :out_ErrorMsg
      );
    END;
  `;

  const binds = {
    in_UserId: payload.in_UserId,
    in_ddlstatus: payload.in_ddlstatus,
    in_reason: normalizeNullable(payload.in_reason),
    in_insby: payload.in_insby,
    out_ErrorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    out_ErrorMsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 1000 },
  };

  const result = await executeProcedure({ statement, binds, useTx: false });
  return result.outBinds;
}

async function searchUsers(filters) {
  let sql = `
    select replace(var_usermst_userid,'E','') username,
           var_usermst_userid userid,
           var_usermst_userfullname empname,
           var_usermst_empcode empcode,
           num_usermst_mobileno mobno,
           num_usermst_email email,
           var_designation_designation desg,
           var_userrole_name role_name,
           num_usermst_roleid role_id,
           var_usermst_status status,
           num_usermst_brid brid
      from aoup_usermst_def a
      left outer join aoup_designation_def d on d.num_designation_id = a.num_usermst_desgid
      left outer join aoup_userrole_mas r on r.num_userrole_id = a.num_usermst_roleid
     where 1 = 1
  `;

  const binds = {};

  if (filters.brid) {
    sql += ' and num_usermst_brid = :brid';
    binds.brid = Number(filters.brid);
  }
  if (filters.userId) {
    sql += ' and var_usermst_userid = :userId';
    binds.userId = filters.userId.startsWith('E') ? filters.userId : `E${filters.userId}`;
  }
  if (filters.empCode) {
    sql += ' and var_usermst_empcode = :empCode';
    binds.empCode = filters.empCode;
  }
  if (filters.status) {
    sql += ' and var_usermst_status = :status';
    binds.status = filters.status;
  }
  if (filters.roleId) {
    sql += ' and num_usermst_roleid = :roleId';
    binds.roleId = Number(filters.roleId);
  }

  sql += ' order by var_usermst_userid';

  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function getUserDetails(userId) {
  const normalizedUserId = userId.startsWith('E') ? userId : `E${userId}`;

  const detailSql = `
    select num_usermst_brid in_brid,
           var_usermst_userid in_userid,
           var_usermst_userfullname in_username,
           num_usermst_mobileno in_mobno,
           num_usermst_email in_email,
           num_usermst_usertype in_usertypeid,
           to_char(date_usermst_dob, 'YYYY-MM-DD"T"HH24:MI:SS') in_DOB,
           num_usermst_idproofno in_proofno,
           num_usermst_desgid in_desgid,
           num_usermst_compcode in_compcode,
           num_usermst_workingid in_workid,
           num_usermst_empid in_empid,
           num_usermst_collectionid in_collectionid,
           num_usermst_categorisation in_categoryid,
           var_usermst_status in_status,
           var_usermst_empcode in_Empcode,
           var_usermst_userfirstname in_firstname,
           var_usermst_userlastname in_lastname,
           num_usermst_userprooftype in_prooftype,
           num_usermst_compid in_compid
      from aoup_usermst_def
     where var_usermst_userid = :userId
  `;

  const result = await executeQuery(detailSql, { userId: normalizedUserId });
  return result.rows?.[0] || null;
}

function normalizeLookupRows(rows) {
  return (rows || []).map((row) => ({
    id: Number(row.ID ?? row.id),
    name: row.NAME ?? row.name,
  }));
}

async function getUserFormOptions(filters = {}) {
  const workingForSql = `
    select num_working_id id,
           var_working_name name
      from aoup_working_mas
     order by var_working_name
  `;

  const designationSql = `
    select num_designation_id id,
           var_designation_designation name
      from aoup_designation_def
     order by var_designation_designation
  `;

  const collectionTeamSql = `
    select num_collectionteam_id id,
           var_collectionteam_name name
      from aoup_collectionteam_mas
     order by num_collectionteam_id
  `;

  const productCategorySql = `
    select num_productcategory_id id,
           var_productcategory_name name
      from aoup_productcategory_mas
     order by num_productcategory_id
  `;

  const companyCodeSql = `
    select num_companycode_id id,
           var_companycode_code name
      from aoup_companycode_mas
     order by var_companycode_code
  `;

  const userRoleSql = `
    select num_userrole_id id,
           var_userrole_name name
      from aoup_userrole_mas
     order by num_userrole_id
  `;

  const userDeviceSql = `
    select num_userdevice_id id,
           var_userdevice_name name
      from aoup_userdevice_mas
     order by num_userdevice_id
  `;

  const userIdProofSql = `
    select num_idproof_id id,
           var_idproof_name name
      from aoup_idproof_mas
     order by num_idproof_id
  `;

  const assetOwnerSql = `
    select num_assetowner_id id,
           var_assetowner_name name
      from etech_cm.aoup_assetowner_mas
     order by var_assetowner_name
  `;

  const zoneSql = `
    select num_companymst_compid id,
           var_companymst_branchname name
      from aoup_companymst_def
     where num_companymst_parentid = 10002
       and num_companymst_brcategory = 3
     order by var_companymst_branchname
  `;

  const regionSql = `
    select num_companymst_compid id,
           var_companymst_branchname name
      from aoup_companymst_def
     where num_companymst_parentid = :zoneId
       and num_companymst_brcategory = 4
     order by var_companymst_branchname
  `;

  const branchSql = `
    select num_companymst_compid id,
           var_companymst_branchname name
      from aoup_companymst_def
     where num_companymst_parentid = :regionId
       and num_companymst_brcategory = 5
     order by var_companymst_branchname
  `;

  const employerSql = `
    select e.num_employer_id id,
           e.var_employer_name name,
           e.var_employer_code code,
           e.var_employer_workingid working_for_id,
           eb.num_empbranch_branchid branch_id
      from aoup_employer_mas e
      inner join AOUP_EMPLOYER_BRANCHCONFIG eb on eb.num_empbranch_empid = e.num_employer_id
     where 1 = 1
  `;

  const employerBinds = {};
  let employerWhere = '';

  if (filters.workingForId) {
    employerWhere += ' and e.var_employer_workingid = :workingForId';
    employerBinds.workingForId = Number(filters.workingForId);
  }

  if (filters.branchId) {
    employerWhere += ' and eb.num_empbranch_branchid = :branchId';
    employerBinds.branchId = Number(filters.branchId);
  }

  const [workingFor, designations, collectionTeams, productCategories, companyCodes, userRoles, userDevices, idProofs, assetOwners, zones, regions, branches, employers] = await Promise.all([
    executeQuery(workingForSql),
    executeQuery(designationSql),
    executeQuery(collectionTeamSql),
    executeQuery(productCategorySql),
    executeQuery(companyCodeSql),
    executeQuery(userRoleSql),
    executeQuery(userDeviceSql),
    executeQuery(userIdProofSql),
    executeQuery(assetOwnerSql),
    executeQuery(zoneSql),
    filters.zoneId ? executeQuery(regionSql, { zoneId: Number(filters.zoneId) }) : Promise.resolve({ rows: [] }),
    filters.regionId ? executeQuery(branchSql, { regionId: Number(filters.regionId) }) : Promise.resolve({ rows: [] }),
    executeQuery(`${employerSql}${employerWhere} order by e.var_employer_name`, employerBinds),
  ]);

  const options = {
    workingFor: normalizeLookupRows(workingFor.rows),
    designations: normalizeLookupRows(designations.rows),
    collectionTeams: normalizeLookupRows(collectionTeams.rows),
    productCategories: normalizeLookupRows(productCategories.rows),
    companyCodes: normalizeLookupRows(companyCodes.rows),
    userRoles: normalizeLookupRows(userRoles.rows),
    userDevices: normalizeLookupRows(userDevices.rows),
    idProofs: normalizeLookupRows(idProofs.rows),
    assetOwners: normalizeLookupRows(assetOwners.rows),
    zones: normalizeLookupRows(zones.rows),
    regions: normalizeLookupRows(regions.rows),
    branches: normalizeLookupRows(branches.rows),
    employers: normalizeLookupRows(employers.rows),
  };

  if (!filters.type) {
    return options;
  }

  const type = String(filters.type).toLowerCase();
  const typeMap = {
    workingfor: 'workingFor',
    working_for: 'workingFor',
    working: 'workingFor',
    designation: 'designations',
    designations: 'designations',
    collectionteam: 'collectionTeams',
    collection_team: 'collectionTeams',
    productcategory: 'productCategories',
    product_category: 'productCategories',
    companycode: 'companyCodes',
    company_code: 'companyCodes',
    userrole: 'userRoles',
    user_role: 'userRoles',
    userdevice: 'userDevices',
    user_device: 'userDevices',
    idproof: 'idProofs',
    id_proof: 'idProofs',
    assetowner: 'assetOwners',
    asset_owner: 'assetOwners',
    zone: 'zones',
    region: 'regions',
    branch: 'branches',
    employer: 'employers',
  };

  const mappedType = typeMap[type];
  return mappedType ? options[mappedType] : [];
}

async function updateUserRole(payload) {
  const normalizedUserId = payload.userId.startsWith('E') ? payload.userId : `E${payload.userId}`;

  const detailSql = `
    select num_usermst_brid in_brid,
           var_usermst_userid in_userid,
           var_usermst_userfullname in_username,
           num_usermst_mobileno in_mobno,
           num_usermst_email in_email,
           num_usermst_usertype in_usertypeid,
           to_char(date_usermst_dob, 'YYYY-MM-DD"T"HH24:MI:SS') in_DOB,
           num_usermst_idproofno in_proofno,
           num_usermst_desgid in_desgid,
           num_usermst_compcode in_compcode,
           num_usermst_workingid in_workid,
           num_usermst_empid in_empid,
           num_usermst_collectionid in_collectionid,
           num_usermst_categorisation in_categoryid,
           var_usermst_status in_status,
           var_usermst_empcode in_Empcode,
           var_usermst_userfirstname in_firstname,
           var_usermst_userlastname in_lastname,
           num_usermst_userprooftype in_prooftype,
           num_usermst_compid in_compid
      from aoup_usermst_def
     where var_usermst_userid = :userId
  `;

  const detailResult = await executeQuery(detailSql, { userId: normalizedUserId });
  if (!detailResult.rows || detailResult.rows.length === 0) {
    return { rowsAffected: 0, reason: 'USER_NOT_FOUND' };
  }

  const current = detailResult.rows[0];
  const out = await callUserIns({
    in_brid: Number(current.IN_BRID),
    in_Requeststatus: 'A',
    in_userid: String(current.IN_USERID),
    in_username: String(current.IN_USERNAME),
    in_mobno: Number(current.IN_MOBNO),
    in_email: String(current.IN_EMAIL),
    in_usertypeid: Number(current.IN_USERTYPEID),
    in_DOB: current.IN_DOB || null,
    in_proofno: current.IN_PROOFNO ? String(current.IN_PROOFNO) : null,
    in_desgid: Number(current.IN_DESGID),
    in_roleid: payload.roleId,
    in_compcode: Number(current.IN_COMPCODE),
    in_workid: Number(current.IN_WORKID),
    in_empid: current.IN_EMPID ? Number(current.IN_EMPID) : null,
    in_collectionid: Number(current.IN_COLLECTIONID),
    in_categoryid: Number(current.IN_CATEGORYID),
    in_mode: payload.mode ?? 2,
    in_status: String(current.IN_STATUS),
    in_Empcode: String(current.IN_EMPCODE),
    in_firstname: current.IN_FIRSTNAME ? String(current.IN_FIRSTNAME) : null,
    in_lastname: current.IN_LASTNAME ? String(current.IN_LASTNAME) : null,
    in_prooftype: Number(current.IN_PROOFTYPE),
    in_compid: Number(current.IN_COMPID),
    in_insby: payload.insBy,
  });

  return {
    rowsAffected: String(out.Out_errorCode) === '-100' ? 1 : 0,
    out,
  };
}

async function branchListbyCategory(filters) {
  let sql = `select brid, branchname from etech_cm.branchlist`;
  const binds = {};

  let conditions = [];

  let column = "";
  if (filters.brcategory == 5) {
    column = "brid";
  } else {
    column = "compid";
  }

  if (filters.userLevel === "Zone") {
    conditions.push(`${column} = :val`);
    binds.val = 10001;
  } 
  else if (filters.userLevel === "Branch") {
    conditions.push(`${column} = :val`);
    binds.val = 10002;
  } 
  else if (filters.userLevel === "Region") {
    conditions.push(`(${column} = :val OR brcategory = 4)`);
    binds.val = 10017;
  }

  // ✅ condition नसेल तर error throw कर
  if (conditions.length === 0) {
    throw new Error("Invalid or missing userLevel");
  }

  sql += " WHERE " + conditions.join(" AND ");

  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function agentDetailsbyBrid(brid) {
  let sql = `
  select replace(var_usermst_userid,'E','') username,var_usermst_userid userid,var_usermst_userfullname empname,var_usermst_empcode empcode,
   num_usermst_mobileno mobno,num_usermst_email email,var_designation_designation desg,var_userrole_name  from etech_cm.aoup_usermst_def a 
             left outer join etech_cm.aoup_designation_def on num_designation_id = num_usermst_desgid 
             left outer join etech_cm.aoup_userrole_mas on num_userrole_id = num_usermst_roleid 
            where num_usermst_brid = :brid order by var_usermst_userid 
  `;

  const binds = { brid: Number(brid) };
  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function agentDetailsbyBridNew(payload) {
  const {
    brid,
    status,
    roleId,
    page = 1,
    limit = 10
  } = payload;

  let conditions = [];
  let binds = {};

  // 🔹 Filters
  if (brid) {
    conditions.push("num_usermst_brid = :brid");
    binds.brid = Number(brid);
  }

  if (status) {
    conditions.push("VAR_USERMST_STATUS = :status");
    binds.status = status;
  }

  if (roleId) {
    conditions.push("NUM_USERMST_ROLEID = :roleId");
    binds.roleId = Number(roleId);
  }

  let whereClause = conditions.length
    ? "WHERE " + conditions.join(" AND ")
    : "";

  const offset = (Number(page) - 1) * Number(limit);

  // =========================
  // 🔥 DATA QUERY
  // =========================
  let dataSql = `
    SELECT 
      REPLACE(var_usermst_userid,'E','') username,
      var_usermst_userid userid,
      var_usermst_userfullname empname,
      var_usermst_empcode empcode,
      num_usermst_mobileno mobno,
      num_usermst_email email,
      var_designation_designation desg,
      var_userrole_name,
      var_usermst_status,
      DATE_USERMST_LASTLOGIN,
      DATE_USERMST_STATUSUPDDT
    FROM etech_cm.aoup_usermst_def a
    LEFT JOIN etech_cm.aoup_designation_def 
      ON num_designation_id = num_usermst_desgid
    LEFT JOIN etech_cm.aoup_userrole_mas 
      ON num_userrole_id = num_usermst_roleid
    ${whereClause}
    ORDER BY var_usermst_userid
    OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY
  `;

  // =========================
  // 🔥 PAGINATION COUNT (IMPORTANT)
  // =========================
  let totalSql = `
    SELECT COUNT(*) AS total_records
    FROM etech_cm.aoup_usermst_def a
    ${whereClause}
  `;

  // =========================
  // 🔥 STATUS COUNTS
  // =========================
  // let countSql = `
  //   SELECT 
  //     SUM(CASE WHEN VAR_USERMST_STATUS = 'A' THEN 1 ELSE 0 END) AS active_count,
  //     SUM(CASE WHEN VAR_USERMST_STATUS = 'I' THEN 1 ELSE 0 END) AS inactive_count
  //   FROM etech_cm.aoup_usermst_def a
  //   ${whereClause}
  // `;

  let countSql = `
    SELECT 
      SUM(CASE WHEN VAR_USERMST_STATUS IN ('A', 'U') THEN 1 ELSE 0 END) AS active_count,
      SUM(CASE WHEN VAR_USERMST_STATUS = 'I' THEN 1 ELSE 0 END) AS inactive_count
    FROM etech_cm.aoup_usermst_def a
    ${whereClause}
  `;

  // 🔹 Execute
  const [dataResult, totalResult, countResult] = await Promise.all([
    executeQuery(dataSql, { ...binds, offset, limit: Number(limit) }),
    executeQuery(totalSql, binds),
    executeQuery(countSql, binds)
  ]);

  const totalRecords = totalResult.rows?.[0]?.TOTAL_RECORDS || 0;
  const active = countResult.rows?.[0]?.ACTIVE_COUNT || 0;
  const inactive = countResult.rows?.[0]?.INACTIVE_COUNT || 0;

  const totalPages = Math.ceil(totalRecords / Number(limit));

  return {
    data: dataResult.rows || [],
    pagination: {
      page: Number(page),
      limit: Number(limit),
      totalRecords,
      totalPages
    },
    counts: {
      total: totalRecords,
      active,
      inactive
    }
  };
}

async function getBranchusercreation(filters) {
  let sql = "";
  const binds = {};

  const isRestricted = (filters.brcategory == 5 || filters.brcategory == 6);

  // 🔹 Restricted Users (Branch / 6)
  if (isRestricted) {
    sql = `
      SELECT branchname, brid
      FROM etech_cm.branchlist
      WHERE brid = :brid
      ORDER BY branchname
    `;
    binds.brid = Number(filters.grdLevel);
  } 
  else {
    // 🔹 Non-restricted users (Zone / Region / Branch)
    if (filters.userLevel === "Zone") {
      sql = `
        SELECT branchname, brid
        FROM etech_cm.view_zone
        ORDER BY branchname
      `;
    } 
    else if (filters.userLevel === "Region") {
      sql = `
        SELECT branchname, brid
        FROM etech_cm.view_region
        ORDER BY branchname
      `;
    } 
    else if (filters.userLevel === "Branch") {
      sql = `
        SELECT branchname, brid
        FROM etech_cm.view_branch
        ORDER BY branchname
      `;
    } 
    else {
      throw new Error("Invalid or missing userLevel");
    }
  }

  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function getRoles() {
  let sql = `
  SELECT var_userrole_name, num_userrole_id
FROM etech_cm.aoup_userrole_mas
WHERE num_userrole_id IN (1,5)
ORDER BY num_userrole_id
  `;

  const binds = {};
  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function getUserDevice() {
  let sql = `
  select var_userdevice_name, num_userdevice_id from 
  etech_cm.aoup_userdevice_mas where num_userdevice_id in(3) order by num_userdevice_id
  `;

  const binds = {};
  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function callUserWebIns(payload) {
  const statement = `
    BEGIN
      etech_cm.aoup_userweb_ins(
        :in_brid,
        :in_userid,
        :in_username,
        :in_userpwd,
        :in_mobno,
        :in_email,
        :in_usertypeid,
        :in_DOB,
        :in_proofno,
        :in_desgid,
        :in_roleid,
        :in_compcode,
        :in_workid,
        :in_empid,
        :in_collectionid,
        :in_categoryid,
        :in_mode,
        :in_status,
        :in_Empcode,
        :in_firstname,
        :in_lastname,
        :in_prooftype,
        :in_compid,
        :in_insby,
        :Out_errorCode,
        :Out_ErrorMsg,
        :Out_User
      );
    END;
  `;

  const binds = {
    in_brid: Number(payload.in_brid),
    in_userid: payload.in_userid ?? null,
    in_username: payload.in_username,
    in_userpwd: payload.in_userpwd ?? null,
    in_mobno: Number(payload.in_mobno),
    in_email: payload.in_email,
    in_usertypeid: Number(payload.in_usertypeid),
    in_DOB: payload.in_DOB ? new Date(payload.in_DOB) : null,
    in_proofno: payload.in_proofno ?? null,
    in_desgid: Number(payload.in_desgid),
    in_roleid: Number(payload.in_roleid),
    in_compcode: Number(payload.in_compcode),
    in_workid: Number(payload.in_workid),
    in_empid: payload.in_empid ? Number(payload.in_empid) : null,
    in_collectionid: Number(payload.in_collectionid),
    in_categoryid: Number(payload.in_categoryid),
    in_mode: Number(payload.in_mode),
    in_status: payload.in_status,
    in_Empcode: payload.in_Empcode,
    in_firstname: payload.in_firstname ?? null,
    in_lastname: payload.in_lastname ?? null,
    in_prooftype: Number(payload.in_prooftype),
    in_compid: Number(payload.in_compid),
    in_insby: payload.in_insby,

    Out_errorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    Out_ErrorMsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 10000 },
    Out_User: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 }
  };

  const result = await executeProcedure({ statement, binds, useTx: false });
  return result.outBinds;
}

async function findUserByUserId(userId) {
  const normalizedUserId = userId.startsWith('E') ? userId : `E${userId}`;

  const sql = `
    select replace(a.var_usermst_userid, 'E', '') as userid,
           a.var_usermst_userfullname as username,
           b.var_userlevelmst_status as currentstatus
      from aoup_usermst_def a
      left outer join aoup_userlevelmst_def b on b.var_userlevelmst_id = a.var_usermst_status
     where a.var_usermst_userid = :userId
  `;

  const result = await executeQuery(sql, { userId: normalizedUserId });
  return result.rows?.[0] || null;
}

function normalizeUserId(userId) {
  return String(userId || '').startsWith('E') ? String(userId) : `E${String(userId || '')}`;
}

async function getPageAccessByUserId(userId) {
  const normalizedUserId = normalizeUserId(userId);

  const userSql = `
    select replace(var_usermst_userid, 'E', '') as userid,
           var_usermst_userfullname as username,
           num_usermst_userprooftype as usertype
      from etech_cm.aoup_usermst_def
     where var_usermst_userid = :userId
  `;

  const userResult = await executeQuery(userSql, { userId: normalizedUserId });
  const user = userResult.rows?.[0];

  if (!user) {
    return null;
  }

  const assignedSql = `
    select b.var_menumst_menuname as menuname,
           a.num_menuusersmst_menuid as menuid
      from etech_cm.aoup_menuusersmst_def a
      inner join etech_cm.aoup_menumst_def b on a.num_menuusersmst_menuid = b.num_menumst_menuid
     where a.var_menuusersmst_userid = :userId
  `;

  const sourceSql = `
    select menuname,
           menuid
      from etech_cm.aoup_menuitems_bank_conneqt
     where sourcesystem = :sourceSystem
     order by menuname
  `;

  const sourceSystem = String(user.USERTYPE ?? user.usertype) === '1' ? 'Conneqt' : 'Bank';

  const [assignedResult, sourceResult] = await Promise.all([
    executeQuery(assignedSql, { userId: normalizedUserId }),
    executeQuery(sourceSql, { sourceSystem }),
  ]);

  const pageMap = new Map();

  for (const row of assignedResult.rows || []) {
    const menuId = String(row.MENUID ?? row.menuid);
    pageMap.set(menuId, {
      menuId,
      menuName: row.MENUNAME ?? row.menuname,
      selected: true,
    });
  }

  for (const row of sourceResult.rows || []) {
    const menuId = String(row.MENUID ?? row.menuid);
    if (!pageMap.has(menuId)) {
      pageMap.set(menuId, {
        menuId,
        menuName: row.MENUNAME ?? row.menuname,
        selected: false,
      });
    }
  }

  return {
    userId: String(user.USERID ?? user.userid),
    userName: user.USERNAME ?? user.username,
    userOf: sourceSystem === 'Conneqt' ? 'Conneqt' : 'Central Bank',
    pages: Array.from(pageMap.values()),
  };
}

async function updatePageAccessByUserId(payload) {
  const normalizedUserId = normalizeUserId(payload.userId);
  const menuIds = (payload.menuIds || []).map((x) => String(x)).join(',');

  const statement = `
    BEGIN
      sp_update_menu_user2(
        :p_menuids,
        :p_userid,
        :out_ErrorCode,
        :out_ErrorMsg
      );
    END;
  `;

  const binds = {
    p_menuids: menuIds,
    p_userid: normalizedUserId,
    out_ErrorCode: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 },
    out_ErrorMsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 1000 },
  };

  const result = await executeProcedure({ statement, binds, useTx: false });
  return result.outBinds;
}

async function findUserByNameId(input) {
  try {
    let sql = `
      SELECT 
        VAR_USERMST_USERID,
        VAR_USERMST_USERFULLNAME
      FROM etech_cm.aoup_usermst_def
      WHERE 
    `;

    let params = {};

    // 👉 Check if input is numeric / ID type
    if (/^E?\d+$/.test(input)) {
      // ID search (LIKE)
      const cleanId = input.replace(/^E/i, ""); // remove E if exists

      sql += ` REPLACE(VAR_USERMST_USERID, 'E', '') LIKE '%' || :userId || '%' `;
      params.userId = cleanId;

    } else {
      // Name search (LIKE)
      sql += ` LOWER(VAR_USERMST_USERFULLNAME) LIKE LOWER('%' || :userName || '%') `;
      params.userName = input;
    }

    const result = await executeQuery(sql, params);
    return result.rows || [];

  } catch (error) {
    console.error("Error in findUser:", error);
    throw error;
  }
}

module.exports = {
  callUserInsNew,
  callUserIns,
  callUserStatusUpdate,
  searchUsers,
  getUserDetails,
  getUserFormOptions,
  updateUserRole, branchListbyCategory, agentDetailsbyBrid, getBranchusercreation, getRoles,
  getUserDevice, callUserWebIns , findUserByUserId,
  getPageAccessByUserId,
  updatePageAccessByUserId,
  agentDetailsbyBridNew,
  findUserByNameId
};
