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

const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
};

const FrmServiceRateConfigList = () => {
    const { user } = useAuth();
    const ulbId = user?.ulbId;
    const userId = user?.userId;
    const prabhagId = user?.prabhagID;
    const deptId = user?.deptId;
    const { setLoading } = useLoader();
    const navigate = useNavigate();

    const [tableData, setTableData] = useState([]);
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

    const [ulbOptions, setULBOptions] = useState([]);
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

    const fetchTableData = async () => {
        try {
            setLoading(true);

            const url = `/config/getServiceRateTableData?ulbId=${encodeURIComponent(watchULB)}`;
            const response = await apiService.get(url);

            if (response.success && Array.isArray(response.data) && response.data.length > 0) {
                const formatted = response.data.map(item => [
                    <span
                        className="text-blue-400 underline cursor-pointer"
                        onClick={() => {
                            navigate("/Masters/FrmServiceRateConfigMst", {
                                state: {
                                    mode: 2,
                                    serviceUlbId: item.SERVICERATE_ULBID,
                                    serviceRateId: item.ERVICERATE_ID
                                }
                            })
                        }}
                    >
                        Select
                    </span>,
                    item.SERVICEENAME,
                    item.SERVICEMNAME,
                    item.CHARGESTYPE,
                    item.VALUENAME,
                    formatDate(item.SERVICERATE_EFFECTIVEFROM)
                ]);
                setTableData(formatted);
            } else {
                setTableData([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    // const onSubmit = async (values) => {
    //     try {
    //         setLoading(true);


    //         // const docStr = values.documentStr.join("$");

    //         const payload = {
    //             ulbName: values.ulbName,
    //             // usageStr: docStr,
    //         };

    //         console.log("Form Values:", values);
    //         console.log("Payload:", payload);

    //         // API call
    //         // const response = await apiService.post("", payload);

    //     } catch (error) {
    //         console.error(error.message);

    //         alert(error.message || "Failed to submit data");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    useEffect(() => {
        if (ulbId) {
            fetchULBDropdown();
        }
    }, [ulbId]);

    useEffect(() => {
        if (watchULB) {
            fetchTableData();
        }
    }, [watchULB]);

    return (
        <Layout
            title="Service Rate Configuration List"
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "Service Rate Configuration List",
            }}
        >
            <div
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
            </div>
        </Layout>
    )
}

export default FrmServiceRateConfigList;