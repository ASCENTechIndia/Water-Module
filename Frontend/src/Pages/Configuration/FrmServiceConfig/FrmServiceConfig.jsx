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

const FrmServiceConfig = () => {
    const [rows, setRows] = useState([
        {
            id: 1,
            serviceName: "Re-Water Connection"
        },
        {
            id: 2,
            serviceName: "Water No Dues Certificate"
        },
        {
            id: 3,
            serviceName: "Change in Water Connection Usage"
        },
        {
            id: 4,
            serviceName: "Connection / Disconnection"
        },
        {
            id: 5,
            serviceName: "Change Water connection size"
        }
    ]);

    const [checkedMap, setCheckedMap] = useState({});

    const tableKeyMapping = {
        id: "id",
        columns: {
            serviceName: "सेवेचे नांव"
        },
    };

    const { user } = useAuth();
    const { setLoading } = useLoader();
    const navigate = useNavigate();

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
            documentStr: [],
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

    const handleToggle = (id, checked) => {
        setCheckedMap((prev) => {
            const updatedMap = {
                ...prev,
                [id]: checked,
            };

            // Get all selected premise IDs
            const selectedIds = rows
                .filter((row) => updatedMap[row.id])
                .map((row) => row.id);

            // Store selected IDs in react-hook-form
            setValue("documentStr", selectedIds, {
                shouldValidate: true,
                shouldDirty: true,
            });

            return updatedMap;
        });
    };


    const handleToggleAll = (checked) => {
        if (checked) {
            const newCheckedMap = {};

            rows.forEach((row) => {
                newCheckedMap[row.id] = true;
            });

            setCheckedMap(newCheckedMap);

            // Store all IDs in react-hook-form
            const selectedIds = rows.map((row) => row.id);

            setValue("documentStr", selectedIds, {
                shouldValidate: true,
                shouldDirty: true,
            });
        } else {
            setCheckedMap({});

            // Clear selected IDs from react-hook-form
            setValue("documentStr", [], {
                shouldValidate: true,
                shouldDirty: true,
            });
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
            title="नगरपालिका सेवेची तयारी"
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "नगरपालिका सेवेची तयारी",
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
                </div>

                <div className="mt-3">
                    <ConfigTable
                        rows={rows}
                        checkedMap={checkedMap}
                        onToggle={handleToggle}
                        onToggleAll={handleToggleAll}
                        tableKeyMapping={tableKeyMapping}
                    />
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
    );

};

export default FrmServiceConfig;