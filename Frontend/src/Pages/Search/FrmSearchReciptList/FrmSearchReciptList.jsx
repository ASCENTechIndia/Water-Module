import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import Label from "../../../Components/Label.jsx";
import { useLoader } from "../../../Context/LoaderContext.jsx";
import { useAuth } from "../../../Context/AuthContext.jsx";
import apiService from "../../../../apiService.js";
import ConfigTable from "../../../Components/ConfigTable.jsx.jsx";
import Button from "../../../Components/Button.jsx";
import Table from "../../../Components/Table.jsx";
import RadioGroup from "../../../Components/RadioGroup.jsx";
import Layout from "../../../Components/Layout.jsx";
import CheckboxGroup from "../../../Components/CheckboxGroup.jsx";

const getToday = () => {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
};

const FrmSearchReciptList = () => {
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
            receiptSearch: "coll",
            financialYear: "",
            oldConnectionNumber: "",
            newConnectionNumber: "",
            flatNumber: "",
            subCode: "",
            receiptNumber: "",
            bankName: "",
            mobileNumber: "",
            chequeNumber: "",
            fromDate: getToday(),
            toDate: getToday()
        },
    });

    const [checked, setChecked] = useState(false);
    const [tableHeader, setTableHeader] = useState([]);
    const [tableData, setTableData] = useState([]);

    const [ulbOptions, setULBOptions] = useState([{
        label: "मीरा भाईंदर महानगरपालिका", value: "1"
    }]);

    const [yearsOption, setYearsOption] = useState([
        { label: "Current Year", value: "26-27" }
    ]);

    const [flatOptions, setFlatOptions] = useState([
        { label: "Flat No. 1", value: "1" }
    ])

    const handleSearch = async (values) => {
        try {
            setLoading(true);

            console.log(values);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout
            title="Search Receipt List"
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "Search Receipt List",
            }}
        >
            <form onSubmit={handleSubmit(handleSearch)} className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <Label
                            text={"नगरपालिकेचे नाव: "}
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
                            text={"पावती शोधा : "}
                            required
                        />

                        <Controller
                            name="receiptSearch"
                            control={control}
                            rules={{ required: "कृपया पावती शोधण्याची पद्धत निवडा." }}
                            render={({ field }) => (
                                <RadioGroup
                                    name={field.name}
                                    options={[
                                        { label: "कनेक्शन क्र. नुसार", value: "coll" },
                                        { label: "दिनांकाप्रमाणे", value: "date" }
                                    ]}
                                    value={field.value}
                                    onChange={field.onChange}
                                    direction="horizontal"
                                    required
                                    className="mt-2"
                                    error={errors.receiptSearch?.message}
                                />
                            )}
                        />
                    </div>
                    <div>
                        <Label
                            text={"आर्थिक वर्ष"}
                            required
                        />
                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                            {...register("financialYear")}
                        >
                            <option value="">
                                -- Select --
                            </option>

                            {yearsOption.map((opt) => (
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
                            text={"Old Connection Number"}
                        />
                        <input
                            type="text"
                            className="form-input-box"
                            {...register("oldConnectionNumber")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"Connection Number"}
                        />
                        <input
                            type="text"
                            className="form-input-box"
                            {...register("newConnectionNumber")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"Flat No: "}
                        />

                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                            {...register("flatNumber")}
                        >
                            <option value="">
                                -- Select --
                            </option>

                            {flatOptions.map((opt) => (
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
                            text={"सब कोड: "}
                            required
                        />
                        <input
                            type="text"
                            className="form-input-box"
                            {...register("subCode")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"पावती क्र: "}
                            required
                        />
                        <input
                            type="text"
                            className="form-input-box"
                            {...register("receiptNumber")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"Bank Name: "}
                            required
                        />
                        <input
                            type="text"
                            className="form-input-box"
                            {...register("bankName")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"Mobile Number: "}
                            required
                        />
                        <input
                            type="text"
                            className="form-input-box"
                            {...register("mobileNumber")}
                        />
                    </div>
                    <div className="flex gap-2">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => {
                                    setChecked(e.target.checked);
                                    setValue("chequeNumber", "")
                                }}
                                className="h-4 w-4"
                            />
                        </div>

                        <div className="flex-1">
                            <Label text={"धनादेश क्र. :"} />

                            <input
                                type="text"
                                className={`form-input-box w-full ${checked ? "" : "bg-slate-200 cursor-not-allowed"}`}
                                disabled={!checked}
                                {...register("chequeNumber")}
                            />
                        </div>
                    </div>
                    <div>
                        <Label
                            text={"दिनांकापासून"}
                        />
                        <input
                            type="date"
                            className="form-input-box bg-slate-200 cursor-not-allowed"
                            disabled
                            {...register("fromDate")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"दिनांकापर्यंत"}
                        />
                        <input
                            type="date"
                            className="form-input-box bg-slate-200 cursor-not-allowed"
                            disabled
                            {...register("toDate")}
                        />
                    </div>
                </div>
                <div className="flex justify-center gap-2 px-5 py-3 border-t border-slate-200 bg-white flex-shrink-0">
                    <Button type="submit">
                        Search
                    </Button>
                </div>
            </form>
        </Layout>
    )
};

export default FrmSearchReciptList;