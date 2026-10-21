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

const emptyRow = {
    from: "",
    to: "",
    rate: ""
}

const getToday = () => {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
};

const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
};

const formatDateDDMMYYYY = (date) => {
    if (!date) return "";

    const [year, month, day] = date.split("-");
    const monthName = new Date(Number(year), Number(month) - 1, 1)
        .toLocaleString("en-US", { month: "short" });

    return `${day}-${monthName}-${year}`;
};

const FrmServiceRateConfigMst = () => {
    const { user } = useAuth();
    const ulbId = user?.ulbId;
    const userId = user?.userId;
    const prabhagId = user?.prabhagID;
    const deptId = user?.deptId;
    const { setLoading } = useLoader();
    const navigate = useNavigate();
    const location = useLocation();

    const {
        mode = 1,
        serviceRateId = "",
        serviceUlbId = "",
    } = location.state || {};


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
            ulbName: "",
            serviceName: "",
            chargesType: "",
            usageType: "",
            usageSubType: "",
            effectiveFrom: getToday(),
            value: "",
            from: "",
            to: "",
            rate: "",
            rowData: [],
            maxAmount: "",
        },
    });

    const watchULB = watch("ulbName");
    const watchServiceName = watch("serviceName");
    const watchUsageType = watch("usageType");
    const watchSubUsageType = watch("usageSubType");
    const watchValue = watch("value");

    const { fields, append, remove } = useFieldArray({
        control,
        name: "rowData",
    });

    const handleAddToList = () => {
        const { from, to, rate } = getValues();

        if (!String(from ?? "").trim()) {
            alert("पासुन आवश्यक आहे.");
            return;
        }

        if (!String(to ?? "").trim()) {
            alert("पर्यंत आवश्यक आहे.");
            return;
        }

        if (!String(rate ?? "").trim()) {
            alert("दर आवश्यक आहे.");
            return;
        }

        if(!watchULB) {
            alert("Please Select ULB Name");
            return;
        }

        if (!watchServiceName) {
            alert("Please select Service Name");
            return;
        }

        if(!watchUsageType) {
            alert("Please select Usage Type");
            return;
        }

        if (!watchSubUsageType) {
            alert("Please select Sub Usage Type");
            return;
        }

        if (!watchValue) {
            alert("Please select Value");
            return;
        }

        append({
            from: String(from).trim(),
            to: String(to).trim(),
            rate: String(rate).trim(),
        });

        setValue("from", "");
        setValue("to", "");
        setValue("rate", "");
    };

    const [selectedUsageType, setSelectedUsageType] = useState("");
    const [serviceDetails, setServiceDetails] = useState(null);
    const [serviceTableDetails, setServiceTableDetails] = useState(null);
    const [ulbOptions, setULBOptions] = useState([]);
    const [serviceNameOptions, setServiceNameOptions] = useState([]);
    const [chargesTypeOptions, setChargesTypeOptions] = useState([]);
    const [usageTypeOptions, setUsageTypeOptions] = useState([]);
    const [usageSubTypeOptions, setUsageSubTypeOptions] = useState([]);
    const [valueOptions, setValueOptions] = useState([]);

    const fetchULBDropdown = async () => {
        try {
            setLoading(true);

            const response = await apiService.get("/config/getULBDropdown");

            if (
                response?.success &&
                Array.isArray(response?.data)
            ) {
                const formatted = response.data.map((item) => ({
                    label: item.CORPORATIONNAME,
                    value: item.CORPORATIONID,
                }));

                setULBOptions(formatted);
            } else {
                setULBOptions([]);
            }
        } catch (error) {
            setULBOptions([]);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchServiceDropdown = async (ulb = watchULB) => {
        try {
            const response = await apiService.get(
                `/config/getServiceNameDropdown?ulbId=${encodeURIComponent(ulb)}`
            );

            if (response?.success && Array.isArray(response.data)) {
                const formatted = response.data.map((item) => ({
                    label: item.SERVICEMNAME,
                    value: String(item.SERVICEID),
                }));

                setServiceNameOptions(formatted);
                return formatted;
            }

            setServiceNameOptions([]);
            return [];
        } catch (error) {
            console.error(error);
            setServiceNameOptions([]);
            return [];
        }
    };

    const fetchChargesTypeDropdown = async (ulb = watchULB) => {
        try {
            setLoading(true);

            const response = await apiService.get(`/config/getChargesTypeDropdown?ulbId=${encodeURIComponent(ulb)}`);

            if (
                response?.success &&
                Array.isArray(response?.data)
            ) {
                const formatted = response.data.map((item) => ({
                    label: item.VAR_CHARGESTYPE_NAME,
                    value: String(item.NUM_CHARGESTYPE_ID),
                }));

                setChargesTypeOptions(formatted);
                return formatted;
            } else {
                setChargesTypeOptions([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchUsageTypeDropdown = async (ulb = watchULB) => {
        try {
            setLoading(true);

            const response = await apiService.get(`/config/getUsageTypeByULBDropdown?ulbId=${encodeURIComponent(ulb)}`);

            if (
                response?.success &&
                Array.isArray(response?.data)
            ) {
                const formatted = response.data.map((item) => ({
                    label: item.USAGETYPE_NAME,
                    value: String(item.USAGETYPEID),
                }));

                setUsageTypeOptions(formatted);
                return formatted;
            } else {
                setUsageTypeOptions([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchUsageSubTypeDropdown = async (ulb = watchULB, usageType = watchUsageType) => {
        try {
            setLoading(true);

            const response = await apiService.get(`/config/getSubUsageTypeByUsageDropdown?ulbId=${encodeURIComponent(ulb)}&usageTypeId=${encodeURIComponent(usageType)}`);

            if (
                response?.success &&
                Array.isArray(response?.data)
            ) {
                const formatted = response.data.map((item) => ({
                    label: item.USAGESUBTYPE_ENGNAME,
                    value: String(item.USGSUBTYPEID),
                }));

                setUsageSubTypeOptions(formatted);
                return formatted;
            } else {
                setUsageSubTypeOptions([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchValueDropdown = async () => {
        try {
            setLoading(true);

            const response = await apiService.get("/config/getValueDropdown");
            if (
                response?.success &&
                Array.isArray(response?.data)
            ) {
                const formatted = response.data.map((item) => ({
                    label: item.VAR_VALUETYPE_NAME,
                    value: item.VAR_VALUETYPE_CODE,
                }));

                setValueOptions(formatted);
            } else {
                setValueOptions([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchApplicationDetails = async () => {
        try {
            setLoading(true);

            const response = await apiService.get(
                `/config/fetchServiceRateConfigDetails?ulbId=${encodeURIComponent(
                    serviceUlbId
                )}&serviceRateId=${encodeURIComponent(serviceRateId)}`
            );

            if (!response?.success || !response?.data) {
                setServiceDetails(null);
                return null;
            }

            const data = Array.isArray(response.data)
                ? response.data[0] || null
                : response.data;

            console.log("Service rate details record:", data);

            setServiceDetails(data);
            return data;
        } catch (error) {
            console.error("Failed to fetch service rate details:", error);
            setServiceDetails(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const fetchApplicationTableDetails = async () => {
        try {
            setLoading(true);

            const response = await apiService.get(
                `/config/getServiceRateDetailsTableData?serviceRateId=${encodeURIComponent(serviceRateId)}`
            );

            if (!response?.success || !response?.data) {
                setServiceTableDetails(null);
                return null;
            }

            const data = Array.isArray(response.data)
                ? response.data : null


            setServiceTableDetails(data);
            return data;
        } catch (error) {
            console.error("Failed to fetch service rate details:", error);
            setServiceTableDetails(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (values) => {
        try {
            setLoading(true);

            if (!values.rowData.length) {
                alert("Please add one row");
                return;
            }

            const ipAddress = await GetIPAddress();
            const payload = {
                In_UserId: userId,
                In_ServiceRateId: mode === 2 ? Number(serviceRateId) : 0,
                In_Mode: Number(mode),
                In_UlbId: mode === 2 ? Number(serviceUlbId) : Number(ulbId),
                In_ServiceId: Number(values.serviceName),
                In_SubServiceId: 0,
                In_UsageTypeId: Number(values.usageType),
                In_UsageSubTypeId: Number(values.usageSubType),
                In_FromDate: formatDateDDMMYYYY(values.effectiveFrom),
                In_ValueType: values.value,
                In_ChargesType: Number(values.chargesType),
                In_MaxAmount: Number(values.maxAmount),
                In_ServiceRateSlabStr: values.rowData
                    .map((row) => `${row.from}#${row.to}#${row.rate}`)
                    .join("$"),
                In_Ipaddress: ipAddress,
                In_Source: config.source
            };


            const response = await apiService.post("/config/service-rate-config", payload);

            if (response.success && response.data.Out_ErrorCode === 9999) {
                alert(response.data.Out_ErrorMsg);
                reset();
                navigate("/Masters/FrmServiceRateConfigList", {
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
    };

    useEffect(() => {
        if (ulbId) {
            fetchULBDropdown();
            fetchValueDropdown();
        }
    }, [ulbId]);

    useEffect(() => {
        if (mode !== 1 || !watchULB) return;

        fetchServiceDropdown(watchULB);
        fetchChargesTypeDropdown(watchULB);
        fetchUsageTypeDropdown(watchULB);
    }, [mode, watchULB]);

    useEffect(() => {
        if (!watchULB || !watchUsageType) {
            setUsageSubTypeOptions([]);
            return;
        }

        fetchUsageSubTypeDropdown(watchULB, watchUsageType);
    }, [mode, watchULB, watchUsageType]);

    useEffect(() => {
        if (mode !== 2 || !serviceUlbId || !serviceRateId) {
            return;
        }

        let cancelled = false;

        const initializeEditForm = async () => {
            try {
                const data = await fetchApplicationDetails();
                const tableData = await fetchApplicationTableDetails();

                const formattedTableData = tableData.length > 0 ? tableData.map(item => ({
                    from: item.DET_FROM,
                    to: item.DET_TO,
                    rate: item.DET_RATE
                })) : [];

                if (!data || cancelled) return;

                // Verify these field names against the console output.
                const ulb = String(data.SERVICERATE_ULBID ?? "");
                const usageType = String(data.SERVICERATE_USAGETYPE ?? "");

                await Promise.all([
                    fetchServiceDropdown(ulb),
                    fetchChargesTypeDropdown(ulb),
                    fetchUsageTypeDropdown(ulb),
                ]);

                if (cancelled) return;

                await fetchUsageSubTypeDropdown(ulb, usageType);

                if (cancelled) return;

                reset({
                    ulbName: ulb,
                    serviceName: String(data.SERVICERATE_SERVICEID ?? ""),
                    chargesType: String(data.SERVICERATE_CHARGESTYPE ?? ""),
                    usageType,
                    usageSubType: String(data.SERVICERATE_SUBUSAGETYPE ?? ""),
                    effectiveFrom: data.SERVICERATE_EFFECTIVEFROM
                        ? formatDate(data.SERVICERATE_EFFECTIVEFROM)
                        : "",
                    value: String(data.SERVICERATE_VALUETYPE ?? ""),
                    from: "",
                    to: "",
                    rate: "",
                    rowData: formattedTableData,
                    maxAmount: String(data.SERVICERATE_MAXAMT ?? ""),
                });

                console.log("Edit form populated:", {
                    ulb,
                    usageType,
                    serviceName: data.SERVICERATE_SERVICEID,
                    chargesType: data.SERVICERATE_CHARGESTYPE,
                    usageSubType: data.SERVICERATE_SUBUSAGETYPE,
                    value: data.SERVICERATE_VALUETYPE,
                });
            } catch (error) {
                console.error("Failed to initialize edit form:", error);
            }
        };

        initializeEditForm();

        return () => {
            cancelled = true;
        };
    }, [mode, serviceUlbId, serviceRateId, reset]);

    return (
        <Layout
            title="Service Tax Rate Configuration"
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "Service Tax Rate Configuration",
            }}
        >
            <form
                className="w-full space-y-6"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <Label
                            text={"नगरपालिकेचे नांव: "}
                            required
                        />
                        <select
                            className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm ${mode === 2 ? "bg-slate-200 cursor-not-allowed" : ""}${errors.ulbName ? "is-invalid" : ""}`}
                            {...register("ulbName", {
                                required: "ULB Name is required"
                            })}
                            disabled={mode === 2}
                        >
                            <option value="">
                                -- Select --
                            </option>

                            {ulbOptions.map((opt) => (
                                <option
                                    key={opt.value}
                                    value={opt.value}
                                >
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        {errors.ulbName && 
                            <div className="mt-3 text-red-500">
                                {errors.ulbName.message}
                            </div>
                        }
                    </div>
                    <div>
                        <Label
                            text={"Service Name: "}
                            required
                        />
                        <select
                            className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm ${errors.serviceName ? "is-invalid" : ""}`}
                            {...register("serviceName",
                                {
                                    required: "Service Name is required"
                                }
                            )}
                        >
                            <option value="">
                                -- Select --
                            </option>

                            {serviceNameOptions.map((opt) => (
                                <option
                                    key={opt.value}
                                    value={opt.value}
                                >
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        {errors.serviceName && 
                            <div className="mt-3 text-red-500">
                                {errors.serviceName.message}
                            </div>
                        }
                    </div>
                    <div>
                        <Label
                            text={"Charges Type: "}
                            required
                        />
                        <select
                            className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm ${errors.chargesType ? "is-invalid" : ""}`}
                            {...register("chargesType", {
                                required: "Charges Type is required"
                            })}
                        >
                            <option value="">
                                -- Select --
                            </option>

                            {chargesTypeOptions.map((opt) => (
                                <option
                                    key={opt.value}
                                    value={opt.value}
                                >
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        {errors.chargesType && 
                            <div className="mt-3 text-red-500">
                                {errors.chargesType.message}
                            </div>
                        }
                    </div>
                    <div>
                        <Label
                            text={"Usage Type: "}
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
                            <div className="mt-3 text-red-500">
                                {errors.usageType.message}
                            </div>
                        }
                    </div>
                    <div>
                        <Label
                            text={"Usage Sub Type: "}
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
                            <div className="mt-3 text-red-500">
                                {errors.usageSubType.message}
                            </div>
                        }
                    </div>
                    <div>
                        <Label
                            text={"Effective From"}
                            required
                        />
                        <input
                            type="date"
                            className="form-input-box w-full"
                            {...register("effectiveFrom")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"Value: "}
                            required
                        />
                        <select
                            className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm ${errors.value ? "is-invalid" : ""}`}
                            {...register("value", {
                                required: "Value is required"
                            })}
                        >
                            <option value="">
                                -- Select --
                            </option>

                            {valueOptions.map((opt) => (
                                <option
                                    key={opt.value}
                                    value={opt.value}
                                >
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        {errors.value && 
                            <div className="mt-3 text-red-500">
                                {errors.value.message}
                            </div>
                        }
                    </div>
                </div>
                <div className="border-t border-slate-200"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                    <div>
                        <Label text={"पासुन: "} required />
                        <input
                            type="text"
                            className="form-input-box w-full"
                            {...register("from")}
                        />
                    </div>

                    <div>
                        <Label text={"पर्यंत: "} required />
                        <input
                            type="text"
                            className="form-input-box w-full"
                            {...register("to")}
                        />
                    </div>

                    <div>
                        <Label text={"दर: "} required />
                        <input
                            type="text"
                            className="form-input-box w-full"
                            {...register("rate")}
                        />
                    </div>
                </div>

                <div className="mt-3 flex justify-center">
                    <Button
                        type="button"
                        onClick={handleAddToList}
                    >
                        Add to List
                    </Button>
                </div>
                <div className="mt-3">
                    <Table
                        headers={[
                            "पासुन",
                            "पर्यंत",
                            "दर",
                            "Delete",
                        ]}
                        data={fields.map((field, index) => [
                            field.from,
                            field.to,
                            field.rate,
                            <Button
                                key={`delete-${field.id}`}
                                type="button"
                                variant="danger"
                                onClick={async () => {
                                    const confirm = await window.confirm("Do you want to delete this row?");
                                    if (confirm) {
                                        remove(index);
                                    }
                                }}
                            >
                                Delete
                            </Button>,
                        ])}
                        showSearch={false}
                    />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                        <Label
                            text={"Max Amount Applicable"}
                            required
                        />
                        <input
                            type="text"
                            className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm ${errors.maxAmount ? "is-invalid" : ""}`}
                            {...register("maxAmount", {
                                required: "Max Amount is required"
                            })}
                        />
                        {errors.maxAmount && 
                            <div className="mt-3 text-red-500">
                                {errors.maxAmount.message}
                            </div>
                        }
                    </div>
                </div>
                <div className="flex justify-center gap-2 px-5 py-3 border-t border-slate-200 bg-white flex-shrink-0">
                    <Button type="submit">
                        {mode === 1 ? "साठवा" : "Update"}
                    </Button>

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            navigate("/Masters/FrmServiceRateConfigList")
                        }}
                    >
                        परत
                    </Button>
                </div>
            </form>
        </Layout>
    )
}

export default FrmServiceRateConfigMst;