import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import Layout from "../../../Components/Layout";
import Label from "../../../Components/Label";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";
import apiService from "../../../../apiService";
import Table from "../../../Components/Table";
import GetIPAddress from "../../../utils/ipHelper";
import config from "../../../utils/config";
import Button from "../../../Components/Button";

const FrmDailyCollRpt = () => {
    const { user } = useAuth();
    const ulbId = user?.ulbId;
    const userId = user?.userId;
    const prabhagId = user?.prabhagID;
    const deptId = user?.deptId;
    const { setLoading } = useLoader();
    const navigate = useNavigate();
    const location = useLocation();

    const {
        register,
        watch,
        handleSubmit,
        reset,
        getValues,
        control,
        formState: { errors }
    } = useForm({
        defaultValues: {
            fromDate: "",
            toDate: "",
            collectionCenter: "",
            userName: "",
            payMode: "",
            reportType: "",
            exportTo: "",
            financialYear: ""
        }
    });

    const [ulbCode, setULBCode] = useState(""); 

    const [reportTypes, setReportTypes] = useState([]);
    const [collectionCenterOptions, setCollectionCenterOptions] = useState([]);
    const [userNameOptions, setUserNameOptions] = useState([]);
    const [paymodeOptions, setPaymodeOptions] = useState([]);
    const [financialYearOptions, setFinancialYearOptions] = useState([]);

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

    const handleProcess = async (data) => {
        try {
            setLoading(true);

            console.log(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (ulbId) {
            fetchULBCode();
        }
    }, [ulbId]);

    useEffect(() => {
        if (ulbCode) {
            switch (ulbCode) {
                case "MBMC":
                    setReportTypes([
                        { label: "Daily Collection", value:"dailycoll" },
                        { label: "Daily Collection Summary", value: "dailysumm" },
                        { label: "Collection Summary", value: "collsumm" }
                    ]);
                    break;
                
                case "SMKMC": 
                case "SMKC":
                    setReportTypes([
                        { label: "Daily Collection", value: "dailycoll" },
                        { label: "Tax Wise Collection", value: "taxwiscoll" },
                        { label: "Tax Wise Collection Manually", value: "taxwismanual" }
                    ]);
                    break;
                
                case "UIMC":
                case "IMC": 
                    setReportTypes([
                        { label: "Daily Collection", value: "dailycoll" },
                        { label: "Tax Wise Collection", value: "taxwiscoll" }
                    ]);
                    break;

                default: 
                    setReportTypes([]);

            }
        }
    }, [ulbCode]);

    return (
        <Layout
            title="Daily Collection Report"
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "Daily Collection Report"
            }}
        >
            <form className="w-full space-y-6" onSubmit={handleSubmit(handleProcess)}>
                <div className="grid grid cols-1 md:grid-cols-2 gap-2">
                    <div>
                        <Label
                            text={"From Date / दिनांक पासून:"}
                            required
                        />
                        <input
                            type="date"
                            className={`form-input-box ${errors.fromDate ? "is-invalid" : ""}`}
                            {...register("fromDate", {
                                required: "From Date is required"
                            })}
                        />
                        {errors.fromDate &&
                            <div className="mt-3 text-red-400">
                                {errors.fromDate.message}
                            </div>
                        }
                    </div>
                    <div>
                        <Label
                            text={"To Date /दिनांक पर्यंत:"}
                            required
                        />
                        <input
                            type="date"
                            className={`form-input-box ${errors.toDate ? "is-invalid" : ""}`}
                            {...register("toDate", {
                                required: "To Date is required"
                            })}
                        />
                        {errors.toDate &&
                            <div className="mt-3 text-red-400">
                                {errors.toDate.message}
                            </div>
                        }
                    </div>
                    <div>
                        <Label
                            text={"Collection Center"}
                        />
                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                            {...register("collectionCenter")}
                        >
                            <option value="">
                                -- Select --
                            </option>

                            {collectionCenterOptions.map((opt) => (
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
                            text={"Username / वापरकर्ता"}
                        />
                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                            {...register("userName")}
                        >
                            <option value="">
                                -- Select --
                            </option>

                            {userNameOptions.map((opt) => (
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
                            text={"Pay Mode /देय प्रकार:"}
                            required
                        />
                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                            {...register("payMode")}
                        >
                            <option value="">
                                -- Select --
                            </option>

                            {paymodeOptions.map((opt) => (
                                <option
                                    key={opt.value}
                                    value={opt.value}
                                >
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Report Type */}
                    <div className="flex items-center">
                        <div className="flex flex-wrap gap-4 mt-2">
                            {reportTypes.map((item) => (
                                <label
                                    key={item.value}
                                    className="flex items-center gap-2 text-sm text-slate-700"
                                >
                                    <input
                                        type="radio"
                                        value={item.value}
                                        {...register("reportType", {
                                            required: "Please select Report Type"
                                        })}
                                    />
                                    {item.label}
                                </label>
                            ))}
                        </div>

                        {errors.reportType && (
                            <div className="mt-2 text-red-400 text-sm">
                                {errors.reportType.message}
                            </div>
                        )}
                    </div>

                    {/* Export File Type */}
                    <div>
                        <Label
                            text={"Export To:"}
                            required
                        />

                        <div className="flex flex-wrap gap-4 mt-2">
                            {[
                                { label: "Excel", value: "1" },
                                { label: "PDF", value: "2" }
                            ].map((item) => (
                                <label
                                    key={item.value}
                                    className="flex items-center gap-2 text-sm text-slate-700"
                                >
                                    <input
                                        type="radio"
                                        value={item.value}
                                        {...register("exportTo", {
                                            required: "Please select File Type"
                                        })}
                                    />
                                    {item.label}
                                </label>
                            ))}
                        </div>

                        {errors.exportTo && (
                            <div className="mt-2 text-red-400 text-sm">
                                {errors.exportTo.message}
                            </div>
                        )}
                    </div>
                    <div>
                        <Label
                            text={"Financial Year/ वर्ष:"}
                            required
                        />
                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                            {...register("financialYear")}
                        >
                            <option value="">
                                -- Select --
                            </option>

                            {financialYearOptions.map((opt) => (
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
                        Process
                    </Button>

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            navigate("/dashboard")
                        }}
                    >
                        Back
                    </Button>
                </div>

            </form>


        </Layout>
    )
}

export default FrmDailyCollRpt;