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

  const taxId = state?.taxId;
  const isEdit = !!taxId;

  const [ulbOptions, setUlbOptions] = useState([]);
  const [taxOptions, setTaxOptions] = useState([]);
  const [usageTypeOptions, setUsageTypeOptions] = useState([]);
  const [accTaxDetail, setAccTaxDetail] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      ulbId: "",
      taxName: "",
      usageType: "",
      arreasMinorCode: "",
      arreasMajorCode: "",
      cMinorCode: "",
      cMajorCode: "",
    },
  });

  const watchUlbId = watch("ulbId");

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

  // Load Tax and Usage Type dropdowns when ULB changes
  useEffect(() => {
    setTaxOptions([]);
    setUsageTypeOptions([]);

    if (!watchUlbId) return;

    const fetchDependents = async () => {
      try {
        setLoading(true);
        const results = await Promise.allSettled([
          apiService.get(`/master/getTaxNameDropdown?ulbId=${watchUlbId}`),
          apiService.get(
            `/master/getUsageTypeNameDropdown?ulbId=${watchUlbId}`,
          ),
        ]);

        const [taxRes, usageRes] = results;

        if (taxRes.status === "fulfilled" && taxRes.value?.success) {
          setTaxOptions(
            taxRes.value.data.map((item) => ({
              value: String(item.NUM_TAX_ID),
              label: item.VAR_TAX_MNAME,
            })),
          );
        } else {
          setTaxOptions([]);
        }

        if (usageRes.status === "fulfilled" && usageRes.value?.success) {
          setUsageTypeOptions(
            usageRes.value.data.map((item) => ({
              value: String(item.VAR_USAGETYPE_CODE),
              label: item.VAR_USAGETYPE_CODE,
            })),
          );
        } else {
          setUsageTypeOptions([]);
        }
      } catch (err) {
        console.error("Dependent dropdown error:", err);
        alert(err.message);
        setTaxOptions([]);
        setUsageTypeOptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDependents();
  }, [watchUlbId]);

  // Acc Tax Config details for update mode
  useEffect(() => {
    if (!taxId) return;

    const fetchAccTaxDetails = async () => {
      try {
        setLoading(true);
        const res = await apiService.get(
          `/master/getAccTaxConfigDetails?taxId=${taxId}`,
        );
        if (res?.success && res?.data?.length > 0) {
          setAccTaxDetail(res.data[0]);
        } else {
          alert("Data Not Found");
        }
      } catch (err) {
        console.error("Acc tax config details error:", err);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAccTaxDetails();
  }, [taxId]);

  // Prefill simple fields
  useEffect(() => {
    if (!accTaxDetail) return;
    setValue("arreasMinorCode", accTaxDetail.VAR_ACCTAX_MINORCODE || "");
    setValue("arreasMajorCode", accTaxDetail.VAR_ACCTAX_MAJORCODE || "");
    setValue("cMinorCode", accTaxDetail.VAR_ACCTAX_CMINORCODE || "");
    setValue("cMajorCode", accTaxDetail.VAR_ACCTAX_CMAJORCODE || "");
  }, [accTaxDetail, setValue]);

  // Prefill ULB after ulb dropdown options load
  useEffect(() => {
    if (!accTaxDetail || ulbOptions.length === 0) return;
    const id = String(accTaxDetail.NUM_ACCTAX_ULBID || "");
    if (ulbOptions.some((o) => o.value === id)) {
      setValue("ulbId", id);
    }
  }, [accTaxDetail, ulbOptions, setValue]);

  // Prefill Tax Name after taxOptions load
  useEffect(() => {
    if (!accTaxDetail || taxOptions.length === 0) return;
    const id = String(accTaxDetail.NUM_ACCTAX_TAXID || "");
    if (taxOptions.some((o) => o.value === id)) {
      setValue("taxName", id);
    }
  }, [accTaxDetail, taxOptions, setValue]);

  // Prefill Usage Type after usageTypeOptions load
  useEffect(() => {
    if (!accTaxDetail || usageTypeOptions.length === 0) return;
    const id = String(accTaxDetail.VAR_ACCTAX_USAGETYPE || "");
    if (usageTypeOptions.some((o) => o.value === id)) {
      setValue("usageType", id);
    }
  }, [accTaxDetail, usageTypeOptions, setValue]);

  // Submit
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
        in_AccTaxid: isEdit ? Number(taxId) : null,
        in_AccTaxtaxid: data.taxName,
        in_AccTaxusagetype: data.usageType,
        in_AccTaxminorcode: data.arreasMinorCode.trim(),
        in_AccTaxmajorcode: data.arreasMajorCode.trim(),
        in_AccTaxcminorcode: data.cMinorCode.trim(),
        in_AccTaxcmajorcode: data.cMajorCode.trim(),
        in_Mode: isEdit ? 2 : 1,
        in_UlbId: Number(data.ulbId),
        in_ipaddress: ip,
        in_source: config.source,
      };

      const res = await apiService.post("/master/aowt_acctax_ins", payload);

      if (res?.success && res?.data?.Out_errorCode === 9999) {
        alert(res.data.Out_ErrorMsg || "Record saved successfully");
        navigate("/Masters/FrmAccTaxConfigList");
      } else {
        alert(
          res?.data?.Out_ErrorMsg ||
            res?.message ||
            "Failed to Insert or update",
        );
      }
    } catch (err) {
      console.error("Error saving acc tax config:", err);
      alert(err.message);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ulb Name */}
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

          {/* Tax Name */}
          <div>
            <Label text="Tax Name : " required />
            <select
              disabled={!watchUlbId}
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${!watchUlbId ? "bg-slate-100 cursor-not-allowed" : ""}
                ${errors.taxName ? "border-red-500" : ""}`}
              {...register("taxName", { required: "Tax name is required" })}
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
            {errors.taxName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.taxName.message}
              </p>
            )}
          </div>

          {/* Usage Type Name */}
          <div>
            <Label text="Usage Type Name : " required />
            <select
              disabled={!watchUlbId}
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${!watchUlbId ? "bg-slate-100 cursor-not-allowed" : ""}
                ${errors.usageType ? "border-red-500" : ""}`}
              {...register("usageType", {
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
            {errors.usageType && (
              <p className="text-sm text-red-500 mt-1">
                {errors.usageType.message}
              </p>
            )}
          </div>

          {/* Arreas MinorCode */}
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

          {/* Arreas MajorCode */}
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

          {/* Current MinorCode */}
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

          {/* Current MajorCode */}
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
