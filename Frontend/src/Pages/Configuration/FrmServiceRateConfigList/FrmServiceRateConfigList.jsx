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
import Table from "../../../Components/Table.jsx";

const FrmServiceRateConfigList = () => {
    const { user } = useAuth();
    const { setLoading } = useLoader();
    const navigate = useNavigate();

    const [tableData, setTableData] = useState([
        [
            <span
                className="text-blue-400 underline cursor-pointer"
                onClick={() => { 
                    navigate("/Masters/FrmServiceRateConfigMst", {
                        state: {
                            mode: 2
                        }
                    })
                 }}
            >
                Select
            </span>,
            "Re-Water Connection",
            "Re-Water Connection",
            "Re-Water Connection Fee",
            "Fix",
            "01-04-2023"
        ],
        [
            <span
                className="text-blue-400 underline cursor-pointer"
                onClick={() => {
                    navigate("/Masters/FrmServiceRateConfigMst", {
                        state: {
                            mode: "2",
                            applicationNumber: ""
                        }
                    })

                 }}
            >
                Select
            </span>,
            "Re-Water Connection",
            "Re-Water Connection",
            "Re-Water Connection Fee",
            "Fix",
            "01-04-2023"
        ]
    ]);
    const [tableHeader, setTableHeader] = useState([
        "निवडा",
        "Service Eng Name",
        "Service Mar Name",
        "Charges Type",
        "Value Name",
        "Effective Date"
    ]);


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
            ulbName: "",
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

    const fetchTableData = async () => {
        try {
            setLoading(true);

            const payload = {};

            // const response = await apiService.post("", payload);

            // console.log(response);

            // if (response.data.success && Array.isArray(response.data.data)) {
            //     setTableData(response.data.data);
            // } else {
            //     setTableData([]);
            // }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const onSubmit = async (values) => {
        try {
            setLoading(true);


            // const docStr = values.documentStr.join("$");

            const payload = {
                ulbName: values.ulbName,
                // usageStr: docStr,
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
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
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
                    <div className="flex items-end">
                        <Button
                            type="button"
                            onClick={() => {
                                navigate("/Masters/FrmServiceRateConfigMst", {
                                    state: {
                                        mode: 1
                                    }
                                })
                            }}
                        >
                            नविन माहिती जोडा
                        </Button>
                    </div>
                </div>
                {tableData.length > 0 &&
                    <div className="mt-3">
                        <Table
                            headers={tableHeader}
                            data={tableData}
                        />
                    </div>
                }
                <div className="mt-3">

                </div>
            </form>
        </Layout>
    )
}

export default FrmServiceRateConfigList;