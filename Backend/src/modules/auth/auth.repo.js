const jwt = require('jsonwebtoken');
const oracledb = require('oracledb');
const { executeQuery } = require('../../db/queryExecutor');
const { executeProcedure } = require('../../db/procedureExecutor');
const { config } = require('../../config/env');

async function loginWithStoredProcedure(userId, password, extra = {}) {
  // Support both positional arguments and object parameter
  if (typeof userId === 'object' && userId !== null) {
    extra = { ...userId };
    password = userId.in_password || userId.password;
    userId = userId.in_UserId || userId.userId;
  }

  const clientInfo = {
    macaddr: extra.in_macaddr || 'NA',
    ipaddr: extra.in_ipaddr  || '127.0.0.1',
    hostname: extra.in_hostname  || 'localhost:3000',
    source: extra.in_source  || 'RW',
    deptid: 62,
  };

  const plsql = `
    BEGIN
      admins.aoma_login_fetch(
        :in_UserId,
        :in_password,
        :in_macaddr,
        :in_ipaddr,
        :in_hostname,
        :in_source,
        :in_deptid,
        :Out_UserName,
        :Out_userid,
        :Out_LastLogin,
        :Out_LastLogOut,
        :Out_Corporation,
        :Out_CorporationAddress,
        :Out_ReceiptOfficeName,
        :Out_ChalanOfficeName,
        :Out_PrabhagName,
        :Out_PrabhagID,
        :Out_DesigID,
        :Out_UserType,
        :Out_Collectioncenter,
        :Out_mobileno,
        :Out_OtpValidate,
        :out_ErrorCode,
        :Out_ErrorMsg,
        :out_OrgId,
        :out_forceFullPassChage
      );
    END;
  `;

  const binds = {
    in_UserId: userId,
    in_password: password,
    in_macaddr: clientInfo.macaddr,
    in_ipaddr: clientInfo.ipaddr,
    in_hostname: clientInfo.hostname,
    in_source: clientInfo.source,
    in_deptid: clientInfo.deptid,
    Out_UserName: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 500 },
    Out_userid: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 200 },
    Out_LastLogin: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 200 },
    Out_LastLogOut: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 200 },
    Out_Corporation: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 500 },
    Out_CorporationAddress: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 1000 },
    Out_ReceiptOfficeName: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 500 },
    Out_ChalanOfficeName: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 500 },
    Out_PrabhagName: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 500 },
    Out_PrabhagID: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 200 },
    Out_DesigID: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 200 },
    Out_UserType: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 200 },
    Out_Collectioncenter: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    Out_mobileno: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 50 },
    Out_OtpValidate: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 50 },
    out_ErrorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    Out_ErrorMsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 4000 },
    out_OrgId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    out_forceFullPassChage: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 },
  };

  const result = await executeProcedure({ statement: plsql, binds, useTx: false });
  const out = result.outBinds;

  const errorCode = out.out_ErrorCode !== undefined && out.out_ErrorCode !== null ? String(out.out_ErrorCode) : null;
  const isSuccess = (errorCode === '9999' );

  if (!isSuccess) {
    return {
      success: false,
      errorCode: errorCode ?? '-1',
      message: out.Out_ErrorMsg || 'Login failed',
      raw: out,
    };
  }

  let userProofType = null;
  try {
    const proofTypeResult = await executeQuery(
      `SELECT NUM_USERMST_USERPROOFTYPE 
       FROM etech_cm.aoup_usermst_def 
       WHERE VAR_USERMST_USERID = :userId`,
      { userId }
    );
    userProofType = proofTypeResult.rows?.[0]?.NUM_USERMST_USERPROOFTYPE;
  } catch (_e) {
    userProofType = null;
  }

  // Fetch brand image
  let brandImage = null;
  try {
    let numericUserId = String(userId);
    if (numericUserId.startsWith('E')) {
      numericUserId = numericUserId.slice(1);
    }
    const brandImageResult = await executeQuery(
      `SELECT BASE64IMG FROM AOUP_ETECH_BANNER_IMAGE WHERE NUM_AGENCY_ID = :agencyId AND USERID = :userId AND IS_ACTIVE = 'Y'`,
      { agencyId: '100', userId: numericUserId }
    );
    brandImage = brandImageResult.rows?.[0]?.BASE64IMG || null;
  } catch (_e) {
    brandImage = null;
  }

  const user = {
    // Spread all raw OUT parameters from procedure
    ...out,

    // Standard properties and frontend AuthContext compatibility keys
    userId: out.Out_userid || userId,
    userName: out.Out_UserName,
    username: out.Out_UserName,
    acccounttype: out.Out_UserType || out.Out_DesigID || '62',
    deptId: 62,
    deptid: 62,
    ulbId: out.out_OrgId,
    collcenterid: out.Out_Collectioncenter,
    lastLogin: out.Out_LastLogin,
    lastlogin: out.Out_LastLogin,
    lastLogout: out.Out_LastLogOut,
    lastlogout: out.Out_LastLogOut,
    corporation: out.Out_Corporation,
    corporationAddress: out.Out_CorporationAddress,
    receiptOfficeName: out.Out_ReceiptOfficeName,
    chalanOfficeName: out.Out_ChalanOfficeName,
    prabhagName: out.Out_PrabhagName,
    prabhagID: out.Out_PrabhagID,
    desigId: out.Out_DesigID,
    userType: out.Out_UserType,
    collectionCenter: out.Out_Collectioncenter,
    mobileNo: out.Out_mobileno,
    otpValidate: out.Out_OtpValidate,
    orgId: out.out_OrgId,
    forceFullPassChange: out.out_forceFullPassChage,
    userProofType,
    brandImage,

    // Explicit procedure aliases
    Out_UserName: out.Out_UserName,
    Out_userid: out.Out_userid || userId,
    Out_LastLogin: out.Out_LastLogin,
    Out_LastLogOut: out.Out_LastLogOut,
    Out_Corporation: out.Out_Corporation,
    Out_CorporationAddress: out.Out_CorporationAddress,
    Out_ReceiptOfficeName: out.Out_ReceiptOfficeName,
    Out_ChalanOfficeName: out.Out_ChalanOfficeName,
    Out_PrabhagName: out.Out_PrabhagName,
    Out_PrabhagID: out.Out_PrabhagID,
    Out_DesigID: out.Out_DesigID,
    Out_UserType: out.Out_UserType,
    Out_Collectioncenter: out.Out_Collectioncenter,
    Out_mobileno: out.Out_mobileno,
    Out_OtpValidate: out.Out_OtpValidate,
    out_ErrorCode: out.out_ErrorCode,
    Out_ErrorMsg: out.Out_ErrorMsg,
    out_OrgId: out.out_OrgId,
    out_forceFullPassChage: out.out_forceFullPassChage,
  };

  const token = jwt.sign(
    {
      sub: user.userId,
      userId: user.userId,
      userName: user.userName,
      orgId: user.orgId,
      ulbId: user.ulbId,
      desigId: user.desigId,
      userType: user.userType,
      collectionCenter: user.collectionCenter,
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  return {
    success: true,
    token,
    user,
  };
}

async function generateResetToken(email) {
  const statement = `
    BEGIN
      etech_cm.aoup_generate_reset_token(
        :in_email,
        :out_userid,
        :out_token,
        :out_errorcode,
        :out_errormsg
      );
    END;
  `;

  const binds = {
    in_email: email,
    out_userid: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 200 },
    out_token: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 2000 },
    out_errorcode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    out_errormsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 4000 },
  };

  const result = await executeProcedure({ statement, binds, useTx: false });
  const out = result.outBinds;

  return {
    userId: out.out_userid,
    token: out.out_token,
    errorCode: out.out_errorcode,
    errorMsg: out.out_errormsg
  };
}

async function resetPasswordWithDbToken(userId, token, newPassword) {
  const statement = `
    BEGIN
      etech_cm.aoup_reset_password(
        :in_userid,
        :in_token,
        :in_newpassword,
        :out_errorcode,
        :out_errormsg
      );
    END;
  `;

  const binds = {
    in_userid: String(userId).trim(),
    in_token: String(token).trim(),
    in_newpassword: newPassword,
    out_errorcode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    out_errormsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 4000 },
  };

  const result = await executeProcedure({ statement, binds, useTx: false });
  const out = result.outBinds;

  return {
    errorCode: out.out_errorcode,
    errorMsg: out.out_errormsg
  };
}

module.exports = {
  loginWithStoredProcedure,
  generateResetToken,
  resetPasswordWithDbToken,
};
