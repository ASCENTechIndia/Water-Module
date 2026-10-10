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

const getToday = () => {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
};

const FrmBillGeneration = () => {
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
            zone: "",
            block: "",
            connectionNumber: "",
            dueDate: getToday()
        }
    });

    const [selectedZone, setSelectedZone] = useState("");

    const [zoneOptions, setZoneOptions] = useState([
        { label: "G", value: "1" },
        { label: "I", value: "2" },
        { label: "N", value: "3" }
    ]);

    const [blockOptions, setBlockOptions] = useState([
        { label: "Block 1", value: "1" }
    ]);

    const fetchZoneDropdown = async () => {
        try {
            setLoading(true);

            const payload = {};

            const response = await apiService.post("", payload);

            if (response.data.success && Array.isArray(response.data.data)) {
                const formatted = response.data.data.map(item => ({
                    label: item.zoneid,
                    value: item.zonename
                }));

                setZoneOptions(formatted);
            } else {
                setZoneOptions([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchBlockDropdown = async () => {
        try {
            setLoading(true);

            const payload = {
                zone: selectedZone
            };

            const response = await apiService.post("", payload);

            if (response.data.success && Array.isArray(response.data.data)) {
                const formatted = response.data.data.map(item => ({
                    label: item.blockid,
                    value: item.blockname
                }));

                setBlockOptions(formatted);
            } else {
                setBlockOptions([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleBillGenerate = async (values) => {
        try {
            setLoading(true);
            console.log(values);
        } catch (error) {
            console.error(error);
            alert(error.message || "Failed to generate bill");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Layout
            title="Bill Generation"
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "Bill Generation",
            }}
        >
            <form onSubmit={handleSubmit(handleBillGenerate)} className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                            required
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
                            text={"Connection Number: "}
                        />
                        <input
                            type="text"
                            className="form-input-box"
                            {...register("connectionNumber")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"Due Date: "}
                        />
                        <input
                            type="date"
                            className="form-input-box"
                            {...register("dueDate")}
                        />
                    </div>
                </div>
                <div className="flex justify-center gap-2 px-5 py-3 border-t border-slate-200 bg-white flex-shrink-0">
                    <Button type="submit">
                        Generate
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            navigate("/dashboard");
                        }}
                    >
                        Close
                    </Button>
                </div>
            </form>
        </Layout>
    )
};

export default FrmBillGeneration;