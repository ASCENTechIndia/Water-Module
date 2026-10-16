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

// Billing Method Config

async function getBillingMethodTableDataRepo(payload) {
    const {
        ulbId
    } = payload;

    if (!ulbId) {
        return {
            success: false,
            message: "ULB ID is required"
        }
    }

    let sql = `
        select 
            num_billmethod_id billMethodId,
            var_billmethod_name BillMethodName,
            'N' previousStatus,
            'N' currentStatus  
        from aowt_billmethod_mas
        left join aowt_billmethodconfig_mas on num_billmethodconfig_billmethid=num_billmethod_id
        and num_billmethodconfig_ulbid= :ulbId
        order by var_billmethodconfig_flag     
    `

    const binds = {
        ulbId
    }

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function getBillingMethodTableDataStatusRepo(payload) {
    const {
        ulbId
    } = payload;

    if (!ulbId) {
        return {
            success: false,
            message: "ULB ID is required"
        }
    }

    let sql = `
        select 
            num_billmethodconfig_id BillMethodConfigId,
            num_billmethodconfig_billmethid BillMethodIdConfig,
            num_billmethodconfig_ulbid
        from aowt_billmethodconfig_mas 
        where 1=1 and var_billmethodconfig_flag='Y'
        and num_billmethodconfig_ulbid= :ulbId    
    `

    const binds = {
        ulbId
    }

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function billingMethodConfigSubmitRepo(payload) {
    const {
        in_userid,
        in_orgid,
        in_billmethodstr,
        in_mode,
        in_ipaddress,
        in_source,
    } = payload;

    let sql = `
        BEGIN
            water.aowt_billmethodconfig_ins(
                :in_userid,
                :in_orgid,
                :in_billmethodstr,
                :in_mode,
                :in_ipaddress,
                :in_source,
                :Out_ErrorCode,
                :Out_ErrorMsg
            );
        END;
    `

    const binds = {
        in_userid,
        in_orgid: Number(in_orgid),
        in_billmethodstr,
        in_mode: Number(in_mode),
        in_ipaddress,
        in_source,
        Out_ErrorCode: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        Out_ErrorMsg: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 200 }
    };

    const result = await executeQuery(sql, binds);

    return result.outBinds || [];
}

// Consumer Type Config

async function getConsumerTypeTableDataRepo(payload) {
    const {
        ulbId
    } = payload;

    if (!ulbId) {
        return {
            success: false,
            message: "ULB ID is required"
        }
    }

    let sql = `
        select 
            num_consumertype_id ConsTypeId,
            var_consumertype_name ConsTypeName, 
            'N' previousStatus,
            'N' currentStatus 
        from aowt_consumertype_mas
        left join aowt_consumertypeconfig_mas on num_consumertypeconfig_contypeid=num_consumertype_id
        and num_consumertypeconfig_ulbid= :ulbId
        where 1=1  order by var_consumertypeconfig_flag  
    `

    const binds = {
        ulbId
    }

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function getConsumerTypeTableDataStatusRepo(payload) {
    const {
        ulbId
    } = payload;

    if (!ulbId) {
        return {
            success: false,
            message: "ULB ID is required"
        }
    }

    let sql = `
        select 
            num_consumertypeconfig_id ConsTypeConId,
            num_consumertypeconfig_contypeid ConsTypeIdCon,
            num_consumertypeconfig_ulbid
        from aowt_consumertypeconfig_mas 
        where 1=1 and var_consumertypeconfig_flag='Y'
        and num_consumertypeconfig_ulbid=:ulbId
    `

    const binds = {
        ulbId
    }

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function consumerTypeConfigDataSubmitRepo(payload) {
    const {
        in_userid,
        in_orgid,
        in_consumertypestr,
        in_mode,
        in_ipaddress,
        in_source,
    } = payload;

    let sql = `
        BEGIN
            water.aowt_consumertypeconfig_ins(
                :in_userid,
                :in_orgid,
                :in_consumertypestr,
                :in_mode,
                :in_ipaddress,
                :in_source,
                :Out_ErrorCode,
                :Out_ErrorMsg
            );
        END;
    `

    const binds = {
        in_userid,
        in_orgid: Number(in_orgid),
        in_consumertypestr,
        in_mode: Number(in_mode),
        in_ipaddress,
        in_source,
        Out_ErrorCode: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        Out_ErrorMsg: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 200 }
    };

    const result = await executeQuery(sql, binds);

    return result.outBinds || [];
}

// Conn Code Config

async function getConnCodeTableDataRepo(payload) {
    const {
        ulbId
    } = payload;

    if (!ulbId) {
        return {
            success: false,
            message: "ULB ID is required"
        }
    }

    let sql = `
        select 
            num_conncode_id ConnCodeId,
            var_conncode_name ConnCodeName, 
            'N' previousStatus,
            'N' currentStatus 
        from aowt_ConnCode_mas
        left join aowt_ConnCodeconfig_mas on num_conncodeconfig_conncodeid=num_conncode_id
        and num_conncodeconfig_ulbid=:ulbId
        order by var_conncodeconfig_flag
    `

    const binds = {
        ulbId
    }

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function getConnCodeTableeDataStatusRepo(payload) {
    const {
        ulbId
    } = payload;

    if (!ulbId) {
        return {
            success: false,
            message: "ULB ID is required"
        }
    }

    let sql = `
        select 
            num_conncodeconfig_id ConnCodeConfId,
            num_conncodeconfig_conncodeid ConnCodeIdConf,
            num_conncodeconfig_ulbid
        from aowt_ConnCodeconfig_mas 
        where 1=1 and var_conncodeconfig_flag='Y'
        and num_conncodeconfig_ulbid= :ulbId
    `

    const binds = {
        ulbId
    }

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function connCodeConfigDataSubmitRepo(payload) {
    const {
        in_userid,
        in_orgid,
        in_ConnCodestr,
        in_mode,
        in_ipaddress,
        in_source,
    } = payload;
    let sql = `
        BEGIN
            water.aowt_ConnCodeconfig_ins(
                :in_userid,
                :in_orgid,
                :in_ConnCodestr,
                :in_mode,
                :in_ipaddress,
                :in_source,
                :Out_ErrorCode,
                :Out_ErrorMsg
            );
        END;
    `

    const binds = {
        in_userid,
        in_orgid: Number(in_orgid),
        in_ConnCodestr,
        in_mode: Number(in_mode),
        in_ipaddress,
        in_source,
        Out_ErrorCode: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        Out_ErrorMsg: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 200 }
    };

    const result = await executeQuery(sql, binds);

    return result.outBinds || [];
}

// Meter Owner Configuration

async function getMeterOwnerTableDataRepo(payload) {
    const {
        ulbId
    } = payload;

    if (!ulbId) {
        return {
            success: false,
            message: "ULB ID is required"
        }
    }

    let sql = `
        select 
            num_meterowner_id MeterOwnerId,
            var_meterowner_name MeterOwnerName, 
            'N' previousStatus,
            'N' currentStatus 
        from aowt_meterOwner_mas
        left join aowt_meterOwnerconfig_mas on num_meterownerconfig_meterownerid=num_meterowner_id 
        and num_meterownerconfig_ulbid= :ulbId
        where 1=1  order by var_meterownerconfig_flag
    `

    const binds = {
        ulbId
    }

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function getMeterOwnerTableDataStatusRepo(payload) {
    const {
        ulbId
    } = payload;

    if (!ulbId) {
        return {
            success: false,
            message: "ULB ID is required"
        }
    }

    let sql = `
        select 
            num_meterownerconfig_id MeterOwnerConfId,
            num_meterownerconfig_meterownerid MeterOwnerIdConf,
            num_meterownerconfig_ulbid
        from aowt_meterOwnerconfig_mas 
        where 1=1 and var_meterownerconfig_flag='Y'
        and num_meterownerconfig_ulbid= :ulbId
    `

    const binds = {
        ulbId
    }

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function meterOwnerConfigDataSubmitRepo(payload) {
    const {
        in_userid,
        in_orgid,
        in_MeterOwnerstr,
        in_mode,
        in_ipaddress,
        in_source,
    } = payload;
    let sql = `
        BEGIN
            water.aowt_MeterOwnerconfig_ins(
                :in_userid,
                :in_orgid,
                :in_MeterOwnerstr,
                :in_mode,
                :in_ipaddress,
                :in_source,
                :Out_ErrorCode,
                :Out_ErrorMsg
            );
        END;
    `

    const binds = {
        in_userid,
        in_orgid: Number(in_orgid),
        in_MeterOwnerstr,
        in_mode: Number(in_mode),
        in_ipaddress,
        in_source,
        Out_ErrorCode: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        Out_ErrorMsg: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 200 }
    };

    const result = await executeQuery(sql, binds);

    return result.outBinds || [];
}

// Bank Config

async function getBankTableDataRepo(payload) {
    const {
        ulbId
    } = payload;

    if (!ulbId) {
        return {
            success: false,
            message: "ULB ID is required"
        }
    }

    let sql = `
        select 
            num_bank_id,
            var_bank_name 
        from aowt_bank_mas
        left join aowt_bank_config c on num_bank_bankid = num_bank_id and c.num_bank_ulbid = :ulbId
        where 1=1 
        order by var_bank_flag
    `

    const binds = {
        ulbId
    }

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function getBankTableDataStatusRepo(payload) {
    const {
        ulbId
    } = payload;

    if (!ulbId) {
        return {
            success: false,
            message: "ULB ID is required"
        }
    }

    let sql = `
        select 
            num_bank_bankid confibank_id,
            var_bank_name  
        from aowt_bank_mas
        inner join  aowt_bank_config cbm  on cbm.num_bank_bankid = num_bank_id
        where cbm.var_bank_flag = 'Y' and cbm.num_bank_ulbid = :ulbId
    `

    const binds = {
        ulbId
    }

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function bankConfigDataSubmitRepo(payload) {
    const {
        in_UserId,
        in_ulbid,
        in_bankStr,
        in_Mode,
        in_ipaddress,
        in_source,
    } = payload;
    let sql = `
        BEGIN
            water.aowt_bankConfigMas_ins(
                :in_UserId,
                :in_ulbid,
                :in_bankStr,
                :in_Mode,
                :in_ipaddress,
                :in_source,
                :Out_ErrorCode,
                :Out_ErrorMsg
            );
        END;
    `

    const binds = {
        in_UserId,
        in_ulbid: Number(in_ulbid),
        in_bankStr,
        in_Mode: Number(in_Mode),
        in_ipaddress,
        in_source,
        Out_ErrorCode: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        Out_ErrorMsg: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 200 }
    };

    const result = await executeQuery(sql, binds);

    return result.outBinds || [];
}

// Billing Frequency 

async function getBillingFrequencyTableDataRepo(payload) {
    const {
        ulbId
    } = payload;

    if (!ulbId) {
        return {
            success: false,
            message: "ULB ID is required"
        }
    }

    let sql = `
        select distinct 
            (num_billfreq_id) billfreqid,
            var_billfreq_name ,
            'N' previousStatus,
            'N' currentStatus   
        from aowt_billfreq_mas
        left join aowt_billfreqconfig_mas on num_billfreqconfig_billfreqid=num_billfreq_id
        and num_billfreqconfig_ulbid= :ulbId
        where 1=1  
        order by billfreqid
    `

    const binds = {
        ulbId
    }

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function getBillingFrequencyTableDataStatusRepo(payload) {
    const {
        ulbId
    } = payload;

    if (!ulbId) {
        return {
            success: false,
            message: "ULB ID is required"
        }
    }

    let sql = `
        select 
            num_billfreqconfig_id, 
            num_billfreqconfig_billfreqid billfreqidconfig, 
            num_billfreqconfig_ulbid 
        from aowt_billfreqconfig_mas  
        where var_billfreqconfig_flag='Y' 
        and num_billfreqconfig_ulbid= :ulbId
    `

    const binds = {
        ulbId
    }

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function billingFrequencyDataSubmitRepo(payload) {
    const {
        in_UserId,
        in_ULBid,
        in_billfrequencyStr,
        in_Mode,
        in_ipaddress,
        in_source,
    } = payload;
    let sql = `
        BEGIN
            water.aowt_billfrequencyconfig_ins(
                :in_UserId,
                :in_ULBid,
                :in_billfrequencyStr,
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
        in_billfrequencyStr,
        in_Mode: Number(in_Mode),
        in_ipaddress,
        in_source,
        Out_errorCode: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        Out_ErrorMsg: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 200 }
    };

    const result = await executeQuery(sql, binds);

    return result.outBinds || [];
}

// Connection Size Config

async function getConnectionSizeTableDataRepo(payload) {
    const {
        ulbId
    } = payload;

    if (!ulbId) {
        return {
            success: false,
            message: "ULB ID is required"
        }
    }

    let sql = `
        select distinct 
            (num_connsize_id) connsizeid,var_connsize_name ,
            'N' previousStatus,
            'N' currentStatus , 
            var_connsize_activeflag 
        from aowt_connsize_mas
        left join aowt_connsizeconfig_mas on num_connsizeconfig_connsizeid=num_connsize_id
        and num_connsizeconfig_ulbid=:ulbId
        where 1=1  order by connsizeid
    `

    const binds = {
        ulbId
    }

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function getConnectionSizeTableDataStatusRepo(payload) {
    const {
        ulbId
    } = payload;

    if (!ulbId) {
        return {
            success: false,
            message: "ULB ID is required"
        }
    }

    let sql = `
        select 
            num_connsizeconfig_id, 
            num_connsizeconfig_connsizeid connsizeidconfig, 
            num_connsizeconfig_ulbid 
        from aowt_connsizeconfig_mas  
        where var_connsizeconfig_flag='Y'
        and num_connsizeconfig_ulbid=:ulbId
    `

    const binds = {
        ulbId
    }

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function connectionSizeDataSubmitRepo(payload) {
    const {
        in_UserId,
        in_ULBid,
        in_ConnSizeStr,
        in_Mode,
        in_ipaddress,
        in_source,
    } = payload;
    let sql = `
        BEGIN
            water.aowt_connsizeconfig_ins(
                :in_UserId,
                :in_ULBid,
                :in_ConnSizeStr,
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
        in_ConnSizeStr,
        in_Mode: Number(in_Mode),
        in_ipaddress,
        in_source,
        Out_errorCode: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        Out_ErrorMsg: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 200 }
    };

    const result = await executeQuery(sql, binds);

    return result.outBinds || [];
}

// Connection Status Config

async function getConnectionStatusTableDataRepo(payload) {
    const {
        ulbId
    } = payload;

    if (!ulbId) {
        return {
            success: false,
            message: "ULB ID is required"
        }
    }

    let sql = `
         select distinct
            (num_connstatus_id) connstatusid,
            var_connstatus_name,
            'N' previousStatus,
            'N' currentStatus   
        from aowt_connstatus_mas
        left join aowt_connstatusconfig_mas on num_connstatusconfig_connstatusid = num_connstatus_id
        and num_connstatusconfig_ulbid=:ulbId
        order by connstatusid
    `

    const binds = {
        ulbId
    }

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function getConnectionStatusTableDataStatusRepo(payload) {
    const {
        ulbId
    } = payload;

    if (!ulbId) {
        return {
            success: false,
            message: "ULB ID is required"
        }
    }

    let sql = `
        select 
            num_connstatusconfig_id,
            num_connstatusconfig_connstatusid connstatusidConfig,
            num_connstatusconfig_ulbid 
            from aowt_connstatusconfig_mas  
        where var_connstatusconfig_flag='Y'
        and num_connstatusconfig_ulbid=:ulbId
    `

    const binds = {
        ulbId
    }

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function connectionStatusDataSubmitRepo(payload) {
    const {
        in_UserId,
        in_ULBid,
        in_ConnStatusStr,
        in_Mode,
        in_ipaddress,
        in_source,
    } = payload;
    let sql = `
        BEGIN
            water.aowt_connstatusconfig_ins(
                :in_UserId,
                :in_ULBid,
                :in_ConnStatusStr,
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
        in_ConnStatusStr,
        in_Mode: Number(in_Mode),
        in_ipaddress,
        in_source,
        Out_errorCode: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        Out_ErrorMsg: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 200 }
    };

    const result = await executeQuery(sql, binds);

    return result.outBinds || [];
}

// Meter Gap Code Config

async function getMeterGapCodeTableDataRepo(payload) {
    const {
        ulbId
    } = payload;

    if (!ulbId) {
        return {
            success: false,
            message: "ULB ID is required"
        }
    }

    let sql = `
         select distinct 
            (num_gapcode_id) gapcodeid,
            var_gapcode_name ,
            'N' previousStatus,
            'N' currentStatus   
        from aowt_gapcode_mas
        left join aowt_gapcodeconfig_mas on num_gapcodeconfig_gapid=num_gapcode_id
        and num_gapcodeconfig_ulbid=:ulbId
    `

    const binds = {
        ulbId
    }

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function getMeterGapCodeTableDataStatusRepo(payload) {
    const {
        ulbId
    } = payload;

    if (!ulbId) {
        return {
            success: false,
            message: "ULB ID is required"
        }
    }

    let sql = `
        select 
            num_gapcodeconfig_id,
            num_gapcodeconfig_gapid gapcodeidconfig,
            num_gapcodeconfig_ulbid 
        from aowt_gapcodeconfig_mas  
        where var_gapcodeconfig_flag='Y'
        and num_gapcodeconfig_ulbid=:ulbId
    `

    const binds = {
        ulbId
    }

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function meterGapCodeDataSubmitRepo(payload) {
    const {
        in_UserId,
        in_ULBid,
        in_gapCodeStr,
        in_Mode,
        in_ipaddress,
        in_source,
    } = payload;
    let sql = `
        BEGIN
            water.aowt_gapcodeconfig_ins(
                :in_UserId,
                :in_ULBid,
                :in_gapCodeStr,
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
        in_gapCodeStr,
        in_Mode: Number(in_Mode),
        in_ipaddress,
        in_source,
        Out_errorCode: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        Out_ErrorMsg: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 200 }
    };

    const result = await executeQuery(sql, binds);

    return result.outBinds || [];
}

// Tax Config

async function getTaxConfigTableDataRepo(payload) {
    const {
        ulbId
    } = payload;

    if (!ulbId) {
        return {
            success: false,
            message: "ULB ID is required"
        }
    }

    let sql = `
        select distinct
            (num_tax_id) taxid,
            var_tax_ename,
            var_tax_code,
            'N' previousStatus,
            'N' currentStatus   
        from aowt_tax_mas
        left join aowt_taxconfig_mas on num_taxconfig_taxid = num_tax_id
        and num_taxconfig_ulbid=:ulbId
        order by taxid
    `

    const binds = {
        ulbId
    }

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function getTaxConfigTableDataStatusRepo(payload) {
    const {
        ulbId
    } = payload;

    if (!ulbId) {
        return {
            success: false,
            message: "ULB ID is required"
        }
    }

    let sql = `
        select 
            num_taxconfig_id,
            num_taxconfig_taxid taxconfigid,
            num_taxconfig_ulbid 
        from aowt_taxconfig_mas  
        where var_taxconfig_flag='Y'
        and num_taxconfig_ulbid=:ulbId
    `

    const binds = {
        ulbId
    }

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function taxConfigDataSubmitRepo(payload) {
    const {
        in_UserId,
        in_ULBid,
        in_TaxStr,
        in_Mode,
        in_ipaddress,
        in_source,
    } = payload;
    let sql = `
        BEGIN
            water.aowt_Taxconfig_ins(
                :in_UserId,
                :in_ULBid,
                :in_TaxStr,
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
        in_TaxStr,
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
    usageSubTypeConfigSubmitRepo,
    getBillingMethodTableDataRepo,
    getBillingMethodTableDataStatusRepo,
    billingMethodConfigSubmitRepo,
    getConsumerTypeTableDataRepo,
    getConsumerTypeTableDataStatusRepo,
    consumerTypeConfigDataSubmitRepo,
    getConnCodeTableDataRepo,
    getConnCodeTableeDataStatusRepo,
    connCodeConfigDataSubmitRepo,
    getMeterOwnerTableDataRepo,
    getMeterOwnerTableDataStatusRepo,
    meterOwnerConfigDataSubmitRepo,
    getBankTableDataRepo,
    getBankTableDataStatusRepo,
    bankConfigDataSubmitRepo,
    getBillingFrequencyTableDataRepo,
    getBillingFrequencyTableDataStatusRepo,
    billingFrequencyDataSubmitRepo,
    getConnectionSizeTableDataRepo,
    getConnectionSizeTableDataStatusRepo,
    connectionSizeDataSubmitRepo,
    getConnectionStatusTableDataRepo,
    getConnectionStatusTableDataStatusRepo,
    connectionStatusDataSubmitRepo,
    getMeterGapCodeTableDataRepo,
    getMeterGapCodeTableDataStatusRepo,
    meterGapCodeDataSubmitRepo,
    getTaxConfigTableDataRepo,
    getTaxConfigTableDataStatusRepo,
    taxConfigDataSubmitRepo
};
