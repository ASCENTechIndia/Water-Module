import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import Label from "../../../Components/Label";
import Layout from "../../../Components/Layout";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";
import apiService from "../../../../apiService";
import Table from "../../../Components/Table";
import GetIPAddress from "../../../utils/ipHelper";
import config from "../../../utils/config";
import Button from "../../../Components/Button";

const emptyTableData = {
    newName: "",
    newAddress: "",
    newMobileNumber: "",
    newConnectionType: ""
}

const FrmConnGenericModify = () => {
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
        setValue,
        reset,
        getValues,
        formState: { errors }
    } = useForm({
        defaultValues: {
            connectionNumber: "",
            tableData: [{ ...emptyTableData }]
        }
    });

    const [searchedData, setSearchedData] = useState(null);

    const handleSearch = async () => {
        const connectionNo = getValues("connectionNumber");

        // const searchUrl = ``
    }

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            console.log(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Layout
            title="Conn Generic Modify"
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "Conn Generic Modify"
            }}
        >
            <form
                className="w-full space-y-6"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                        <Label
                            text={"Connection Number"}
                            required
                        />
                        <input
                            type="text"
                            {...register("connectionNumber", {
                                required: "Connection Number is required"
                            })}
                            className={`form-input-box ${errors.connectionNumber ? "is-invalid" : ""}`}
                        />
                        {errors.connectionNumber && (
                            <div className="mt-3 text-red-400">
                                {errors.connectionNumber.message}
                            </div>
                        )}
                    </div>
                    <div className="flex items-end">
                        <Button
                            type="button"
                            onClick={() => {
                                handleSearch();
                            }}
                        >
                            Search
                        </Button>
                    </div>
                </div>
                <div className="mt-3">
                    <div className="rounded-xl border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px] table-fixed border-collapse">
                                <thead className="bg-slate-100/95">
                                    <tr className="border-b border-slate-200">
                                        <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">

                                        </th>
                                        <th className="px-3 py-3 text-center text-[12px] font-bold uppercase tracking-wider text-slate-600">
                                            जुने मूल्य
                                        </th>
                                        <th className="px-3 py-3 text-center text-[12px] font-bold uppercase tracking-wider text-slate-600">
                                            नविन मूल्य
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr
                                        className="hover:bg-slate-50/60 transition-colors"
                                    >
                                        <td className="px-3 py-2 text-center text-sm text-slate-500">
                                            नांव
                                        </td>
                                        <td className="px-3 py-2 text-center text-sm text-slate-500">
                                            Deepesh
                                        </td>
                                        <td className="px-3 py-2">
                                            <input
                                                type="text"
                                                className="form-input-box"
                                            // {...register("tableData")}
                                            />
                                        </td>
                                    </tr>
                                    <tr
                                        className="hover:bg-slate-50/60 transition-colors"
                                    >
                                        <td className="px-3 py-2 text-center text-sm text-slate-500">
                                            पत्ता
                                        </td>
                                        <td className="px-3 py-2 text-center text-sm text-slate-500">
                                            Vasai west
                                        </td>
                                        <td className="px-3 py-2">
                                            <input
                                                type="text"
                                                className="form-input-box"
                                            // {...register("tableData")}
                                            />
                                        </td>
                                    </tr>
                                    <tr
                                        className="hover:bg-slate-50/60 transition-colors"
                                    >
                                        <td className="px-3 py-2 text-center text-sm text-slate-500">
                                            मोबाईल क्र.
                                        </td>
                                        <td className="px-3 py-2 text-center text-sm text-slate-500">
                                            0
                                        </td>
                                        <td className="px-3 py-2">
                                            <input
                                                type="text"
                                                className="form-input-box"
                                            // {...register("tableData")}
                                            />
                                        </td>
                                    </tr>
                                    <tr
                                        className="hover:bg-slate-50/60 transition-colors"
                                    >
                                        <td className="px-3 py-2 text-center text-sm text-slate-500">
                                            Connection Type
                                        </td>
                                        <td className="px-3 py-2 text-center text-sm text-slate-500">
                                            Meter
                                        </td>
                                        <td className="px-3 py-2">
                                            <select
                                                className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                                                // {...register("reason")}
                                            >
                                                <option value="">--SELECT--</option>
                                            </select>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center gap-2 px-5 py-3 border-t border-slate-200 bg-white flex-shrink-0">
                    <Button type="submit">
                        Submit
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

export default FrmConnGenericModify;