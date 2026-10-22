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
    const ulbId = user?.ulbId;
    const userId = user?.userId;
    const prabhagId = user?.prabhagID;
    const deptId = user?.deptId;
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

    const watchConnectionNumber = watch("connectionNumber");

    const [tableHeader, setTableHeader] = useState([
        "Zone",
        "Ward",
        "Connection",
        "Owner",
        "Building Name",
        "Mobile Number"
    ]);
    const [tableData, setTableData] = useState([]);
    const [rawData, setRawData] = useState(null);

    const handleSearch = async (values) => {
        try {
            setLoading(true);

            if (!values.connectionNumber) {
                alert("Enter Connection Number");
                return;
            }

            const response = await apiService.get(
                `/water/getConnectionSearchDtls?ulbId=${ulbId}&connectionNumber=${encodeURIComponent(watchConnectionNumber)}`
            );

            if (response?.success && Array.isArray(response.data) && response.data.length > 0) {
                const data = response.data[0];
                setRawData(data);

                const formatted = response.data.map(item => ([
                    item.ZONENAME ?? "",
                    item.BLOCKNAME ?? "",
                    item.CONNNO ?? "",
                    item.OWNERNAME ?? "",
                    item.ADDRESS ?? "",
                    item.MOBNO ?? ""
                ]));
                setTableData(formatted);
            } else {
                setTableData([]);
            }


        } catch (error) {
            console.error(error);
            setTableData([]);
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
                                className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm`}
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
                                    navigate("/Transaction/FrmConnectionMst", {
                                        state: {
                                            mode: 1
                                        }
                                    })
                                }}
                            >
                                Add New Connection
                            </Button>
                        </div>
                        <div className="flex items-end">
                            <Button
                                type="button"
                                onClick={() => {
                                    navigate("/Transaction/FrmConnectionMst", {
                                        state: {
                                            mode: 2,
                                            connectionNumber: rawData.CONNNO,
                                            connectionId: rawData.CONNID
                                        }
                                    })
                                }}
                                disabled={!tableData.length}
                            >
                                Edit Connection
                            </Button>
                        </div>

                    </div>
                </div>
                {tableData.length > 0 &&
                    (
                        <>
                            <div className="mt-3">
                                <h2 className="font-semibold">
                                    Connection Details
                                </h2>
                            </div>
                            <div className="mt-3">
                                <Table
                                    headers={tableHeader}
                                    data={tableData}
                                />
                            </div>
                        </>
                    )
                }
            </form>
        </Layout>
    );
}

export default FrmConnSearch;