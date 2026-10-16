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

const FrmBankConfig = () => {
    const [rows, setRows] = useState([
        {
            id: 1,
            bankName: "Punjab National Bank",
        },
        {
            id: 2,
            bankName: "Sbi"
        },
        {
            id: 3,
            bankName: "Bank Of Baroda"
        },
        {
            id: 4,
            bankName: "Abhyudaya Cooperative Bank Limited"
        },
        {
            id: 5,
            bankName: "Bank"
        }
    ]);

    const [checkedMap, setCheckedMap] = useState({});

    const tableKeyMapping = {
        id: "id",
        columns: {
            bankName: "Bank Name",
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
            ulbName: "1",
            bankStr: [],
        },
    });

    const watchULB = watch("ulbName");
    const [ulbOptions, setULBOptions] = useState([]);
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

    const fetchTableData = async () => {
        try {
            setLoading(true);

            const url = `/config/getBankTableData?ulbId=${encodeURIComponent(watchULB)}`;
            const response = await apiService.get(url);

            if (response?.success && Array.isArray(response?.data)) {
                const formatted = response.data.map((item) => ({
                    ...item,
                    id: item.NUM_BANK_ID,
                    bankName: item.VAR_BANK_NAME,
                }));

                setRows(formatted);
            } else {
                setRows([]);
            }
        } catch (error) {
            setRows([]);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBankTableDataStatus = async () => {
        try {
            setLoading(true);

            const url = `/config/getBankTableDataStatus?ulbId=${encodeURIComponent(watchULB)}`;
            const response = await apiService.get(url);

            if (response?.success && Array.isArray(response?.data)) {
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
    };

    useEffect(() => {
        const configuredIds = new Set(
            existingStatusCheckList.map((item) =>
                String(item.CONFIBANK_ID)
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

        setValue("bankStr", selectedIds, {
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
            setValue("bankStr", selectedIds, {
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

            setValue("bankStr", selectedIds, {
                shouldValidate: true,
                shouldDirty: true,
            });
        } else {
            setCheckedMap({});

            // Clear selected IDs from react-hook-form
            setValue("bankStr", [], {
                shouldValidate: true,
                shouldDirty: true,
            });
        }
    };

    const onSubmit = async (values) => {
        try {
            setLoading(true);
            const mode = existingStatusCheckList.length > 0 ? 2 : 1;
       
            if (mode === 1 && (!values.bankStr || values.bankStr.length === 0)) {
                alert("Please atleast one checkbox");
                return;
            }


            const previouslyConfiguredIds = new Set(
                existingStatusCheckList.map((item) =>
                    String(item.CONFIBANK_ID)
                )
            );

            const bankStr = rows
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
                in_ulbid: Number(values.ulbName),
                in_bankStr: bankStr,
                in_Mode: mode,
                in_ipaddress: ipAddress,
                in_source: config.source
            };



            const response = await apiService.post("/config/bank-config", payload);

            if (
                response?.success &&
                response?.data?.Out_errorCode === 9999
            ) {
                alert(response.data.Out_ErrorMsg);

                setRows([]);
                setCheckedMap({});
                setExistingStatusCheckList([]);

                setValue("bankStr", [], {
                    shouldValidate: false,
                    shouldDirty: false,
                });

                // await Promise.all([
                await fetchTableData();
                await fetchBankTableDataStatus();
                // ]);
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
        if (ulbOptions.length > 0 && ulbId) {
            setValue("ulbName", String(ulbId));
        }
    }, [ulbOptions, ulbId, setValue]);

    useEffect(() => {
        if (!watchULB) {
            setRows([]);
            setCheckedMap({});
            setExistingStatusCheckList([]);
            setValue("bankStr", []);
            return;
        }

        fetchTableData();
        fetchBankTableDataStatus();
    }, [watchULB]);

    return (
        <Layout
            title="Bank Configuration"
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "Bank Configuration",
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

export default FrmBankConfig;