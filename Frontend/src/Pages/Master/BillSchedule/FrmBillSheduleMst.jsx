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

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

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

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      ulbId: "",
      billingFreq: "",
      fromMonth: "",
      toMonth: "",
      scheduleStatus: "Active", // ✅ Active by default
    },
  });

  // ---------- Load ULB dropdown (DUMMY) ----------
  useEffect(() => {
    // 🔸 DUMMY — replace with apiService.get("getUlbDropdown") later
    const dummyUlbs = [
      { value: "1", label: "Pune Municipal Corporation" },
      { value: "2", label: "Mumbai Municipal Corporation" },
      { value: "3", label: "Nashik Municipal Corporation" },
      { value: "4", label: "Nagpur Municipal Corporation" },
    ];
    setUlbOptions(dummyUlbs);

    // Auto-select first ULB (dropdown disabled below)
    if (dummyUlbs.length > 0) {
      setValue("ulbId", dummyUlbs[0].value);
    }

    // 🔸 REAL API — uncomment when ready
    // const fetchUlb = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.get("getUlbDropdown");
    //     if (res?.data?.success && Array.isArray(res.data.data)) {
    //       const opts = res.data.data.map((item) => ({
    //         value: String(item.CORPORATIONID),
    //         label: item.CORPORATIONNAME,
    //       }));
    //       setUlbOptions(opts);
    //     } else {
    //       setUlbOptions([]);
    //     }
    //   } catch (err) {
    //     console.error("ULB dropdown error:", err);
    //     setUlbOptions([]);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchUlb();
  }, [setValue]);

  // ---------- Load Billing Frequency dropdown (DUMMY) ----------
  useEffect(() => {
    // 🔸 DUMMY — replace with apiService.get("getBillingFreqDropdown") later
    setBillingFreqOptions([
      { value: "1", label: "Monthly" },
      { value: "2", label: "Quarterly" },
      { value: "3", label: "Half Yearly" },
      { value: "4", label: "Yearly" },
    ]);

    // 🔸 REAL API — uncomment when ready
    // const fetchFreq = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.get("getBillingFreqDropdown");
    //     if (res?.data?.success && Array.isArray(res.data.data)) {
    //       setBillingFreqOptions(
    //         res.data.data.map((item) => ({
    //           value: String(item.FREQID),
    //           label: item.FREQNAME,
    //         })),
    //       );
    //     } else {
    //       setBillingFreqOptions([]);
    //     }
    //   } catch (err) {
    //     console.error("Billing frequency dropdown error:", err);
    //     setBillingFreqOptions([]);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchFreq();
  }, []);

  // ---------- Load detail in edit mode (DUMMY) ----------
  useEffect(() => {
    if (!scheduleId) return;

    // 🔸 DUMMY — replace with apiService.post("getBillSheduleDetail", { scheduleId: Number(scheduleId) })
    const dummyDetail = {
      NUM_SCHEDULE_ID: scheduleId,
      NUM_ULB_ID: "1",
      NUM_BILLINGFREQ_ID: "1",
      VAR_FROM_MONTH: "April",
      VAR_TO_MONTH: "March",
      VAR_SCHEDULE_STATUS: "Active",
    };

    reset({
      ulbId: String(dummyDetail.NUM_ULB_ID || ""),
      billingFreq: String(dummyDetail.NUM_BILLINGFREQ_ID || ""),
      fromMonth: dummyDetail.VAR_FROM_MONTH || "",
      toMonth: dummyDetail.VAR_TO_MONTH || "",
      scheduleStatus: dummyDetail.VAR_SCHEDULE_STATUS || "Active",
    });

    // 🔸 REAL API — uncomment when ready
    // const fetchDetail = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.post("getBillSheduleDetail", {
    //       scheduleId: Number(scheduleId),
    //     });
    //     if (res?.data?.success && res?.data?.data?.length > 0) {
    //       const d = res.data.data[0];
    //       reset({
    //         ulbId: String(d.NUM_ULB_ID || ""),
    //         billingFreq: String(d.NUM_BILLINGFREQ_ID || ""),
    //         fromMonth: d.VAR_FROM_MONTH || "",
    //         toMonth: d.VAR_TO_MONTH || "",
    //         scheduleStatus: d.VAR_SCHEDULE_STATUS || "Active",
    //       });
    //     } else {
    //       alert(res?.data?.errorMessage || "Bill schedule detail not found");
    //     }
    //   } catch (err) {
    //     console.error("Bill schedule detail error:", err);
    //     alert("Failed to fetch bill schedule detail.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchDetail();
  }, [scheduleId, reset]);

  // ---------- Submit ----------
  const onSubmit = async (data) => {
    if (!userId || !ulbid) {
      alert("User Id or Ulb Id is not set");
      return;
    }

    try {
      setLoading(true);
      const ip = await GetIPAddress();

      const payload = {
        in_UserId: userId,
        in_Mode: isEdit ? 2 : 1,
        in_ScheduleId: isEdit ? Number(scheduleId) : null,
        in_UlbId: Number(data.ulbId),
        in_BillingFreqId: Number(data.billingFreq),
        in_FromMonth: data.fromMonth,
        in_ToMonth: data.toMonth,
        in_ScheduleStatus: data.scheduleStatus,
        in_ipaddress: ip,
        in_source: config.source,
      };

      // 🔸 DUMMY — replace with real endpoint when ready
      console.log("Bill Schedule payload →", payload);
      alert("Saved successfully (dummy)");
      navigate("/Masters/FrmBillSheduleList");

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.post("aoio_billshedule_ins", payload);
      // if (res?.data?.success && res?.data?.errorCode === 9999) {
      //   alert(res.data.errorMessage);
      //   navigate("/Masters/FrmBillSheduleList");
      // } else {
      //   alert(
      //     res?.data?.errorMessage ||
      //       res?.data?.message ||
      //       "Failed to save bill schedule",
      //   );
      // }
    } catch (error) {
      console.error("Error saving bill schedule:", error);
      alert("API Error — check console for details.");
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
        {/* 2 columns per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. ULB Name — disabled, first selected */}
          <div>
            <Label text="ULB Name : " required />
            <select
              disabled
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                bg-slate-100 cursor-not-allowed
                ${errors.ulbId ? "border-red-500" : ""}`}
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

          {/* 2. Billing Frequency */}
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

          {/* 3. From Month */}
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
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            {errors.fromMonth && (
              <p className="text-sm text-red-500 mt-1">
                {errors.fromMonth.message}
              </p>
            )}
          </div>

          {/* 4. To Month */}
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
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            {errors.toMonth && (
              <p className="text-sm text-red-500 mt-1">
                {errors.toMonth.message}
              </p>
            )}
          </div>

          {/* 5. Schedule Status — radio (Active default) */}
          <div>
            <Label text="Schedule Status : " required />
            <div className="flex flex-wrap items-center gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                <input
                  type="radio"
                  value="Active"
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
                  value="Inactive"
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

        {/* Buttons — centered */}
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