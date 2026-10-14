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

const FrmVasuliChalanGenerationMBMC = () => {
    const { user } = useAuth();
    const { setLoading } = useLoader();
    const navigate = useNavigate();
    const location = useLocation();

    const [ulbOptions, setULBOptions] = useState([{
        label: "मीरा भाईंदर महानगरपालिका", value: "1"
    }]);

    const [collectionCenterOptions, setCollectionCenterOptions] = useState([
        { label: "Ho", value: "1" }
    ]);

    const [paymentModeOptions, setPaymentModeOptions] = useState([
        { label: "Adjustment", value: "1" },
        { label: "Cash", value: "2" },
        { label: "Cheque", value: "3" },
        { label: "Credit / Debit Card", value: "4" },
        { label: "Demand Draft", value: "5" },
        { label: "Online", value: "6" },
        { label: "RTGS/NEFT/IMPS", value: "7" }
    ]);

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
            ulbName: "1",
            collectionCenter: "",
            paymentMode: "",
            fromDate: getToday(),
            toDate: getToday(),
            challanDate: getToday()
        }
    })

    const fetchTableData = async () => {
        try {
            setLoading(true);
            const payload = {};
            const response = await apiService.post("", payload);

            if (response.data.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
                const formatted = response.data.data.map(item => ([
                    item.fromDate,
                    item.toDate,
                    item.challanDate,
                    item.paymode,
                    item.amount,
                    item.collcenterName,
                    item.subby,
                    <span
                        className="text-blue-400 underline cursor-pointer"
                        onClick={() => {

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