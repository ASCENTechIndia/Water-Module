import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import Label from "../../../Components/Label";
import Layout from "../../../Components/Layout";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";
import apiService from "../../../../apiService";
import Table from "../../../Components/Table";
import GetIPAddress from "../../../utils/ipHelper";
import config from "../../../utils/config";
import Button from "../../../Components/Button";

const emptyTableData = {
    newName: "",
    newAddress: "",
    newMobileNumber: "",
    newConnectionType: ""
}

const FrmConnGenericModify = () => {
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
        watch,
        handleSubmit,
        setValue,
        reset,
        getValues,
        formState: { errors }
    } = useForm({
        defaultValues: {
            connectionNumber: "",
            tableData: [{ ...emptyTableData }]
        }
    });

    const handleSearch = async () => {
        const connectionNo = getValues("connectionNumber");

        // const searchUrl = ``
    }

    const onSubmit = async (data) => {
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
            title="Conn Generic Modify"
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "Conn Generic Modify"
            }}
        >
            <form
                className="w-full space-y-6"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                        <Label 
                            text={"Connection Number"}
                            required
                        />
                        <input 
                            type="text"
                            {...register("connectionNumber", {
                                required: "Connection Number is required"
                            })}
                            className={`form-input-box ${errors.connectionNumber ? "is-invalid" : ""}`}
                        />
                        {errors.connectionNumber && (
                            <div className="mt-3 text-red-400">
                                {errors.connectionNumber.message}
                            </div>
                        )}
                    </div>
                    <div className="flex items-end">
                        <Button
                            type="button"
                            onClick={() => {
                                handleSearch();
                            }}
                        >
                            Search
                        </Button>
                    </div>
                </div>
            </form>
        </Layout>
    )
}