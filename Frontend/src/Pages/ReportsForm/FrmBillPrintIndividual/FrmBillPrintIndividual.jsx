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

const FrmBillPrintIndividual = () => {
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
        setValue,
        watch,
        handleSubmit,
        reset,
        control,
        formState: { errors }
    } = useForm({
        defaultValues: {
            ulbName: "",
            wardName: "",
            zoneName: "",
            blockName: "",
            connectionNumber: "",
            financialYear: "",
            billingCycle: "",
            connectionType: "",
            fromRowNumber: "",
            toRowNumber: "",
            printType: ""
        }
    });

    const handleIndividualPrint = async (data) => {
        try {
            setLoading(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    } 
    return (
        <Layout
            title="Bill Print"
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "Bill Print"
            }}
        >
            <form className="w-full space-y-6" onSubmit={handleSubmit(handleIndividualPrint)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    
                </div>
            </form>
        </Layout>
    )
}
export default FrmBillPrintIndividual;