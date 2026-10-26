import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import Label from "../../../Components/Label";
import Layout from "../../../Components/Layout";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";
import apiService from "../../../../apiService";
import ConfigTable from "../../../Components/ConfigTable.jsx";
import Button from "../../../Components/Button.jsx";
import Table from "../../../Components/Table.jsx";

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

    return `${day}-${month}-${year}`;
};

const FrmVasuliChalanGenerationMBMC = () => {
    const { user } = useAuth();
    const ulbId = user?.ulbId;
    const userId = user?.userId;
    const prabhagId = user?.prabhagID;
    const deptId = user?.deptId;
    const { setLoading } = useLoader();
    const navigate = useNavigate();
    const location = useLocation();

    const [ulbOptions, setULBOptions] = useState([]);

    const [collectionCenterOptions, setCollectionCenterOptions] = useState([]);

    const [paymentModeOptions, setPaymentModeOptions] = useState([]);

    const [tableData, setTableData] = useState([]);
    const [tableHeader, setTableHeader] = useState([
        "From Date",
        "To Date",
        "Challan Date",
        "Payment Mode",
        "Amount",
        "Collection Center Name",
        "Challan Submit By",
        "Generate"
    ])

    const {
        register,
        watch,
        setValue,
        getValues,
        handleSubmit,
        reset,
        control
    } = useForm({
        defaultValues: {
            ulbName: "",
            collectionCenter: "",
            paymentMode: "",
            fromDate: getToday(),
            toDate: getToday(),
            challanDate: getToday()
        }
    });

    const watchULB = watch("ulbName");

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

    const fetchPayTypeDropdown = async () => {
        try {
            setLoading(true);
            const url = `/transaction/getPaymentMenu?ulbId=${encodeURIComponent(watchULB)}`;
            const response = await apiService.get(url);

            if (
                response?.success &&
                Array.isArray(response?.data)
            ) {
                const formatted = response.data.map((item) => ({
                    label: item.RECMODNAME,
                    value: item.RECMODEID,
                }));

                setPaymentModeOptions(formatted);
            } else {
                setPaymentModeOptions([]);
            }
        } catch (error) {
            setPaymentModeOptions([]);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCollectionCenterDropdown = async () => {
        try {
            setLoading(true);
            const url = `/config/getCollectionCenterDropdown?ulbId=${encodeURIComponent(watchULB)}`;
            const response = await apiService.get(url);

            if (
                response?.success &&
                Array.isArray(response?.data)
            ) {
                const formatted = response.data.map((item) => ({
                    label: item.COLLCENTRE_NAME,
                    value: item.COLLCENTRE_ID,
                }));

                setCollectionCenterOptions(formatted);
            } else {
                setCollectionCenterOptions([]);
            }
        } catch (error) {
            setCollectionCenterOptions([]);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async (data) => {
        try {
            setLoading(true);
            console.log(data);
        } catch (error) {
            console.error("Failed to generate challan number: ", error);
            alert(error.message || "Failed to generate challan number");
        } finally {
            setLoading(false);
        }
    }

    const fetchTableData = async () => {
        try {
            setLoading(true);
            const response = await apiService.get("/transaction/getVasuliChallanTableData");

            if (response.success && Array.isArray(response.data) && response.data.length > 0) {
                const formatted = response.data.map(item => ([
                    formatDate(item.FRMDATE),
                    formatDate(item.TODATE),
                    formatDate(item.CHALANDATA),
                    item.RECMODNAME,
                    item.AMOUNT,
                    item.COLLCENTRE_NAME,
                    item.USERDL,
                    <span
                        className="text-blue-400 underline cursor-pointer"
                        onClick={() => {
                            handleGenerate(item);
                        }}
                    >
                        Generate
                    </span>
                ]));

                setTableData(formatted);
            } else {
                setTableData([]);
            }
        } catch (error) {
            console.error(error);
            alert(error.message || "Failed to fetch table data");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchULBDropdown();
        fetchTableData();
    }, [])

    useEffect(() => {
        if (watchULB) {
            fetchPayTypeDropdown();
            fetchCollectionCenterDropdown();
        }
    }, [watchULB]);

    return (
        <Layout
            title="वसुली चलन निर्मिती"
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "वसुली चलन निर्मिती",
            }}
        >
            <form
                className="w-full space-y-6"
            // onSubmit={handleSubmit(onSubmit)}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <Label
                            text={"ULB Name: "}
                            required
                        />

                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                            {...register("ulbName")}
                            // disabled
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
                            text={"कलेक्शन सेंटर/झोन: "}
                            required
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
                            text={"देय प्रकार: "}
                            required
                        />

                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                            {...register("paymentMode")}
                        >
                            <option value="">
                                -- Select --
                            </option>

                            {paymentModeOptions.map((opt) => (
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
                            text={"दिनांका पासुन: "}
                            required
                        />
                        <input
                            type="date"
                            className="form-input-box"
                            {...register("fromDate")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"दिनांका पर्यत: "}
                            requiredx
                        />
                        <input
                            type="date"
                            className="form-input-box"
                            {...register("toDate")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"चलन दिनांक: "}
                            required
                        />
                        <input
                            type="date"
                            className="form-input-box"
                            {...register("challanDate")}
                        />
                    </div>
                </div>
                <div className="mt-3">
                    <Table
                        headers={tableHeader}
                        data={tableData}
                    />
                </div>
            </form>
        </Layout>
    )
}

export default FrmVasuliChalanGenerationMBMC;