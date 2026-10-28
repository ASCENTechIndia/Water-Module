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
import { pdf } from "@react-pdf/renderer";
import ChangeOwnershipAckRptPDF from "../../../Components/WaterPDF/ChangeOwnershipAckRptPDF";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const FrmChangeOwnership = () => {
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
            wardName: "",
            zoneName: "",
            blockName: "",
            applicationNumber: "",
            consumerNumber: "",
            applicantName: "",
            oldOwnerName: "",
            newOwnerName: "",
            oldAddress: "",
            newAddress: "",
            service: "",
            applicableAmt: "",
            attachedDoc: "",
            fees: ""
        }
    });

    const watchWard = watch("wardName");
    const watchZone = watch("zoneName");
    const watchConsumerNumber = watch("consumerNumber");
    const watchService = watch("service");
    const watchAmount = watch("applicableAmt");

    const [corpName, setCorpName] = useState("");
    const [corpEName, setCorpEName] = useState("");
    const [logo, setLogo] = useState(null);

    const [wardOptions, setWardOptions] = useState([]);
    const [zoneOptions, setZoneOptions] = useState([]);
    const [blockOptions, setBlockOptions] = useState([]);
    const [serviceOptions, setServiceOptions] = useState([]);

    const [searchedData, setSearchedData] = useState([]);
    const [chargesTableHeader, setChargesTableHeader] = useState([
        "शुल्क",
        "मूल्य"
    ])
    const [chargesTableData, setChargesTableData] = useState([]);
    const [feesData, setFeesData] = useState([]);

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

    const handleSearch = async () => {
        try {

            const ward = getValues("wardName");
            const zone = getValues("zoneName");
            const block = getValues("blockName");
            const connNumber = getValues("consumerNumber");

            if (!ward) {
                alert("Select Ward");
                return;
            }
            if (!zone) {
                alert("Select Zone");
                return;
            }
            if (!block) {
                alert("Select Block");
                return;
            }
            if (!connNumber) {
                alert("Select Consumer Number");
                return;
            }

            setLoading(true);

            const url = `/transaction/getChangeOwnerDetails?ulbId=${ulbId}&wardId=${ward}&zoneid=${zone}&blockId=${block}&connectionNumber=${connNumber}`;

            const response = await apiService.get(url);

            if (response.success && Array.isArray(response.data) && response.data.length > 0) {
                setSearchedData(response.data);

                setValue("applicationNumber", response.data[0].VAR_CONN_APPLINO ?? "");
                setValue("oldOwnerName", response.data[0].VAR_CONN_OWNERNAME);
                setValue("oldAddress", response.data[0].VAR_CONN_ADDRESS);
            } else {
                setSearchedData([]);
                setValue("applicationNumber", "");
                setValue("oldOwnerName", "");
                setValue("oldAddress", "");
                alert("Enter valid consumer number");
                setValue("consumerNumber", "");
            }

        } catch (error) {
            console.error(error);
            setSearchedData([]);
            setValue("applicationNumber", "");
            setValue("oldOwnerName", "");
            setValue("oldAddress", "");
        } finally {
            setLoading(false);
        }
    }

    const onSubmit = async (data) => {
        let pdfWindow = null;
        let keepPdfWindowOpen = false;

        try {
            setLoading(true);

            if (!data.applicantName) {
                alert("Enter Applicant Name");
                return;
            }

            if (!data.newOwnerName) {
                alert("Enter New Owner Name");
                return;
            }

            if (!data.newAddress) {
                alert("Enter New Address");
                return;
            }

            if (!data.service) {
                alert("Select Service");
                return;
            }

            if (!data.applicableAmt) {
                alert("Enter Amount");
                return;
            }

            const attachedDoc = data.attachedDoc?.[0];

            if (!attachedDoc) {
                alert("Document Not Available");
                return;
            }

            const chargesDtlsStr = chargesTableData
                .map(([chargeName, chargeVal]) =>
                    `${chargeName}$${chargeVal === "" ? "0" : chargeVal}#`
                )
                .join("");

            if (!chargesDtlsStr.trim()) {
                alert("Charges List can not be empty");
                return;
            }

            // Open a blank tab before asynchronous API calls
            // to reduce the chance of popup blocking.
            pdfWindow = window.open("about:blank", "_blank");

            if (pdfWindow) {
                pdfWindow.document.title = "Generating Acknowledgement";
                pdfWindow.document.body.innerHTML =
                    "<p style='font-family:Arial;padding:20px'>Generating acknowledgement PDF...</p>";
            }


            // Build document string
            const extension = attachedDoc.name.split(".").pop().toLowerCase();
            const docStr = `1$${extension}`;

            const ipAddress = await GetIPAddress();

            const dtlsPayload = {
                in_UserId: userId,
                in_ULBID: Number(ulbId),
                in_AppliNo: data.applicationNumber,
                in_connid: Number(searchedData?.[0]?.NUM_CONN_CONNID),
                in_connno: data.consumerNumber,
                in_AppliName: data.applicantName,
                in_ServiceID: Number(data.service),
                in_wardID: Number(data.wardName),
                in_zoneID: Number(data.zoneName),
                in_blockID: Number(data.blockName),
                in_newownername: data.newOwnerName,
                in_oldownername: data.oldOwnerName,
                in_newaddress: data.newAddress,
                in_oldaddress: data.oldAddress,
                in_AppliAmount: Number(data.applicableAmt),
                in_Docstring: docStr,
                in_Chargeslist: chargesDtlsStr,
                in_ipaddress: ipAddress,
                in_source: config.source,
            };

            // Step 1: Save ownership transfer details
            const detailsResponse = await apiService.post(
                "/transaction/change-ownership",
                dtlsPayload
            );
            console.log("Details Response: ", detailsResponse);
            if (
                !detailsResponse.success ||
                Number(detailsResponse.data?.Out_errorCode) !== 9999
            ) {
                alert(
                    `${detailsResponse.data?.Out_errorCode ?? ""}: ${detailsResponse.data?.Out_ErrorMsg ??
                    detailsResponse.message ??
                    "Failed to save ownership transfer details"
                    }`
                );
                return;
            }

            // Step 2: Get document identifiers returned by the backend
            const outDocStr = detailsResponse.data?.Out_DocStr;

            if (!outDocStr?.trim()) {
                alert("Failed to save Documents");
                return;
            }

            // Step 3: Update the document BLOB through your backend
            const formData = new FormData();

            formData.append("file", attachedDoc);
            formData.append("outDocStr", outDocStr.trim());

            const documentResponse = await apiService.post(
                "/transaction/update-ownership-document",
                formData
            );

            console.log("Document Response: ", documentResponse);
            if (!documentResponse.success) {
                alert("Failed to save Documents");
                return;
            }

            // Step 4: Fetch acknowledgement details
            const reportUrl =
                `/transaction/getAcknowledgementDetails?ulbId=${ulbId}` +
                `&applicationNo=${data.applicationNumber}` +
                `&connNo=${data.consumerNumber}`;

            const reportDtlsResponse = await apiService.get(reportUrl);

            console.log("Report Dtls Response: ", reportDtlsResponse);
            if (
                reportDtlsResponse.success &&
                Array.isArray(reportDtlsResponse.data) &&
                reportDtlsResponse.data.length > 0
            ) {
                const reportData = reportDtlsResponse.data[0];

                // Map your API response to the PDF component's props.
                const pdfData = {
                    ...reportData
                };

                if (!pdfWindow || pdfWindow.closed) {
                    alert(
                        "Please allow popups to view the acknowledgement PDF."
                    );
                } else {
                    // Generate the PDF Blob from your existing component.
                    const pdfBlob = await pdf(
                        <ChangeOwnershipAckRptPDF
                            data={pdfData}
                            logo={logo}
                            municipalText={corpName}
                        />
                    ).toBlob();

                    // Create a URL that the browser can display.
                    const pdfUrl = URL.createObjectURL(pdfBlob);

                    // Display the PDF in the new tab.
                    pdfWindow.location.href = pdfUrl;

                    // Keep the tab open when finally executes.
                    keepPdfWindowOpen = true;
                }
            } else {
                if (pdfWindow && !pdfWindow.closed) {
                    pdfWindow.close();
                }

                alert("Unable to fetch acknowledgement details.");
            }

            // Step 5: Show success message
            alert(
                detailsResponse.data?.Out_ErrorMsg ||
                "Ownership transfer saved successfully"
            );

        } catch (error) {
            console.error(
                "Ownership transfer submission failed:",
                error
            );

            alert(
                "An error occurred while saving ownership transfer details."
            );
        } finally {
            // Close the blank tab if PDF generation or submission failed.
            if (
                pdfWindow &&
                !pdfWindow.closed &&
                !keepPdfWindowOpen
            ) {
                pdfWindow.close();
            }

            setLoading(false);
        }
    };
    console.log(searchedData);
    const getChargesTableData = async () => {
        try {
            setLoading(true);

            let usageTypeId = "0", usageSubTypeId = "0";

            const usageSubUsageUrl = `/transaction/getUsageSubUsage?ulbId=${ulbId}&connNumber=${encodeURIComponent(watchConsumerNumber)}`

            const usageSubUsageResponse = await apiService.get(usageSubUsageUrl);

            if (usageSubUsageResponse.success && Array.isArray(usageSubUsageResponse.data) && usageSubUsageResponse.data.length > 0) {
                usageTypeId = String(usageSubUsageResponse?.data[0].NUM_CONN_CONNUSAGEID ?? 0);
                usageSubTypeId = String(usageSubUsageResponse?.data[0].NUM_CONN_CONNUSAGESUBID ?? 0);
            }

            const chargesUrl = `/transaction/getChargesTableData?ulbId=${ulbId}&serviceId=${encodeURIComponent(watchService)}&usageTypeId=${usageTypeId}&subUsageTypeId=${usageSubTypeId}`;

            const chargesResponse = await apiService.get(chargesUrl);

            if (chargesResponse.success && Array.isArray(chargesResponse.data) && chargesResponse.data.length > 0) {
                const formatted = chargesResponse.data.map(item => ([
                    item.CHARGNAME ?? "",
                    item.CHARGVALUE ?? ""
                ]));
                setFeesData(chargesResponse.data);
                setChargesTableData(formatted);
                setValue("fees", formatted);

            } else {
                setChargesTableData([]);
            }

        } catch (error) {
            console.error(error);
            setChargesTableData([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const loadDropdowns = async () => {
            if (!ulbId) return;

            await fetchDropdowns(
                `/transaction/getWardMenu?ulbId=${ulbId}`,
                "NUM_WARD_ID",
                "VAR_WARD_NAME",
                setWardOptions
            );

            await fetchDropdowns(
                `/transaction/getServiceMenu?ulbId=${ulbId}`,
                "NUM_SERVICE_ID",
                "VAR_SERVICE_MNAME",
                setServiceOptions
            )
        }

        loadDropdowns().catch(error => console.error(error));
    }, [ulbId]);

    useEffect(() => {
        const loadZones = async () => {
            if (!watchWard) return;

            await fetchDropdowns(
                `/transaction/getZoneMenu?wardId=${encodeURIComponent(watchWard)}`,
                "NUM_ZONE_ID",
                "VAR_ZONE_NAME",
                setZoneOptions
            )
        }

        loadZones().catch(err => console.error(err));
    }, [watchWard]);

    useEffect(() => {
        const loadBlocks = async () => {
            if (!watchZone) return;

            await fetchDropdowns(
                `/transaction/getBlockMenu?zoneId=${encodeURIComponent(watchZone)}`,
                "NUM_BLOCK_ID",
                "VAR_BLOCK_NAME",
                setBlockOptions
            )
        }

        loadBlocks().catch(err => console.error(err));
    }, [watchZone]);

    useEffect(() => {
        if (watchService && ulbId) {
            getChargesTableData();
        }
    }, [watchService, ulbId]);

    useEffect(() => {
        if (watchAmount === "" || watchAmount === null || watchAmount === undefined) {
            setChargesTableData(
                feesData.map((item) => [
                    item.CHARGNAME ?? "",
                    item.CHARGVALUE ?? "",
                ])
            );
            return;
        }

        const amount = Number(watchAmount);

        if (!Number.isFinite(amount) || !Array.isArray(feesData)) {
            return;
        }

        const updatedChargesTableData = feesData.map((item) => {
            let chargeValue = item.CHARGVALUE;

            // Calculate percentage-based charges
            if (String(item.VALUETYPE).trim() === "P") {
                chargeValue = (
                    (amount * Number(item.CHARGVALUE)) / 100
                ).toFixed(2);
            }

            return [
                item.CHARGNAME ?? "",
                chargeValue,
            ];
        });

        setChargesTableData(updatedChargesTableData);
        setValue("fees", updatedChargesTableData);

    }, [watchAmount, feesData, setChargesTableData, setValue]);

    useEffect(() => {
        const fetchCorpDetails = async () => {
            if (!ulbId) return;
            try {
                const res = await fetch(`${API_BASE_URL}/admin/textLogo`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ulbid: ulbId }),
                });
                const json = await res.json();

                if (json?.success && json?.data?.success) {
                    const d = json.data.data;
                    setCorpName(d.ABC_MUNICIPAL_TEXT || "");
                    setCorpEName(d.ABC_MUNICIPAL_ETEXT || "");
                    setLogo(d.ULBLOGO || null);
                }
            } catch (err) {
                console.error("Error fetching corporation details:", err);
            }
        };
        fetchCorpDetails();
    }, [ulbId]);

    return (
        <Layout
            title="Change Ownership"
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "Change Ownership"
            }}
        >
            <form
                className="w-full space-y-6"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                        <Label
                            text={"Ward"}
                            required
                        />
                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
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
                        {errors.wardName &&
                            <div className="mt-3 text-red-500">
                                {errors.wardName.message}
                            </div>
                        }
                    </div>
                    <div>
                        <Label
                            text={"Zone"}
                            required
                        />
                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
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
                        {errors.zoneName &&
                            <div className="mt-3 text-red-500">
                                {errors.zoneName.message}
                            </div>
                        }
                    </div>
                    <div>
                        <Label
                            text={"Block"}
                            required
                        />
                        <select
                            className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
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
                        {errors.blockName &&
                            <div className="mt-3 text-red-500">
                                {errors.blockName.message}
                            </div>
                        }
                    </div>
                    <div>
                        <Label
                            text={"Application Number"}
                            required
                        />
                        <input
                            type="text"
                            {...register("applicationNumber")}
                            className={`form-input-box ${searchedData.length > 0 ? "bg-slate-200 cursor-not-allowed" : ""}`}
                            disabled={searchedData.length > 0}
                        />
                        {/* {errors.applicationNumber &&
                            <div className="mt-3 text-red-500">
                                {errors.applicationNumber.message}
                            </div>
                        } */}
                    </div>
                    <div>
                        <Label
                            text={"Consumer Number"}
                            required
                        />
                        <input
                            type="text"
                            {...register("consumerNumber")}
                            className="form-input-box"
                        />
                        {errors.consumerNumber &&
                            <div className="mt-3 text-red-500">
                                {errors.consumerNumber.message}
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
                </div>

                {searchedData.length > 0 && (
                    <>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                                <Label
                                    text="Applicant Name"
                                    required
                                />
                                <input
                                    type="text"
                                    {...register("applicantName", {
                                        required: "Applicant Name is required"
                                    })}
                                    className="form-input-box"
                                />
                                {errors.applicantName &&
                                    <div className="mt-3 text-red-400">
                                        {errors.applicantName.message}
                                    </div>
                                }
                            </div>

                            <div>
                                <Label
                                    text={"Old Owner Name"}
                                />
                                <input
                                    type="text"
                                    {...register("oldOwnerName")}
                                    className={`form-input-box ${searchedData.length > 0 ? "bg-slate-200 cursor-not-allowed" : ""}`}
                                    disabled={searchedData.length > 0}
                                />
                            </div>
                            <div>
                                <Label
                                    text={"New Owner Name"}
                                    required
                                />
                                <input
                                    type="text"
                                    {...register("newOwnerName", {
                                        required: "New Owner Name is required"
                                    })}
                                    className="form-input-box"
                                />
                                {errors.newOwnerName &&
                                    <div className="mt-3 text-red-400">
                                        {errors.newOwnerName.message}
                                    </div>
                                }
                            </div>
                            <div>
                                <Label
                                    text={"Old Address"}
                                />
                                <input
                                    type="text"
                                    {...register("oldAddress")}
                                    className={`form-input-box ${searchedData.length > 0 ? "bg-slate-200 cursor-not-allowed" : ""}`}
                                    disabled={searchedData.length > 0}
                                />
                            </div>
                            <div>
                                <Label
                                    text={"New Address"}
                                    required
                                />
                                <input
                                    type="text"
                                    {...register("newAddress", {
                                        required: "New Address is required"
                                    })}
                                    className="form-input-box"
                                />
                                {errors.newAddress &&
                                    <div className="mt-3 text-red-400">
                                        {errors.newAddress.message}
                                    </div>
                                }
                            </div>
                            <div>
                                <Label
                                    text={"Service"}
                                    required
                                />
                                <select
                                    className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                                    {...register("service")}
                                >
                                    <option value="">
                                        -- Select --
                                    </option>

                                    {serviceOptions.map((opt) => (
                                        <option
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.service &&
                                    <div className="mt-3 text-red-500">
                                        {errors.service.message}
                                    </div>
                                }
                            </div>
                            <div>
                                <Label
                                    text={"Amount Applicable"}
                                    required
                                />
                                <input
                                    type="text"
                                    {...register("applicableAmt")}
                                    className="form-input-box"
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                    }}
                                />
                            </div>
                            <div>
                                <Label text="Attached Document" required />

                                <div className="mt-1 flex items-center gap-3">
                                    <label
                                        htmlFor="attachedDoc"
                                        className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                                    >
                                        Choose File
                                    </label>

                                    <span className="text-sm text-gray-500">
                                        {watch("attachedDoc")?.[0]?.name || "No file chosen"}
                                    </span>

                                    <input
                                        id="attachedDoc"
                                        type="file"
                                        accept=".jpg,.jpeg,.pdf"
                                        className="hidden"
                                        {...register("attachedDoc", {
                                            required: "Document is required",
                                            validate: {
                                                fileType: (files) => {
                                                    const file = files?.[0];

                                                    if (!file) return "Please attach a document.";

                                                    const allowedTypes = [
                                                        "image/jpeg",
                                                        "application/pdf",
                                                    ];

                                                    return (
                                                        allowedTypes.includes(file.type) ||
                                                        "Only JPG, JPEG, and PDF files are allowed."
                                                    );
                                                },
                                            }
                                        })}
                                    />
                                </div>

                                {errors.attachedDoc && (
                                    <div className="mt-2 text-sm text-red-500">
                                        {errors.attachedDoc.message}
                                    </div>
                                )}
                            </div>
                        </div>
                        {(watchService && chargesTableData.length > 0) ?
                            <div className="mt-3">
                                <p className="font-semibold">
                                    Fees
                                </p>
                                <div className="mt-3">
                                    <Table
                                        headers={chargesTableHeader}
                                        data={chargesTableData}
                                    />
                                </div>
                            </div>
                            :
                            <div className="mt-3">
                                <p className="font-semibold">
                                    Fees
                                </p>
                                <div className="mt-3">
                                    <Table
                                        headers={chargesTableHeader}
                                        data={chargesTableData}
                                    />
                                </div>
                            </div>

                        }
                        <div className="flex justify-center gap-2 px-5 py-3 border-t border-slate-200 bg-white flex-shrink-0">
                            <Button type="submit">
                                Submit
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    reset();
                                }}
                            >
                                Reset
                            </Button>
                        </div>
                    </>
                )}
            </form>
        </Layout>
    )
}

export default FrmChangeOwnership;