import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import Layout from "../../../Components/Layout";
import Label from "../../../Components/Label";
import Button from "../../../Components/Button";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";
import apiService from "../../../../apiService.js";
import GetIPAddress from "../../../utils/ipHelper.jsx";
import config from "../../../utils/config.jsx";

// Local-date today (YYYY-MM-DD)
const todayISO = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const FrmRateMst = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const rateId = state?.rateId;
  const isEdit = !!rateId;

  // ---------- Dropdown state ----------
  const [usageTypeOptions, setUsageTypeOptions] = useState([]);
  const [usageSubTypeOptions, setUsageSubTypeOptions] = useState([]);
  const [connectionTypeOptions, setConnectionTypeOptions] = useState([]);
  const [connectionSizeOptions, setConnectionSizeOptions] = useState([]);
  const [taxOptions, setTaxOptions] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      usageType: "",
      usageSubType: "",
      connectionType: "",
      connectionSize: "",
      effectiveFrom: todayISO(),
      tax: "",
      tableFields: [{ from: "", to: "", rate: "", minimumAmt: "" }],
    },
  });

  const { fields } = useFieldArray({ control, name: "tableFields" });

  const watchUsageType = watch("usageType");
  const watchTableFields = watch("tableFields");

  // ---------- Load all dropdowns (DUMMY) ----------
  useEffect(() => {
    // 🔸 DUMMY DATA — replace with real APIs later
    setUsageTypeOptions([
      { value: "1", label: "Residential" },
      { value: "2", label: "Commercial" },
      { value: "3", label: "Industrial" },
    ]);

    setConnectionTypeOptions([
      { value: "1", label: "Metered" },
      { value: "2", label: "Non-Metered" },
    ]);

    setConnectionSizeOptions([
      { value: "1", label: "15mm" },
      { value: "2", label: "20mm" },
      { value: "3", label: "25mm" },
      { value: "4", label: "40mm" },
    ]);

    setTaxOptions([
      { value: "1", label: "5%" },
      { value: "2", label: "12%" },
      { value: "3", label: "18%" },
      { value: "4", label: "0%" },
    ]);

    // 🔸 REAL API — uncomment when ready
    // const loadAll = async () => {
    //   try {
    //     setLoading(true);
    //     const [ut, ct, cs, tax] = await Promise.all([
    //       apiService.get("getUsageTypeDropdown"),
    //       apiService.get("getConnectionTypeDropdown"),
    //       apiService.get("getConnectionSizeDropdown"),
    //       apiService.get("getTaxDropdown"),
    //     ]);
    //     const map = (res, k, l) =>
    //       res?.data?.success
    //         ? res.data.data.map((i) => ({ value: String(i[k]), label: i[l] }))
    //         : [];
    //     setUsageTypeOptions(map(ut, "ID", "NAME"));
    //     setConnectionTypeOptions(map(ct, "ID", "NAME"));
    //     setConnectionSizeOptions(map(cs, "ID", "NAME"));
    //     setTaxOptions(map(tax, "ID", "NAME"));
    //   } catch (err) {
    //     console.error("Dropdown load error:", err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // loadAll();
  }, []);

  // ---------- Load Usage Sub-Type when Usage Type changes (DUMMY) ----------
  useEffect(() => {
    setUsageSubTypeOptions([]);
    setValue("usageSubType", "");

    if (!watchUsageType) return;

    // 🔸 DUMMY — keyed by usage type
    const dummySubTypes = {
      1: [
        { value: "1", label: "Domestic" },
        { value: "2", label: "Slum" },
      ],
      2: [
        { value: "3", label: "Shop" },
        { value: "4", label: "Hotel" },
      ],
      3: [{ value: "5", label: "Factory" }],
    };
    setUsageSubTypeOptions(dummySubTypes[watchUsageType] || []);

    // 🔸 REAL API — uncomment when ready
    // const fetchSubTypes = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.post("getUsageSubTypeDropdown", {
    //       usageTypeId: Number(watchUsageType),
    //     });
    //     if (res?.data?.success && Array.isArray(res.data.data)) {
    //       setUsageSubTypeOptions(
    //         res.data.data.map((item) => ({
    //           value: String(item.ID),
    //           label: item.NAME,
    //         })),
    //       );
    //     } else {
    //       setUsageSubTypeOptions([]);
    //     }
    //   } catch (err) {
    //     console.error("Usage Sub Type dropdown error:", err);
    //     setUsageSubTypeOptions([]);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchSubTypes();
  }, [watchUsageType, setValue]);

  // ---------- Load detail in edit mode (DUMMY) ----------
  useEffect(() => {
    if (!rateId) return;

    // 🔸 DUMMY — replace with apiService.post("getRateDetail", { rateId: Number(rateId) })
    const dummyDetail = {
      NUM_RATE_ID: rateId,
      NUM_USAGE_TYPE: "1",
      NUM_USAGE_SUBTYPE: "1",
      NUM_CONNECTION_TYPE: "1",
      NUM_CONNECTION_SIZE: "1",
      DATE_EFFECTIVE_FROM: "2024-04-01",
      NUM_TAX: "1",
      NUM_FROM: "0",
      NUM_TO: "10",
      NUM_RATE: "12.50",
      NUM_MINIMUM_AMT: "100",
    };

    reset({
      usageType: String(dummyDetail.NUM_USAGE_TYPE || ""),
      usageSubType: String(dummyDetail.NUM_USAGE_SUBTYPE || ""),
      connectionType: String(dummyDetail.NUM_CONNECTION_TYPE || ""),
      connectionSize: String(dummyDetail.NUM_CONNECTION_SIZE || ""),
      effectiveFrom: dummyDetail.DATE_EFFECTIVE_FROM || todayISO(),
      tax: String(dummyDetail.NUM_TAX || ""),
      tableFields: [
        {
          from: String(dummyDetail.NUM_FROM || ""),
          to: String(dummyDetail.NUM_TO || ""),
          rate: String(dummyDetail.NUM_RATE || ""),
          minimumAmt: String(dummyDetail.NUM_MINIMUM_AMT || ""),
        },
      ],
    });

    // 🔸 REAL API — uncomment when ready
    // const fetchDetail = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.post("getRateDetail", {
    //       rateId: Number(rateId),
    //     });
    //     if (res?.data?.success && res?.data?.data?.length > 0) {
    //       const d = res.data.data[0];
    //       reset({
    //         usageType: String(d.NUM_USAGE_TYPE || ""),
    //         usageSubType: String(d.NUM_USAGE_SUBTYPE || ""),
    //         connectionType: String(d.NUM_CONNECTION_TYPE || ""),
    //         connectionSize: String(d.NUM_CONNECTION_SIZE || ""),
    //         effectiveFrom: d.DATE_EFFECTIVE_FROM || todayISO(),
    //         tax: String(d.NUM_TAX || ""),
    //         tableFields: [
    //           {
    //             from: String(d.NUM_FROM || ""),
    //             to: String(d.NUM_TO || ""),
    //             rate: String(d.NUM_RATE || ""),
    //             minimumAmt: String(d.NUM_MINIMUM_AMT || ""),
    //           },
    //         ],
    //       });
    //     } else {
    //       alert(res?.data?.errorMessage || "Rate detail not found");
    //     }
    //   } catch (err) {
    //     console.error("Rate detail error:", err);
    //     alert("Failed to fetch rate detail.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchDetail();
  }, [rateId, reset]);

  // ---------- Submit ----------
  const onSubmit = async (data) => {
    if (!userId || !ulbid) {
      alert("User Id or Ulb Id is not set");
      return;
    }

    try {
      setLoading(true);
      const ip = await GetIPAddress();

      const row = data.tableFields?.[0] || {};

      const payload = {
        in_UserId: userId,
        in_Mode: isEdit ? 2 : 1,
        in_RateId: isEdit ? Number(rateId) : null,
        in_UlbId: Number(ulbid),
        in_UsageType: Number(data.usageType),
        in_UsageSubType: Number(data.usageSubType),
        in_ConnectionType: Number(data.connectionType),
        in_ConnectionSize: Number(data.connectionSize),
        in_EffectiveFrom: data.effectiveFrom,
        in_Tax: Number(data.tax),
        in_From: Number(row.from),
        in_To: Number(row.to),
        in_Rate: Number(row.rate),
        in_MinimumAmt: Number(row.minimumAmt),
        in_ipaddress: ip,
        in_source: config.source,
      };

      // 🔸 DUMMY — replace with real endpoint when ready
      console.log("Rate payload →", payload);
      alert("Saved successfully (dummy)");
      navigate("/Masters/FrmRateList");

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.post("aoio_rate_ins", payload);
      // if (res?.data?.success && res?.data?.errorCode === 9999) {
      //   alert(res.data.errorMessage);
      //   navigate("/Masters/FrmRateList");
      // } else {
      //   alert(
      //     res?.data?.errorMessage ||
      //       res?.data?.message ||
      //       "Failed to save rate",
      //   );
      // }
    } catch (error) {
      console.error("Error saving rate:", error);
      alert("API Error — check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Input sanitizers ----------
  const allowOnlyDigits = (e) => {
    e.target.value = e.target.value.replace(/\D/g, "");
  };
  const allowOnlyDecimal = (e) => {
    let v = e.target.value.replace(/[^0-9.]/g, "");
    const parts = v.split(".");
    if (parts.length > 2) v = parts[0] + "." + parts[1];
    e.target.value = v;
  };

  return (
    <Layout
      title="Rate Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Rate Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        {/* ---------- 6 Form Fields (2 per row) ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Usage Type */}
          <div>
            <Label text="Usage Type : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${errors.usageType ? "border-red-500" : ""}`}
              {...register("usageType", {
                required: "Usage Type is required",
              })}
            >
              <option value="">-- Select Usage Type --</option>
              {usageTypeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.usageType && (
              <p className="text-sm text-red-500 mt-1">
                {errors.usageType.message}
              </p>
            )}
          </div>

          {/* 2. Usage Sub-Type */}
          <div>
            <Label text="Usage Sub-Type : " required />
            <select
              disabled={!watchUsageType}
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${!watchUsageType ? "bg-slate-100 cursor-not-allowed" : ""}
                ${errors.usageSubType ? "border-red-500" : ""}`}
              {...register("usageSubType", {
                required: "Usage Sub-Type is required",
              })}
            >
              <option value="">
                {watchUsageType
                  ? "-- Select Usage Sub-Type --"
                  : "-- Select Usage Type first --"}
              </option>
              {usageSubTypeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.usageSubType && (
              <p className="text-sm text-red-500 mt-1">
                {errors.usageSubType.message}
              </p>
            )}
          </div>

          {/* 3. Connection Type */}
          <div>
            <Label text="Connection Type : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${errors.connectionType ? "border-red-500" : ""}`}
              {...register("connectionType", {
                required: "Connection Type is required",
              })}
            >
              <option value="">-- Select Connection Type --</option>
              {connectionTypeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.connectionType && (
              <p className="text-sm text-red-500 mt-1">
                {errors.connectionType.message}
              </p>
            )}
          </div>

          {/* 4. Connection Size */}
          <div>
            <Label text="Connection Size : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${errors.connectionSize ? "border-red-500" : ""}`}
              {...register("connectionSize", {
                required: "Connection Size is required",
              })}
            >
              <option value="">-- Select Connection Size --</option>
              {connectionSizeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.connectionSize && (
              <p className="text-sm text-red-500 mt-1">
                {errors.connectionSize.message}
              </p>
            )}
          </div>

          {/* 5. Effective From */}
          <div>
            <Label text="Effective From : " required />
            <input
              type="date"
              className={`form-input-box ${
                errors.effectiveFrom ? "border-red-500" : ""
              }`}
              {...register("effectiveFrom", {
                required: "Effective From is required",
              })}
            />
            {errors.effectiveFrom && (
              <p className="text-sm text-red-500 mt-1">
                {errors.effectiveFrom.message}
              </p>
            )}
          </div>

          {/* 6. Tax */}
          <div>
            <Label text="Tax : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${errors.tax ? "border-red-500" : ""}`}
              {...register("tax", { required: "Tax is required" })}
            >
              <option value="">-- Select Tax --</option>
              {taxOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.tax && (
              <p className="text-sm text-red-500 mt-1">{errors.tax.message}</p>
            )}
          </div>
        </div>

        {/* ---------- Slab Table (single row) ---------- */}
        <div className="mt-3">
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-slate-100/95">
                  <tr className="border-b border-slate-200">
                    {["From", "To", "Rate", "Minimum Amount"].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field, index) => (
                    <tr key={field.id} className="border-b border-slate-100">
                      {/* From */}
                      <td className="px-3 py-2 align-top">
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="From"
                          className={`form-input-box w-full ${
                            errors.tableFields?.[index]?.from
                              ? "border-red-500"
                              : ""
                          }`}
                          onInput={allowOnlyDigits}
                          {...register(`tableFields.${index}.from`, {
                            required: "From is required",
                          })}
                        />
                        {errors.tableFields?.[index]?.from && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.tableFields[index].from.message}
                          </p>
                        )}
                      </td>

                      {/* To */}
                      <td className="px-3 py-2 align-top">
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="To"
                          className={`form-input-box w-full ${
                            errors.tableFields?.[index]?.to
                              ? "border-red-500"
                              : ""
                          }`}
                          onInput={allowOnlyDigits}
                          {...register(`tableFields.${index}.to`, {
                            required: "To is required",
                            validate: (v) => {
                              const from = Number(
                                watchTableFields?.[index]?.from ?? 0,
                              );
                              const to = Number(v);
                              if (v === "") return "To is required";
                              if (!Number.isNaN(from) && to < from)
                                return "To must be greater than From";
                              return true;
                            },
                          })}
                        />
                        {errors.tableFields?.[index]?.to && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.tableFields[index].to.message}
                          </p>
                        )}
                      </td>

                      {/* Rate */}
                      <td className="px-3 py-2 align-top">
                        <input
                          type="text"
                          inputMode="decimal"
                          placeholder="Rate"
                          className={`form-input-box w-full ${
                            errors.tableFields?.[index]?.rate
                              ? "border-red-500"
                              : ""
                          }`}
                          onInput={allowOnlyDecimal}
                          {...register(`tableFields.${index}.rate`, {
                            required: "Rate is required",
                          })}
                        />
                        {errors.tableFields?.[index]?.rate && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.tableFields[index].rate.message}
                          </p>
                        )}
                      </td>

                      {/* Minimum Amount */}
                      <td className="px-3 py-2 align-top">
                        <input
                          type="text"
                          inputMode="decimal"
                          placeholder="Minimum Amount"
                          className={`form-input-box w-full ${
                            errors.tableFields?.[index]?.minimumAmt
                              ? "border-red-500"
                              : ""
                          }`}
                          onInput={allowOnlyDecimal}
                          {...register(`tableFields.${index}.minimumAmt`, {
                            required: "Minimum amount is required",
                          })}
                        />
                        {errors.tableFields?.[index]?.minimumAmt && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.tableFields[index].minimumAmt.message}
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ---------- Buttons ---------- */}
        <div className="flex justify-center gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isEdit ? "Update" : "Submit"}
          </Button>
          <Button
            type="button"
            onClick={() => navigate("/Masters/FrmRateList")}
          >
            Back
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmRateMst;
