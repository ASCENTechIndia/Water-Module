const oracledb = require("oracledb");
const { executeQuery } = require("../../db/queryExecutor");
async function getULBDropdownRepo() {
    let sql = "select CORPORATIONNAME, CORPORATIONID from vw_corporation";

    const binds = {};

    const result = await executeQuery(sql, binds);
    return result.rows || [];
}

// Premise Type Configuration

async function getPremiseTypeDataRepo(payload) {
    const { ulbId } = payload;

    if (!ulbId) {
        return {
            success: false,
            message: "ULB ID is required",
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
        ulbId,
    };

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function getPremiseTypeDataStatusRepo(payload) {
    const { ulbId } = payload;

    if (!ulbId) {
        return {
            success: false,
            message: "ULB ID is required",
        };
    }

    let sql = `
        select num_premisetypeconfig_id PreTypeConfigId,num_premisetypeconfig_premisetypeid ConfigPreTypeID,num_premisetypeconfig_ulbid ulbid
from aowt_premisetypeconfig_mas
where num_premisetypeconfig_ulbid  = :ulbId
order by var_premisetypeconfig_activeflag
    `;

    const binds = {
        ulbId,
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
    `;

    const binds = {
        in_UserId,
        in_ULBid: Number(in_ULBid),
        in_PreTypeStr,
        in_Mode: Number(in_Mode),
        in_ipaddress,
        in_source,
        Out_errorCode: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        Out_ErrorMsg: {
            type: oracledb.STRING,
            dir: oracledb.BIND_OUT,
            maxSize: 200,
        },
    };

    const result = await executeQuery(sql, binds);

    return result.outBinds || [];
}

// Usage Type Configuration

async function getUsageTypeTableDataRepo(payload) {
    const { ulbId } = payload;

    if (!ulbId) {
        return {
            success: false,
            message: "ULB ID is required"
        }
    }

    let sql = `
        select num_usagetype_id UsageTypeId,var_usagetype_name UsageTypeName,'N' previousstatus, 'N' currentstatus from aowt_usagetype_mas 
        left join aowt_usagetypeconfig_mas on num_usagetypeconfig_usageid=num_usagetype_id 
        and num_usagetypeconfig_ulbid= :ulbId
        order by var_usagetypeconfig_flag 
    `

    const binds = {
        ulbId
    }

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function getUsageTypeTableDataStatusRepo(payload) {
    const { ulbId } = payload;

    if (!ulbId) {
        return {
            success: false,
            message: "ULB ID is required"
        }
    }

    let sql = `
        select num_usagetypeconfig_id UsageTypeConfigId,num_usagetypeconfig_usageid UsageConfigId,num_usagetypeconfig_ulbid ulbid from aowt_usagetypeconfig_mas
        where num_usagetypeconfig_ulbid= :ulbId
        order by var_usagetypeconfig_flag
    `

    const binds = {
        ulbId
    }

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function usageTypeConfigSubmitRepo(payload) {
    const {
        in_UserId,
        in_ULBid,
        in_UsageTypeStr,
        in_Mode,
        in_ipaddress,
        in_source,
    } = payload;

    let sql = `
        BEGIN
            water.aowt_usagetypeconfig_ins(
                :in_UserId,
                :in_ULBid,
                :in_UsageTypeStr,
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
        in_UsageTypeStr,
        in_Mode: Number(in_Mode),
        in_ipaddress,
        in_source,
        Out_errorCode: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        Out_ErrorMsg: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 200 }
    };

    const result = await executeQuery(sql, binds);

    return result.outBinds || [];
}

// Usage Sub Type Config

async function getUsageTypeDropdownRepo() {

    // if (!ulbId) {
    //     return {
    //         success: false,
    //         message: "ULB ID is required"
    //     }
    // }

    let sql = `
        select 
            var_usagetype_name, 
            num_usagetype_id 
        from aowt_usagetype_mas   
    `

    const binds = {}

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function getUsageSubTypeTableDataRepo(payload) {
    const {
        ulbId,
        usageTypeId
    } = payload;

    if (!ulbId) {
        return {
            success: false,
            message: "ULB ID is required"
        }
    }
    if (!usageTypeId) {
        return {
            success: false,
            message: "Usage Type ID is required"
        }
    }

    let sql = `
        select 
            num_usagesubtype_id UsageSubTypeId,
            var_usagesubtype_name UsageSubTypeName,
            'N' previousstatus,
            'N' currentstatus 
        from aowt_usagesubtype_mas
        left Join aowt_usagesubtypeconfig_mas 
        on num_usagesubtypeconfig_usagetypeid=num_usagesubtype_usagetypeid and num_usagesubtypeconfig_usagesubid=num_usagesubtype_id
        and num_usagesubtypeconfig_ulbid= :ulbId
        where num_usagesubtype_usagetypeid= :usageTypeId     
    `

    const binds = {
        ulbId,
        usageTypeId
    }

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function getUsageSubTypeTableDataStatusRepo(payload) {
    const {
        ulbId,
        usageTypeId
    } = payload;

    if (!ulbId) {
        return {
            success: false,
            message: "ULB ID is required"
        }
    }
    if (!usageTypeId) {
        return {
            success: false,
            message: "Usage Type ID is required"
        }
    }

    let sql = `
        select 
            num_usagesubtypeconfig_id UsageSubTypeConfigId,
            num_usagesubtypeconfig_usagesubid UsageSubId,
            num_usagesubtypeconfig_ulbid ulbid
        from aowt_usagesubtypeconfig_mas  
        where var_usagesubtypeconfig_flag='Y' 
        and num_usagesubtypeconfig_ulbid= :ulbId
        and num_usagesubtypeconfig_usagetypeid = :usageTypeId     
    `

    const binds = {
        ulbId,
        usageTypeId
    }

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function usageSubTypeConfigSubmitRepo(payload) {
    const {
        in_UserId,
        in_Orgid,
        in_UsageTypeID,
        in_usagesubstr,
        in_Mode,
        in_ipaddress,
        in_source,
    } = payload;

    let sql = `
        BEGIN
            water.aowt_usagesubtypeconfig_ins(
                :in_UserId,
                :in_Orgid,
                :in_UsageTypeID,
                :in_usagesubstr,
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
        in_Orgid: Number(in_Orgid),
        in_UsageTypeID: Number(in_UsageTypeID),
        in_usagesubstr,
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
    premiseTypeConfigSubmitRepo,
    getUsageTypeTableDataRepo,
    getUsageTypeTableDataStatusRepo,
    usageTypeConfigSubmitRepo,
    getUsageTypeDropdownRepo,
    getUsageSubTypeTableDataRepo,
    getUsageSubTypeTableDataStatusRepo,
    usageSubTypeConfigSubmitRepo
};
