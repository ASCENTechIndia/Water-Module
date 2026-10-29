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
    newResRV: "",
    newCommRV: "",
    newMobileNumber: "",
    newEmail: "",
    newFlatNo: "",
    newConnectionNumber: "",
    newOwnerName: "",
    newConnectionType: "",
    newConnectionSize: "",
};

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
        handleSubmit,
        setValue,
        reset,
        getValues,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            connectionNumber: "",
            tableData: [],
        },
    });

    const {
        fields: tableFields,
        replace,
    } = useFieldArray({
        control,
        name: "tableData",
    });

    const [searchedData, setSearchedData] = useState(null);
    const [connectionTypeDtls, setConnectionTypeDtls] = useState(null);
    const [connectionMenuOptions, setConnectionMenuOptions] = useState([]);
    const [connectionId, setConnectionId] = useState(null);
    const [connectionTypeId, setConnectionTypeId] = useState("");


    const getInputField = (nameid, index, options = []) => {
        const fieldName = (name) => `tableData.${index}.${name}`;

        const numericOnly = {
            onInput: (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
            },
        };

        switch (Number(nameid)) {
            case 1:
                return (
                    <input
                        type="text"
                        className="form-input-box"
                        {...register(fieldName("newName"))}
                    />
                );

            case 2:
                return (
                    <input
                        type="text"
                        className="form-input-box"
                        {...register(fieldName("newAddress"))}
                    />
                );

            case 3:
                return (
                    <input
                        type="text"
                        className="form-input-box"
                        {...register(fieldName("newResRV"), numericOnly)}
                    />
                );

            case 4:
                return (
                    <input
                        type="text"
                        className="form-input-box"
                        {...register(fieldName("newCommRV"), numericOnly)}
                    />
                );

            case 5:
                return (
                    <input
                        type="text"
                        maxLength={10}
                        className="form-input-box"
                        {...register(fieldName("newMobileNumber"), {
                            onChange: (e) => {
                                e.target.value = e.target.value
                                    .replace(/[^0-9]/g, "")
                                    .slice(0, 10);
                            },
                        })}
                    />
                );

            case 6:
                return (
                    <input
                        type="email"
                        className="form-input-box"
                        {...register(fieldName("newEmail"))}
                    />
                );

            case 7:
                return (
                    <input
                        type="text"
                        className="form-input-box"
                        {...register(fieldName("newFlatNo"))}
                    />
                );

            case 8:
                return (
                    <input
                        type="text"
                        className="form-input-box"
                        {...register(fieldName("newConnectionNumber"))}
                    />
                );

            case 9:
                return (
                    <input
                        type="text"
                        className="form-input-box"
                        {...register(fieldName("newOwnerName"))}
                    />
                );

            case 10:
                return (
                    <select
                        className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                        {...register(fieldName("newConnectionType"))}
                    >
                        <option value="">-- Select Connection Type --</option>

                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                );

            case 13:
                return (
                    <select
                        className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                        {...register(fieldName("newConnectionSize"))}
                    >
                        <option value="">-- Select Connection Size --</option>

                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                );

            default:
                return null;
        }
    };

    const handleSearch = async () => {
        const connectionNo = getValues("connectionNumber");

        if (!connectionNo) {
            alert("Enter connection number");
            return;
        }

        try {
            setLoading(true);

            const statusUrl =
                `/transaction/getConnAuthStatus?ulbId=${ulbId}&connectionNumber=${connectionNo}`;

            const tableUrl =
                `/transaction/getGenericModifyListDtls?ulbId=${ulbId}&connectionNumber=${connectionNo}`;

            const statusResponse = await apiService.get(statusUrl);

            if (!statusResponse.success) {
                alert("Unable to check connection authorization status");
                return;
            }

            if (
                Array.isArray(statusResponse.data) &&
                statusResponse.data.length > 0
            ) {
                alert("Conn is already Generic Modify Authorisation");
                return;
            }

            const tableResponse = await apiService.get(tableUrl);

            if (
                !tableResponse.success ||
                !Array.isArray(tableResponse.data) ||
                tableResponse.data.length === 0
            ) {
                setSearchedData([]);
                replace([]);
                setConnectionId(null);
                alert("Connection Number not found");
                return;
            }

            const rows = tableResponse.data;

            let formattedOptions = [];

            const optionsUrl =
                Number(ulbId) === 990
                    ? `/transaction/getConnectionSize?ulbId=${ulbId}`
                    : `/transaction/getConnectionType?ulbId=${ulbId}`;

            const optionsResponse = await apiService.get(optionsUrl);

            if (optionsResponse.success && Array.isArray(optionsResponse.data)) {
                setConnectionTypeDtls(optionsResponse.data);

                formattedOptions = optionsResponse.data.map((item) => ({
                    value: String(
                        item.CONNSIZEID ?? item.CONNTYPE_ID ?? ""
                    ),
                    label: String(item.NAME ?? "").trim(),
                }));
            }

            setConnectionMenuOptions(formattedOptions);

            setSearchedData(rows);
            setConnectionId(rows[0].CONNID);
            setConnectionTypeId(rows[0].CONNTYPEID);

            const fieldMap = {
                1: "newName",
                2: "newAddress",
                3: "newResRV",
                4: "newCommRV",
                5: "newMobileNumber",
                6: "newEmail",
                7: "newFlatNo",
                8: "newConnectionNumber",
                9: "newOwnerName",
                10: "newConnectionType",
                13: "newConnectionSize",
            };

            const formRows = rows.map((item) => {
                const formRow = { ...emptyTableData };
                const nameId = Number(item.NAMEID);
                const fieldName = fieldMap[nameId];

                if (!fieldName) {
                    return formRow;
                }

                if (nameId === 10 || nameId === 13) {
                    const existingValue = String(
                        item.CONNTYPEID ?? ""
                    ).trim();

                    const matchedOption = formattedOptions.find(
                        (option) =>
                            String(option.value).trim() === existingValue
                    );

                    formRow[fieldName] = matchedOption
                        ? matchedOption.value
                        : "";
                } else {
                    formRow[fieldName] = item.EXISTING_VALUE ?? "";
                }

                return formRow;
            });

            replace(formRows);
        } catch (error) {
            console.error("Error searching connection:", error);
            alert("Unable to fetch connection details");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            const fieldMap = {
                1: "newName",
                2: "newAddress",
                3: "newResRV",
                4: "newCommRV",
                5: "newMobileNumber",
                6: "newEmail",
                7: "newFlatNo",
                8: "newConnectionNumber",
                9: "newOwnerName",
                10: "newConnectionType",
                11: "newSequenceNo",
                12: "newPropertyNo",
                13: "newConnectionSize",
            };

            for (let index = 0; index < searchedData.length; index++) {
                const item = searchedData[index];
                const nameId = Number(item.NAMEID);
                const fieldName = fieldMap[nameId];
                const value = String(data.tableData?.[index]?.[fieldName] ?? "").trim();

                const showValidation = (message) => {
                    alert(message);
                };

                if (nameId === 1 && !value) {
                    showValidation("Please Enter Name");
                    return;
                }


                if (nameId === 2 && !value) {
                    showValidation("Please Enter Address");
                    return;
                }


                if (nameId === 5) {
                    if (!value) {
                        showValidation("Please Enter Mobile Number");
                        return;
                    }

                    if (!/^[7-9][0-9]{9}$/.test(value)) {
                        showValidation("Invalid Mobile Number");
                        return;
                    }
                }

                if (nameId === 6) {
                    if (!value) {
                        showValidation("Please Enter Email ID");
                        return;
                    }

                    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}$/.test(value)) {
                        showValidation("Invalid Email ID");
                        return;
                    }
                }

                if (nameId === 7 && !value) {
                    showValidation("Please Enter Flat No.");
                    return;
                }


                if (nameId === 8 && !value) {
                    showValidation("Please Enter Old Connection No.");
                    return;
                }

                if (nameId === 9 && !value) {
                    showValidation("Please Enter Owner Name.");
                    return;
                }

                if (
                    ["1690", "870"].includes(String(ulbId)) &&
                    nameId === 11 &&
                    !value
                ) {
                    showValidation("Please Enter Valid Sequence No.");
                    return;
                }

                if (
                    String(ulbId) === "990" &&
                    nameId === 12 &&
                    !value
                ) {
                    showValidation("Please Enter Property No.");
                    return;
                }
            }

            const tableDataString = searchedData
                .map((item, index) => {
                    const nameId = item.NAMEID;
                    const existingValue = (nameId === 10 || nameId === 13) ? item.CONNTYPEID ?? "" : item.EXISTING_VALUE ?? "";

                    const fieldMap = {
                        1: "newName",
                        2: "newAddress",
                        3: "newResRV",
                        4: "newCommRV",
                        5: "newMobileNumber",
                        6: "newEmail",
                        7: "newFlatNo",
                        8: "newConnectionNumber",
                        9: "newOwnerName",
                        10: "newConnectionType",
                        11: "newSequenceNo",
                        12: "newPropertyNo",
                        13: "newConnectionSize",
                    };

                    const fieldName = fieldMap[Number(nameId)];
                    const newValue = data.tableData?.[index]?.[fieldName] ?? "";

                    return `${nameId}#${existingValue}#${newValue}$`;
                })
                .join("");


            const ipAddress = await GetIPAddress();

            const payload = {
                in_UserId: userId,
                in_ULBID: Number(ulbId),
                in_connid: Number(connectionId),
                in_conntypeid: Number(connectionTypeId),
                in_conndetailsstr: tableDataString,
                in_ipaddress: ipAddress,
                in_source: config.source
            }

            const genericModifyResponse = await apiService.post(
                "/transaction/conn-generic-modify",
                payload
            );

            if (
                genericModifyResponse.success &&
                Number(genericModifyResponse?.data?.Out_errorCode) === 9999
            ) {
                alert(
                    genericModifyResponse?.data?.Out_ErrorMsg ||
                    "Connection Generic Modify Details saved successfully"
                );

                reset({
                    connectionNumber: "",
                    tableData: [],
                });

                replace([]);

                setSearchedData(null);
                setConnectionId(null);
                setConnectionTypeId("");

                setConnectionTypeDtls(null);
                setConnectionMenuOptions([]);
            } else {
                alert(
                    genericModifyResponse?.data?.Out_ErrorMsg ||
                    "Something went wrong"
                );
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    // useEffect(() => {
    //     if (!Array.isArray(connectionTypeDtls)) {
    //         setConnectionMenuOptions([]);
    //         return;
    //     }

    //     const formatted = connectionTypeDtls.map((item) => ({
    //         value: String(
    //             item.CONNSIZEID ?? item.CONNTYPE_ID ?? ""
    //         ),
    //         label: item.NAME ?? "",
    //     }));

    //     setConnectionMenuOptions(formatted);
    // }, [connectionTypeDtls]);

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
                    <div className="flex items-end md:justify-start justify-center">
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
                {searchedData?.length &&
                    <>
                        <div className="mt-3">
                            <div className="rounded-xl border border-slate-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[800px] table-fixed border-collapse">
                                        <thead className="bg-slate-100/95">
                                            <tr className="border-b border-slate-200">
                                                <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">

                                                </th>
                                                <th className="px-3 py-3 text-center text-[12px] font-bold uppercase tracking-wider text-slate-600">
                                                    जुने मूल्य
                                                </th>
                                                <th className="px-3 py-3 text-center text-[12px] font-bold uppercase tracking-wider text-slate-600">
                                                    नविन मूल्य
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {searchedData?.map((item, index) => (
                                                <tr
                                                    key={`${item.NAMEID}-${index}`}
                                                    className="hover:bg-slate-50/60 transition-colors"
                                                >
                                                    <td className="px-3 py-2 text-center text-sm text-slate-500">
                                                        {item.NAME1 ?? ""}
                                                    </td>

                                                    <td className="px-3 py-2 text-center text-sm text-slate-500">
                                                        {item.EXISTING_VALUE ?? ""}
                                                    </td>

                                                    <td className="px-3 py-2">
                                                        {getInputField(
                                                            Number(item.NAMEID),
                                                            index,
                                                            connectionMenuOptions
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}

                                            {searchedData?.length === 0 && (
                                                <tr>
                                                    <td
                                                        colSpan={3}
                                                        className="px-3 py-4 text-center text-sm text-slate-500"
                                                    >
                                                        No connection details found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center gap-2 px-5 py-3 border-t border-slate-200 bg-white flex-shrink-0">
                            <Button type="submit">
                                Submit
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
                    </>
                }
            </form>
        </Layout>
    )
}

export default FrmConnGenericModify;