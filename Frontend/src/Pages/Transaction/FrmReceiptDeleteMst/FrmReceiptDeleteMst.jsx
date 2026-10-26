import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import Label from "../../../Components/Label";
import Layout from "../../../Components/Layout";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";
import apiService from "../../../../apiService";
import ConfigTable from "../../../Components/ConfigTable.jsx";
import Button from "../../../Components/Button.jsx";
import Table from "../../../Components/Table.jsx";
import GetIPAddress from "../../../utils/ipHelper.jsx";
import config from "../../../utils/config.jsx";


const getToday = () => {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
};

const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
};

const FrmReceiptDeleteMst = () => {
    const { user } = useAuth();
    const ulbId = user?.ulbId;
    const userId = user?.userId;
    const prabhagId = user?.prabhagID;
    const deptId = user?.deptId;
    const { setLoading } = useLoader();
    const navigate = useNavigate();
    const location = useLocation();

    const { mode = 1, receiptNumber = "", connectionNumber = "", connectionId = "", receiptId = "" } = location.state;


    const [wardOptions, setWardOptions] = useState([]);
    const [zoneOptions, setZoneOptions] = useState([]);
    const [blockOptions, setBlockOptions] = useState([]);
    const [paymentModeOptions, setPaymentModeOptions] = useState([]);
    const [bankOptions, setBankOptions] = useState([]);
    const [reasonOptions, setReasonOptions] = useState([]);
    const [fetchedData, setFetchedData] = useState(null);
    const [paymodeType, setPaymodeType] = useState("");

    const {
        register,
        watch,
        setValue,
        getValues,
        handleSubmit,
        formState: { errors },
        control,
        reset
    } = useForm({
        defaultValues: {
            connectionNumber: "",
            billNumber: "",
            wardName: "",
            zoneName: "",
            blockName: "",
            name: "",
            address: "",
            bookNumber: "",
            refNumber: "",
            receiptDate: "",
            paymentMode: "",
            instrumentNumber: "",
            instrumentDate: "",
            bankName: "",
            branchName: "",
            micrNumber: "",
            instrumentType: "",
            billAmount: "",
            dpc: "",
            rebate: "",
            paidAmount: "",
            reason: ""
        }
    });

    const watchWard = watch("wardName");
    const watchZone = watch("zoneName");

    const fetchCheckPaymode = async (payId) => {
        try {
            setLoading(true);

            const url = `/transaction/getCheckPaymode?ulbId=${ulbId}&paymentId=${payId}`

            const response = await apiService.get(url);

            if (response.success && Array.isArray(response.data) && response.data.length > 0) {
                const data = response.data[0];

                setPaymodeType(data.VAR_RECMODE_PAYCODE);
            } else {

            }
        } catch (error) {
            console.error(error);
            alert(error.message || "Failed to fetch application details");
        } finally {
            setLoading(false);
        }
    }

    const fetchReceiptDetails = async () => {
        try {
            setLoading(true);

            const url = `/transaction/getReceiptDeleteMstDetails?connectionNumber=${connectionNumber}&receiptNumber=${receiptNumber}`

            const response = await apiService.get(url);

            if (response.success && Array.isArray(response.data) && response.data.length > 0) {
                const data = response.data[0];

                setFetchedData(data);
            } else {

            }
        } catch (error) {
            console.error(error);
            alert(error.message || "Failed to fetch application details");
        } finally {
            setLoading(false);
        }
    }

    const fetchDropdowns = async (endpoint, valueKey, labelKey, setter) => {
        try {
            setLoading(true);

            const response = await apiService.get(endpoint);

            if (response.success && Array.isArray(response.data)) {
                const formatted = response.data.map(item => ({
                    label: item[labelKey],
                    value: item[valueKey]
                }));

                setter(formatted);
            } else {
                setter([]);
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

            if (!values.reason) {
                alert("Select Reason.");
                return;
            } 

            const ipAddress = await GetIPAddress();

            const payload = {
                in_userid: userId,
                in_ulbid: Number(ulbId),
                in_wardid: Number(values.wardName),
                in_zoneid: Number(values.zoneName),
                in_blockno: Number(values.blockName),
                in_connid: Number(connectionId),
                in_recid: Number(receiptId),
                in_recno: String(receiptNumber),
                in_remark: String(values.reason),
                in_ipaddress: ipAddress,
                in_source: config.source
            }

            const response = await apiService.post("/transaction/receipt-delete-mst", payload);

            if (response.success && response.data.out_errorcode === 9999) {
                alert(response.data.out_errormssg);
                reset();
                navigate("/Transaction/FrmReceiptDeleteList", {
                    replace: true
                });
            } else {
                alert(response.data.out_errormssg || "Failed to delete receipt");
            }
            
        } catch (error) {
            console.error(error);
            alert(error.message || "Failed to delete receipt");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const loadDropdowns = async () => {
            if (!ulbId) return;

            await fetchDropdowns(
                `/transaction/getPaymentMenu?ulbId=${ulbId}`,
                "RECMODEID",
                "RECMODNAME",
                setPaymentModeOptions
            );

            await fetchDropdowns(
                `/transaction/getBankMenu`,
                "BANK_ID",
                "BANK_NAME",
                setBankOptions
            );

            await fetchDropdowns(
                `/transaction/getReasonMenu`,
                "NUM_DELETEREASON_ID",
                "VAR_DELETEREASON_REASON",
                setReasonOptions
            );
        }

        loadDropdowns().catch(error => console.error("Error: ", error));
    }, [ulbId]);



    useEffect(() => {
        if (mode === 1 && connectionNumber && receiptNumber) {
            fetchReceiptDetails();
        }
    }, [mode, receiptNumber, connectionNumber]);


    useEffect(() => {
        const loadLocationDropdowns = async () => {
            if (!ulbId || !fetchedData || Number(mode) !== 1) return;

            try {
                // 1. Load wards and set the saved ward
                const wardResponse = await apiService.get(
                    `/transaction/getWardMenu?ulbId=${ulbId}`
                );

                if (!wardResponse.success || !Array.isArray(wardResponse.data)) {
                    console.error("Failed to load ward options");
                    return;
                }

                const wards = wardResponse.data.map((item) => ({
                    label: item.VAR_WARD_NAME,
                    value: String(item.NUM_WARD_ID),
                }));

                setWardOptions(wards);

                const savedWard = String(fetchedData.WARDID ?? "");

                if (!wards.some((option) => option.value === savedWard)) {
                    console.error("Saved ward ID not found:", savedWard, wards);
                    return;
                }

                setValue("wardName", savedWard);

                // 2. Load zones using the saved ward ID
                const zoneResponse = await apiService.get(
                    `/transaction/getZoneMenu?wardId=${encodeURIComponent(savedWard)}`
                );

                if (!zoneResponse.success || !Array.isArray(zoneResponse.data)) {
                    console.error("Failed to load zone options");
                    return;
                }

                const zones = zoneResponse.data.map((item) => ({
                    label: item.VAR_ZONE_NAME,
                    value: String(item.NUM_ZONE_ID),
                }));

                setZoneOptions(zones);

                const savedZone = String(fetchedData.ZONEID ?? "");

                if (!zones.some((option) => option.value === savedZone)) {
                    console.error("Saved zone ID not found:", savedZone, zones);
                    return;
                }

                setValue("zoneName", savedZone);

                // 3. Load blocks using the saved zone ID
                const blockResponse = await apiService.get(
                    `/transaction/getBlockMenu?zoneId=${encodeURIComponent(savedZone)}`
                );

                if (!blockResponse.success || !Array.isArray(blockResponse.data)) {
                    console.error("Failed to load block options");
                    return;
                }

                const blocks = blockResponse.data.map((item) => ({
                    label: item.VAR_BLOCK_NAME,
                    value: String(item.NUM_BLOCK_ID),
                }));

                setBlockOptions(blocks);

                const savedBlock = String(fetchedData.BLOCKID ?? "");

                if (!blocks.some((option) => option.value === savedBlock)) {
                    console.error("Saved block ID not found:", savedBlock, blocks);
                    return;
                }

                setValue("blockName", savedBlock);
            } catch (error) {
                console.error("Error loading ward, zone and block:", error);
            }
        };

        loadLocationDropdowns();
    }, [ulbId, fetchedData, mode, setValue]);


    useEffect(() => {
        const loadBanks = async () => {

            const response = await apiService.get(
                `/transaction/getBankMenu`
            );

            if (response.success && Array.isArray(response.data)) {
                const options = response.data.map(item => ({
                    label: item.BANK_NAME,
                    value: String(item.BANK_ID),
                }));

                setBankOptions(options);

                if (mode === 1 && fetchedData) {
                    const savedBank = String(fetchedData.NUM_REC_BANKID ?? "");

                    if (options.some(option => option.value === savedBank)) {
                        setValue("bankName", savedBank);
                    }
                }
            }
        };

        loadBanks().catch(console.error);
    }, [mode, fetchedData, setValue]);

    useEffect(() => {
        const loadPayments = async () => {
            if (!ulbId) return;

            const response = await apiService.get(
                `/transaction/getPaymentMenu?ulbId=${ulbId}`
            );

            if (response.success && Array.isArray(response.data)) {
                const options = response.data.map(item => ({
                    label: item.RECMODNAME,
                    value: String(item.RECMODEID),
                }));

                setPaymentModeOptions(options);

                if (mode === 1 && fetchedData) {
                    const savedPayment = String(fetchedData.AMTTYPE ?? "");

                    if (options.some((option) => option.value === savedPayment)) {
                        setValue("paymentMode", savedPayment);
                    }
                }
            }
        };

        loadPayments().catch(console.error);
    }, [ulbId, mode, fetchedData, setValue]);

    useEffect(() => {
        if (mode === 1 && fetchedData && Object.entries(fetchedData).length > 0) {
            setValue("connectionNumber", fetchedData.CONNNO ?? "");
            setValue("billNumber", fetchedData.BILLNO ?? "");
            // setValue("wardName", fetchedData.WARDID);
            setValue("name", fetchedData.OWNERNAME ?? "");
            setValue("address", fetchedData.ADDRESS ?? "");
            setValue("bookNumber", fetchedData.BOOKNO ?? "");
            setValue("refNumber", fetchedData.REC_REFNO ?? "");
            setValue("receiptDate", formatDate(fetchedData.RECDATE ?? ""));
            setValue("instrumentNumber", fetchedData.INSTRUNO ?? "");
            setValue("instrumentDate", formatDate(fetchedData.INSTRUDATE ?? ""));
            setValue("micrNumber", fetchedData.MICRCODE ?? "");
            setValue("instrumentType", fetchedData.INSTRUTYPE ?? "");
            setValue("billAmount", fetchedData.TOTALAMT ?? "");
            setValue("dpc", fetchedData.DPC ?? "");
            setValue("rebate", fetchedData.REBATE ?? "");
            setValue("paidAmount", fetchedData.AMOUNT ?? "");
        }
    }, [mode, fetchedData, setValue]);

    useEffect(() => {
        if (ulbId && fetchedData) {
            fetchCheckPaymode(fetchedData.AMTTYPE);
        }
    }, [ulbId, fetchedData]);

    return (
        <Layout
            title="Connection Details"
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "Connection Details",
            }}
        >
            <form
                className="w-full space-y-6"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <Label
                            text={"Connection Number: "}
                            required
                        />
                        <input
                            type="text"
                            className="form-input-box bg-slate-200 cursor-not-allowed"
                            disabled
                            {...register("connectionNumber")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"Bill Number: "}
                            required
                        />
                        <input
                            type="text"
                            className="form-input-box bg-slate-200 cursor-not-allowed"
                            disabled
                            {...register("billNumber")}
                        />
                    </div>
                </div>
                <div className="border-t border-slate-200 mt-3"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    <div>
                        <Label
                            text={"Ward"}
                            required
                        />
                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm bg-slate-200 cursor-not-allowed"
                            disabled
                            {...register("wardName")}
                        >
                            <option value="">
                                -- Select --
                            </option>

                            {wardOptions.map((opt) => (
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
                            text={"Zone"}
                            required
                        />
                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm bg-slate-200 cursor-not-allowed"
                            disabled
                            {...register("zoneName")}
                        >
                            <option value="">
                                -- Select --
                            </option>

                            {zoneOptions.map((opt) => (
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
                            text={"Block"}
                            required
                        />
                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm bg-slate-200 cursor-not-allowed"
                            disabled
                            {...register("blockName")}
                        >
                            <option value="">
                                -- Select --
                            </option>

                            {blockOptions.map((opt) => (
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
                            text={"Name"}
                            required
                        />
                        <input
                            type="text"
                            className="form-input-box bg-slate-200 cursor-not-allowed"
                            disabled
                            {...register("name")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"Address"}
                            required
                        />
                        <input
                            type="text"
                            className="form-input-box bg-slate-200 cursor-not-allowed"
                            disabled
                            {...register("address")}
                        />
                    </div>
                    <div>
                        <Label
                            text={Number(ulbId) === 870 || Number(ulbId) === 1690 ? "Financial Year" : "Book Number"}
                            required
                        />
                        <input
                            type="text"
                            className="form-input-box bg-slate-200 cursor-not-allowed"
                            disabled
                            {...register("bookNumber")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"Ref Number"}
                            required
                        />
                        <input
                            type="text"
                            {...register("refNumber")}
                            className="form-input-box bg-slate-200 cursor-not-allowed"
                            disabled
                        />
                    </div>
                    <div>
                        <Label
                            text={"Receipt Date"}
                            required
                        />
                        <input
                            type="date"
                            className="form-input-box bg-slate-200 cursor-not-allowed"
                            disabled
                            {...register("receiptDate")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"Payment Mode"}
                            required
                        />
                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm bg-slate-200 cursor-not-allowed"
                            disabled
                            {...register("paymentMode")}
                        >
                            <option value="">
                                -- Select --
                            </option>

                            {paymentModeOptions.map((opt) => (
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
                            text={"Instrument Number"}
                            required
                        />
                        <input
                            type="text"
                            className="form-input-box bg-slate-200 cursor-not-allowed"
                            disabled={!(paymodeType === "CHQ" || paymodeType === "DDP")}
                            {...register("instrumentNumber")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"Instrument Date"}
                            required
                        />
                        <input
                            type="date"
                            className="form-input-box bg-slate-200 cursor-not-allowed"
                            disabled={!(paymodeType === "CHQ" || paymodeType === "DDP")}
                            {...register("instrumentDate")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"Bank Name"}
                            required
                        />
                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm bg-slate-200 cursor-not-allowed"
                            disabled={!(paymodeType === "CHQ" || paymodeType === "DDP")}
                            {...register("bankName")}
                        >
                            <option value="">
                                -- Select --
                            </option>

                            {bankOptions.map((opt) => (
                                <option
                                    key={opt.value}
                                    value={opt.value}
                                >
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    {false && <div>
                            <Label 
                                text={"Branch Name"}
                            />
                            <input 
                                type="text"
                                {...register("branchName")}
                                className="form-input-box bg-slate-200 cursor-not-allowed"
                                disabled={!(paymodeType === "CHQ" || paymodeType === "DDP")}
                            />
                    </div>}        

                    <div>
                        <Label
                            text={"MICR Number"}
                            required
                        />
                        <input
                            type="text"
                            className="form-input-box bg-slate-200 cursor-not-allowed"
                            disabled={!(paymodeType === "CHQ" || paymodeType === "DDP")}
                            {...register("micrNumber")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"Instrument Type"}
                            required
                        />
                        <input
                            type="text"
                            className="form-input-box bg-slate-200 cursor-not-allowed"
                            disabled={!(paymodeType === "CHQ" || paymodeType === "DDP")}
                            {...register("instrumentType")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"Bill Amount"}
                            required
                        />
                        <input
                            type="text"
                            className="form-input-box bg-slate-200 cursor-not-allowed"
                            disabled
                            {...register("billAmount")}
                        />
                    </div>
                    <div>
                        <Label
                            text={"DPC"}
                            required
                        />
                        <input
                            type="text"
                            {...register("dpc")}
                            className="form-input-box bg-slate-200 cursor-not-allowed"
                            disabled
                        />
                    </div>
                    <div>
                        <Label
                            text={"Rebate"}
                            required
                        />
                        <input
                            type="text"
                            {...register("rebate")}
                            className="form-input-box bg-slate-200 cursor-not-allowed"
                            disabled
                        />
                    </div>
                    <div>
                        <Label
                            text={"Paid Amount"}
                            required
                        />
                        <input
                            type="text"
                            {...register("paidAmount")}
                            className="form-input-box bg-slate-200 cursor-not-allowed"
                            disabled
                        />
                    </div>
                    <div>
                        <Label
                            text={"Reason"}
                            required
                        />
                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                            {...register("reason")}
                        >
                            <option value="">
                                -- Select --
                            </option>

                            {reasonOptions.map((opt) => (
                                <option
                                    key={opt.value}
                                    value={opt.value}
                                >
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex justify-center gap-2 px-5 py-3 border-t border-slate-200 bg-white flex-shrink-0">
                    <Button
                        type="submit"
                    >
                        Submit
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            navigate("/Transaction/FrmReceiptDeleteList");
                        }}
                    >
                        Back
                    </Button>
                </div>
            </form>
        </Layout>
    )
}

export default FrmReceiptDeleteMst;