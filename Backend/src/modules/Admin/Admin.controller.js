const {
  locationTrackingService,
  lastLoginService,
  bucketSetterService,
  getUsersWithPincodesService,
  unassignCasesService,
  matrixDistanceInsertionService, accCountService, allocateAccService
} = require('./Admin.service');
const { auditLog } = require('../../utils/audit-log');
const { logApiSuccess, logApiError } = require('../../utils/log');

function requestMeta(req) {
  return {
    ip: req.ip,
    method: req.method,
    path: req.originalUrl,
  };
}

async function locationTrackingHandler(req, res, next) {
  try {
     const { userId, cDate } = req.query; 
    const rows = await locationTrackingService(userId, cDate);
    logApiSuccess(req, 200, { count: rows?.length || 0 }, `Location tracking data retrieved`);
    return res.ok(rows);
  } catch (error) {
    logApiError(req, 500, error.message, 'Location tracking error');
    return next(error);
  }
}

async function lastLoginHandler(req, res, next) {
  try {
     const { userId } = req.query; 
    const rows = await lastLoginService(userId);
    logApiSuccess(req, 200, { count: rows?.length || 0 }, `Last login data retrieved`);
    return res.ok(rows);
  } catch (error) {
    logApiError(req, 500, error.message, 'Last login error');
    return next(error);
  }
}

async function bucketSetterHandler(req, res, next) {
  try {
    const result = await bucketSetterService();

    logApiSuccess(
      req,
      200,
      { count: result?.p_updated_count || 0 },
      result.message || "Bucket Setter completed"
    );

    return res.ok(result);

  } catch (error) {
    logApiError(req, 500, error.message, 'Bucket Setter error');
    return next(error);
  }
}

async function getUsersWithPincodesHandler(req, res, next) {
  try {
    const users = await getUsersWithPincodesService();
    logApiSuccess(
      req,
      200,
      { count: users?.length || 0 },
      'Users with pincodes retrieved'
    );
    return res.ok(users);
  } catch (error) {
    logApiError(req, 500, error.message, 'Get users with pincodes error');
    return next(error);
  }
}

async function unassignCasesHandler(req, res, next) {
  try {
    const result = await unassignCasesService(req.body.selections);
    logApiSuccess(
      req,
      200,
      { rowsUpdated: result?.totalRowsUpdated || 0 },
      result.message || 'Cases unassigned'
    );
    return res.ok(result);
  } catch (error) {
    const status = error?.statusCode || 500;
    if (status < 500) {
      return res.fail(error.message, status);
    }
    logApiError(req, 500, error.message, 'Unassign cases error');
    return next(error);
  }
}
  
async function matrixDistanceInsertionHandler(req, res, next) {
  try {
    const result = await matrixDistanceInsertionService();
    logApiSuccess(
      req,
      200,
      { rowsUpdated: result?.totalRowsAffected || 0 },
      result.message || 'Matrix distance insertion completed'
    );
    return res.ok(result);
  } catch (error) {
    logApiError(req, 500, error.message, 'Matrix distance insertion error');
    return next(error);
  }
}
async function getAccCountHandler(req, res, next) {
  try {
    const rows = await accCountService();
    logApiSuccess(req, 200, { count: rows?.length || 0 }, `Counts retrieved`);
    return res.ok(rows);
  } catch (error) {
    logApiError(req, 500, error.message, 'Counts error');
  }
}

async function allocateAccountHandler(req, res, next) {
   try {
    // const payload = req.body;
    const out = await allocateAccService();

    const isSuccess = String(out.Out_errorCode) === '9999';
    if (isSuccess) {
      logApiSuccess(req, 200, `Account Allocation Successful`);
    } else {
      logApiError(req, 400, out.Out_ErrorMsg, `Account Allocation failed`);
    }

    auditLog({
      action: 'ACCOUNT_ALLOCATION',
      actor: req.user?.userId || 'system',
 module: 'users',
      entityId: out.Out_User,
      status: isSuccess ? 'SUCCESS' : 'FAILED',
      details: { outErrorCode: out.Out_errorCode, outErrorMsg: out.Out_ErrorMsg },
      requestMeta: requestMeta(req),
    });

    return res.ok(out);
  } catch (error) {
logApiError(req, 500, error.message, 'Account Allocation error');
 return next(error);
  }
}

module.exports = {
  locationTrackingHandler,
  lastLoginHandler,
  bucketSetterHandler,
  getUsersWithPincodesHandler,
  unassignCasesHandler,
  matrixDistanceInsertionHandler, getAccCountHandler, allocateAccountHandler
}
