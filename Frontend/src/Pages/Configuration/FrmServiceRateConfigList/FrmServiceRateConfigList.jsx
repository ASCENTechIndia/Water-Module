import React, { useState, useEffect } from "react";
import Layout from "../../../Components/Layout";
import Label from "../../../Components/Label";
import { useForm } from "react-hook-form";
import { useLoader } from "../../../Context/LoaderContext";
import { useAuth } from "../../../Context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import apiService from "../../../../apiService";
import ConfigTable from "../../../Components/ConfigTable.jsx";
import Button from "../../../Components/Button";

const FrmServiceRateConfigList = () => {
    const { user } = useAuth();
    const { setLoading } = useLoader();
    const navigate = useNavigate();

    const [tableData, setTableData] = useState([]);

    const {
        register,
        setValue,
        handleSubmit,
        reset,
        getValues,
        formState: { errors },
        watch,
    } = useForm({
        defaultValues: {
            ulbName: "1",
        },
    });

    const [ulbOptions, setULBOptions] = useState([{
        label: "मीरा भाईंदर महानगरपालिका", value: "1"
    }]);

    const fetchULBDropdown = async () => {
        try {
            setLoading(true);

            const payload = {};

            const response = await apiService.post("", payload);

            if (
                response?.data?.success &&
                Array.isArray(response?.data?.data)
            ) {
                const formatted = response.data.data.map((item) => ({
                    label: item.ulbID,
                    value: item.ulbname,
                }));

                setULBOptions(formatted);
            } else {
                setULBOptions([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (values) => {
        try {
            setLoading(true);


            const docStr = values.documentStr.join("$");

            const payload = {
                ulbName: values.ulbName,
                usageStr: docStr,
            };

            console.log("Form Values:", values);
            console.log("Payload:", payload);

            // API call
            // const response = await apiService.post("", payload);

        } catch (error) {
            console.error(error.message);

            alert(error.message || "Failed to submit data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout
            title="Service Rate Configuration List"
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "Service Rate Configuration List",
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
                    <div className="flex items-end">
                        <Button
                            type="button"
                            onClick={() => {

                            }}
                        >
                            नविन माहिती जोडा
                        </Button>
                    </div>
                </div>
                <div className="mt-3">
                    
                </div>
            </form>
        </Layout>
    )
}

export default FrmServiceRateConfigList;