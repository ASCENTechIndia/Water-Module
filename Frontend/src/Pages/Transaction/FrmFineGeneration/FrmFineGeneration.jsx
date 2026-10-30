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

const FrmFineGeneration = () => {
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
        formState: { errors }
    } = useForm({
        defaultValues: {
            connnectionNumberNotInclude: ""
        }
    });

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            const connectionString = data.connnectionNumberNotInclude.trim();

            const pattern = /^'[^']+'(,'[^']+')*$/;

            if (connectionString.endsWith(",")) {
                alert("Please remove the comma at the end of the connection string");
                return;
            }

            if (!pattern.test(connectionString)) {
                alert(
                    "Please Enter Connection No in valid format. Use format like 'A123','B456'."
                );
                return;
            }

            const payload = {
                in_UserId: userId,
                in_ulbid: Number(ulbId),
                in_ConnNo: connectionString
            };

            const response = await apiService.post("/transaction/fine-generation", payload);
            if (response.success && Number(response.data.Out_errorCode) === 9999) {
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
    };

    return (
        <Layout
            title="Fine Generation"
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "Fine Generation"
            }}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                        <Label
                            text="Connection No Not Include :"
                            required
                        />
                        <input
                            type="text"
                            className={`form-input-box ${errors.connnectionNumberNotInclude ? "is-invalid" : ""}`}
                            {...register("connnectionNumberNotInclude", {
                                required: "Connection Number is required"
                            })}
                            placeholder="Format 'A123456', '9565556'"
                        />
                        {errors.connnectionNumberNotInclude &&
                            <div className="mt-3 text-red-400">
                                {errors.connnectionNumberNotInclude.message}
                            </div>
                        }
                    </div>
                </div>
                <div className="flex justify-center gap-2 px-5 py-3 border-t border-slate-200 bg-white flex-shrink-0">
                    <Button type="submit">
                        Generate
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
    )
}

export default FrmFineGeneration;