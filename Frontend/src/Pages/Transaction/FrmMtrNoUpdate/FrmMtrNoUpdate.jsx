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

    const handleSearch = async () => {
        try {
            setLoading(true);
            
            if (!watchConnectionNumber.trim()) {
                alert("Please enter Connection Number");
                return;
            }
            setHasSearched(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleUpdate = async (data) => {
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
                            className={`form-input-box ${errors.connectionNumber ? "is-invalid" : ""}`}
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
                            }}
                        >
                            Reset
                        </Button>
                    }
                </div>

                {hasSearched && (

                    <>

                        <p className="mt-3 font-semibold">
                            Owner Name: Test 4
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
                                    className={`form-input-box ${errors.oldMeterNo ? "is-invalid" : ""}`}
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