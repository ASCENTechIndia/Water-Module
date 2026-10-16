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

const FrmReceiptDeleteMst = () => {
    const { user } = useAuth();
    const { setLoading } = useLoader();
    const navigate = useNavigate();
    const location = useLocation();

    const { mode, receiptNumber } = location.state || {
        mode: 1,
        receiptNumber: ""
    } 

    const [wardOptions, setWardOptions] = useState([]);
    const [zoneOptions, setZoneOptions] = useState([]);
    const [blockOptions, setBlockOptions] = useState([]);
    const [paymentModeOptions, setPaymentModeOptions] = useState([]);
    const [bankOptions, setBankOptions] = useState([]);
    const [reasonOptions, setReasonOptions] = useState([
        { label: "Faulty Updation", value: "1" },
        { label: "Wrong Detail", value: "2" },
        { label: "Wrong Entry", value: "3" }
    ]);

    const {
        register,
        watch,
        setValue,
        getValues,
        handleSubmit,
        formState: { errors },
        control,
        reset
    } = useForm({
        defaultValues: {
            connectionNumber: "",
            billNumber: "",
            wardName: "",
            zoneName: "",
            blockName: "",
            name: "",
            address: "",
            bookNumber: "",
            refNumber: "",
            receiptDate: getToday(),
            paymentMode: "",
            instrumentNumber: "",
            instrumentDate: getToday(),
            bankName: "",
            micrNumber: "",
            instrumentType: "",
            billAmount: "",
            dpc: "",
            rebate: "",
            paidAmount: "",
            reason: ""
        }
    });

    const fetchReceiptDetails = async () => {
        try {
            setLoading(true);

            const payload = {
                receiptNumber
            };

            const response = await apiService.post("", payload);

            if (response.data.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
                const data = response.data.data[0];

                setValue("connectionNumber", data.conno);
                setValue("billnumber", data.billno);
                setValue("ward", data.ward);
                setValue("block", data.block);
                setValue("name", data.name);
                setValue("address", data.address);
                setValue("bookNumber", data.bookno);
                setValue("refNumber", data.refno);
                setValue("receiptDate", data.refdate);
                setValue("paymentMode", data.paymode);
                setValue("instrumentNumber", date.insno);
                setValue("instrumentDate", data.insdate);
                setValue("bankName", data.bank);
                setValue("micrNumber", data.micr);
                setValue("instrumentType", data.instrtype);
                setValue("billAmount", data.billamt);
                setValue("dpc", data.dpc);
                setValue("rebate", data.discount);
                setValue("paidAmount", data.amount);
                setValue("reason", data.reason);
            } else {

            }
        } catch (error) {
            console.error(error);
            alert(error.message || "Failed to fetch application details");
        } finally {
            setLoading(false);
        }
    }

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

    const onSubmit = async (values) => {
        try {
            setLoading(true);
            console.log(values);
        } catch (error) {
            console.error(error);
            alert(error.message || "Failed to delete receipt");
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
            <form
                className="w-full space-y-6"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <Label
                            text={"Connection Number: "}
                            required
                        />
                        <input
                            type="text"
                            className="form-input-box bg-slate-200 cursor-not-allowed"
                            disabled
                            {...register("connectionNumber")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"Bill Number: "}
                            required
                        />
                        <input
                            type="text"
                            className="form-input-box bg-slate-200 cursor-not-allowed"
                            disabled
                            {...register("billNumber")}
                        />
                    </div>
                </div>
                <div className="border-t border-slate-200 mt-3"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    <div>
                        <Label
                            text={"Ward"}
                            required
                        />
                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm bg-slate-200 cursor-not-allowed"
                            disabled
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
                            text={"Block"}
                            required
                        />
                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm bg-slate-200 cursor-not-allowed"
                            disabled
                            {...register("blockName")}
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
                            text={"Name"}
                            required
                        />
                        <input
                            type="text"
                            className="form-input-box bg-slate-200 cursor-not-allowed"
                            disabled
                            {...register("name")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"Address"}
                            required
                        />
                        <input
                            type="text"
                            className="form-input-box bg-slate-200 cursor-not-allowed"
                            disabled
                            {...register("address")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"Book Number"}
                            required
                        />
                        <input
                            type="text"
                            className="form-input-box bg-slate-200 cursor-not-allowed"
                            disabled
                            {...register("bookNumber")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"Ref Number"}
                            required
                        />
                        <input
                            type="text"
                            {...register("refNumber")}
                            className="form-input-box bg-slate-200 cursor-not-allowed"
                            disabled
                        />
                    </div>
                    <div>
                        <Label
                            text={"Receipt Date"}
                            required
                        />
                        <input
                            type="date"
                            className="form-input-box bg-slate-200 cursor-not-allowed"
                            disabled
                            {...register("receiptDate")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"Payment Mode"}
                            required
                        />
                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm bg-slate-200 cursor-not-allowed"
                            disabled
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
                            text={"Instrument Number"}
                            required
                        />
                        <input
                            type="text"
                            className="form-input-box bg-slate-200 cursor-not-allowed"
                            disabled
                            {...register("instrumentNumber")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"Instrument Date"}
                            required
                        />
                        <input
                            type="date"
                            className="form-input-box bg-slate-200 cursor-not-allowed"
                            disabled
                            {...register("instrumentDate")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"Bank Name"}
                            required
                        />
                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm bg-slate-200 cursor-not-allowed"
                            disabled
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
                            text={"MICR Number"}
                            required
                        />
                        <input
                            type="text"
                            className="form-input-box bg-slate-200 cursor-not-allowed"
                            disabled
                            {...register("micrNumber")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"Instrument Type"}
                            required
                        />
                        <input
                            type="text"
                            className="form-input-box bg-slate-200 cursor-not-allowed"
                            disabled
                            {...register("instrumentType")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"Bill Amount"}
                            required
                        />
                        <input
                            type="text"
                            className="form-input-box bg-slate-200 cursor-not-allowed"
                            disabled
                            {...register("billAmount")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"DPC"}
                            required
                        />
                        <input
                            type="text"
                            {...register("dpc")}
                            className="form-input-box bg-slate-200 cursor-not-allowed"
                            disabled
                        />
                    </div>
                    <div>
                        <Label
                            text={"Rebate"}
                            required
                        />
                        <input
                            type="text"
                            {...register("rebate")}
                            className="form-input-box bg-slate-200 cursor-not-allowed"
                            disabled
                        />
                    </div>
                    <div>
                        <Label
                            text={"Paid Amount"}
                            required
                        />
                        <input
                            type="text"
                            {...register("paidAmount")}
                            className="form-input-box bg-slate-200 cursor-not-allowed"
                            disabled
                        />
                    </div>
                    <div>
                        <Label
                            text={"Reason"}
                            required
                        />
                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                            {...register("reason")}
                        >
                            <option value="">
                                -- Select --
                            </option>

                            {reasonOptions.map((opt) => (
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
                    <Button
                        type="submit"
                    >
                        Submit
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            navigate("/Transaction/FrmReceiptDeleteList");
                        }}
                    >
                        Back
                    </Button>
                </div>
            </form>
        </Layout>
    )
}

export default FrmReceiptDeleteMst;