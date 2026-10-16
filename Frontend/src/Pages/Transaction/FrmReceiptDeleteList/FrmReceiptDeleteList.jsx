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
import Table from "../../../Components/Table.jsx";

const getToday = () => {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
};

const FrmReceiptDeleteList = () => {
    const { user } = useAuth();
    const { setLoading } = useLoader();
    const navigate = useNavigate();
    const location = useLocation();

    const [tableHeader, setTableHeader] = useState([
        "निवडा",
        "पूस्तक क्र.",
        "पावती क्र",
        "धनादेश क्र.",
        "दिनांक",
        "रक्कम",
        "सूट रक्कम",
        "एकूण देय रक्कम",
        "मालमत्ता क्र.",
        "रोकड",
        "मालक",
        "वॉर्ड क्र.",
        "झोन"
    ]);
    const [tableData, setTableData] = useState([]);

    const [financialYearOptions, setFinancialYearOptions] = useState([
        { label: "Current Year", value: "1" }
    ]);
    const [wardOptions, setWardOptions] = useState([
        { label: "उत्तन विभाग", value: "1" },
        { label: "डोंगरी विभाग", value: "2" },
        { label: "मीरा विभाग", value: "3" }
    ]);
    const [zoneOptions, setZoneOptions] = useState([
        { label: "B", value: "1" },
        { label: "A", value: "2" },
        { label: "zone name", value: "3" },
        { label: "zone name three", value: "4" }
    ]);

    const {
        register,
        reset,
        setValue,
        getValues,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            financialYear: "1",
            wardName: "",
            zoneName: "",
            connectionNumber: "",
            receiptNumber: "",
            fromDate: getToday(),
            toDate: getToday()
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

    const handleSearch = async (values) => {
        try {
            setLoading(true);
            console.log(values);
            const payload = {

            };
            return;
            const response = await apiService.post("", payload);

            if (response.data.success && Array.isArray(response.data.data)) {
                const formatted = response.data.data.map(item => ([
                    <span
                        className="text-blue-400 underline cursor-pointer"
                        onClick={() => {
                            navigate("/Transaction/FrmReceiptDeleteMst", {
                                state: {
                                    receiptNumber: item.recno,
                                    mode: 2
                                }
                            })
                        }}
                    >
                        Select
                    </span>,
                    item.book_no,
                    item.recno,
                    item.chequeno,
                    item.date,
                    item.amt,
                    item.discount,
                    item.paymode,
                    item.propno,
                    item.paymode,
                    item.owner,
                    item.wardId,
                    item.zoneid
                ]));

                setTableData(formatted);
            } else {
                setTableData([]);
            }
        } catch (error) {
            console.error(error);
            alert(error.message || "Failed to fetch details");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Layout
            title="Receipt Delete List"
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "Receipt Delete List",
            }}
        >
            <form
                className="w-full space-y-6"
                onSubmit={handleSubmit(handleSearch)}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <Label
                            text={"आर्थिक वर्ष: "}
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
                    <div>
                        <Label
                            text={"वॉर्ड नं: "}
                            required
                        />

                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                            {...register("wardName")}
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
                            text={"झोन: "}
                            required
                        />

                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                            {...register("zoneName")}
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
                            text={"Connection Number"}
                        />
                        <input 
                            type="text"
                            className="form-input-box"
                            {...register("connectionNumber")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"पावती क्र."}
                        />
                        <input 
                            type="text"
                            className="form-input-box"
                            {...register("receiptNumber")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"दिनांकापासून"}
                        />
                        <input 
                            type="date"
                            className="form-input-box"
                            {...register("fromDate")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"दिनांकापर्यंत"}
                        />
                        <input 
                            type="date"
                            className="form-input-box"
                            {...register("toDate")}
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
                    <Button 
                        type="button"
                        variant="secondary"
                        onClick={() => { 
                            reset({
                                connectionNumber: "",
                                fromDate: getToday(),
                                toDate: getToday(),
                                receiptNumber: "",
                                zoneName: "",
                                wardName: "",
                                financialYear: "1"
                            })
                        }}
                    >
                        Reset
                    </Button>
                </div>
                {tableData.length > 0 && <div className="mt-3">
                    <Table 
                        headers={tableHeader}
                        data={tableData}
                    />
                </div>}
            </form>
        </Layout>
    )
}

export default FrmReceiptDeleteList;