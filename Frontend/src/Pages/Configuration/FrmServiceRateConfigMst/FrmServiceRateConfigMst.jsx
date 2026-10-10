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

const emptyRow = {
    from: "",
    to: "",
    rate: ""
}

const FrmServiceRateConfigMst = () => {
    const { user } = useAuth();
    const { setLoading } = useLoader();
    const navigate = useNavigate();
    const location = useLocation();

    const { mode, applicationNumber } = location.state || {
        mode: 1,
        applicationNumber: ""
    };


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
            effectiveFrom: "",
            value: "",
            from: "",
            to: "",
            rate: "",
            rowData: [],
            maxAmount: "",
        },
    });

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

    const [ulbOptions, setULBOptions] = useState([{
        label: "मीरा भाईंदर महानगरपालिका", value: "1"
    }]);
    const [serviceNameOptions, setServiceNameOptions] = useState([{
        label: "Re-Water Connection",
        value: "1"
    }]);
    const [chargesTypeOptions, setChargesTypeOptions] = useState([
        { label: "Water No Dues Certificate", value: "1" },
        { label: "Change in Water Connection Usage", value: "2" },
        { label: "Connecion / Disconnection", value: "3" }
    ]);
    const [usageTypeOptions, setUsageTypeOptions] = useState([
        { label: "Commercial", value: "1" },
        { label: "Domestic", value: "2" },
        { label: "Residential", value: "3" }
    ]);
    const [usageSubTypeOptions, setUsageSubTypeOptions] = useState([
        { label: "Building", value: "1" },
        { label: "Domestic", value: "2" },
        { label: "Government School", value: "3" }
    ]);
    const [valueOptions, setValueOptions] = useState([
        { label: "Fix", value: "1" },
        { label: "Percentage", value: "2" }
    ]);

    const fetchULBDropdown = async () => {
        try {
            setLoading(true);

            const payload = {};

            const response = await apiService.post("", payload);

            console.log(response);

            if (
                response?.data?.success &&
                Array.isArray(response?.data?.data)
            ) {
                const formatted = response.data.data.map((item) => ({
                    label: item.ulbID,
                    value: item.ulbname,
                }));

                setULBOptions(formatted);
            } else {
                setULBOptions([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchServiceDropdown = async () => {
        try {
            setLoading(true);

            const payload = {};

            const response = await apiService.post("", payload);

            console.log(response);

            if (
                response?.data?.success &&
                Array.isArray(response?.data?.data)
            ) {
                const formatted = response.data.data.map((item) => ({
                    label: item.serID,
                    value: item.serviceName,
                }));

                setServiceNameOptions(formatted);
            } else {
                setServiceNameOptions([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchChargesTypeDropdown = async () => {
        try {
            setLoading(true);

            const payload = {};

            const response = await apiService.post("", payload);

            console.log(response);

            if (
                response?.data?.success &&
                Array.isArray(response?.data?.data)
            ) {
                const formatted = response.data.data.map((item) => ({
                    label: item.charID,
                    value: item.chargesName,
                }));

                setChargesTypeOptions(formatted);
            } else {
                setChargesTypeOptions([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchUsageTypeDropdown = async () => {
        try {
            setLoading(true);

            const payload = {};

            const response = await apiService.post("", payload);

            console.log(response);

            if (
                response?.data?.success &&
                Array.isArray(response?.data?.data)
            ) {
                const formatted = response.data.data.map((item) => ({
                    label: item.usageID,
                    value: item.usageName,
                }));

                setUsageTypeOptions(formatted);
            } else {
                setUsageTypeOptions([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchUsageSubTypeDropdown = async (usageType) => {
        try {
            setLoading(true);

            const payload = {
                usageType
            };

            const response = await apiService.post("", payload);

            console.log(response);

            if (
                response?.data?.success &&
                Array.isArray(response?.data?.data)
            ) {
                const formatted = response.data.data.map((item) => ({
                    label: item.usagesubID,
                    value: item.usagesubName,
                }));

                setUsageSubTypeOptions(formatted);
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

            const payload = {};

            const response = await apiService.post("", payload);

            console.log(response);

            if (
                response?.data?.success &&
                Array.isArray(response?.data?.data)
            ) {
                const formatted = response.data.data.map((item) => ({
                    label: item.valueID,
                    value: item.valueName,
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

            const payload = {};

            // const response = await apiService.post("", payload);

            // console.log(response);

            // if (
            //     response?.data?.success &&
            //     Array.isArray(response?.data?.data)
            // ) {
            //     const formatted = response.data.data.map((item) => ({
            //         label: item.valueID,
            //         value: item.valueName,
            //     }));

            //     setValueOptions(formatted);
            // } else {
            //     setValueOptions([]);
            // }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const onSubmit = async (values) => {
        try {
            setLoading(true);

            const payload = {
                ulbName: values.ulbName,
                serviceName: values.serviceName,
                chargesType: values.chargesType,
                usageType: values.usageType,
                usageSubType: values.usageSubType,
                effectiveFrom: values.effectiveFrom,
                value: values.value,
                rowData: values.rowData,
                maxAmount: values.maxAmount,
            };

            console.log("Payload:", payload);

            // Call your API here.
        } catch (error) {
            console.error(error);
            alert(error.message || "Failed to submit data");
        } finally {
            setLoading(false);
        }
    };

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
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                            {...register("ulbName")}
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
                    </div>
                    <div>
                        <Label
                            text={"Service Name: "}
                            required
                        />
                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                            {...register("serviceName")}
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
                    </div>
                    <div>
                        <Label
                            text={"Charges Type: "}
                            required
                        />
                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                            {...register("chargesType")}
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
                    </div>
                    <div>
                        <Label
                            text={"Usage Type: "}
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
                            text={"Usage Sub Type: "}
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
                            text={"Usage Sub Type: "}
                            required
                        />
                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                            {...register("value")}
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
                                onClick={() => remove(index)}
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
                        />
                        <input
                            type="text"
                            className="form-input-box"
                            {...register("maxAmount")}
                        />
                    </div>
                </div>
                <div className="flex justify-center gap-2 px-5 py-3 border-t border-slate-200 bg-white flex-shrink-0">
                    <Button type="submit">
                        साठवा
                    </Button>

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            navigate("/dashboard")
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