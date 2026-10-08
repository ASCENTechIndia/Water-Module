const jwt = require('jsonwebtoken');
const oracledb = require('oracledb');
const { executeQuery } = require('../../db/queryExecutor');
const { executeProcedure } = require('../../db/procedureExecutor');
const { config } = require('../../config/env');

async function loginWithStoredProcedure(userId, password) {
  const plsql = `
    BEGIN
      etech_cm.aoup_login_fetch(
        :in_UserId,
        :in_password,
        :Out_CompId,
        :Out_UserName,
        :Out_LastLogin,
        :Out_LastLogOut,
        :Out_LastChangePwd,
        :Out_IsBlock,
        :Out_Type,
        :Out_DesgId,
        :Out_brid,
        :Out_branchname,
        :Out_brcompid,
        :Out_compname,
        :Out_typename,
        :Out_desgname,
        :Out_brcategory,
        :Out_role,
        :out_ErrorCode,
        :Out_ErrorMsg
      );
    END;
  `;

  const binds = {
    in_UserId: userId,
    in_password: password,
    Out_CompId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    Out_UserName: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 200 },
    Out_LastLogin: { dir: oracledb.BIND_OUT, type: oracledb.DATE },
    Out_LastLogOut: { dir: oracledb.BIND_OUT, type: oracledb.DATE },
    Out_LastChangePwd: { dir: oracledb.BIND_OUT, type: oracledb.DATE },
    Out_IsBlock: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 20 },
    Out_Type: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    Out_DesgId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    Out_brid: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    Out_branchname: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 200 },
    Out_brcompid: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    Out_compname: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 200 },
    Out_typename: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 },
    Out_desgname: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 200 },
    Out_brcategory: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    Out_role: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 200 },
    out_ErrorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    Out_ErrorMsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 4000 },
  };

  const result = await executeProcedure({ statement: plsql, binds, useTx: false });
  const out = result.outBinds;

  const errorCode = String(out.out_ErrorCode ?? '0');
  if (errorCode !== '-100') {
    return {
      success: false,
      errorCode,
      message: out.Out_ErrorMsg || 'Login failed',
    };
  }
const proofTypeResult = await executeQuery(
  `SELECT NUM_USERMST_USERPROOFTYPE 
   FROM etech_cm.aoup_usermst_def 
   WHERE VAR_USERMST_USERID = :userId`,
  { userId }
);
const userProofType = proofTypeResult.rows?.[0]?.NUM_USERMST_USERPROOFTYPE;
  // Fetch brand image
  let brandImage = null;
  try {
    // Remove leading 'E' if present in userId for brand image query
    let numericUserId = String(userId);
    if (numericUserId.startsWith('E')) {
      numericUserId = numericUserId.slice(1);
    }
    const brandImageResult = await executeQuery(
      `SELECT BASE64IMG FROM AOUP_ETECH_BANNER_IMAGE WHERE NUM_AGENCY_ID = :agencyId AND USERID = :userId AND IS_ACTIVE = 'Y'`,
      { agencyId: '100', userId: numericUserId }
    );
    brandImage = brandImageResult.rows?.[0]?.BASE64IMG || null;
  } catch (e) {
    brandImage = null;
  }

  const user = {
    userId,
    compId: out.Out_CompId,
    userName: out.Out_UserName,
    lastLogin: out.Out_LastLogin,
    lastLogout: out.Out_LastLogOut,
    lastChangePwd: out.Out_LastChangePwd,
    isBlocked: out.Out_IsBlock,
    type: out.Out_Type,
    desgId: out.Out_DesgId,
    brid: out.Out_brid,
    branchName: out.Out_branchname,
    brCompId: out.Out_brcompid,
    compName: out.Out_compname,
    typeName: out.Out_typename,
    desgName: out.Out_desgname,
    brCategory: out.Out_brcategory,
    role: out.Out_role,
    userProofType,
    brandImage
  };

  const token = jwt.sign(
    {
      sub: user.userId,
      userId: user.userId,
      brCategory: user.brCategory,
      brid: user.brid,
      role: user.role,
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
