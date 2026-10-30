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

const FrmMtrNoUpdate = () => {
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
        handleSubmit,
        setValue,
        reset,
        getValues,
        control,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues: {
            connectionNumber: "",
            oldMeterNo: "",
            newMeterNo: "",
            remark: ""
        }
    });

    const watchConnectionNumber = watch("connectionNumber");

    const [hasSearched, setHasSearched] = useState(false);
    const [ownerName, setOwnerName] = useState("");

    const handleSearch = async () => {
        try {
            setLoading(true);
            
            if (!watchConnectionNumber.trim()) {
                alert("Please enter Connection Number");
                return;
            }

            const url = `/transaction/getMeterUpdateConnDetails?ulbId=${ulbId}&connectionNumber=${encodeURIComponent(watchConnectionNumber)}`;

            const response = await apiService.get(url);

            if (response.success && Array.isArray(response.data) && response.data.length > 0) {
                const data = response.data[0];
                setValue("oldMeterNo", data.VAR_CONN_METERNO);
                setOwnerName(data.VAR_CONN_OWNERNAME);
                setHasSearched(true);
            } else {
                alert("No Data Found");
                setValue("oldMeterNo", "");
                setValue("newMeterNo", "");
                setValue("remark", "");
                setOwnerName("");
                setHasSearched(false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleUpdate = async (data) => {
        try {
            setLoading(true);

            const payload = {
                in_userid: userId,
                in_ulbid: Number(ulbId),
                in_connno: data.connectionNumber,
                in_OldMtrNo: data.oldMeterNo,
                in_NewMtrNo: data.newMeterNo,
                in_remark: data.remark
            };

            const response = await apiService.post("/transaction/meter-number-update", payload);
            if (response?.success && Number(response?.data?.out_errcode) === 9999) {
                alert(response.data.out_errmsg);
                reset();
                setHasSearched(false);
            } else {
                alert(response.data.out_errmsg || "Something went wrong");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Layout
            title="Meter No Update"
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "Meter No Update"
            }}
        >
            <form className="w-full space-y-6" onSubmit={handleSubmit(handleUpdate)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                        <Label
                            text="Connection Number :"
                            required
                        />
                        <input
                            type="text"
                            className={`form-input-box ${errors.connectionNumber ? "is-invalid" : ""} ${hasSearched ? "bg-slate-200 cursor-not-allowed" : ""}`}
                            {...register("connectionNumber", {
                                required: "Connection Number is required"
                            })}
                        />
                        {errors.connectionNumber &&
                            <div className="mt-3 text-red-400">
                                {errors.connectionNumber.message}
                            </div>
                        }
                    </div>
                </div>
                <div className="flex justify-center gap-2 px-5 py-3 border-t border-slate-200 bg-white flex-shrink-0">
                    <Button
                        type="button"
                        onClick={() => {
                            handleSearch();
                        }}
                    >
                        Search
                    </Button>

                    {!hasSearched &&
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                navigate("/dashboard")
                            }}
                        >
                            Back
                        </Button>
                    }

                    {hasSearched &&
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                reset();
                                setHasSearched(false);
                            }}
                        >
                            Reset
                        </Button>
                    }
                </div>

                {hasSearched && (

                    <>

                        <p className="mt-3 font-semibold">
                            Owner Name: {ownerName}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">
                            <div>
                                <Label
                                    text={"Old Meter Number"}
                                    required
                                />
                                <input
                                    type="text"
                                    {...register("oldMeterNo", {
                                        required: "Old Meter Number is required"
                                    })}
                                    className={`form-input-box bg-slate-200 cursor-not-allowed ${errors.oldMeterNo ? "is-invalid" : ""}`}
                                    disabled
                                />
                                {errors.oldMeterNo &&
                                    <div className="mt-3 text-red-400">
                                        {errors.oldMeterNo.message}
                                    </div>
                                }
                            </div>
                            <div>
                                <Label
                                    text={"New Meter Number"}
                                    required
                                />
                                <input
                                    type="text"
                                    {...register("newMeterNo", {
                                        required: "New Meter Number is required"
                                    })}
                                    className={`form-input-box ${errors.newMeterNo ? "is-invalid" : ""}`}
                                />
                                {errors.newMeterNo &&
                                    <div className="mt-3 text-red-400">
                                        {errors.newMeterNo.message}
                                    </div>
                                }
                            </div>
                            <div>
                                <Label
                                    text={"Remark"}
                                    required
                                />
                                <input
                                    type="text"
                                    {...register("remark", {
                                        required: "Remark is required"
                                    })}
                                    className={`form-input-box ${errors.remark ? "is-invalid" : ""}`}
                                />
                                {errors.remark &&
                                    <div className="mt-3 text-red-400">
                                        {errors.remark.message}
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="flex justify-center gap-2 px-5 py-3 border-t border-slate-200 bg-white flex-shrink-0">
                            <Button
                                type="submit"
                            >
                                Update
                            </Button>
                        </div>
                    </>
                )}


            </form>
        </Layout>
    )
}

export default FrmMtrNoUpdate;