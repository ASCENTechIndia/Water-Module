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

const FrmAccTaxConfigMst = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const accTaxConfigId = state?.accTaxConfigId;
  const isEdit = !!accTaxConfigId;

  const [ulbOptions, setUlbOptions] = useState([]);
  const [taxOptions, setTaxOptions] = useState([]);
  const [usageTypeOptions, setUsageTypeOptions] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      ulbId: "",
      taxId: "",
      usageTypeId: "",
      arreasMinorCode: "",
      arreasMajorCode: "",
      cMinorCode: "",
      cMajorCode: "",
    },
  });

  const watchUlbId = watch("ulbId");

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

    // Auto-select first ULB by default
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

  // ---------- Load Tax + Usage Type dropdowns when ULB changes (DUMMY) ----------
  useEffect(() => {
    setTaxOptions([]);
    setUsageTypeOptions([]);
    setValue("taxId", "");
    setValue("usageTypeId", "");

    if (!watchUlbId) return;

    // 🔸 DUMMY — keyed by ULB
    const dummyTaxes = {
      1: [
        { value: "1", label: "Water Tax" },
        { value: "2", label: "Sewerage Tax" },
      ],
      2: [
        { value: "3", label: "Property Tax" },
      ],
      3: [
        { value: "4", label: "Water Tax" },
      ],
      4: [
        { value: "5", label: "Water Tax" },
      ],
    };
    setTaxOptions(dummyTaxes[watchUlbId] || []);

    const dummyUsageTypes = {
      1: [
        { value: "1", label: "Residential" },
        { value: "2", label: "Commercial" },
      ],
      2: [
        { value: "3", label: "Industrial" },
      ],
      3: [
        { value: "4", label: "Residential" },
      ],
      4: [
        { value: "5", label: "Commercial" },
      ],
    };
    setUsageTypeOptions(dummyUsageTypes[watchUlbId] || []);

    // 🔸 REAL API — uncomment when ready
    // const fetchDependents = async () => {
    //   try {
    //     setLoading(true);
    //     const [taxRes, usageRes] = await Promise.all([
    //       apiService.post("getTaxDropdown", { ulbId: Number(watchUlbId) }),
    //       apiService.post("getUsageTypeDropdown", { ulbId: Number(watchUlbId) }),
    //     ]);
    //     if (taxRes?.data?.success && Array.isArray(taxRes.data.data)) {
    //       setTaxOptions(
    //         taxRes.data.data.map((i) => ({
    //           value: String(i.TAXID),
    //           label: i.TAXNAME,
    //         })),
    //       );
    //     } else {
    //       setTaxOptions([]);
    //     }
    //     if (usageRes?.data?.success && Array.isArray(usageRes.data.data)) {
    //       setUsageTypeOptions(
    //         usageRes.data.data.map((i) => ({
    //           value: String(i.USAGETYPEID),
    //           label: i.USAGETYPENAME,
    //         })),
    //       );
    //     } else {
    //       setUsageTypeOptions([]);
    //     }
    //   } catch (err) {
    //     console.error("Dependent dropdown error:", err);
    //     setTaxOptions([]);
    //     setUsageTypeOptions([]);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchDependents();
  }, [watchUlbId, setValue]);

  // ---------- Load detail in edit mode (DUMMY) ----------
  useEffect(() => {
    if (!accTaxConfigId) return;

    // 🔸 DUMMY — replace with apiService.post("getAccTaxConfigDetail", { accTaxConfigId: Number(accTaxConfigId) })
    const dummyDetail = {
      NUM_ACCTAXCONFIG_ID: accTaxConfigId,
      NUM_ULB_ID: "1",
      NUM_TAX_ID: "1",
      NUM_USAGETYPE_ID: "1",
      VAR_ARREAS_MINORCODE: "AR-MIN-01",
      VAR_ARREAS_MAJORCODE: "AR-MAJ-01",
      VAR_C_MINORCODE: "C-MIN-01",
      VAR_C_MAJORCODE: "C-MAJ-01",
    };

    reset({
      ulbId: String(dummyDetail.NUM_ULB_ID || ""),
      taxId: String(dummyDetail.NUM_TAX_ID || ""),
      usageTypeId: String(dummyDetail.NUM_USAGETYPE_ID || ""),
      arreasMinorCode: dummyDetail.VAR_ARREAS_MINORCODE || "",
      arreasMajorCode: dummyDetail.VAR_ARREAS_MAJORCODE || "",
      cMinorCode: dummyDetail.VAR_C_MINORCODE || "",
      cMajorCode: dummyDetail.VAR_C_MAJORCODE || "",
    });

    // 🔸 REAL API — uncomment when ready
    // const fetchDetail = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.post("getAccTaxConfigDetail", {
    //       accTaxConfigId: Number(accTaxConfigId),
    //     });
    //     if (res?.data?.success && res?.data?.data?.length > 0) {
    //       const d = res.data.data[0];
    //       reset({
    //         ulbId: String(d.NUM_ULB_ID || ""),
    //         taxId: String(d.NUM_TAX_ID || ""),
    //         usageTypeId: String(d.NUM_USAGETYPE_ID || ""),
    //         arreasMinorCode: d.VAR_ARREAS_MINORCODE || "",
    //         arreasMajorCode: d.VAR_ARREAS_MAJORCODE || "",
    //         cMinorCode: d.VAR_C_MINORCODE || "",
    //         cMajorCode: d.VAR_C_MAJORCODE || "",
    //       });
    //     } else {
    //       alert(res?.data?.errorMessage || "Acc tax config detail not found");
    //     }
    //   } catch (err) {
    //     console.error("Acc tax config detail error:", err);
    //     alert("Failed to fetch acc tax config detail.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchDetail();
  }, [accTaxConfigId, reset]);

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
        in_AccTaxConfigId: isEdit ? Number(accTaxConfigId) : null,
        in_UlbId: Number(data.ulbId),
        in_TaxId: Number(data.taxId),
        in_UsageTypeId: Number(data.usageTypeId),
        in_ArreasMinorCode: data.arreasMinorCode.trim(),
        in_ArreasMajorCode: data.arreasMajorCode.trim(),
        in_CMinorCode: data.cMinorCode.trim(),
        in_CMajorCode: data.cMajorCode.trim(),
        in_ipaddress: ip,
        in_source: config.source,
      };

      // 🔸 DUMMY — replace with real endpoint when ready
      console.log("Acc Tax Config payload →", payload);
      alert("Saved successfully (dummy)");
      navigate("/Masters/FrmAccTaxConfigList");

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.post("aoio_acctaxconfig_ins", payload);
      // if (res?.data?.success && res?.data?.errorCode === 9999) {
      //   alert(res.data.errorMessage);
      //   navigate("/Masters/FrmAccTaxConfigList");
      // } else {
      //   alert(
      //     res?.data?.errorMessage ||
      //       res?.data?.message ||
      //       "Failed to save account tax config",
      //   );
      // }
    } catch (error) {
      console.error("Error saving acc tax config:", error);
      alert("API Error — check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Account Tax Config Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Account Tax Config Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        {/* 2 columns per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Ulb Name */}
          <div>
            <Label text="Ulb Name : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${errors.ulbId ? "border-red-500" : ""}`}
              {...register("ulbId", { required: "ULB name is required" })}
            >
              <option value="">-- Select Ulb --</option>
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

          {/* 2. Tax Name */}
          <div>
            <Label text="Tax Name : " required />
            <select
              disabled={!watchUlbId}
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${!watchUlbId ? "bg-slate-100 cursor-not-allowed" : ""}
                ${errors.taxId ? "border-red-500" : ""}`}
              {...register("taxId", { required: "Tax name is required" })}
            >
              <option value="">
                {watchUlbId ? "-- Select Tax --" : "-- Select Ulb first --"}
              </option>
              {taxOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.taxId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.taxId.message}
              </p>
            )}
          </div>

          {/* 3. Usage Type Name */}
          <div>
            <Label text="Usage Type Name : " required />
            <select
              disabled={!watchUlbId}
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${!watchUlbId ? "bg-slate-100 cursor-not-allowed" : ""}
                ${errors.usageTypeId ? "border-red-500" : ""}`}
              {...register("usageTypeId", {
                required: "Usage Type is required",
              })}
            >
              <option value="">
                {watchUlbId
                  ? "-- Select Usage Type --"
                  : "-- Select Ulb first --"}
              </option>
              {usageTypeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.usageTypeId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.usageTypeId.message}
              </p>
            )}
          </div>

          {/* 4. Arreas MinorCode */}
          <div>
            <Label text="Arreas MinorCode : " required />
            <input
              type="text"
              placeholder="Enter arreas minor code"
              className={`form-input-box ${
                errors.arreasMinorCode ? "border-red-500" : ""
              }`}
              {...register("arreasMinorCode", {
                required: "Arreas minor code is required",
                validate: (v) =>
                  v.trim().length > 0 || "Arreas minor code cannot be empty",
              })}
            />
            {errors.arreasMinorCode && (
              <p className="text-sm text-red-500 mt-1">
                {errors.arreasMinorCode.message}
              </p>
            )}
          </div>

          {/* 5. Arreas MajorCode */}
          <div>
            <Label text="Arreas MajorCode : " required />
            <input
              type="text"
              placeholder="Enter arreas major code"
              className={`form-input-box ${
                errors.arreasMajorCode ? "border-red-500" : ""
              }`}
              {...register("arreasMajorCode", {
                required: "Arreas major code is required",
                validate: (v) =>
                  v.trim().length > 0 || "Arreas major code cannot be empty",
              })}
            />
            {errors.arreasMajorCode && (
              <p className="text-sm text-red-500 mt-1">
                {errors.arreasMajorCode.message}
              </p>
            )}
          </div>

          {/* 6. Current MinorCode */}
          <div>
            <Label text="Current MinorCode : " required />
            <input
              type="text"
              placeholder="Enter current minor code"
              className={`form-input-box ${
                errors.cMinorCode ? "border-red-500" : ""
              }`}
              {...register("cMinorCode", {
                required: "Current minor code is required",
                validate: (v) =>
                  v.trim().length > 0 || "Current minor code cannot be empty",
              })}
            />
            {errors.cMinorCode && (
              <p className="text-sm text-red-500 mt-1">
                {errors.cMinorCode.message}
              </p>
            )}
          </div>

          {/* 7. Current MajorCode */}
          <div>
            <Label text="Current MajorCode : " required />
            <input
              type="text"
              placeholder="Enter current major code"
              className={`form-input-box ${
                errors.cMajorCode ? "border-red-500" : ""
              }`}
              {...register("cMajorCode", {
                required: "Current major code is required",
                validate: (v) =>
                  v.trim().length > 0 || "Current major code cannot be empty",
              })}
            />
            {errors.cMajorCode && (
              <p className="text-sm text-red-500 mt-1">
                {errors.cMajorCode.message}
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
            onClick={() => navigate("/Masters/FrmAccTaxConfigList")}
          >
            Back
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmAccTaxConfigMst;