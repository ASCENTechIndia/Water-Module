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
import { defaultLocale } from "yup";
import GetIPAddress from "../../../utils/ipHelper.jsx";
import config from "../../../utils/config.jsx";

const getToday = () => {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
};

const formatDate = (dateString) => {
    if (!dateString) return "";

    const [year, month, day] = dateString.split("-");
    const monthName = new Date(
        Number(year),
        Number(month) - 1,
        1
    ).toLocaleString("en-US", { month: "short" });

    return `${day}-${monthName}-${year}`;
};


const FrmUserCollectionConfig = () => {
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
            userName: "",
            collectionCenter: "",
            fromDate: getToday(),
            toDate: getToday()
        },
    });

    const [userDropdownOptions, setUserDropdownOptions] = useState([]);
    const [collectionCenterOptions, setCollectionCenterOptions] = useState([]);

    const fetchUserDropdown = async () => {
        try {
            setLoading(true);

            const response = await apiService.get(`/config/getUserDropdown?ulbId=${ulbId}`);

            if (response.success && Array.isArray(response.data)) {
                const formatted = response.data.map(item => ({
                    label: item.USERNAME,
                    value: item.USERID
                }));

                setUserDropdownOptions(formatted);
            } else {
                setUserDropdownOptions([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchCollectionCenterDropdown = async () => {
        try {
            setLoading(true);

            const response = await apiService.get(`/config/getCollectionCenterDropdown?ulbId=${ulbId}`);

            if (response.success && Array.isArray(response.data)) {
                const formatted = response.data.map(item => ({
                    label: item.COLLCENTRE_NAME,
                    value: item.COLLCENTRE_ID
                }));

                setCollectionCenterOptions(formatted);
            } else {
                setCollectionCenterOptions([]);
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

            const ipAddress = await GetIPAddress();
            const payload = {
                in_UserId: userId,
                in_CuserId: values.userName,
                in_Collid: Number(values.collectionCenter),
                in_Fromdt: formatDate(values.fromDate),
                in_ToDate: formatDate(values.toDate),
                in_Ulbid: Number(ulbId),
                in_ipaddress: ipAddress,
                in_source: config.source
            };

            
            const response = await apiService.post("/config/user-collection", payload);

            if (response.success && response.data.Out_ErrorCode === 9999) {
                alert(response.data.Out_ErrorMsg);
                reset();
            } else {
                alert(response.data.Out_ErrorMsg);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (ulbId) {
            fetchUserDropdown();
            fetchCollectionCenterDropdown();
        }
    }, [ulbId]);

    return (
        <Layout
            title="Collection Center Configuration"
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "Collection Center Configuration",
            }}
        >
            <form
                className="w-full space-y-6"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <Label
                            text={"Username / वापरकर्ता: "}
                            required
                        />

                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                            {...register("userName")}
                        >
                            <option value="">
                                -- Select --
                            </option>

                            {userDropdownOptions.map((opt) => (
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
                            text={"Collection Centre: "}
                            required
                        />

                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                            {...register("collectionCenter")}
                        >
                            <option value="">
                                -- Select --
                            </option>

                            {collectionCenterOptions.map((opt) => (
                                <option
                                    key={opt.value}
                                    value={opt.value}
                                >
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="min-w-0">
                        <Label
                            text="From Date /दिनांक पासून : "
                            required
                        />
                        <input
                            type="date"
                            className="form-input-box w-full"
                            {...register("fromDate")}
                        />
                    </div>
                    <div className="min-w-0">
                        <Label
                            text="To Date /दिनांक पर्यंत: "
                            required
                        />
                        <input
                            type="date"
                            className="form-input-box w-full"
                            {...register("toDate")}
                        />
                    </div>
                </div>
                <div className="flex justify-center gap-2 px-5 py-3 border-t border-slate-200 bg-white flex-shrink-0">
                    <Button type="submit">
                        Submit
                    </Button>
                    <Button
                        type="button"
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
};

export default FrmUserCollectionConfig;