import React, { useState, useEffect } from "react";
import Layout from "../../../Components/Layout";
import Label from "../../../Components/Label";
import { useForm, useFieldArray } from "react-hook-form";
import { useLoader } from "../../../Context/LoaderContext";
import { useAuth } from "../../../Context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import apiService from "../../../../apiService";
import ConfigTable from "../../../Components/ConfigTable.jsx";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table.jsx";

const FrmConnSearch = () => {
    const { user } = useAuth();
    const { setLoading } = useLoader();
    const navigate = useNavigate();
    const location = useLocation();

    const {
        register,
        control,
        setValue,
        handleSubmit,
        reset,
        getValues,
        formState: { errors },
        watch,
    } = useForm({
        defaultValues: {
            connectionNumber: ""
        },
    });

    const [tableHeader, setTableHeader] = useState([]);
    const [tableData, setTableData] = useState([]);

    const handleSearch = async (values) => {
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
            title="Connection Details"
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "Connection Details",
            }}
        >
            <form onSubmit={handleSubmit(handleSearch)} className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex gap-3">
                        <div>
                            <Label
                                text={"Connection Number: "}
                                required
                            />
                            <input
                                type="text"
                                className="form-input-box"
                                {...register("connectionNumber")}
                            />
                        </div>
                        <div className="flex items-end">
                            <Button
                                type="submit"
                            >
                                Search
                            </Button>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex items-end">
                            <Button
                                type="button"
                                // className="btn-sm"
                                onClick={() => {
                                    navigate("/Transaction/FrmConnectionMst")
                                }}
                            >
                                Add New Connection
                            </Button>
                        </div>
                        <div className="flex items-end">
                            <Button
                                type="button"
                                onClick={() => {
                                    // navigate("/Transaction/FrmConnectionMst")
                                }}
                            >
                                Edit Connection
                            </Button>
                        </div>

                    </div>
                </div>
                {tableData.length > 0 &&
                    <div className="mt-3">
                        <Table
                            headers={tableHeader}
                            data={tableData}
                        />
                    </div>
                }
            </form>
        </Layout>
    );
}

export default FrmConnSearch;