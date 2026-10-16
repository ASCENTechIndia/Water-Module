import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import Label from "../../../Components/Label";
import Layout from "../../../Components/Layout";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";
import apiService from "../../../../apiService";
import ConfigTable from "../../../Components/ConfigTable.jsx";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";

const FrmConnectionSearch = () => {
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
            ulbName: "1",
            ward: "",
            zone: "",
            block: "",
            ptnNumber: "",
            connectionNumber: "",
            applicantName: "",
            address: "",
            meterNumber: "",
            mobileNumber: "",
            connectionType: "",
            connectionCode: "",
            usageType: "",
            usageSubType: ""
        },
    });

    const [ulbOptions, setULBOptions] = useState([{
        label: "मीरा भाईंदर महानगरपालिका", value: "1"
    }]);

    const [wardOptions, setWardOptions] = useState([]);
    const [zoneOptions, setZoneOptions] = useState([]);
    const [blockOptions, setBlockOptions] = useState([]);
    const [connectionTypeOptions, setConnectionTypeOptions] = useState([]);
    const [connectionCodeOptions, setConnectionCodeOptions] = useState([]);
    const [usageTypeOptions, setUsageTypeOptions] = useState([]);
    const [usageSubTypeOptions, setUsageSubTypeOptions] = useState([]);

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

    const handleSearch = async (values) => {
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
            title="Connection Search"
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "Connection Search",
            }}
        >
            <form onSubmit={handleSubmit(handleSearch)} className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <Label
                            text={"ULB Name: "}
                            required
                        />
                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm bg-slate-100 cursor-not-allowed"
                            disabled
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
                            text={"Ward: "}
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
                            text={"Zone: "}
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
                            text={"Block: "}
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
                            text={"PTN Number"}
                        />
                        <input
                            type="text"
                            className="form-input-box"
                            {...register("ptnNumber")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"Application Name"}
                        />
                        <input
                            type="text"
                            className="form-input-box"
                            {...register("applicantName")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"Address"}
                        />
                        <input
                            type="text"
                            className="form-input-box"
                            {...register("address")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"Meter Number"}
                        />
                        <input
                            type="text"
                            className="form-input-box"
                            {...register("meterNumber")}
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
                            text={"Connection Type: "}
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
                            text={"Connection Code: "}
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
                    <div>
                        <Label
                            text={"Usage Type: "}
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
                </div>
                <div className="flex justify-center gap-2 px-5 py-3 border-t border-slate-200 bg-white flex-shrink-0">
                    <Button type="submit">
                        Search
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            navigate("/dashboard");
                        }}
                    >
                        Back
                    </Button>
                </div>
            </form>
        </Layout>
    )

}

export default FrmConnectionSearch;