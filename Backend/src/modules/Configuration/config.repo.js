const oracledb = require("oracledb");
const { executeQuery } = require("../../db/queryExecutor");
async function getULBDropdownRepo() {
    let sql = "select CORPORATIONNAME, CORPORATIONID from vw_corporation";

    const binds = {};

    const result = await executeQuery(sql, binds);
    return result.rows || [];
}

async function getPremiseTypeDataRepo(payload) {
    const { ulbId } = payload;

    if (!ulbId) {
        return {
            success: false,
            message: "ULB ID is required"
        };
    }

    let sql = `
        select num_premisetype_id PreTypeId,var_premisetype_name PreTypeName, 'N' previousstatus, 'N' currentstatus 
from aowt_premisetype_mas
left join aowt_premisetypeconfig_mas on num_premisetypeconfig_premisetypeid=num_premisetype_id
and num_premisetypeconfig_ulbid= :ulbId
where var_premisetype_activeflag='Y'  order by var_premisetypeconfig_activeflag
    `;

    const binds = {
        ulbId
    };

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function getPremiseTypeDataStatusRepo(payload) {
    const { ulbId } = payload;

    if (!ulbId) {
        return {
            success: false,
            message: "ULB ID is required"
        };
    }

    let sql = `
        select num_premisetypeconfig_id PreTypeConfigId,num_premisetypeconfig_premisetypeid ConfigPreTypeID,num_premisetypeconfig_ulbid ulbid
from aowt_premisetypeconfig_mas
where num_premisetypeconfig_ulbid  = :ulbId
order by var_premisetypeconfig_activeflag
    `;

    const binds = {
        ulbId
    };

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function premiseTypeConfigSubmitRepo(payload) {
    const {
        in_UserId,
        in_ULBid,
        in_PreTypeStr,
        in_Mode,
        in_ipaddress,
        in_source,
    } = payload;

    let sql = `
        BEGIN
            water.aowt_premisetypeconfig_ins(
                :in_UserId,
                :in_ULBid,
                :in_PreTypeStr,
                :in_Mode,
                :in_ipaddress,
                :in_source,
                :Out_errorCode,
                :Out_ErrorMsg
            );
        END;
    `

    const binds = {
        in_UserId,
        in_ULBid: Number(in_ULBid),
        in_PreTypeStr,
        in_Mode: Number(in_Mode),
        in_ipaddress,
        in_source,
        Out_errorCode: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        Out_ErrorMsg: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 200 }
    };

    const result = await executeQuery(sql, binds);

    return result.outBinds || [];
}

module.exports = { 
    getULBDropdownRepo, 
    getPremiseTypeDataRepo, 
    getPremiseTypeDataStatusRepo, 
    premiseTypeConfigSubmitRepo
};