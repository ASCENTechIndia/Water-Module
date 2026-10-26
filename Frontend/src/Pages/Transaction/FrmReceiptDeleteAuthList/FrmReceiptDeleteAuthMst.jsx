import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Layout from "../../../Components/Layout";
import Label from "../../../Components/Label";
import Button from "../../../Components/Button.jsx";
import apiService from "../../../../apiService";
import GetIPAddress from "../../../utils/ipHelper.jsx";
import config from "../../../utils/config.jsx";
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
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const connId = state?.connId;
  const receiptId = state?.recId;
  const wardId = state?.wardId;
  const zoneId = state?.zoneId;
  const blockId = state?.blockId;
  const stateRecNo = state?.recNo;

  const [payTypeOptions, setPayTypeOptions] = useState([]);
  const [reasonOptions, setReasonOptions] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);
  const [detail, setDetail] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
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

  // Prefill form data after fetching details
  useEffect(() => {
    if (!detail) return;

    setValue("connNo", detail.CONNNO || "");
    setValue("ownerName", detail.RECEIVDFROM || "");
    setValue("receiptDate", toDateInput(detail.RECEIPDATE));

    setValue("billAmt", String(detail.PAYBLEAMOUNT ?? ""));
    setValue("interestFine", String(detail.PAYBLEAMOUNT ?? ""));
    setValue("collectionCenter", detail.ZONENAME || "");

    setValue("mobileNo", String(detail.MOBILENO ?? ""));
    setValue("email", detail.EMAIL || "");
    setValue("instrumentNo", detail.INSTRUNO || "");
    setValue("instrumentDate", toDateInput(detail.INSTRUDATE));
    setValue("micrCode", detail.MICRCODE);
    setValue("instrumentType", detail.INSTRUTYPE);

    setValue("totalBillAmt", String(detail.ARRDEMAND ?? ""));
    setValue("totalRebate", String(detail.REBATEAMOUNT ?? ""));
    setValue("payAmt", String(detail.AMOUNT ?? ""));

    setValue("charges", String(detail.DELCHARGES ?? ""));
  }, [detail, setValue]);

  // Prefill Pay Type — match by label
  useEffect(() => {
    if (!detail || payTypeOptions.length === 0) return;
    const match = payTypeOptions.find((o) => o.label === detail.RECMODE);
    if (match) setValue("payType", match.value);
  }, [detail, payTypeOptions, setValue]);

  // Prefill Reason
  useEffect(() => {
    if (!detail || reasonOptions.length === 0) return;
    const id = String(detail.DELREMARK || "");
    if (reasonOptions.some((o) => o.value === id)) {
      setValue("reason", id);
    }
  }, [detail, reasonOptions, setValue]);

  // Prefill Bank
  useEffect(() => {
    if (!detail || bankOptions.length === 0) return;
    const id = String(detail.BANKID ?? "");
    if (bankOptions.some((o) => o.value === id)) {
      setValue("bankId", id);
    }
  }, [detail, bankOptions, setValue]);

  // Submit handler
  const onSubmit = async (values) => {
    if (!userId || !ulbid) {
      alert("User Id or Ulb Id is not set");
      return;
    }

    if (!values.remark?.trim()) {
      alert("Please Enter Remark");
      return;
    }
    if (!values.status) {
      alert("Please Select Status");
      return;
    }
    if (!values.reason) {
      alert("Delete reason is missing");
      return;
    }
    if (
      values.charges === "" ||
      values.charges === null ||
      values.charges === undefined
    ) {
      alert("Please Enter Charges");
      return;
    }
    if (!values.password?.trim()) {
      alert("Please Enter Password");
      return;
    }
    if (!connId || !receiptId || !wardId || !zoneId || !blockId) {
      alert(
        "Required identifiers are missing. Please go back to the list and try again.",
      );
      return;
    }

    const recNoForDisplay = detail?.RECEIPTNO || stateRecNo || "";
    const payAmtForDisplay = values.payAmt || detail?.AMOUNT || "";
    const recDateForDisplay = values.receiptDate || "";

    const confirmed = window.confirm(
      `Are You Sure, You Want To Delete Receipt?\n\n` +
        `Conn No: ${values.connNo}\n` +
        `Receipt No: ${recNoForDisplay}\n` +
        `Receipt Amount: ${payAmtForDisplay}\n` +
        `Receipt Date: ${recDateForDisplay}`,
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      const ip = await GetIPAddress();

      const payload = {
        in_userid: userId,
        in_ulbid: Number(ulbid),
        in_wardid: Number(wardId),
        in_zoneid: Number(zoneId),
        in_blockno: Number(blockId),
        in_connid: Number(connId),
        in_recid: Number(receiptId),
        in_recno: String(detail?.RECEIPTNO || stateRecNo || ""),
        in_status: values.status,
        in_reasonid: Number(values.reason),
        in_charges: Number(values.charges),
        in_password: values.password,
        in_remark: values.remark.trim(),
        in_ipaddress: ip,
        in_source: config.source,
      };

      console.log("Receipt delete auth payload →", payload);

      const res = await apiService.post(
        "/transaction/aowt_rec_delauth",
        payload,
      );

      if (res?.success && res?.data?.out_errorcode === 9999) {
        alert(res.data.out_errormssg || "Receipt processed successfully");
        navigate("/Transaction/FrmReceiptDeleteAuthList");
      } else {
        alert(
          res?.data?.out_errormssg ||
            res?.message ||
            "Failed to process receipt delete authorization",
        );
      }
    } catch (err) {
      console.error("Receipt delete auth error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Shared classes
  const disabledInput = "form-input-box w-full bg-slate-100 cursor-not-allowed";
  const enabledInput = "form-input-box w-full";
  const disabledSelect =
    "form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm bg-slate-100 cursor-not-allowed";

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

            {/* Reason */}
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

            {/* Charges */}
            <div>
              <Label text="Charges: " required />
              <input
                type="text"
                className={enabledInput}
                maxLength={10}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
                {...register("charges", {
                  required: "Charges is required",
                })}
              />
            </div>

            {/* Password */}
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
