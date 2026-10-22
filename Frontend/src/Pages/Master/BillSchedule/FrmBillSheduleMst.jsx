import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Layout from "../../../Components/Layout";
import Label from "../../../Components/Label";
import Button from "../../../Components/Button";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";
import apiService from "../../../../apiService.js";
import GetIPAddress from "../../../utils/ipHelper.jsx";
import config from "../../../utils/config.jsx";

const FrmBillSheduleMst = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const scheduleId = state?.scheduleId;
  const isEdit = !!scheduleId;

  const [ulbOptions, setUlbOptions] = useState([]);
  const [billingFreqOptions, setBillingFreqOptions] = useState([]);
  const [monthOptions, setMonthOptions] = useState([]);
  const [billScheduleDetail, setBillScheduleDetail] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      ulbId: "",
      billingFreq: "",
      fromMonth: "",
      toMonth: "",
      scheduleStatus: "Y",
    },
  });

  // ULB dropdown
  useEffect(() => {
    const fetchUlbDropdown = async () => {
      try {
        setLoading(true);
        const res = await apiService.get("/master/getUlbDropdownController");
        if (res?.success && Array.isArray(res.data)) {
          setUlbOptions(
            res.data.map((item) => ({
              value: String(item.CORPORATIONID),
              label: item.CORPORATIONNAME,
            })),
          );
        } else {
          setUlbOptions([]);
        }
      } catch (err) {
        console.error("ULB dropdown error:", err);
        alert(err.message);
        setUlbOptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUlbDropdown();
  }, []);

  // Auto-select ULB
  useEffect(() => {
    if (ulbid && ulbOptions.length > 0) {
      const match = ulbOptions.find((o) => o.value === String(ulbid));
      if (match) {
        setValue("ulbId", match.value);
      }
    }
  }, [ulbid, ulbOptions, setValue]);

  // Billing Frequency dropdown
  useEffect(() => {
    if (!ulbid) return;

    const fetchBillFreq = async () => {
      try {
        setLoading(true);
        const res = await apiService.get(
          `/master/getBillFrequencyDropdown?ulbId=${ulbid}`,
        );
        if (res?.success && Array.isArray(res.data)) {
          setBillingFreqOptions(
            res.data.map((item) => ({
              value: String(item.NUM_BILLFREQ_ID),
              label: item.VAR_BILLFREQ_NAME,
            })),
          );
        } else {
          setBillingFreqOptions([]);
        }
      } catch (err) {
        console.error("Billing frequency dropdown error:", err);
        alert(err.message);
        setBillingFreqOptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBillFreq();
  }, [ulbid]);

  // Month dropdown
  useEffect(() => {
    const fetchMonths = async () => {
      try {
        setLoading(true);
        const res = await apiService.get("/master/getMonthDropdown");
        if (res?.success && Array.isArray(res.data)) {
          setMonthOptions(
            res.data.map((item) => ({
              value: String(item.NUM_MONTHS_ID),
              label: item.VAR_MONTHS_NAME,
            })),
          );
        } else {
          setMonthOptions([]);
        }
      } catch (err) {
        console.error("Month dropdown error:", err);
        alert(err.message);
        setMonthOptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMonths();
  }, []);

  // Bill Schedule details
  useEffect(() => {
    if (!scheduleId) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await apiService.get(
          `/master/getBillScheduleDetails?billId=${scheduleId}`,
        );
        if (res?.success && res?.data?.length > 0) {
          setBillScheduleDetail(res.data[0]);
        } else {
          alert(res?.message || "Data Not Found");
        }
      } catch (err) {
        console.error("Bill schedule details error:", err);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [scheduleId]);

  // Prefill Status
  useEffect(() => {
    if (!billScheduleDetail) return;
    setValue(
      "scheduleStatus",
      billScheduleDetail.VAR_BILSCHED_CYCLESTATUS || "Y",
    );
  }, [billScheduleDetail, setValue]);

  // Prefill ULB
  useEffect(() => {
    if (!billScheduleDetail || ulbOptions.length === 0) return;
    const id = String(billScheduleDetail.ULBID || "");
    if (ulbOptions.some((o) => o.value === id)) {
      setValue("ulbId", id);
    }
  }, [billScheduleDetail, ulbOptions, setValue]);

  // Prefill Billing Frequency
  useEffect(() => {
    if (!billScheduleDetail || billingFreqOptions.length === 0) return;
    const id = String(billScheduleDetail.NUM_BILSCHED_BILLFREQ_ID || "");
    if (billingFreqOptions.some((o) => o.value === id)) {
      setValue("billingFreq", id);
    }
  }, [billScheduleDetail, billingFreqOptions, setValue]);

  // Prefill From Month
  useEffect(() => {
    if (!billScheduleDetail || monthOptions.length === 0) return;
    const id = String(billScheduleDetail.NUM_BILSCHED_FROMID || "");
    if (monthOptions.some((o) => o.value === id)) {
      setValue("fromMonth", id);
    }
  }, [billScheduleDetail, monthOptions, setValue]);

  // Prefill To Month
  useEffect(() => {
    if (!billScheduleDetail || monthOptions.length === 0) return;
    const id = String(billScheduleDetail.NUM_BILSCHED_TOID || "");
    if (monthOptions.some((o) => o.value === id)) {
      setValue("toMonth", id);
    }
  }, [billScheduleDetail, monthOptions, setValue]);

  // Submit
  const onSubmit = async (data) => {
    if (!userId || !ulbid) {
      alert("User Id or Ulb Id is not set");
      return;
    }

    try {
      setLoading(true);
      const ip = await GetIPAddress();

      const fromMonthName =
        monthOptions.find((o) => o.value === String(data.fromMonth))?.label ||
        "";
      const toMonthName =
        monthOptions.find((o) => o.value === String(data.toMonth))?.label || "";

      const payload = {
        in_userid: userId,
        in_BilSchedid: isEdit ? Number(scheduleId) : 0,
        in_ulbid: Number(ulbid),
        in_freqid: Number(data.billingFreq),
        in_Fromid: Number(data.fromMonth),
        in_FromMname: fromMonthName,
        in_Toid: Number(data.toMonth),
        in_ToMname: toMonthName,
        in_mode: isEdit ? 2 : 1,
        in_ipaddress: ip,
        in_ipSource: config.source,
        in_Status: data.scheduleStatus,
      };

      const res = await apiService.post(
        "/master/aowt_billschedule_ins",
        payload,
      );

      if (res?.success && res?.data?.out_Errcode === 9999) {
        alert(res.data.out_ErrMsg || "Record saved successfully");
        navigate("/Masters/FrmBillSheduleList");
      } else {
        alert(
          res?.data?.out_ErrMsg || res?.message || "Failed to Insert or update",
        );
      }
    } catch (err) {
      console.error("Error saving bill schedule:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Bill Schedule Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Bill Schedule Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ULB */}
          <div>
            <Label text="ULB Name : " required />
            <select
              disabled
              className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                bg-slate-100 cursor-not-allowed"
              {...register("ulbId", { required: "ULB name is required" })}
            >
              <option value="">-- Select ULB --</option>
              {ulbOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.ulbId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.ulbId.message}
              </p>
            )}
          </div>

          {/* Billing Frequency */}
          <div>
            <Label text="Billing Frequency : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${errors.billingFreq ? "border-red-500" : ""}`}
              {...register("billingFreq", {
                required: "Billing frequency is required",
              })}
            >
              <option value="">-- Select Billing Frequency --</option>
              {billingFreqOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.billingFreq && (
              <p className="text-sm text-red-500 mt-1">
                {errors.billingFreq.message}
              </p>
            )}
          </div>

          {/* From Month */}
          <div>
            <Label text="From Month : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${errors.fromMonth ? "border-red-500" : ""}`}
              {...register("fromMonth", {
                required: "From month is required",
              })}
            >
              <option value="">-- Select From Month --</option>
              {monthOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.fromMonth && (
              <p className="text-sm text-red-500 mt-1">
                {errors.fromMonth.message}
              </p>
            )}
          </div>

          {/* To Month */}
          <div>
            <Label text="To Month : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${errors.toMonth ? "border-red-500" : ""}`}
              {...register("toMonth", {
                required: "To month is required",
              })}
            >
              <option value="">-- Select To Month --</option>
              {monthOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.toMonth && (
              <p className="text-sm text-red-500 mt-1">
                {errors.toMonth.message}
              </p>
            )}
          </div>

          {/* Schedule Status */}
          <div>
            <Label text="Schedule Status : " required />
            <div className="flex flex-wrap items-center gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                <input
                  type="radio"
                  value="Y"
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                  {...register("scheduleStatus", {
                    required: "Schedule status is required",
                  })}
                />
                <span>Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                <input
                  type="radio"
                  value="N"
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                  {...register("scheduleStatus", {
                    required: "Schedule status is required",
                  })}
                />
                <span>Inactive</span>
              </label>
            </div>
            {errors.scheduleStatus && (
              <p className="text-sm text-red-500 mt-1">
                {errors.scheduleStatus.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isEdit ? "Update" : "Submit"}
          </Button>
          <Button
            type="button"
            onClick={() => navigate("/Masters/FrmBillSheduleList")}
          >
            Back
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmBillSheduleMst;
