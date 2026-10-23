import React, { useState, useEffect } from "react";
import Layout from "../../../Components/Layout";
import Label from "../../../Components/Label";
import { useForm, useFieldArray } from "react-hook-form";
import { useLoader } from "../../../Context/LoaderContext";
import { useAuth } from "../../../Context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import apiService from "../../../../apiService";
import ConfigTable from "../../../Components/ConfigTable.jsx";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table.jsx";
import GetIPAddress from "../../../utils/ipHelper.jsx";
import config from "../../../utils/config.jsx";


const getDate = (dateString) => {
    const d = new Date(dateString);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
};

const formatDateForPayload = (dateString) => {
    const [year, month, day] = dateString.split("-");
    const monthMap = {
        "1": "Jan",
        "2": "Feb",
        "3": "Mar",
        "4": "Apr",
        "5": "May",
        "6": "Jun",
        "7": "Jul",
        "8": "Aug",
        "9": "Sep",
        "10": "Oct",
        "11": "Nov",
        "12": "Dec"
    };
    let date = `${day}-${monthMap[month]}-${year}`;
    return date;
}

const FrmConnectionMst = () => {
    const { user } = useAuth();
    const ulbId = user?.ulbId;
    const userId = user?.userId;
    const prabhagId = user?.prabhagID;
    const deptId = user?.deptId;
    const { setLoading } = useLoader();
    const navigate = useNavigate();
    const location = useLocation();

    const { mode = 1, connectionNumber = "", connectionId = "" } = location.state;
    const {
        register,
        control,
        setValue,
        handleSubmit,
        reset,
        getValues,
        formState: { errors },
        watch,
    } = useForm({
        defaultValues: {
            ward: "",
            zone: "",
            block: "",
            connectionNumber: "",
            registerNumber: "",
            ptnNumber: "",
            pageNumber: "",

            // Consumer Details
            applicationNumber: "",
            applicationDate: "",
            approveDate: "",
            applicationName: "",
            aadharNumber: "",
            address: "",
            panNumber: "",
            mobileNumber: "",
            email: "",
            status: "",
            securityDeposit: "",
            connectionType: "",
            connectionCode: "",

            // Connection Details
            connectionSize: "",
            usageType: "",
            usageSubType: "",
            numberOfConnection: "",
            numberOfFamilies: "",
            consumerType: "",
            buildUpArea: "",
            meterNumber: "",
            meterMake: "",
            meterOwnerShip: "",
            instDate: "",
            initialReading: "",
            connectionDate: "",
            plumber: "",
            billingType: "",
            billingMethod: "",
            waterTank: "",
            remark: ""
        },
    });

    const watchWard = watch("ward");
    const watchZone = watch("zone");
    const watchUsage = watch("usageType");
    const watchConnectionType = watch("connectionType");

    const [editData, setEditData] = useState(null);
    const [baseDropdownsLoaded, setBaseDropdownsLoaded] = useState(false);
    const [connCode, setConnCode] = useState("");

    const [ulbCode, setULBCode] = useState("");
    const [connectionGenFlag, setConnectionGenFlag] = useState("");

    const [wardOptions, setWardOptions] = useState([]);
    const [zoneOptions, setZoneOptions] = useState([]);
    const [blockOptions, setBlockOptions] = useState([]);

    // Consumer Details Dropdown
    const [statusOptions, setStatusOptions] = useState([]);
    const [connectionTypeOptions, setConnectionTypeOptions] = useState([])
    const [connectionCodeOptions, setConnectionCodeOptions] = useState([]);

    // Connection Details Dropdown
    const [connectionSizeOptions, setConnectionSizeOptions] = useState([]);
    const [usageTypeOptions, setUsageTypeOptions] = useState([]);
    const [usageSubTypeOptions, setUsageSubTypeOptions] = useState([]);
    const [consumerTypeOptions, setConsumerTypeOptions] = useState([]);
    const [meterOwnerShipOptions, setMeterOwnerShipOptions] = useState([]);
    const [billingTypeOptions, setBillingTypeOptions] = useState([]);
    const [billingMethodOptions, setBillingMethodOptions] = useState([]);
    const [waterTankOptions, setWaterTankOptions] = useState([]);
    const [plumberOptions, setPlumberOptions] = useState([]);


    // Tab Button
    const [consumerDetailsTabOpen, setConsumerDetailsTabOpen] = useState(true);
    const [connectionDetailsTabOpen, setConnectionDetailsTabOpen] = useState(false);

    const fetchULBCode = async () => {
        try {
            const response = await apiService.get(`/water/ulbcode?ulbId=${ulbId}`);

            if (response.success && Array.isArray(response.data) && response.data.length > 0) {
                const data = response.data[0];
                setULBCode(data.VAR_CORPORATION_CODE);
            } else {
                setULBCode("");
            }
        } catch (error) {
            console.error(error);
            setULBCode("");
        }
    }

    const fetchConnectionGenFlag = async () => {
        try {
            const response = await apiService.get(`/water/connectionnogen?ulbId=${ulbId}`);

            if (response.success && Array.isArray(response.data) && response.data.length > 0) {
                const data = response.data[0];
                setConnectionGenFlag(data.NUM_CONNOGEN_FLAG);
            } else {
                setConnectionGenFlag("");
            }
        } catch (error) {
            console.error(error);
            setConnectionGenFlag("");
        }
    }

    // const fetchConnectionDetails = async () => {
    //     try {
    //         const response = await apiService.get(`/water/getConnectionDetails?ulbId=${ulbId}&connectionNumber=${connectionNumber}&connectionId=${connectionId}`);

    //         if (response.success && Array.isArray(response.data) && response.data.length > 0) {
    //             const data = response.data[0];

    //             setValue("ward", data.WARDID ?? "");
    //             setValue("zone", data.ZONEID ?? "");
    //             setValue("block", data.BLOCKID ?? "");
    //             setValue("connectionNumber", data.CONNNO ?? "");
    //             setValue("registerNumber", data.OLDCONNNO ?? "");
    //             setValue("ptnNumber", data.PTNNO ?? "");
    //             setValue("pageNumber", data.PAGENO ?? "");
    //             setValue("applicationNumber", data.APPLINO ?? "");
    //             setValue("applicationDate", getDate(data.APPLIDT) ?? "");
    //             setValue("approveDate", getDate(data.APPLIAPROVDT) ?? "");
    //             setValue("applicationName", data.OWNERNAME ?? "");
    //             setValue("aadharNumber", data.AADHAR ?? "");
    //             setValue("address", data.ADDRESS ?? "");
    //             setValue("panNumber", data.PANNO ?? "");
    //             setValue("mobileNumber", data.MOBNO ?? "");
    //             setValue("email", data.EMAILID ?? "");
    //             setValue("status", data.STATUSID ?? "");
    //             setValue("securityDeposit", data.SEQURITYAMT ?? "");
    //             setValue("connectionType", data.CONNTYPEID ?? "");
    //             setValue("connectionCode", data.CONNCODEID ?? "");
    //             setValue("connectionSize", data.CONNSIZEID ?? "");
    //             setValue("usageType", data.CONNUSAGEID ?? "");
    //             setValue("usageSubType", data.CONNUSAGESUBID ?? "");
    //             setValue("numberOfConnection", data.NOOFCONN ?? "");
    //             setValue("consumerType", data.CONSURMERID ?? "");
    //             setValue("meterNumber", data.METERNO ?? "");
    //             setValue("meterMake", data.METERMAKE ?? "");
    //             setValue("meterOwnerShip", data.CONNOWNERID ?? "");
    //             setValue("instDate", getDate(data.INSATALLDT) ?? "");
    //             setValue("connectionDate", getDate(data.CONNDT) ?? "");
    //             setValue("billingType", data.BILLCYCLEID ?? "");
    //             setValue("billingMethod", data.BILLMETHOID ?? "");
    //             setValue("waterTank", data.WATERTANK ?? "");
    //             setValue("remark", data.REMARK ?? "");
    //             setValue("numberOfFamilies", data.NOOFFAMILY ?? "");
    //             setValue("buildUpArea", data.BULITUPAREA ?? "");
    //             setValue("plumber", data.PLUMBERID ?? "")
    //         } else {

    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    const fetchConnectionDetails = async () => {
        try {
            const response = await apiService.get(
                `/water/getConnectionDetails?ulbId=${ulbId}&connectionNumber=${connectionNumber}&connectionId=${connectionId}`
            );

            if (
                response.success &&
                Array.isArray(response.data) &&
                response.data.length > 0
            ) {
                setEditData(response.data[0]);
            }
        } catch (error) {
            console.error("Error fetching connection details:", error);
        }
    };


    const fetchDropdowns = async (endpoint, valueKey, labelKey, setter) => {
        try {
            setLoading(true);

            const response = await apiService.get(endpoint);

            if (response.success && Array.isArray(response.data)) {
                const formatted = response.data.map(item => ({
                    label: item[labelKey],
                    value: item[valueKey]
                }));

                setter(formatted);
            } else {
                setter([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchConnTypeCode = async () => {
        try {
            const response = await apiService.get(
                `/water/getConnTypeCode?ulbId=${ulbId}&connTypeId=${encodeURIComponent(watchConnectionType)}`
            );

            if (
                response.success &&
                Array.isArray(response.data) &&
                response.data.length > 0
            ) {
                setConnCode(response.data[0].CONNTYPECODE);
            } else {
                setConnCode("");
            }
        } catch (error) {
            setConnCode("");
            console.error("Error fetching connection details:", error);
        }
    };


    useEffect(() => {
        if (ulbId && watchConnectionType) {
            fetchConnTypeCode();
        }
    }, [ulbId, watchConnectionType])

    useEffect(() => {
        const loadDropdowns = async () => {
            if (!ulbId) return;

            await fetchULBCode();

            await fetchDropdowns(
                `/water/wardDropdown?ulbId=${ulbId}`,
                "NUM_WARD_ID",
                "VAR_WARD_NAME",
                setWardOptions
            );

            await fetchDropdowns(
                `/water/connectionTypeDropdown?ulbId=${ulbId}`,
                "CONNTYPEID",
                "CONNTYPE",
                setConnectionTypeOptions
            );

            await fetchDropdowns(
                `/water/connectionStatusDropdown?ulbId=${ulbId}`,
                "CONNSTATUSID",
                "CONNSTATUSNAME",
                setStatusOptions
            );

            await fetchDropdowns(
                `/water/connectionCodeDropdown?ulbId=${ulbId}`,
                "NUM_CONNCODE_ID",
                "VAR_CONNCODE_NAME",
                setConnectionCodeOptions
            );

            await fetchDropdowns(
                `/water/tankDropdown`,
                "NUM_WATERTANK_ID",
                "VAR_WATERTANK_NAME",
                setWaterTankOptions
            );

            await fetchDropdowns(
                `/water/connectionSizeDropdown?ulbId=${ulbId}`,
                "CONNSIZEID",
                "CONNSIZENAME",
                setConnectionSizeOptions
            );

            await fetchDropdowns(
                `/water/usageTypeDropdown?ulbId=${ulbId}`,
                "USAGETYPEID",
                "USAGETYPENAME",
                setUsageTypeOptions
            );

            await fetchDropdowns(
                `/water/consumerTypeDropdown?ulbId=${ulbId}`,
                "CONSUMERTYPEID",
                "CONSUMERTYPENAME",
                setConsumerTypeOptions
            );

            await fetchDropdowns(
                `/water/meterOwnerDropdown?ulbId=${ulbId}`,
                "METEROWNEREID",
                "METEROWNERENAME",
                setMeterOwnerShipOptions
            );

            await fetchDropdowns(
                `/water/plumberDropdown`,
                "NUM_PLUMBER_ID",
                "VAR_PLUMBER_NAME",
                setPlumberOptions
            );

            await fetchDropdowns(
                `/water/billFreqDropdown?ulbId=${ulbId}`,
                "NUM_BILLFREQ_ID",
                "VAR_BILLFREQ_NAME",
                setBillingTypeOptions
            );

            if (ulbCode === "KNP") {
                await fetchDropdowns(
                    `/water/billMethodKNPDropdown?ulbId=${ulbId}`,
                    "NUM_BILLMETHOD_ID",
                    "VAR_BILLMETHOD_NAME",
                    setBillingMethodOptions
                );
            } else {
                await fetchDropdowns(
                    `/water/billMethodDropdown`,
                    "NUM_BILLINGMETHOD_ID",
                    "VAR_BILLINGMETHOD_NAME",
                    setBillingMethodOptions
                );
            }

            if (mode === 2) {
                await fetchConnectionDetails();
            }

            setBaseDropdownsLoaded(true);
        };

        loadDropdowns().catch(error => {
            console.error("Error loading water dropdowns:", error);
        });
    }, [ulbId, ulbCode]);

    useEffect(() => {
        const loadZones = async () => {
            if (!watchWard) {
                setZoneOptions([]);
                setBlockOptions([]);
                return;
            }

            const response = await apiService.get(
                `/water/zoneDropdown?wardId=${encodeURIComponent(watchWard)}`
            );

            if (response.success && Array.isArray(response.data)) {
                const options = response.data.map(item => ({
                    label: item.VAR_ZONE_NAME,
                    value: String(item.NUM_ZONE_ID),
                }));

                setZoneOptions(options);

                if (mode === 2 && editData) {
                    const savedZone = String(editData.ZONEID ?? "");

                    if (options.some(option => option.value === savedZone)) {
                        setValue("zone", savedZone);
                    }
                }
            }
        };

        loadZones().catch(console.error);
    }, [watchWard, mode, editData, setValue]);

    useEffect(() => {
        const loadBlocks = async () => {
            if (!watchZone) {
                setBlockOptions([]);
                return;
            }

            const response = await apiService.get(
                `/water/blockDropdown?zoneId=${encodeURIComponent(watchZone)}`
            );

            if (response.success && Array.isArray(response.data)) {
                const options = response.data.map(item => ({
                    label: item.VAR_BLOCK_NAME,
                    value: String(item.NUM_BLOCK_ID),
                }));

                setBlockOptions(options);

                if (mode === 2 && editData) {
                    const savedBlock = String(editData.BLOCKID ?? "");

                    if (options.some(option => option.value === savedBlock)) {
                        setValue("block", savedBlock);
                    }
                }
            }
        };

        loadBlocks().catch(console.error);
    }, [watchZone, mode, editData, setValue]);

    useEffect(() => {
        const loadSubUsage = async () => {
            if (!watchUsage || !ulbId) {
                setUsageSubTypeOptions([]);
                return;
            }

            const response = await apiService.get(
                `/water/subUsageTypeDropdown?ulbId=${ulbId}&usageTypeId=${encodeURIComponent(watchUsage)}`
            );

            if (response.success && Array.isArray(response.data)) {
                const options = response.data.map(item => ({
                    label: item.USAGESUBTYPENAME,
                    value: String(item.USAGESUBTYPEID),
                }));

                setUsageSubTypeOptions(options);

                if (mode === 2 && editData) {
                    const savedSubUsage = String(
                        editData.CONNUSAGESUBID ?? ""
                    );

                    if (
                        options.some(option => option.value === savedSubUsage)
                    ) {
                        setValue("usageSubType", savedSubUsage);
                    }
                }
            }
        };

        loadSubUsage().catch(console.error);
    }, [watchUsage, ulbId, mode, editData, setValue]);

    useEffect(() => {
        if (mode === 1) {
            fetchConnectionGenFlag();
        }
    }, [mode]);

    useEffect(() => {
        if (ulbId) {
            fetchULBCode();
        }
    }, [ulbId]);



    useEffect(() => {
        if (mode !== 2 || !baseDropdownsLoaded || !editData) return;

        setValue("ward", String(editData.WARDID ?? ""));
        setValue("usageType", String(editData.CONNUSAGEID ?? ""));

        setValue("connectionNumber", editData.CONNNO ?? "");
        setValue("registerNumber", editData.OLDCONNNO ?? "");
        setValue("ptnNumber", editData.PTNNO ?? "");
        setValue("pageNumber", editData.PAGENO ?? "");

        setValue("applicationNumber", editData.APPLINO ?? "");
        setValue("applicationDate", getDate(editData.APPLIDT));
        setValue("approveDate", getDate(editData.APPLIAPROVDT));
        setValue("applicationName", editData.OWNERNAME ?? "");

        setValue("aadharNumber", editData.AADHAR ?? "");
        setValue("address", editData.ADDRESS ?? "");
        setValue("panNumber", editData.PANNO ?? "");
        setValue("mobileNumber", editData.MOBNO ?? "");
        setValue("email", editData.EMAILID ?? "");
        setValue("status", editData.STATUSID ?? "");
        setValue("securityDeposit", editData.SEQURITYAMT ?? "");
        setValue("connectionType", editData.CONNTYPEID ?? "");
        setValue("connectionCode", editData.CONNCODEID ?? "");
        setValue("connectionSize", editData.CONNSIZEID ?? "");

        setValue("numberOfConnection", editData.NOOFCONN ?? "");
        setValue("consumerType", editData.CONSURMERID ?? "");
        setValue("meterNumber", editData.METERNO ?? "");
        setValue("meterMake", editData.METERMAKE ?? "");
        setValue("meterOwnerShip", editData.CONNOWNERID ?? "");
        setValue("instDate", getDate(editData.INSATALLDT) ?? "");
        setValue("connectionDate", getDate(editData.CONNDT) ?? "");
        setValue("billingType", editData.BILLCYCLEID ?? "");
        setValue("billingMethod", editData.BILLMETHOID ?? "");
        setValue("waterTank", editData.WATERTANK ?? "");
        setValue("remark", editData.REMARK ?? "");
        setValue("numberOfFamilies", editData.NOOFFAMILY ?? "");
        setValue("buildUpArea", editData.BULITUPAREA ?? "");
        setValue("plumber", editData.PLUMBERID ?? "");
        setValue("initialReading", editData.INTILREADING ?? "");

        // Set the remaining independent fields in the same way.
    }, [mode, baseDropdownsLoaded, editData, setValue]);


    const onSubmit = async (values) => {
        try {
            setLoading(true);

            if (Number(values.connectionType) === 2 && (!values.meterOwnerShip || (values.meterOwnerShip) === 0)) {
                alert("Select Meter Ownership");
                return;
            }

            if ((Number(ulbId) === 890 || Number(ulbId) === 1710) && !values.pageNumber) {
                alert("Enter Page Number");
                return;
            }

            if (values.pageNumber && values.pageNumber > 100) {
                alert("Page Number should be less than 100");
                return;
            }

            const ipAddress = await GetIPAddress();
            const payload = {
                in_UserId: userId,
                in_ulbid: Number(ulbId),
                in_Mode: Number(mode),
                in_connid: mode === 1 ? 0 : Number(connectionId),
                in_wardid: Number(values.ward),
                in_zoneid: Number(values.zone),
                in_blockid: Number(values.block),
                in_srno: mode === 2 ? Number(editData.SRNO) : 0,
                in_seqno: mode === 2 ? Number(editData.SEQNO) : 0,
                in_connno: mode === 2 ? values.connectionNumber : null,
                in_oldconnno: values.registerNumber ? values.registerNumber : null,
                in_ptnno: values.ptnNumber ? values.ptnNumber : null,
                in_applino: values.applicationNumber,
                in_applidt: formatDateForPayload(values.applicationDate),
                in_appliaprovdt: formatDateForPayload(values.approveDate),
                in_ownername: values.applicationName,
                in_uid: values.aadharNumber ? Number(values.aadharNumber) : null,
                in_address: values.address,
                in_panno: values.panNumber ? values.panNumber : null,
                in_mobno: values.mobileNumber ? Number(values.mobileNumber) : null,
                in_emailid: values.email ? values.email : null,
                in_statusid: Number(values.status),
                in_sequrityamt: Number(values.securityDeposit),
                in_conntypeid: Number(values.connectionType),
                in_conncodeid: Number(values.connectionCode),
                in_connsizeid: Number(values.connectionSize),
                in_connusageid: Number(values.usageType),
                in_connusagesubid: Number(values.usageSubType),
                in_noofconn: Number(values.numberOfConnection),
                in_nooffamily: ulbCode === "MBMC" ? 1 : values.numberOfFamilies ? Number(values.numberOfFamilies) : 0,
                in_consurmerid: Number(values.consumerType),
                in_bulituparea: ulbCode === "MBMC" ? 1 : values.buildUpArea ? Number(values.buildUpArea) : 0,
                in_meterno: values.meterNumber ? values.meterNumber : null,
                in_metermake: values.meterMake ? values.meterMake : null,
                in_connownerid: values.meterOwnerShip ? Number(values.meterOwnerShip) : 0,
                in_insatalldt: values.instDate ? formatDateForPayload(values.instDate) : null,
                in_intilreading: values.initialReading ? Number(values.initialReading) : 0,
                in_plumberid: ulbCode === "MBMC" ? 1 : values.plumber ? Number(values.plumber) : 0,
                in_conndt: values.connectionDate ? formatDateForPayload(values.connectionDate) : null,
                in_billmethoid: values.billingMethod ? Number(values.billingMethod) : 0,
                in_billcycleid: values.billingType ? Number(values.billingType) : 0,
                in_arrearsamt: 0,
                in_Watertank: values.waterTank ? Number(values.waterTank) : 0,
                in_Remark: values.remark ? values.remark : null,
                in_pageno: values.pageNumber ? Number(values.pageNumber) : null,
                in_ipaddress: ipAddress,
                in_source: config.source
            };


            const response = await apiService.post("/water/water-connnection-master", payload);

            if (response.success && response.data.Out_ErrorCode === 9999) {
                alert(response.data.Out_ErrorMsg);
                reset();
                navigate("/Transaction/FrmConnSearch", {
                    replace: true
                })
            } else {
                alert(response.data.Out_ErrorMsg);
            }
        } catch (error) {
            console.error(error);
            alert(error.message || "Failed to submit data");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Layout
            title="Connection Details"
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "Connection Details",
            }}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <Label
                            text={"Ward"}
                            required
                        />
                        <select
                            className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm ${mode === 2 ? "bg-slate-200 cursor-not-allowed" : ""} ${errors.ward ? "is-invalid" : ""}`}
                            {...register("ward", {
                                required: "Ward is required"
                            })}
                            disabled={mode === 2}
                        >
                            <option value="">
                                -- Select --
                            </option>

                            {wardOptions.map((opt) => (
                                <option
                                    key={opt.value}
                                    value={opt.value}
                                >
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        {errors.ward &&
                            <div className="mt-3 text-red-500">
                                {errors.ward.message}
                            </div>
                        }
                    </div>
                    <div>
                        <Label
                            text={"Zone"}
                            required
                        />
                        <select
                            className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm ${mode === 2 ? "bg-slate-200 cursor-not-allowed" : ""} ${errors.zone ? "is-invalid" : ""}`}
                            {...register("zone", {
                                required: "Zone is required"
                            })}
                            disabled={mode === 2}
                        >
                            <option value="">
                                -- Select --
                            </option>

                            {zoneOptions.map((opt) => (
                                <option
                                    key={opt.value}
                                    value={opt.value}
                                >
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        {errors.zone &&
                            <div className="mt-3 text-red-500">
                                {errors.zone.message}
                            </div>
                        }
                    </div>
                    <div>
                        <Label
                            text={ulbCode === "MBMC" ? "Register No / Block" : "Block"}
                            required
                        />
                        <select
                            className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm ${mode === 2 ? "bg-slate-200 cursor-not-allowed" : ""} ${errors.block ? "is-invalid" : ""}`}
                            {...register("block", {
                                required: "Block is required"
                            })}
                            disabled={mode === 2}
                        >
                            <option value="">
                                -- Select --
                            </option>

                            {blockOptions.map((opt) => (
                                <option
                                    key={opt.value}
                                    value={opt.value}
                                >
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        {errors.block &&
                            <div className="mt-3 text-red-400">
                                {errors.block.message}
                            </div>
                        }
                    </div>
                    <div>
                        <Label
                            text={"Connection No"}
                            required
                        />
                        <input
                            type="text"
                            className="form-input-box bg-slate-200 cursor-not-allowed"
                            {...register("connectionNumber")}
                            disabled={(mode === 1 && connectionGenFlag === "Y") || (mode === 2)}
                        />
                    </div>
                    <div>
                        <Label
                            text={ulbCode === "MBMC" ? "Register No" : (Number(ulbId) === 870 || Number(ulbId) === 1690) ? "Customer No" : "Old Connection No."}
                        />
                        <input
                            type="text"
                            className="form-input-box"
                            {...register("registerNumber")}
                            placeholder="Enter Register Number"
                        />
                    </div>
                    <div>
                        <Label
                            text={"PTN No"}
                        />
                        <input
                            type="text"
                            className="form-input-box"
                            {...register("ptnNumber")}
                            placeholder="Enter PTN Number"
                        />
                    </div>
                    <div>
                        <Label
                            text={"Page No"}
                        />
                        <input
                            type="text"
                            className="form-input-box"
                            {...register("pageNumber")}
                            placeholder="Enter Page Number"
                            onInput={(e) => {
                                e.target.value = e.target.value.replace(/[^0-9]/g, "");
                            }}
                        />
                    </div>
                </div>
                <div className="flex gap-2 px-5 py-3 border-t border-slate-200 bg-white flex-shrink-0 mt-3">
                    <Button
                        type="button"
                        variant={consumerDetailsTabOpen ? "primary" : "secondary"}
                        onClick={() => {
                            setConsumerDetailsTabOpen(true);
                            setConnectionDetailsTabOpen(false);
                        }}
                    >
                        Consumer Details
                    </Button>
                    <Button
                        type="button"
                        variant={connectionDetailsTabOpen ? "primary" : "secondary"}
                        onClick={() => {
                            setConnectionDetailsTabOpen(true);
                            setConsumerDetailsTabOpen(false);
                        }}
                    >
                        Connection Details
                    </Button>
                </div>
                {consumerDetailsTabOpen && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        <div>
                            <Label
                                text={"Application Number"}
                                required
                            />
                            <input
                                type="text"
                                className={`form-input-box ${errors.applicationNumber ? "is-invalid" : ""}`}
                                {...register("applicationNumber", {
                                    required: "Application Number is required"
                                })}
                            />
                            {errors.applicationNumber &&
                                <div className="mt-3 text-red-400">
                                    {errors.applicationNumber.message}
                                </div>
                            }
                        </div>
                        <div>
                            <Label
                                text={"Application Date"}
                                required
                            />
                            <input
                                type="date"
                                className={`form-input-box w-full ${errors.applicationDate ? "is-invalid" : ""}`}
                                {...register("applicationDate", {
                                    required: "Application Date is required"
                                })}
                            />
                            {errors.applicationDate &&
                                <div className="mt-3 text-red-400">
                                    {errors.applicationDate.message}
                                </div>
                            }
                        </div>
                        <div>
                            <Label
                                text={"Approve Date"}
                                required
                            />
                            <input
                                type="date"
                                className={`form-input-box w-full ${errors.approveDate ? "is-invalid" : ""}`}
                                {...register("approveDate", {
                                    required: "Approve Date is required"
                                })}
                            />
                            {errors.approveDate &&
                                <div className="mt-3 text-red-400">
                                    {errors.approveDate.message}
                                </div>
                            }
                        </div>
                        <div>
                            <Label
                                text={"Application Name"}
                                required
                            />
                            <input
                                type="text"
                                className={`form-input-box ${errors.applicationName ? "is-invalid" : ""}`}
                                {...register("applicationName", {
                                    required: "Application Name is required"
                                })}
                            />
                            {errors.applicationName &&
                                <div className="mt-3 text-red-400">
                                    {errors.applicationName.message}
                                </div>
                            }
                        </div>
                        <div>
                            <Label
                                text={"Aadhar Number"}
                            />
                            <input
                                type="text"
                                className="form-input-box"
                                {...register("aadharNumber")}
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                }}
                                maxLength={12}
                            />
                        </div>
                        <div>
                            <Label
                                text={"Address"}
                                required
                            />
                            <input
                                type="text"
                                className={`form-input-box ${errors.address ? "is-invalid" : ""}`}
                                {...register("address", {
                                    required: "Address is required"
                                })}
                            />
                            {errors.address &&
                                <div className="mt-3 text-red-400">
                                    {errors.address.message}
                                </div>
                            }
                        </div>
                        <div>
                            <Label
                                text={"PAN Number"}
                            />
                            <input
                                type="text"
                                className="form-input-box"
                                {...register("panNumber")}
                                maxLength={10}
                            />
                        </div>
                        <div>
                            <Label
                                text={"Mobile Number"}
                            />
                            <input
                                type="text"
                                className="form-input-box"
                                {...register("mobileNumber")}
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                }}
                                maxLength={10}
                            />
                        </div>
                        <div>
                            <Label
                                text={"Email"}
                            />
                            <input
                                type="email"
                                className="form-input-box"
                                {...register("email")}
                            />
                        </div>
                        <div>
                            <Label
                                text={"Status"}
                                required
                            />
                            <select
                                className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm ${errors.status ? "is-invalid" : ""}`}
                                {...register("status", {
                                    required: "Status is required"
                                })}
                            >
                                <option value="">
                                    -- Select --
                                </option>

                                {statusOptions.map((opt) => (
                                    <option
                                        key={opt.value}
                                        value={opt.value}
                                    >
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            {errors.status &&
                                <div className="mt-3 text-red-400">
                                    {errors.status.message}
                                </div>
                            }
                        </div>
                        <div>
                            <Label
                                text={"Security Deposit"}
                                required
                            />
                            <input
                                type="text"
                                className={`form-input-box ${errors.securityDeposit ? "is-invalid" : ""}`}
                                {...register("securityDeposit")}
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                }}

                            />
                            {errors.securityDeposit &&
                                <div className="mt-3 text-red-400">
                                    {errors.securityDeposit.message}
                                </div>
                            }
                        </div>
                        <div>
                            <Label
                                text={"Connection Type"}
                                required
                            />
                            <select
                                className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm ${errors.connectionType ? "is-invalid" : ""}`}
                                {...register("connectionType", {
                                    required: "Connection Type is required"
                                })}
                            >
                                <option value="">
                                    -- Select --
                                </option>

                                {connectionTypeOptions.map((opt) => (
                                    <option
                                        key={opt.value}
                                        value={opt.value}
                                    >
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            {errors.connectionType &&
                                <div className="mt-3 text-red-400">
                                    {errors.connectionType.message}
                                </div>
                            }
                        </div>
                        <div>
                            <Label
                                text={"Connection Code"}
                                required
                            />
                            <select
                                className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm ${errors.connectionCode ? "is-invalid" : ""}`}
                                {...register("connectionCode", {
                                    required: "Connection Code is required"
                                })}
                            >
                                <option value="">
                                    -- Select --
                                </option>

                                {connectionCodeOptions.map((opt) => (
                                    <option
                                        key={opt.value}
                                        value={opt.value}
                                    >
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            {errors.connectionCode &&
                                <div className="mt-3 text-red-400">
                                    {errors.connectionCode.message}
                                </div>
                            }
                        </div>
                    </div>
                )}

                {connectionDetailsTabOpen && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        <div>
                            <Label
                                text={"Connection Size"}
                                required
                            />
                            <select
                                className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm ${errors.connectionSize ? "is-invalid" : ""}`}
                                {...register("connectionSize", {
                                    required: "Connection Size is required"
                                })}
                            >
                                <option value="">
                                    -- Select --
                                </option>

                                {connectionSizeOptions.map((opt) => (
                                    <option
                                        key={opt.value}
                                        value={opt.value}
                                    >
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            {errors.connectionSize &&
                                <div className="mt-3 text-red-400">
                                    {errors.connectionSize.message}
                                </div>
                            }
                        </div>
                        <div>
                            <Label
                                text={"Usage Type"}
                                required
                            />
                            <select
                                className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm ${errors.usageType ? "is-invalid" : ""}`}
                                {...register("usageType", {
                                    required: "Usage Type is required"
                                })}
                            >
                                <option value="">
                                    -- Select --
                                </option>

                                {usageTypeOptions.map((opt) => (
                                    <option
                                        key={opt.value}
                                        value={opt.value}
                                    >
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            {errors.usageType &&
                                <div className="mt-3 text-red-400">
                                    {errors.usageType.message}
                                </div>
                            }
                        </div>
                        <div>
                            <Label
                                text={"Usage Sub Type"}
                                required
                            />
                            <select
                                className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm ${errors.usageSubType ? "is-invalid" : ""}`}
                                {...register("usageSubType", {
                                    required: "Sub Usage Type is required"
                                })}
                            >
                                <option value="">
                                    -- Select --
                                </option>

                                {usageSubTypeOptions.map((opt) => (
                                    <option
                                        key={opt.value}
                                        value={opt.value}
                                    >
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            {errors.usageSubType &&
                                <div className="mt-3 text-red-400">
                                    {errors.usageSubType.message}
                                </div>
                            }
                        </div>
                        <div>
                            <Label
                                text={"No. of Connections: "}
                                required
                            />
                            <input
                                type="text"
                                className={`form-input-box ${errors.numberOfConnection ? "is-invalid" : ""}`}
                                {...register("numberOfConnection", {
                                    required: "Number of Connections is required"
                                })}
                            />
                            {errors.numberOfConnection &&
                                <div className="mt-3 text-red-400">
                                    {errors.numberOfConnection.message}
                                </div>
                            }
                        </div>
                        {ulbCode !== "MBMC" && <div>
                            <Label
                                text={"No. of Families: "}
                                required
                            />
                            <input
                                type="text"
                                className={`form-input-box ${errors.numberOfFamilies ? "is-invalid" : ""}`}
                                {...register("numberOfFamilies", {
                                    required: "Number of Families is required"
                                })}
                            />
                            {errors.numberOfFamilies &&
                                <div className="mt-3 text-red-400">
                                    {errors.numberOfFamilies.message}
                                </div>
                            }
                        </div>}
                        <div>
                            <Label
                                text={"Consumer Type"}
                                required
                            />
                            <select
                                className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm ${errors.consumerType ? "is-invalid" : ""}`}
                                {...register("consumerType", {
                                    required: "Consumer Type is required"
                                })}
                            >
                                <option value="">
                                    -- Select --
                                </option>

                                {consumerTypeOptions.map((opt) => (
                                    <option
                                        key={opt.value}
                                        value={opt.value}
                                    >
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            {errors.consumerType &&
                                <div className="mt-3 text-red-400">
                                    {errors.consumerType.message}
                                </div>
                            }
                        </div>
                        {ulbCode !== "MBMC" && <div>
                            <Label
                                text={"Build Up Area: "}
                                required
                            />
                            <input
                                type="text"
                                className={`form-input-box ${errors.buildUpArea ? "is-invalid" : ""}`}
                                {...register("buildUpArea", {
                                    required: "Build Up Area is required"
                                })}
                            />
                            {errors.buildUpArea &&
                                <div className="mt-3 text-red-400">
                                    {errors.buildUpArea.message}
                                </div>
                            }
                        </div>}
                        <div>
                            <Label
                                text={"Meter Number: "}
                            />
                            <input
                                type="text"
                                className={`form-input-box ${connCode === "NMTR" ? "bg-slate-200 cursor-not-allowed" : ""}`}
                                {...register("meterNumber")}
                                disabled={connCode === "NMTR"}
                            />
                        </div>
                        <div>
                            <Label
                                text={"Meter Make: "}
                            />
                            <input
                                type="text"
                                className={`form-input-box ${connCode === "NMTR" ? "bg-slate-200 cursor-not-allowed" : ""}`}
                                {...register("meterMake")}
                                disabled={connCode === "NMTR"}
                            />
                        </div>
                        <div>
                            <Label
                                text={"Meter Ownership"}
                            />
                            <select
                                className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm ${connCode === "NMTR" ? "bg-slate-200 cursor-not-allowed" : ""}`}
                                {...register("meterOwnerShip")}
                                disabled={connCode === "NMTR"}
                            >
                                <option value="">
                                    -- Select --
                                </option>

                                {meterOwnerShipOptions.map((opt) => (
                                    <option
                                        key={opt.value}
                                        value={opt.value}
                                    >
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label
                                text={"Inst. Date: "}
                            />
                            <input
                                type="date"
                                className={`form-input-box ${connCode === "NMTR" ? "bg-slate-200 cursor-not-allowed" : ""}`}
                                {...register("instDate")}
                                disabled={connCode === "NMTR"}
                            />
                        </div>
                        <div>
                            <Label
                                text={"Initial Reading: "}
                            />
                            <input
                                type="text"
                                className={`form-input-box ${connCode === "NMTR" ? "bg-slate-200 cursor-not-allowed" : ""}`}
                                {...register("initialReading", {
                                    required: "Initial Reading is required"
                                })}
                                disabled={connCode === "NMTR"}
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                }}
                            />
                            {errors.initialReading &&
                                <div className="mt-3 text-red-400">
                                    {errors.initialReading.message}
                                </div>
                            }
                        </div>
                        {ulbCode !== "MBMC" && <div>
                            <Label
                                text={"Plumber: "}
                                required
                            />
                            <select
                                className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm ${errors.plumber ? "is-invalid" : ""}`}
                                {...register("plumber", {
                                    required: "Plumber is required"
                                })}
                            >
                                <option value="">
                                    -- Select --
                                </option>

                                {plumberOptions.map((opt) => (
                                    <option
                                        key={opt.value}
                                        value={opt.value}
                                    >
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            {errors.plumber &&
                                <div className="mt-3 text-red-400">
                                    {errors.plumber.message}
                                </div>
                            }
                        </div>}
                        <div>
                            <Label
                                text={"Con. Date: "}
                            />
                            <input
                                type="date"
                                className="form-input-box"
                                {...register("connectionDate")}
                            />
                        </div>
                        <div>
                            <Label
                                text={"Billing Type"}
                                required
                            />
                            <select
                                className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm ${errors.billingType ? "is-invalid" : ""}`}
                                {...register("billingType", {
                                    required: "Billing Type is required"
                                })}
                            >
                                <option value="">
                                    -- Select --
                                </option>

                                {billingTypeOptions.map((opt) => (
                                    <option
                                        key={opt.value}
                                        value={opt.value}
                                    >
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label
                                text={"Billing Method"}
                                required
                            />
                            <select
                                className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm ${errors.billingMethod ? "is-invalid" : ""}`}
                                {...register("billingMethod", {
                                    required: "Billing Method is required"
                                })}
                            >
                                <option value="">
                                    -- Select --
                                </option>

                                {billingMethodOptions.map((opt) => (
                                    <option
                                        key={opt.value}
                                        value={opt.value}
                                    >
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            {errors.billingMethod &&
                                <div className="mt-3 text-red-400">
                                    {errors.billingMethod.message}
                                </div>
                            }
                        </div>
                        <div>
                            <Label
                                text={"Water Tank"}
                                required
                            />
                            <select
                                className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm ${errors.waterTank ? "is-invalid" : ""}`}
                                {...register("waterTank", {
                                    required: "Water Tank is required"
                                })}
                            >
                                <option value="">
                                    -- Select --
                                </option>

                                {waterTankOptions.map((opt) => (
                                    <option
                                        key={opt.value}
                                        value={opt.value}
                                    >
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            {errors.waterTank &&
                                <div className="mt-3 text-red-400">
                                    {errors.waterTank.message}
                                </div>
                            }
                        </div>
                        <div>
                            <Label
                                text={"Remark: "}
                            />
                            <input
                                type="text"
                                className="form-input-box"
                                {...register("remark")}
                            />
                        </div>
                    </div>
                )}

                <div className="flex justify-center gap-2 px-5 py-3 border-t border-slate-200 bg-white flex-shrink-0">
                    <Button type="submit">
                        {mode === 1 ? "Submit" : "Update"}
                    </Button>

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            navigate("/Transaction/FrmConnSearch")
                        }}
                    >
                        Back
                    </Button>
                </div>


            </form>
        </Layout>
    )
}

export default FrmConnectionMst;