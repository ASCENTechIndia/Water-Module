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
import GetIPAddress from "../../../utils/ipHelper.jsx";
import config from "../../../utils/config.jsx";

const FrmUsageSubTypeConfig = () => {
    const [rows, setRows] = useState([]);

    const [checkedMap, setCheckedMap] = useState({});

    const tableKeyMapping = {
        id: "id",
        columns: {
            subUsageName: "Sub Usage Name",
        },
    };

    const { user } = useAuth();
    const ulbId = user?.ulbId;
    const userId = user?.userId;
    const prabhagId = user?.prabhagID;
    const deptId = user?.deptId;
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
            ulbName: "",
            usageType: "",
            usageSubTypeStr: [],
        },
    });

    const watchULB = watch("ulbName");
    const watchUsageType = watch("usageType");

    const [ulbOptions, setULBOptions] = useState([]);
    const [usageTypeOptions, setUsageTypeOptions] = useState([]);
    const [existingStatusCheckList, setExistingStatusCheckList] = useState([]);

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

    const fetchUsageTypeDropdown = async () => {
        try {
            setLoading(true);


            const response = await apiService.get("/config/getUsageTypeDropdown");

            if (
                response?.success &&
                Array.isArray(response?.data)
            ) {
                const formatted = response.data.map((item) => ({
                    label: item.VAR_USAGETYPE_NAME,
                    value: item.NUM_USAGETYPE_ID,
                }));

                setUsageTypeOptions(formatted);
            } else {
                setUsageTypeOptions([]);
            }
        } catch (error) {
            setUsageTypeOptions([]);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTableData = async () => {
        try {
            setLoading(true);

            const url = `/config/getUsageSubTypeData?ulbId=${encodeURIComponent(
                watchULB
            )}&usageTypeId=${encodeURIComponent(watchUsageType)}`;

            const response = await apiService.get(url);
            if (response?.success && Array.isArray(response?.data)) {
                const formatted = response.data.map((item) => ({
                    ...item,
                    id: item.USAGESUBTYPEID,
                    subUsageName: item.USAGESUBTYPENAME,
                }));

                setRows(formatted);
            } else {
                setRows([]);
            }
        } catch (error) {
            setRows([]);
            console.error("Error fetching usage subtype data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsageTypeStatus = async () => {
        try {
            setLoading(true);

            const url = `/config/getUsageSubTypeDataStatus?ulbId=${encodeURIComponent(
                watchULB
            )}&usageTypeId=${encodeURIComponent(watchUsageType)}`

            const response = await apiService.get(url);
            if (
                response?.success &&
                Array.isArray(response?.data)
            ) {
                setExistingStatusCheckList(response.data);
            } else {
                setExistingStatusCheckList([]);
            }
        } catch (error) {
            setExistingStatusCheckList([]);
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const configuredIds = new Set(
            existingStatusCheckList.map((item) =>
                String(item.USAGESUBID)
            )
        );

        const updatedCheckedMap = {};

        const selectedIds = rows
            .filter((row) => {
                const isChecked = configuredIds.has(String(row.id));

                if (isChecked) {
                    updatedCheckedMap[row.id] = true;
                }

                return isChecked;
            })
            .map((row) => row.id);

        setCheckedMap(updatedCheckedMap);

        setValue("usageSubTypeStr", selectedIds, {
            shouldValidate: true,
            shouldDirty: false,
        });
    }, [rows, existingStatusCheckList, setValue]);

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
            setValue("usageSubTypeStr", selectedIds, {
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

            setValue("usageSubTypeStr", selectedIds, {
                shouldValidate: true,
                shouldDirty: true,
            });
        } else {
            setCheckedMap({});

            // Clear selected IDs from react-hook-form
            setValue("usageSubTypeStr", [], {
                shouldValidate: true,
                shouldDirty: true,
            });
        }
    };

    const onSubmit = async (values) => {
        try {
            setLoading(true);
            const mode = existingStatusCheckList.length > 0 ? 2 : 1;

            if (mode === 1 && (!values.usageSubTypeStr || values.usageSubTypeStr.length === 0)) {
                alert("Please atleast one checkbox");
                return;
            }

            const previouslyConfiguredIds = new Set(
                existingStatusCheckList.map((item) =>
                    String(item.USAGESUBID)
                )
            );

            const subUsageStr = rows
                .map((row) => {
                    const id = row.id;


                    const previousStatus = previouslyConfiguredIds.has(
                        String(id)
                    )
                        ? "Y"
                        : "N";

                    const currentStatus = checkedMap[id] ? "Y" : "N";

                    return `${id}#${previousStatus}#${currentStatus}`;
                })
                .join("$");


            const ipAddress = await GetIPAddress();
            const payload = {
                in_UserId: userId,
                in_Orgid: Number(values.ulbName),
                in_UsageTypeID: Number(values.usageType),
                in_usagesubstr: subUsageStr,
                in_Mode: mode,
                in_ipaddress: ipAddress,
                in_source: config.source
            };

            const response = await apiService.post("/config/usage-sub-type", payload);

            if (
                response?.success &&
                response?.data?.Out_errorCode === 9999
            ) {
                alert(response.data.Out_ErrorMsg);

                setValue("usageType", "");

                setRows([]);
                setCheckedMap({});
                setValue("usageSubTypeStr", []);

                setExistingStatusCheckList([]);
            } else {
                alert(response?.data?.Out_ErrorMsg || "Submission failed");
            }

        } catch (error) {
            console.error(error.message);
            alert(error.message || "Failed to submit data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (ulbId) {
            fetchULBDropdown();
        }
    }, [ulbId]);

    useEffect(() => {
        if (ulbOptions.length > 0) {
            setValue("ulbName", String(ulbId));
        }
    }, [ulbOptions]);

    useEffect(() => {
        if (watchULB && ulbId) {
            fetchUsageTypeDropdown();
        }
    }, [watchULB, ulbId]);

    useEffect(() => {
        setRows([]);
        setCheckedMap({});
        setValue("usageSubTypeStr", []);

        if (watchULB && watchUsageType) {
            fetchTableData();
            fetchUsageTypeStatus();
        }
    }, [watchULB, watchUsageType]);

    return (
        <Layout
            title="वापराचा उप प्रकार वर्गीकरण"
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "वापराचा उप प्रकार वर्गीकरण",
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
                    <div>
                        <Label
                            text={"Usage Type: "}
                            required
                        />
                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                            {...register("usageType")}
                        >
                            <option value="">
                                -- Select --
                            </option>

                            {usageTypeOptions.map((opt) => (
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

                {rows.length > 0 &&
                    (
                        <div className="mt-3">
                            <ConfigTable
                                rows={rows}
                                checkedMap={checkedMap}
                                onToggle={handleToggle}
                                onToggleAll={handleToggleAll}
                                tableKeyMapping={tableKeyMapping}
                            />
                        </div>
                    )
                }

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

export default FrmUsageSubTypeConfig;