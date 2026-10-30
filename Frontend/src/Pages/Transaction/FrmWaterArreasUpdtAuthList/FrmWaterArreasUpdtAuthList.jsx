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

const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};


const FrmWaterArreasUpdtAuthList = () => {
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
            authorizationRemark: "",
        }
    });

    const [pendingAuthListData, setPendingAuthListData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [tableHeader, setTableHeader] = useState([
        "CONN NO",
        "Owner Name",
        "Date",
        "Ins By",
        "Details",
        "Status",
        "Remark"
    ]);
    const [searchText, setSearchText] = useState("");
    const [rowActions, setRowActions] = useState({});

    const handleStatusChange = (index, status) => {
        setRowActions((prev) => ({
            ...prev,
            [index]: {
                ...prev[index],
                status
            }
        }));
    };

    const handleRemarkChange = (index, remark) => {
        setRowActions((prev) => ({
            ...prev,
            [index]: {
                ...prev[index],
                remark
            }
        }));
    };

    const handleDetails = (item) => {
        // Add your Details button action here
        console.log("Selected record:", item);
    };

    const fetchPendingAuthTableData = async () => {
        try {
            setLoading(true);

            const url = `/transaction/getPendingArrearsUpdateAuthList?ulbId=${ulbId}`;

            const response = await apiService.get(url);

            if (response.success && Array.isArray(response.data) && response.data.length) {
                setPendingAuthListData(response.data);
            } else {
                setPendingAuthListData([]);
            }
        } catch (error) {
            setPendingAuthListData([]);
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            const invalidRow = pendingAuthListData.find((item) => {
                const rowKey = item.CONNNO;
                return !rowActions[rowKey]?.status;
            });

            if (invalidRow) {
                alert(`Please select Approve or Reject for ${invalidRow.CONNNO}`);
                return;
            }

            const connStr = pendingAuthListData
                .map((item) => {
                    const rowKey = item.CONNNO;

                    const status = rowActions[rowKey]?.status ?? "";
                    const remark = rowActions[rowKey]?.remark?.trim() ?? "";

                    return `${item.CONNAUTHID}#${status}#${remark}$`;
                })
                .join("");

            const ipAddress = await GetIPAddress();

            const payload = {
                in_userid: userId,
                in_ulbid: Number(ulbId),
                in_zoneid: 0,
                in_connno: "-",
                in_blockno: 0,
                in_connid: 0,
                in_updtstr: connStr,
                in_mode: 2,
                in_authstatus: "-",
                in_authremark: data.authorizationRemark,
                in_ipaddress: ipAddress,
                in_source: config.source,
                in_flatno: null
            };

            console.log("Connection String:", connStr);
            console.log("Payload:", payload);

            return; 

            const response = await apiService.post(
                "/transaction/arrears-update-auth-list",
                payload
            );

            console.log(response);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (ulbId) {
            fetchPendingAuthTableData();
        }
    }, [ulbId]);

    return (
        <Layout
            title="Water Arrears Update Authorization List"
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "Water Arrears Update Authorization List"
            }}
        >
            <form className="w-full space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                        <Label
                            text={"Search: "}
                        />
                        <input
                            type="text"
                            className="form-input-box"
                            onChange={(e) => {
                                const value = e.target.value;
                                setSearchText(value);
                            }}
                        />
                    </div>
                </div>

                {pendingAuthListData.length > 0 && (
                    <>
                        <div className="mt-3">
                            <div className="rounded-xl border border-slate-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[1200px] table-fixed border-collapse">
                                        <thead className="bg-slate-100/95">
                                            <tr className="border-b border-slate-200">
                                                {[
                                                    "CONN NO",
                                                    "Owner Name",
                                                    "Date",
                                                    "Ins By",
                                                    "Details",
                                                    "Status",
                                                    "Remark"
                                                ].map((header) => (
                                                    <th
                                                        key={header}
                                                        className="px-3 py-3 text-center text-[12px] font-bold uppercase tracking-wider text-slate-600"
                                                    >
                                                        {header}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-slate-100">
                                            {pendingAuthListData
                                                .filter((item) => {
                                                    const searchValue = searchText.trim().toLowerCase();

                                                    return (
                                                        String(item.CONNNO ?? "").toLowerCase().includes(searchValue) ||
                                                        String(item.OWNER_NAME ?? "").toLowerCase().includes(searchValue) ||
                                                        String(item.INSBY ?? "").toLowerCase().includes(searchValue)
                                                    );
                                                })
                                                .map((item, index) => {
                                                    const rowKey = item.CONNNO ?? index;

                                                    return (
                                                        <tr
                                                            key={rowKey}
                                                            className="hover:bg-slate-50"
                                                        >
                                                            {/* CONN NO */}
                                                            <td className="px-3 py-3 text-center text-sm text-slate-700">
                                                                {item.CONNNO}
                                                            </td>

                                                            {/* Owner Name */}
                                                            <td className="px-3 py-3 text-center text-sm text-slate-700">
                                                                {item.OWNER_NAME}
                                                            </td>

                                                            {/* Date */}
                                                            <td className="px-3 py-3 text-center text-sm text-slate-700">
                                                                {formatDate(item.INSDATE)}
                                                            </td>

                                                            {/* Ins By */}
                                                            <td className="px-3 py-3 text-center text-sm text-slate-700">
                                                                {item.INSBY}
                                                            </td>

                                                            {/* Details Button */}
                                                            <td className="px-3 py-3 text-center">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDetails(item)}
                                                                    className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-700"
                                                                >
                                                                    Details
                                                                </button>
                                                            </td>

                                                            {/* Approve / Reject */}
                                                            <td className="px-3 py-3">
                                                                <div className="flex items-center justify-center gap-3">
                                                                    <label className="flex items-center gap-1.5 text-sm">
                                                                        <input
                                                                            type="radio"
                                                                            name={`status-${rowKey}`}
                                                                            value="A"
                                                                            checked={
                                                                                rowActions[rowKey]?.status === "A"
                                                                            }
                                                                            onChange={() =>
                                                                                handleStatusChange(rowKey, "A")
                                                                            }
                                                                        />
                                                                        Approve
                                                                    </label>

                                                                    <label className="flex items-center gap-1.5 text-sm">
                                                                        <input
                                                                            type="radio"
                                                                            name={`status-${rowKey}`}
                                                                            value="R"
                                                                            checked={
                                                                                rowActions[rowKey]?.status === "R"
                                                                            }
                                                                            onChange={() =>
                                                                                handleStatusChange(rowKey, "R")
                                                                            }
                                                                        />
                                                                        Reject
                                                                    </label>
                                                                </div>
                                                            </td>

                                                            {/* Remark */}
                                                            <td className="px-3 py-3">
                                                                <input
                                                                    type="text"
                                                                    value={rowActions[rowKey]?.remark ?? ""}
                                                                    onChange={(e) =>
                                                                        handleRemarkChange(
                                                                            rowKey,
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    placeholder="Enter remark"
                                                                    className="form-input-box"
                                                                />
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                                <Label
                                    text={"Authorization Remark: "}
                                    required
                                />
                                <input
                                    type="text"
                                    {...register("authorizationRemark", {
                                        required: "Authorization Remark is required"
                                    })}
                                    className="form-input-box"
                                />
                            </div>
                            <div>
                                <Label
                                    text={"वरील माहिती बिनचूक आहे ?: "}
                                    required
                                />
                                <div className="flex gap-2 mt-1">
                                    <Button
                                        type="submit"
                                    >
                                        होय
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                    >
                                        बाहेर
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </form>
        </Layout >
    )
}

export default FrmWaterArreasUpdtAuthList;