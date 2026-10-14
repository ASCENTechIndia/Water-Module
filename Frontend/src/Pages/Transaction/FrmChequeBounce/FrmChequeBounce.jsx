import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import Label from "../../../Components/Label";
import Layout from "../../../Components/Layout";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";
import apiService from "../../../../apiService";
import ConfigTable from "../../../Components/ConfigTable.jsx";
import Button from "../../../Components/Button.jsx";
import Table from "../../../Components/Table";

const getToday = () => {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
};

const FrmChequeBounce = () => {
    const { user } = useAuth();
    const { setLoading } = useLoader();
    const navigate = useNavigate();
    const location = useLocation();

    const [tableHeader, setTableHeader] = useState([]);
    const [tableData, setTableData] = useState([]);

    const [ulbOptions, setULBOptions] = useState([{
        label: "मीरा भाईंदर महानगरपालिका", value: "1"
    }]);
    const [zoneOptions, setZoneOptions] = ([
        { label: "G", value: "1" },
        { label: "I", value: "2" },
        { label: "N", value: "3" }
    ])
    const [bankOptions, setBankOptions] = useState([]);

    const {
        register,
        setValue,
        getValues,
        reset,
        handleSubmit,
        formState: { errors },
        control
    } = useForm({
        defaultValues: {
            ulbName: "1",
            zoneName: "",
            chequeNumber: "",
            bankName: "",
            chequeMoney: "",
            receiptDate: getToday(),
            mobileNumber: ""
        }
    });

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

    const handleSearch = async () => {
        try {
            setLoading(true);
        } catch (error) {
            console.log(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    const onSubmit = async (values) => {
        try {
            setLoading(true);
        } catch (error) {
            console.log(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Layout
            title="Cheque Bounce"
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "Cheque Bounce",
            }}
        >
            <form
                className="w-full space-y-6"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <Label
                            text={"ULB Name: "}
                            required
                        />

                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm bg-slate-100 cursor-not-allowed"
                            {...register("ulbName")}
                            disabled
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
                            text={"Zone: "}
                            required
                        />

                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                            {...register("zoneName")}
                        >
                            <option value="">
                                -- Select --
                            </option>

                            {/* {zoneOptions.map((opt) => (
                                <option
                                    key={opt.value}
                                    value={opt.value}
                                >
                                    {opt.label}
                                </option>
                            ))} */}
                        </select>
                    </div>
                    <div>
                        <Label
                            text={"Cheque Number: "}
                            required
                        />
                        <input
                            type="text"
                            className="form-input-box"
                            {...register("chequeNumber")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"Bank: "}
                            required
                        />

                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                            {...register("bankName")}
                        >
                            <option value="">
                                -- Select --
                            </option>

                            {bankOptions.map((opt) => (
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
                            text={"चेक रक्कम: "}
                            required
                        />
                        <input
                            type="text"
                            className="form-input-box"
                            {...register("chequeMoney")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"पावती दिनांक: "}
                        />
                        <input
                            type="date"
                            className="form-input-box"
                            {...register("receiptDate")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"Mobile Number: "}
                        />
                        <input
                            type="text"
                            className="form-input-box"
                            {...register("mobileNumber")}
                        />
                    </div>
                </div>
                <div className="flex justify-center gap-2 px-5 py-3 border-t border-slate-200 bg-white flex-shrink-0">
                    <Button 
                        type="button"
                        onClick={() => { 
                            // handleSearch();
                        }}
                    >
                        Search
                    </Button>
                </div>
            </form>
        </Layout>
    )
};

export default FrmChequeBounce;