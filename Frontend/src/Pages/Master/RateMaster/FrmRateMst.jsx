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

const todayISO = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const toDateInput = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const addOneYearMinusOneDay = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  d.setFullYear(d.getFullYear() + 1);
  d.setDate(d.getDate() - 1);
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

  const [usageTypeOptions, setUsageTypeOptions] = useState([]);
  const [usageSubTypeOptions, setUsageSubTypeOptions] = useState([]);
  const [connectionTypeOptions, setConnectionTypeOptions] = useState([]);
  const [connectionSizeOptions, setConnectionSizeOptions] = useState([]);
  const [taxOptions, setTaxOptions] = useState([]);
  const [rateDetail, setRateDetail] = useState(null);

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
      valueType: "F",
      tableFields: [{ from: "", to: "", rate: "", minimumAmt: "" }],
    },
  });

  const { fields } = useFieldArray({ control, name: "tableFields" });

  const watchUsageType = watch("usageType");
  const watchTableFields = watch("tableFields");

  // Load all dropdowns
  useEffect(() => {
    if (!ulbid) return;

    const fetchAllDropdowns = async () => {
      try {
        setLoading(true);
        const results = await Promise.allSettled([
          apiService.get(`/master/getUsageTypeDropdown?ulbId=${ulbid}`),
          apiService.get(`/master/getConnectionTypeDropdown?ulbId=${ulbid}`),
          apiService.get(`/master/getConnectionSize?ulbId=${ulbid}`),
          apiService.get(`/master/getTaxDropdown?ulbId=${ulbid}`),
        ]);

        const [utRes, ctRes, csRes, taxRes] = results;

        if (utRes.status === "fulfilled" && utRes.value?.success) {
          setUsageTypeOptions(
            utRes.value.data.map((item) => ({
              value: String(item.USAGETYPEID),
              label: item.USAGETYPENAME,
            })),
          );
        }

        if (ctRes.status === "fulfilled" && ctRes.value?.success) {
          setConnectionTypeOptions(
            ctRes.value.data.map((item) => ({
              value: String(item.CONNTYPEID),
              label: item.CONNTYPE,
            })),
          );
        }

        if (csRes.status === "fulfilled" && csRes.value?.success) {
          setConnectionSizeOptions(
            csRes.value.data.map((item) => ({
              value: String(item.CONNSIZEID),
              label: item.CONNSIZENAME,
            })),
          );
        }

        if (taxRes.status === "fulfilled" && taxRes.value?.success) {
          setTaxOptions(
            taxRes.value.data.map((item) => ({
              value: String(item.NUM_TAX_ID),
              label: item.VAR_TAX_ENAME,
            })),
          );
        }
      } catch (err) {
        console.error("Dropdown load error:", err);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllDropdowns();
  }, [ulbid]);

  // Usage Sub Type dropdown
  useEffect(() => {
    setUsageSubTypeOptions([]);
    setValue("usageSubType", "");

    if (!watchUsageType || !ulbid) return;

    const fetchUsageSubTypes = async () => {
      try {
        setLoading(true);
        const res = await apiService.get(
          `/master/getUsageSubTypeDropdown?ulbId=${ulbid}&usageTypeId=${watchUsageType}`,
        );
        if (res?.success && Array.isArray(res.data)) {
          setUsageSubTypeOptions(
            res.data.map((item) => ({
              value: String(item.USAGESUBTYPEID),
              label: item.USAGESUBTYPENAME,
            })),
          );
        } else {
          setUsageSubTypeOptions([]);
        }
      } catch (err) {
        console.error("Usage sub type dropdown error:", err);
        alert(err.message);
        setUsageSubTypeOptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsageSubTypes();
  }, [watchUsageType, ulbid, setValue]);

  // Rate details
  useEffect(() => {
    if (!rateId) return;

    const fetchRateDetails = async () => {
      try {
        setLoading(true);
        const res = await apiService.get(
          `/master/getRateDetails?rateId=${rateId}`,
        );
        if (res?.success && res?.data?.length > 0) {
          setRateDetail(res.data[0]);
        } else {
          alert("Data Not Found");
        }
      } catch (err) {
        console.error("Rate details error:", err);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRateDetails();
  }, [rateId]);

  // Prefill fields
  useEffect(() => {
    if (!rateDetail) return;
    setValue("effectiveFrom", toDateInput(rateDetail.DAT_RATE_FRMDT));
    setValue("valueType", rateDetail.VAR_RATE_VALUETYPE || "F");
    setValue("tableFields", [
      {
        from: String(rateDetail.NUM_RATE_FRMVALUE ?? ""),
        to: String(rateDetail.NUM_RATE_TOVALUE ?? ""),
        rate: String(rateDetail.NUM_RATE_RATEAMT ?? ""),
        minimumAmt: String(rateDetail.NUM_RATE_MINAMT ?? ""),
      },
    ]);
  }, [rateDetail, setValue]);

  // Prefill Usage Type
  useEffect(() => {
    if (!rateDetail || usageTypeOptions.length === 0) return;
    const id = String(rateDetail.NUM_RATE_USAGEID || "");
    if (usageTypeOptions.some((o) => o.value === id)) {
      setValue("usageType", id);
    }
  }, [rateDetail, usageTypeOptions, setValue]);

  // Prefill Usage Sub Type
  useEffect(() => {
    if (!rateDetail || usageSubTypeOptions.length === 0) return;
    const id = String(rateDetail.NUM_RATE_USAGESUBID || "");
    if (usageSubTypeOptions.some((o) => o.value === id)) {
      setValue("usageSubType", id);
    }
  }, [rateDetail, usageSubTypeOptions, setValue]);

  // Prefill Connection Type
  useEffect(() => {
    if (!rateDetail || connectionTypeOptions.length === 0) return;
    const id = String(rateDetail.NUM_RATE_CONNTYPEID || "");
    if (connectionTypeOptions.some((o) => o.value === id)) {
      setValue("connectionType", id);
    }
  }, [rateDetail, connectionTypeOptions, setValue]);

  // Prefill Connection Size
  useEffect(() => {
    if (!rateDetail || connectionSizeOptions.length === 0) return;
    const id = String(rateDetail.NUM_RATE_CONNSIZEID || "");
    if (connectionSizeOptions.some((o) => o.value === id)) {
      setValue("connectionSize", id);
    }
  }, [rateDetail, connectionSizeOptions, setValue]);

  // Prefill Tax
  useEffect(() => {
    if (!rateDetail || taxOptions.length === 0) return;
    const id = String(rateDetail.NUM_RATE_TAXID || "");
    if (taxOptions.some((o) => o.value === id)) {
      setValue("tax", id);
    }
  }, [rateDetail, taxOptions, setValue]);

  // Submit
  const onSubmit = async (data) => {
    if (!userId || !ulbid) {
      alert("User Id or Ulb Id is not set");
      return;
    }

    try {
      setLoading(true);
      const ip = await GetIPAddress();

      const row = data.tableFields?.[0] || {};

      const rateStr = `${row.from}#${row.to}#${row.rate}#${row.minimumAmt}`;

      const payload = {
        in_UserId: userId,
        in_UsageTypeId: Number(data.usageType),
        in_UsageSubTypeId: Number(data.usageSubType),
        in_conntypeid: Number(data.connectionType),
        in_connsizeid: Number(data.connectionSize),
        in_valuetype: data.valueType,
        in_frmdt: data.effectiveFrom,
        in_todt: addOneYearMinusOneDay(data.effectiveFrom),
        in_ulbid: Number(ulbid),
        in_Rate_Str: rateStr,
        in_Mode: isEdit ? 2 : 1,
        in_TaxId: Number(data.tax),
        in_ipaddr: ip,
        in_source: config.source,
      };

      const res = await apiService.post("/master/aowt_rate_ins", payload);

      if (res?.success && res?.data?.Out_errorCode === 9999) {
        alert(res.data.Out_ErrorMsg || "Rate saved successfully");
        navigate("/Masters/FrmRateList");
      } else {
        alert(
          res?.data?.Out_ErrorMsg ||
            res?.message ||
            "Failed to Insert or update",
        );
      }
    } catch (err) {
      console.error("Error saving rate:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Usage Type */}
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

          {/* Usage Sub Type */}
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

          {/* Connection Type */}
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

          {/* Connection Size */}
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

          {/* Effective From */}
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

          {/* Tax */}
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

          {/* Value Type */}
          <div>
            <Label text="Value Type : " required />
            <div className="flex flex-wrap items-center gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                <input
                  type="radio"
                  value="F"
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                  {...register("valueType", {
                    required: "Value Type is required",
                  })}
                />
                <span>Fixed</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                <input
                  type="radio"
                  value="S"
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                  {...register("valueType", {
                    required: "Value Type is required",
                  })}
                />
                <span>Slab</span>
              </label>
            </div>
            {errors.valueType && (
              <p className="text-sm text-red-500 mt-1">
                {errors.valueType.message}
              </p>
            )}
          </div>
        </div>

        {/* Slab Table */}
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
