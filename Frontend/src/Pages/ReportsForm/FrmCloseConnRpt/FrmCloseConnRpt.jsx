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

const FrmCloseConnRpt = () => {
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
        setValue,
        watch,
        handleSubmit,
        reset,
        control,
        formState: { errors }
    } = useForm({
        defaultValues: {
            ulbName: "",
            connectionType: "",
            prabhagName: "",
            blockName: "",
            fromRupees: "",
            toRupees: "",
            totalArrearsCurrent: ""
        }
    });

    const [ulbOptions, setULBOptions] = useState([]);
    const [connectionTypeOptions, setConnectionTypeOptions] = useState([]);
    const [prabhagOptions, setPrabhagOptions] = useState([]);
    const [blockOptions, setBlockOptions] = useState([]);
    const [totalArrearsCurrentChecked, setTotalArrearsCurrentChecked] = useState(false);

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

    const handlePrint = async (data) => {
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
            title="Close Connection List Report"
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "Close Connection List Report"
            }}
        >
            <form className="w-full space-y-6" onSubmit={handleSubmit(handlePrint)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                        <Label
                            text={"नगरपालिका: "}
                            required
                        />
                        <select
                            className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm bg-slate-200 cursor-not-allowed ${errors.ulbName ? "is-invalid" : ""}`}
                            {...register("ulbName", {
                                required: "ULB Name is required"
                            })}
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
                        {errors.ulbName &&
                            <div className="mt-3 text-red-400">
                                {errors.ulbName.message}
                            </div>
                        }
                    </div>
                    <div>
                        <Label
                            text={"Connection Type: "}
                            required
                        />
                        <select
                            className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm ${errors.connectionType ? "is-invalid" : ""}`}
                            {...register("connectionType", {
                                required: "Connection Type is required"
                            })}
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
                        {errors.connectionType &&
                            <div className="mt-3 text-red-400">
                                {errors.connectionType.message}
                            </div>
                        }
                    </div>
                    <div>
                        <Label
                            text={"प्रभागाचे नाव: "}
                            required
                        />
                        <select
                            className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm ${errors.prabhagName ? "is-invalid" : ""}`}
                            {...register("prabhagName", {
                                required: "Prabhag is required"
                            })}
                        >
                            <option value="">
                                -- Select --
                            </option>

                            {prabhagOptions.map((opt) => (
                                <option
                                    key={opt.value}
                                    value={opt.value}
                                >
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        {errors.prabhagName &&
                            <div className="mt-3 text-red-400">
                                {errors.prabhagName.message}
                            </div>
                        }
                    </div>
                    <div>
                        <Label
                            text={"Block Name: "}
                            required
                        />
                        <select
                            className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm ${errors.blockName ? "is-invalid" : ""}`}
                            {...register("blockName", {
                                required: "Block is required"
                            })}
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
                        {errors.blockName &&
                            <div className="mt-3 text-red-400">
                                {errors.blockName.message}
                            </div>
                        }
                    </div>
                    <div>
                        <Label
                            text={"रक्कम रु.पासून: "}
                        />
                        <input
                            type="text"
                            className="form-input-box"
                            {...register("fromRupees")}
                            onInput={(e) => {
                                e.target.value = e.target.value.replace(/[^0-9]/g, "");
                            }}
                            maxLength={10}
                        />
                    </div>
                    <div>
                        <Label
                            text={"रक्कम रु.पर्यंत: "}
                        />
                        <input
                            type="text"
                            className="form-input-box"
                            {...register("toRupees")}
                            onInput={(e) => {
                                e.target.value = e.target.value.replace(/[^0-9]/g, "");
                            }}
                            maxLength={10}
                        />
                    </div>
                    <div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                value={totalArrearsCurrentChecked}
                                onChange={() => {
                                    setTotalArrearsCurrentChecked(!totalArrearsCurrentChecked);
                                }}
                            />
                            <Label
                                text={"एकूण, मागील व चालू: "}
                                className="mb-[-1px]"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-2">
                            {[
                                { label: "सर्व", value: "1" },
                                { label: "निवासी", value: "2" },
                                { label: "वाणिज्य", value: "3" }
                            ].map((item) => (
                                <label
                                    key={item.value}
                                    className="flex items-center gap-2 text-sm cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        value={item.value}
                                        {...register("totalArrearsCurrent")}
                                        className="w-3 h-3"
                                    />
                                    {item.label}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex justify-center gap-2 px-5 py-3 border-t border-slate-200 bg-white flex-shrink-0">
                    <Button type="submit">
                        Print
                    </Button>

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            navigate("/dashboard")
                        }}
                    >
                        परत
                    </Button>
                </div>
            </form>
        </Layout>
    )
}

export default FrmCloseConnRpt; 