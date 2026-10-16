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

const getToday = () => {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

const FrmUserCollectionConfig = () => {
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
            const payload = {};

            const response = await apiService.post("", payload);

            console.log(response);

            if (response.data.success && Array.isArray(response.data.data)) {
                const formatted = response.data.data.map(item => ({
                    label: item.userName,
                    value: item.userID
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
            const payload = {};

            const response = await apiService.post("", payload);

            console.log(response);

            if (response.data.success && Array.isArray(response.data.data)) {
                const formatted = response.data.data.map(item => ({
                    label: item.collName,
                    value: item.collID
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

            const payload = {
                userID: "",
                collId: "",
                fromDate: "",
                toDate: ""
            };

            console.log(payload);

            const response = await apiService.post("", payload);

            console.log(response);

            if (response.data.errorCode === 9999) {
                alert(response.data.message);
                reset();
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

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