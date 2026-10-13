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

const emptyTableRow = {
    connectionNo: "",
    name: "",
    meterNo: "",
    lastReading: "",
    readingDate: getToday(),
    currentReading: "",
    consumptionQty: "",
    gapCode: ""
};

const FrmMeterReadingEntry = () => {
    const { user } = useAuth();
    const { setLoading } = useLoader();
    const navigate = useNavigate();
    const location = useLocation();

    const [tableHeader, setTableHeader] = useState([
        "Connection Number",
        "Name",
        "Meter Number",
        "Last Reading",
        "Reading Date",
        "Current Reading",
        "Consumption Quantity",
        "GAP Code"
    ]);
    const [tableData, setTableData] = useState([]);

    const [checked, setChecked] = useState(false);
    const [wardOptions, setWardOptions] = useState([]);
    const [zoneOptions, setZoneOptions] = useState([]);
    const [blockOptions, setBlockOptions] = useState([]);
    const [gapCodeOptions, setGapCodeOptions] = useState([]);

    const {
        register,
        control,
        watch,
        setValue,
        getValues,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            ward: "",
            zone: "",
            block: "",
            connectionSlab: "",
            fromConnectionNo: "",
            toConnectionNo: "",
            billingCycle1: "",
            billingCycle2: "",
            tableRow: [{ ...emptyTableRow }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "tableRow",
    });

    const fetchTableData = async () => {
        try {
            setLoading(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

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
            title="Meter Reading Entry"
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "Meter Reading Entry",
            }}
        >
            <form className="w-full space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                        <Label
                            text={"Ward"}
                            required
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
                            required
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
                    <div className="flex items-center gap-4">
                        <div>
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => {
                                    setChecked(e.target.checked);
                                }}
                                className="h-4 w-4"
                            />
                        </div>

                        <div >
                            <Label
                                text={"Connection Slab"}
                            />
                        </div>

                    </div>
                    <div>
                        <Label
                            text={"From Connection No: "}
                        />
                        <input
                            type="text"
                            className={`form-input-box ${checked ? "" : "bg-slate-200 cursor-not-allowed"}`}
                            {...register("fromConnectionNo")}
                            disabled={!checked}
                        />
                    </div>
                    <div>
                        <Label
                            text={"To Connection No: "}
                        />
                        <input
                            type="text"
                            className={`form-input-box ${checked ? "" : "bg-slate-200 cursor-not-allowed"}`}
                            {...register("toConnectionNo")}
                            disabled={!checked}
                        />
                    </div>
                </div>
                <div className="flex justify-center gap-2 px-5 py-3 border-t border-slate-200 bg-white flex-shrink-0">
                    <Button
                        type="button"
                        onClick={() => {
                            // fetchTableData();
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        type="button"
                        onClick={() => {
                            setTableData([]);
                            reset();
                        }}
                    >
                        Reset
                    </Button>
                </div>
                <div className="grid grid-cols-1 border-t border-slate-200 mt-3">
                    <div>
                        <Label
                            text={"Billing Cycle:"}
                        />
                        <div className="flex gap-3">
                            <input
                                type="text"
                                className="form-input-box bg-slate-200 cursor-not-allowed"
                                {...register("billingCycle1")}
                            />
                            <input
                                type="text"
                                className="form-input-box bg-slate-200 cursor-not-allowed"
                                {...register("billingCycle2")}
                            />
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-slate-200 overflow-hidden mt-3">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1500px] table-fixed border-collapse">
                            <thead className="bg-slate-100/95">
                                <tr className="border-b border-slate-200">
                                    {tableHeader.map(item => (
                                        <th className="w-12 px-3 py-3 text-center text-[12px] font-bold uppercase tracking-wider text-slate-600">
                                            {item}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {fields.map((field, index) => (
                                    <tr key={field.id} className="hover:bg-slate-50">

                                        {/* Connection Number */}
                                        <td className="border border-slate-200 px-2 py-2">
                                            <input
                                                type="text"
                                                className="form-input-box w-full bg-slate-200 cursor-not-allowed"
                                                disabled
                                                {...register(`tableRow.${index}.connectionNo`)}
                                            />
                                        </td>

                                        {/* Name */}
                                        <td className="border border-slate-200 px-2 py-2">
                                            <input
                                                type="text"
                                                className="form-input-box w-full bg-slate-200 cursor-not-allowed"
                                                disabled
                                                {...register(`tableRow.${index}.name`)}
                                            />
                                        </td>

                                        {/* Meter Number */}
                                        <td className="border border-slate-200 px-2 py-2">
                                            <input
                                                type="text"
                                                className="form-input-box w-full bg-slate-200 cursor-not-allowed"
                                                disabled
                                                {...register(`tableRow.${index}.meterNo`)}
                                            />
                                        </td>

                                        {/* Last Reading */}
                                        <td className="border border-slate-200 px-2 py-2">
                                            <input
                                                type="number"
                                                className="form-input-box w-full bg-slate-200 cursor-not-allowed"
                                                disabled
                                                {...register(`tableRow.${index}.lastReading`)}
                                            />
                                        </td>

                                        {/* Reading Date */}
                                        <td className="border border-slate-200 px-2 py-2">
                                            <input
                                                type="date"
                                                className="form-input-box w-full"
                                                {...register(`tableRow.${index}.readingDate`)}
                                            />
                                        </td>

                                        {/* Current Reading */}
                                        <td className="border border-slate-200 px-2 py-2">
                                            <input
                                                type="number"
                                                className="form-input-box w-full"
                                                {...register(`tableRow.${index}.currentReading`)}
                                            />
                                        </td>

                                        {/* Consumption Quantity */}
                                        <td className="border border-slate-200 px-2 py-2">
                                            <input
                                                type="number"
                                                className="form-input-box w-full"
                                                {...register(`tableRow.${index}.consumptionQty`)}
                                            />
                                        </td>

                                        {/* GAP Code */}
                                        <td className="border border-slate-200 px-2 py-2">
                                            <input
                                                type="text"
                                                className="form-input-box w-full"
                                                {...register(`tableRow.${index}.gapCode`)}
                                            />
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="flex justify-center gap-2 px-5 py-3 border-t border-slate-200 bg-white flex-shrink-0">
                    <Button
                        type="submit"
                    >
                        Submit
                    </Button>
                    <Button
                        type="button"
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

};

export default FrmMeterReadingEntry;