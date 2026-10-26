import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Layout from "../../../Components/Layout";
import Label from "../../../Components/Label";
import Button from "../../../Components/Button.jsx";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const toDateInput = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const FrmReceiptDeleteAuthMst = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const connId = state?.connId;
  const receiptId = state?.recId;

  const [payTypeOptions, setPayTypeOptions] = useState([]);
  const [reasonOptions, setReasonOptions] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);
  const [detail, setDetail] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      connNo: "",
      flatNo: "",
      subCode: "",
      ownerName: "",
      receiptDate: "",
      billAmt: "",
      interestFine: "",
      collectionCenter: "",
      payType: "",
      mobileNo: "",
      email: "",
      bankId: "",
      bankBranch: "",
      instrumentNo: "",
      instrumentDate: "",
      micrCode: "",
      instrumentType: "",
      remark: "",
      totalBillAmt: "",
      totalRebate: "",
      payAmt: "",
      status: "A",
      reason: "",
      charges: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!ulbid) return;

    const loadDropdowns = async () => {
      try {
        setLoading(true);
        const results = await Promise.allSettled([
          apiService.get(`/transaction/getPayTypeDropdown?ulbId=${ulbid}`),
          apiService.get(`/transaction/getReceiptDeleteReasonDropdown`),
          apiService.get(
            `/transaction/getReceiptDeleteBankDropdown?ulbId=${ulbid}`,
          ),
        ]);

        const [payRes, reasonRes, bankRes] = results;

        // Payment type dropdown
        if (payRes.status === "fulfilled" && payRes.value?.success) {
          setPayTypeOptions(
            payRes.value.data.map((item) => ({
              value: String(item.RECMODEID),
              label: item.RECMODNAME,
            })),
          );
        } else {
          setPayTypeOptions([]);
        }

        // Reason dropdown
        if (reasonRes.status === "fulfilled" && reasonRes.value?.success) {
          setReasonOptions(
            reasonRes.value.data.map((item) => ({
              value: String(item.NUM_DELETEREASON_ID),
              label: item.VAR_DELETEREASON_REASON,
            })),
          );
        } else {
          setReasonOptions([]);
        }

        // Bank dropdown
        if (bankRes.status === "fulfilled" && bankRes.value?.success) {
          setBankOptions(
            bankRes.value.data.map((item) => ({
              value: String(item.BANK_ID),
              label: item.BANK_NAME,
            })),
          );
        } else {
          setBankOptions([]);
        }
      } catch (err) {
        console.error("Dropdown load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDropdowns();
  }, [ulbid]);

  // Fetch receipt delete auth details
  useEffect(() => {
    if (!connId || !receiptId || !ulbid) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await apiService.get(
          `/transaction/fetchDelRecAuthDetails?connId=${connId}&receiptId=${receiptId}&ulbId=${ulbid}`,
        );
        if (res?.success && res?.data?.length > 0) {
          setDetail(res.data[0]);
        } else {
          alert(res?.message || "Data Not Found");
        }
      } catch (err) {
        console.error("Fetch details error:", err);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [connId, receiptId, ulbid]);

  // Prefill form data after fetching form details
  useEffect(() => {
    if (!detail) return;

    setValue("connNo", detail.CONNNO || "");
    setValue("ownerName", detail.RECEIVDFROM || "");
    setValue("receiptDate", toDateInput(detail.RECEIPDATE));

    // Bill Amt AND Interest/Fine
    setValue("billAmt", String(detail.PAYBLEAMOUNT ?? ""));
    setValue("interestFine", String(detail.PAYBLEAMOUNT ?? ""));

    // Collection Center = zonename
    setValue("collectionCenter", detail.ZONENAME || "");

    setValue("mobileNo", String(detail.MOBILENO ?? ""));
    setValue("email", detail.EMAIL || "");
    setValue("instrumentNo", detail.INSTRUNO || "");
    setValue("instrumentDate", toDateInput(detail.INSTRUDATE));
    setValue("micrCode", detail.MICRCODE ? String(detail.MICRCODE) : "");
    setValue(
      "instrumentType",
      detail.INSTRUTYPE ? String(detail.INSTRUTYPE) : "",
    );

    // Total Bill Amount = ARRDEMAND, Total Rebate = REBATEAMOUNT, Pay Amount = AMOUNT
    setValue("totalBillAmt", String(detail.ARRDEMAND ?? ""));
    setValue("totalRebate", String(detail.REBATEAMOUNT ?? ""));
    setValue("payAmt", String(detail.AMOUNT ?? ""));

    // Charges prefilled from DELCHARGES
    setValue("charges", String(detail.DELCHARGES ?? ""));
  }, [detail, setValue]);

  // Prefill Pay Type — RECMODE is the label so matching dropdown optins value with label not id
  useEffect(() => {
    if (!detail || payTypeOptions.length === 0) return;
    const match = payTypeOptions.find((o) => o.label === detail.RECMODE);
    if (match) setValue("payType", match.value);
  }, [detail, payTypeOptions, setValue]);

  // Prefill Reason — DELREMARK is the id
  useEffect(() => {
    if (!detail || reasonOptions.length === 0) return;
    const id = String(detail.DELREMARK || "");
    if (reasonOptions.some((o) => o.value === id)) {
      setValue("reason", id);
    }
  }, [detail, reasonOptions, setValue]);

  // Prefill Bank — BANKID is the id
  useEffect(() => {
    if (!detail || bankOptions.length === 0) return;
    const id = String(detail.BANKID ?? "");
    if (bankOptions.some((o) => o.value === id)) {
      setValue("bankId", id);
    }
  }, [detail, bankOptions, setValue]);

  const onSubmit = async (values) => {
    console.log("Submit payload →", values);
    alert("Submit not implemented yet");
  };

  // Shared classes
  const disabledInput = "form-input-box w-full bg-slate-100 cursor-not-allowed";
  const enabledInput = "form-input-box w-full";
  const disabledSelect =
    "form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm bg-slate-100 cursor-not-allowed";
  const enabledSelect =
    "form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm";

  return (
    <Layout
      title="Delete Receipt Authorization"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Delete Receipt Authorization",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        {/* Row 1: Connection No, Flat No, Sub Code */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label text="Connection No / मालमत्ता क्र.: " required />
            <input
              type="text"
              className={disabledInput}
              disabled
              {...register("connNo")}
            />
          </div>
          <div>
            <Label text="Flat No: " required />
            <select className={disabledSelect} disabled {...register("flatNo")}>
              <option value="">-- Select --</option>
            </select>
          </div>
          <div>
            <Label text="Sub Code / सब कोड: " />
            <input
              type="text"
              className={disabledInput}
              disabled
              {...register("subCode")}
            />
          </div>
        </div>

        {/* Row 2: Owner Name, Receipt Date */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label text="Owner Name: " required />
            <input
              type="text"
              className={disabledInput}
              disabled
              {...register("ownerName")}
            />
          </div>
          <div>
            <Label text="Receipt Date: " />
            <input
              type="date"
              className={disabledInput}
              disabled
              {...register("receiptDate")}
            />
          </div>
        </div>

        {/* Row 3: Bill Amt, Interest/Fine, Collection Center */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label text="Bill Amt: " />
            <input
              type="text"
              className={disabledInput}
              disabled
              {...register("billAmt")}
            />
          </div>
          <div>
            <Label text="Interest 2% / Fine: " />
            <input
              type="text"
              className={disabledInput}
              disabled
              {...register("interestFine")}
            />
          </div>
          <div>
            <Label text="Collection Center: " />
            <input
              type="text"
              className={disabledInput}
              disabled
              {...register("collectionCenter")}
            />
          </div>
        </div>

        {/* Payment Details */}
        <div className="border border-slate-300 rounded-md p-4 space-y-4">
          <h6 className="text-sm font-semibold text-slate-700 -mt-6 bg-white px-2 inline-block">
            Payment Details
          </h6>

          {/* Row A */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label text="Payment Type: " required />
              <select
                className={disabledSelect}
                disabled
                {...register("payType")}
              >
                <option value="">-- Select --</option>
                {payTypeOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label text="Mobile No: " required />
              <input
                type="text"
                className={disabledInput}
                disabled
                {...register("mobileNo")}
              />
            </div>
            <div>
              <Label text="Email: " />
              <input
                type="text"
                className={disabledInput}
                disabled
                {...register("email")}
              />
            </div>
          </div>

          {/* Row B */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label text="Bank: " required />
              <select
                className={disabledSelect}
                disabled
                {...register("bankId")}
              >
                <option value="">-- Select --</option>
                {bankOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label text="Branch: " />
              <input
                type="text"
                className={disabledInput}
                disabled
                {...register("bankBranch")}
              />
            </div>
          </div>

          {/* Row C */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label text="Instrument No: " />
              <input
                type="text"
                className={disabledInput}
                disabled
                {...register("instrumentNo")}
              />
            </div>
            <div>
              <Label text="Instrument Date: " />
              <input
                type="date"
                className={disabledInput}
                disabled
                {...register("instrumentDate")}
              />
            </div>
          </div>

          {/* Row D */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label text="MICR Code: " />
              <input
                type="text"
                className={disabledInput}
                disabled
                {...register("micrCode")}
              />
            </div>
            <div>
              <Label text="Instrument Type: " />
              <input
                type="text"
                className={disabledInput}
                disabled
                {...register("instrumentType")}
              />
            </div>
            <div>
              <Label text="Remark: " required />
              <input
                type="text"
                className={enabledInput}
                maxLength={250}
                {...register("remark", {
                  required: "Remark is required",
                })}
              />
            </div>
          </div>

          {/* Row E */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label text="Total Bill Amount: " />
              <input
                type="text"
                className={disabledInput}
                disabled
                {...register("totalBillAmt")}
              />
            </div>
            <div>
              <Label text="Total Rebate: " />
              <input
                type="text"
                className={disabledInput}
                disabled
                {...register("totalRebate")}
              />
            </div>
            <div>
              <Label text="Pay Amount: " />
              <input
                type="text"
                className={disabledInput}
                disabled
                {...register("payAmt")}
              />
            </div>
          </div>
        </div>

        {/* Authorization */}
        <div className="border border-slate-300 rounded-md p-4 space-y-4">
          <h6 className="text-sm font-semibold text-slate-700 -mt-6 bg-white px-2 inline-block">
            Authorization
          </h6>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {/* Status radio */}
            <div>
              <Label text="Status: " required />
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                  <input
                    type="radio"
                    value="A"
                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                    {...register("status")}
                  />
                  <span>Approve</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                  <input
                    type="radio"
                    value="R"
                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                    {...register("status")}
                  />
                  <span>Reject</span>
                </label>
              </div>
            </div>

            {/* Reason (disabled, prefilled) */}
            <div>
              <Label text="Reason: " required />
              <select
                className={disabledSelect}
                disabled
                {...register("reason")}
              >
                <option value="">-- Select --</option>
                {reasonOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Charges (enabled, prefilled, editable) */}
            <div>
              <Label text="Charges: " required />
              <input
                type="text"
                className={enabledInput}
                maxLength={10}
                {...register("charges", {
                  required: "Charges is required",
                })}
              />
            </div>

            {/* Password (enabled) */}
            <div>
              <Label text="Password: " required />
              <input
                type="password"
                className={enabledInput}
                {...register("password", {
                  required: "Password is required",
                })}
              />
            </div>

            {/* Buttons */}
            <div className="flex items-end gap-2">
              <Button type="submit" disabled={isSubmitting}>
                Submit
              </Button>
              <Button
                type="button"
                onClick={() =>
                  navigate("/Transaction/FrmReceiptDeleteAuthList")
                }
              >
                Back
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default FrmReceiptDeleteAuthMst;
