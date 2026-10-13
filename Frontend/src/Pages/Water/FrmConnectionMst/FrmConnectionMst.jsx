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

const FrmConnectionMst = () => {
    const { user } = useAuth();
    const { setLoading } = useLoader();
    const navigate = useNavigate();
    const location = useLocation();

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
            consumerType: "",
            meterNumber: "",
            meterMake: "",
            meterOwnerShip: "",
            instDate: "",
            initialReading: "",
            connectionDate: "",
            billingType: "",
            billingMethod: "",
            waterTank: "",
            remark: ""
        },
    });

    const [wardOptions, setWardOptions] = useState([
        { label: "उत्तन विभाग", value: "1" },
        { label: "काशी विभाग", value: "2" },
        { label: "डोंगरी विभाग", value: "3" }
    ]);
    const [zoneOptions, setZoneOptions] = useState([
        { label: "B", value: "1" },
        { label: "A", value: "2" },
        { label: "zone name", value: "3" }
    ]);
    const [blockOptions, setBlockOptions] = useState([
        { label: "Block 1", value: "1" },
    ]);

    // Consumer Details Dropdown
    const [statusOptions, setStatusOptions] = useState([
        { label: "Active", value: "1" },
        { label: "Inactive", value: "2" },
        { label: "Permanently Disconnected", value: "3" }
    ]);
    const [connectionTypeOptions, setConnectionTypeOptions] = useState([
        { label: "Meter", value: "1" }
    ])
    const [connectionCodeOptions, setConnectionCodeOptions] = useState([
        { label: "Group", value: "1" },
        { label: "TA", value: "2" },
        { label: "TA", value: "3" }
    ]);

    // Connection Details Dropdown
    const [connectionSizeOptions, setConnectionSizeOptions] = useState([
        { label: "0.5", value: "0.5" },
        { label: "0.75", value: "0.75" },
        { label: "1", value: "1" }
    ]);
    const [usageTypeOptions, setUsageTypeOptions] = useState([
        { label: "Commercial", value: "1" },
        { label: "Domestic", value: "2" },
        { label: "Industrial", value: "3" }
    ]);
    const [usageSubTypeOptions, setUsageSubTypeOptions] = useState([
        { label: "Bank", value: "1" },
        { label: "Company", value: "2" },
        { label: "Clinic", value: "3" }
    ]);
    const [consumerTypeOptions, setConsumerTypeOptions] = useState([
        { label: "Group Connection", value: "1" },
        { label: "Individual Connection", value: "2" },
        { label: "Not Stated", value: "3" }
    ]);
    const [meterOwnerShipOptions, setMeterOwnerShipOptions] = useState([
        { label: "AGENCY", value: "1" },
        { label: "CITIZEN", value: "2" },
        { label: "Not Stated", value: "3" },
        { label: "Self (Private Meter)", value: "4" }
    ]);
    const [billingTypeOptions, setBillingTypeOptions] = useState([
        { label: "Four Months", value: "1" },
        { label: "Quaterly", value: "2" },
        { label: "Half Yearly", value: "3" },
        { label: "Yearly", value: "4" }
    ]);
    const [billingMethodOptions, setBillingMethodOptions] = useState([
        { label: "Individual Billing", value: "1" },
        { label: "Single", value: "2" },
        { label: "Whole Billing", value: "3" }
    ]);
    const [waterTankOptions, setWaterTankOptions] = useState([
        { label: "Akruti ESR", value: "1" },
        { label: "Asmita Park ESR", value: "2" },
        { label: "Chena ESR", value: "3" }
    ]);


    // Tab Button
    const [consumerDetailsTabOpen, setConsumerDetailsTabOpen] = useState(true);
    const [connectionDetailsTabOpen, setConnectionDetailsTabOpen] = useState(false);

    const fetchDropdowns = async (endpoint, valueKey, labelKey, setter, payload) => {
        try {
            setLoading(true);

            const response = await apiService.post(endpoint, payload);

            if (response.data.success && Array.isArray(response.data.data)) {
                const formatted = response.data.data.map(item => ({
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

    // useEffect(() => {
    //     if (ulbId) {
    //         fetchDropdowns()
    //     }
    // }, [ulbId]);

    const onSubmit = async (values) => {
        try {
            setLoading(true);
        } catch (error) {
            console.error(error);
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
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                            {...register("ward")}
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
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                            {...register("zone")}
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
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                            {...register("block")}
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
                            disabled
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