const oracledb = require("oracledb");
const { executeQuery } = require("../../db/queryExecutor");

// Connection Master -> Connection Search

async function getConnectionSearchRepo(payload) {
    const { ulbId, connectionNumber } = payload;

    if (!ulbId) {
        throw new Error("ULB ID is required");
    }

    if (!connectionNumber) {
        throw new Error("Connection Number is required");
    }

    let sql = `
        SELECT 
            connid, 
            wardid, 
            zoneid, 
            blockid, 
            ulbid, 
            srno,
            seqno, 
            connno, 
            oldconnno, 
            ptnno, 
            applino, 
            applidt,
            appliaprovdt, 
            ownername, 
            aadhar, 
            address, 
            panno,
            mobno, 
            emailid, 
            statusid, 
            sequrityamt, 
            conntypeid,
            conncodeid, connsizeid, connusageid, connusagesubid,noofconn, nooffamily, consurmerid, bulituparea,
            meterno, metermake, connownerid, insatalldt,intilreading, plumberid, conndt, billmethoid,
            billcycleid, arrearsamt, BLOCKNAME,ZONENAME ,watertank, remark, pageno
        FROM vw_connsearch_det where  ulbid=:ulbId and connno=:connectionNumber
    `;

    const binds = {
        ulbId,
        connectionNumber
    };

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function getConnectionDetailsRepo(payload) {
    const { ulbId, connectionNumber, connectionId } = payload;

    if (!ulbId) {
        throw new Error("ULB ID is required");
    }

    if (!connectionNumber) {
        throw new Error("Connection Number is required");
    }

    if (!connectionId) {
        throw new Error("Connection ID is required");
    }

    let sql = `
        SELECT 
            connid, 
            wardid, 
            zoneid, 
            blockid, 
            ulbid, 
            srno,
            seqno, 
            connno, 
            oldconnno, 
            ptnno, 
            applino, 
            applidt,
            appliaprovdt, 
            ownername, 
            aadhar, 
            address, 
            panno,
            mobno, 
            emailid, 
            statusid, 
            sequrityamt, 
            conntypeid,
            conncodeid, connsizeid, connusageid, connusagesubid,noofconn, nooffamily, consurmerid, bulituparea,
            meterno, metermake, connownerid, insatalldt,intilreading, plumberid, conndt, billmethoid,
            billcycleid, arrearsamt, BLOCKNAME,ZONENAME ,watertank, remark, pageno
        FROM vw_connsearch_det where  ulbid=:ulbId and connno=:connectionNumber
        and connid =:connectionId
    `;

    const binds = {
        ulbId,
        connectionNumber,
        connectionId
    };

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}


async function getULBCodeRepo(payload) {
    const { ulbId } = payload;

    if (!ulbId) {
        throw new Error("ULB ID is required");
    }

    let sql = `
        select 
            var_corporation_code 
        from admins.aoma_corporation_mas
        where 1=1 
        and num_corporation_id=:ulbId
    `;

    const binds = {
        ulbId
    };

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function getWardDropdownRepo(payload) {
    const { ulbId } = payload;

    if (!ulbId) {
        throw new Error("ULB ID is required");
    }

    let sql = `
        select 
            var_ward_name,
            num_ward_id
        from vw_wardmas
        where num_ward_ulbid=:ulbId
        order by var_ward_name
    `;

    const binds = {
        ulbId
    };

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function getZoneDropdownRepo(payload) {
    const { wardId } = payload;

    if (!wardId) {
        throw new Error("Ward ID is required");
    }

    let sql = `
        select 
            var_zone_name, 
            num_zone_id  
        from vw_zonemas 
        where num_zone_wardid = :wardId
    `;

    const binds = {
        wardId
    };

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function getBlockDropdownRepo(payload) {
    const { zoneId } = payload;

    if (!zoneId) {
        throw new Error("Zone ID is required");
    }

    let sql = `
       select 
            var_block_name,
            num_block_id
        from vw_blockmas
        where num_block_zoneid=:zoneId
        order by var_block_name
    `;

    const binds = {
        zoneId
    };

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function getConnectionTypeDropdownRepo(payload) {
    const { ulbId } = payload;

    if (!ulbId) {
        throw new Error("ULB ID is required");
    }

    let sql = `
        select 
            CONNTYPE,
            conntypeid
        from vw_conntypeconfig
        where ulbid=:ulbId
        order by CONNTYPE
    `;

    const binds = {
        ulbId
    };

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function getConnectionStatusDropdownRepo(payload) {
    const { ulbId } = payload;

    if (!ulbId) {
        throw new Error("ULB ID is required");
    }

    let sql = `
        select 
            connstatusname,
            connstatusid
        from vw_connstatusconfig
        where ulbid=:ulbId
        order by connstatusname
    `;

    const binds = {
        ulbId
    };

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function getConnectionCodeMBMCDropdownRepo() {

    let sql = `
        select 
            var_conncode_name,
            num_conncode_id
        from vw_conncodemas
        where num_conncode_id in (221,222,223)
        order by var_conncode_name
    `;

    const binds = {};

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function getConnectionCodeDropdownRepo(payload) {
    const { ulbId } = payload;

    if (!ulbId) {
        throw new Error("ULB ID is required");
    }

    let sql = `
        select 
            var_conncode_name,
            num_conncode_id
        from vw_conncodemas
        where ULBID = :ulbId
        order by var_conncode_name
    `;

    const binds = {
        ulbId
    };

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function getTankDropdownRepo() {

    let sql = `
        select 
            var_watertank_name,
            num_watertank_id
        from aowt_watertank_mas
        order by var_watertank_name
    `;

    const binds = {};

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function getConnectionSizeDropdownRepo(payload) {
    const { ulbId } = payload;

    if (!ulbId) {
        throw new Error("ULB ID is required");
    }

    let sql = `
        select 
            connsizename,
            connsizeid
        from vw_connsizeconfigmas
        where ulbid= :ulbId
        order by connsizename
    `;

    const binds = {
        ulbId
    };

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function getUsageTypeDropdownRepo(payload) {
    const { ulbId } = payload;

    if (!ulbId) {
        throw new Error("ULB ID is required");
    }

    let sql = `
        select 
            usagetypename,
            usagetypeid
        from vw_usagetypemas
        where ulbid=:ulbId
        order by usagetypename
    `;

    const binds = {
        ulbId
    };

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function getSubUsageTypeDropdownRepo(payload) {
    const { ulbId, usageTypeId } = payload;

    if (!ulbId) {
        throw new Error("ULB ID is required");
    }

    if (!usageTypeId) {
        throw new Error("Usage Type ID is required");
    }

    let sql = `
        select 
            usagesubtypename,
            usagesubtypeid
        from vw_usagesubtypemas
        where usagetypeid=:usageTypeId
        and ulbid=:ulbId
        order by usagesubtypename
    `;

    const binds = {
        ulbId,
        usageTypeId
    };

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function getConsumerTypeDropdownRepo(payload) {
    const { ulbId } = payload;

    if (!ulbId) {
        throw new Error("ULB ID is required");
    }

    let sql = `
        select 
            consumertypename,
            consumertypeid
        from vw_consumertypemas
        where ulbid= :ulbId
        order by consumertypename
    `;

    const binds = {
        ulbId
    };

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function getMeterOwnerDropdownRepo(payload) {
    const { ulbId } = payload;

    if (!ulbId) {
        throw new Error("ULB ID is required");
    }

    let sql = `
        select 
            meterownerename,
            meterownereid
        from vw_meterowneremas
        where ulbid=:ulbId
        order by meterownerename
    `;

    const binds = {
        ulbId
    };

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function getPlumberDropdownRepo() {

    let sql = `
        select 
            var_plumber_name,
            num_plumber_id
        from vw_plumbermas
        order by var_plumber_name
    `;

    const binds = {};

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function getBillFrequencyDropdownRepo(payload) {

    const { ulbId } = payload;

    if (!ulbId) {
        throw new Error("ULB ID is required");
    }

    let sql = `
        select 
            var_billfreq_name, 
            num_billfreq_id  
        from vw_billfreq 
        where num_billfreqconfig_ulbid =:ulbId
        and  var_billfreq_activeflag = 'Y'
    `;

    const binds = {
        ulbId
    };

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}


async function getBillingMethodDropdownKNPRepo(payload) {

    const { ulbId } = payload;

    if (!ulbId) {
        throw new Error("ULB ID is required");
    }

    let sql = `
        select 
            var_billmethod_name, 
            num_billmethod_id  
        from vw_billingmethodmas_khmc 
        where ulbid =:ulbId
        order by var_billmethod_name
    `;

    const binds = {
        ulbId
    };

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function getBillingMethodDropdownRepo() {
    let sql = `
        select 
            var_billingmethod_name, 
            num_billingmethod_id  
        from vw_billingmethodmas 
        order by var_billingmethod_name
    `
    const binds = {};

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function getConnectionNumberGenRepo(payload) {

    const { ulbId } = payload;

    if (!ulbId) {
        throw new Error("ULB ID is required");
    }

    let sql = `
        select 
            num_connogen_flag 
        from AOwt_ConNoGen_Config 
        where num_connogen_ulbid=:ulbId
    `;

    const binds = {
        ulbId
    };

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function getConnTypeCodeRepo(payload) {
    const { ulbId, connTypeId } = payload;

    if (!ulbId) {
        throw new Error("ULB ID is required");
    }

    if (!connTypeId) {
        throw new Error("Connection Type ID is required");
    }

    let sql = `
        select distinct 
            conntypecode 
        from vw_conntypeconfig 
        where conntypeid=:connTypeId and ulbid=:ulbId
    `;

    const binds = {
        ulbId,
        connTypeId
    };

    const result = await executeQuery(sql, binds);

    return result.rows || [];
}

async function connectionNumberDetailsSubmitRepo(payload) {

    const { 
        in_UserId,
        in_ulbid,
        in_Mode,
        in_connid,
        in_wardid,
        in_zoneid,
        in_blockid,
        in_srno,
        in_seqno,
        in_connno,
        in_oldconnno,
        in_ptnno,
        in_applino,
        in_applidt,
        in_appliaprovdt,
        in_ownername,
        in_uid,
        in_address,
        in_panno,
        in_mobno,
        in_emailid,
        in_statusid,
        in_sequrityamt,
        in_conntypeid,
        in_conncodeid,
        in_connsizeid,
        in_connusageid,
        in_connusagesubid,
        in_noofconn,
        in_nooffamily,
        in_consurmerid,
        in_bulituparea,
        in_meterno,
        in_metermake,
        in_connownerid,
        in_insatalldt,
        in_intilreading,
        in_plumberid,
        in_conndt,
        in_billmethoid,
        in_billcycleid,
        in_arrearsamt,
        in_Watertank,
        in_Remark,
        in_pageno,
        in_ipaddress,
        in_source    
    } = payload;


    let sql = `
        BEGIN 
            water.aowt_conn_ins(
                :in_UserId,
                :in_ulbid,
                :in_Mode,
                :in_connid,
                :in_wardid,
                :in_zoneid,
                :in_blockid,
                :in_srno,
                :in_seqno,
                :in_connno,
                :in_oldconnno,
                :in_ptnno,
                :in_applino,
                :in_applidt,
                :in_appliaprovdt,
                :in_ownername,
                :in_uid,
                :in_address,
                :in_panno,
                :in_mobno,
                :in_emailid,
                :in_statusid,
                :in_sequrityamt,
                :in_conntypeid,
                :in_conncodeid,
                :in_connsizeid,
                :in_connusageid,
                :in_connusagesubid,
                :in_noofconn,
                :in_nooffamily,
                :in_consurmerid,
                :in_bulituparea,
                :in_meterno,
                :in_metermake,
                :in_connownerid,
                :in_insatalldt,
                :in_intilreading,
                :in_plumberid,
                :in_conndt,
                :in_billmethoid,
                :in_billcycleid,
                :in_arrearsamt,
                :in_Watertank,
                :in_Remark,
                :in_pageno,
                :in_ipaddress,
                :in_source
                :Out_ErrorCode,
                :Out_ErrorMsg
            );
        END;
    `;

    const binds = {
        in_UserId,
        in_ulbid: Number(in_ulbid),
        in_Mode: Number(in_Mode),
        in_connid: Number(in_connid),
        in_wardid: Number(in_wardid),
        in_zoneid: Number(in_zoneid),
        in_blockid: Number(in_blockid),
        in_srno: Number(in_srno),
        in_seqno: Number(in_seqno),
        in_connno,
        in_oldconnno,
        in_ptnno,
        in_applino,
        in_applidt,
        in_appliaprovdt,
        in_ownername,
        in_uid: Number(in_uid),
        in_address,
        in_panno,
        in_mobno: Number(in_mobno),
        in_emailid,
        in_statusid: Number(in_statusid),
        in_sequrityamt: Number(in_sequrityamt),
        in_conntypeid: Number(in_conntypeid),
        in_conncodeid: Number(in_conncodeid),
        in_connsizeid: Number(in_connsizeid),
        in_connusageid: Number(in_connusageid),
        in_connusagesubid: Number(in_connusagesubid),
        in_noofconn: Number(in_noofconn),
        in_nooffamily: Number(in_nooffamily),
        in_consurmerid: Number(in_consurmerid),
        in_bulituparea: Number(in_bulituparea),
        in_meterno,
        in_metermake,
        in_connownerid: Number(in_connownerid),
        in_insatalldt,
        in_intilreading: Number(in_intilreading),
        in_plumberid: Number(in_plumberid),
        in_conndt,
        in_billmethoid: Number(in_billmethoid),
        in_billcycleid: Number(in_billcycleid),
        in_arrearsamt: Number(in_arrearsamt),
        in_Watertank: Number(in_Watertank),
        in_Remark,
        in_pageno: Number(in_pageno),
        in_ipaddress,
        in_source,
        Out_ErrorCode: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        Out_ErrorMsg: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 200 }   
    };

    const result = await executeQuery(sql, binds);

    return result.outBinds || [];
}

module.exports = {
    getConnectionSearchRepo,
    getULBCodeRepo,
    getWardDropdownRepo,
    getZoneDropdownRepo,
    getBlockDropdownRepo,
    getConnectionTypeDropdownRepo,
    getConnectionStatusDropdownRepo,
    getConnectionCodeMBMCDropdownRepo,
    getConnectionCodeDropdownRepo,
    getTankDropdownRepo,
    getConnectionSizeDropdownRepo,
    getUsageTypeDropdownRepo,
    getSubUsageTypeDropdownRepo,
    getConsumerTypeDropdownRepo,
    getMeterOwnerDropdownRepo,
    getPlumberDropdownRepo,
    getBillFrequencyDropdownRepo,
    getBillingMethodDropdownRepo,
    getBillingMethodDropdownKNPRepo,
    getConnectionNumberGenRepo,
    getConnectionDetailsRepo,
    getConnTypeCodeRepo,
    connectionNumberDetailsSubmitRepo
};