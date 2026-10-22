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
    const watchUsage = watch("usageType")

    const [editData, setEditData] = useState(null);
    const [baseDropdownsLoaded, setBaseDropdownsLoaded] = useState(false);

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

            const ipAddress = await GetIPAddress();
            const payload = {
                in_UserId: userId,
                in_ulbid: Number(ulbId),
                in_Mode: Number(mode),
                in_connid: mode === 1 ? null : Number(connectionId),
                in_wardid: Number(values.ward),
                in_zoneid: Number(values.zone),
                in_blockid: Number(values.block),
                in_srno: "",
                in_seqno: "",
                in_connno: values.connectionNumber,
                in_oldconnno: values.registerNumber,
                in_ptnno: values.ptnNumber,
                in_applino: values.applicationNumber,
                in_applidt: values.applicationDate,
                in_appliaprovdt: values.approveDate,
                in_ownername: values.applicationName,
                in_uid: "",
                in_address: values.address,
                in_panno: values.panNumber,
                in_mobno: Number(values.mobileNumber),
                in_emailid: values.email,
                in_statusid: Number(values.status),
                in_sequrityamt: Number(values.securityDeposit),
                in_conntypeid: Number(values.connectionType),
                in_conncodeid: Number(values.connectionCode),
                in_connsizeid: Number(values.connectionSize),
                in_connusageid: Number(values.usageType),
                in_connusagesubid: Number(values.usageSubType),
                in_noofconn: Number(values.numberOfConnection),
                in_nooffamily: Number(values.numberOfFamilies),
                in_consurmerid: Number(values.consumerType),
                in_bulituparea: Number(values.buildUpArea),
                in_meterno: values.meterNumber,
                in_metermake: values.meterMake,
                in_connownerid: Number(values.meterOwnerShip),
                in_insatalldt: values.instDate,
                in_intilreading: Number(values.initialReading),
                in_plumberid: Number(values.plumber),
                in_conndt: values.connectionDate,
                in_billmethoid: Number(values.billingMethod),
                in_billcycleid: Number(values.billingType),
                in_arrearsamt: 0,
                in_Watertank: Number(values.waterTank),
                in_Remark: values.remark,
                in_pageno: Number(values.pageNumber),
                in_ipaddress: ipAddress,
                in_source: config.source
            };

            console.log(payload);
            return;
            const response = await apiService.post("/water/water-connnection-master", payload);

            if (response.success && response.data.Out_ErrorCode === 9999) {
                alert(response.data.Out_ErrorMsg);
                reset();
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
                        />
                        <select
                            className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm ${mode === 2 ? "bg-slate-200 cursor-not-allowed" : ""}`}
                            {...register("ward")}
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
                    </div>
                    <div>
                        <Label
                            text={"Zone"}
                        />
                        <select
                            className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm ${mode === 2 ? "bg-slate-200 cursor-not-allowed" : ""}`}
                            {...register("zone")}
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
                    </div>
                    <div>
                        <Label
                            text={"Register No / Block"}
                        />
                        <select
                            className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm ${mode === 2 ? "bg-slate-200 cursor-not-allowed" : ""}`}
                            {...register("block")}
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
                            text={"Register No"}
                        />
                        <input
                            type="text"
                            className="form-input-box"
                            {...register("connectionNumber")}
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
                            required
                        />
                        <input
                            type="text"
                            className="form-input-box"
                            {...register("pageNumber")}
                            placeholder="Enter Page Number"
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
                                className="form-input-box"
                                {...register("applicationNumber")}
                            />
                        </div>
                        <div>
                            <Label
                                text={"Application Date"}
                                required
                            />
                            <input
                                type="date"
                                className="form-input-box w-full"
                                {...register("applicationDate")}
                            />
                        </div>
                        <div>
                            <Label
                                text={"Approve Date"}
                                required
                            />
                            <input
                                type="date"
                                className="form-input-box w-full"
                                {...register("approveDate")}
                            />
                        </div>
                        <div>
                            <Label
                                text={"Application Name"}
                                required
                            />
                            <input
                                type="text"
                                className="form-input-box"
                                {...register("applicationName")}
                            />
                        </div>
                        <div>
                            <Label
                                text={"Aadhar Number"}
                            />
                            <input
                                type="text"
                                className="form-input-box"
                                {...register("aadharNumber")}
                            />
                        </div>
                        <div>
                            <Label
                                text={"Address"}
                                required
                            />
                            <input
                                type="text"
                                className="form-input-box"
                                {...register("address")}
                            />
                        </div>
                        <div>
                            <Label
                                text={"PAN Number"}
                            />
                            <input
                                type="text"
                                className="form-input-box"
                                {...register("panNumber")}
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
                                className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                                {...register("status")}
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
                        </div>
                        <div>
                            <Label
                                text={"Security Deposit"}
                                required
                            />
                            <input
                                type="text"
                                className="form-input-box"
                                {...register("securityDeposit")}
                            />
                        </div>
                        <div>
                            <Label
                                text={"Connection Type"}
                                required
                            />
                            <select
                                className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                                {...register("connectionType")}
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
                        </div>
                        <div>
                            <Label
                                text={"Connection Code"}
                                required
                            />
                            <select
                                className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                                {...register("connectionCode")}
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
                                className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                                {...register("connectionSize")}
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
                        </div>
                        <div>
                            <Label
                                text={"Usage Type"}
                                required
                            />
                            <select
                                className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                                {...register("usageType")}
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
                        </div>
                        <div>
                            <Label
                                text={"Usage Sub Type"}
                                required
                            />
                            <select
                                className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                                {...register("usageSubType")}
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
                        </div>
                        <div>
                            <Label
                                text={"No. of Connections: "}
                                required
                            />
                            <input
                                type="text"
                                className="form-input-box"
                                {...register("numberOfConnection")}
                            />
                        </div>
                        {ulbCode !== "MBMC" && <div>
                            <Label
                                text={"No. of Families: "}
                                required
                            />
                            <input
                                type="text"
                                className="form-input-box"
                                {...register("numberOfFamilies")}
                            />
                        </div>}
                        <div>
                            <Label
                                text={"Consumer Type"}
                                required
                            />
                            <select
                                className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                                {...register("consumerType")}
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
                        </div>
                        {ulbCode !== "MBMC" && <div>
                            <Label
                                text={"Build Up Area: "}
                                required
                            />
                            <input
                                type="text"
                                className="form-input-box"
                                {...register("buildUpArea")}
                            />
                        </div>}
                        <div>
                            <Label
                                text={"Meter Number: "}
                            />
                            <input
                                type="text"
                                className="form-input-box"
                                {...register("meterNumber")}
                            />
                        </div>
                        <div>
                            <Label
                                text={"Meter Make: "}
                            />
                            <input
                                type="text"
                                className="form-input-box"
                                {...register("meterMake")}
                            />
                        </div>
                        <div>
                            <Label
                                text={"Meter Ownership"}
                            />
                            <select
                                className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                                {...register("meterOwnerShip")}
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
                                className="form-input-box"
                                {...register("instDate")}
                            />
                        </div>
                        <div>
                            <Label
                                text={"Initial Reading: "}
                            />
                            <input
                                type="text"
                                className="form-input-box"
                                {...register("initialReading")}
                            />
                        </div>
                        {ulbCode !== "MBMC" && <div>
                            <Label
                                text={"Plumber: "}
                            />
                            <select
                                className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                                {...register("plumber")}
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
                                className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                                {...register("billingType")}
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
                                className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                                {...register("billingMethod")}
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
                        </div>
                        <div>
                            <Label
                                text={"Water Tank"}
                                required
                            />
                            <select
                                className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                                {...register("waterTank")}
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
                        Submit
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