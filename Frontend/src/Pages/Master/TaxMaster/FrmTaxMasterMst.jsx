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

const FrmTaxMasterMst = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const taxId = state?.taxId;
  const isEdit = !!taxId;

  const [taxOwnerOptions, setTaxOwnerOptions] = useState([]);
  const [taxApplyOnOptions, setTaxApplyOnOptions] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      taxNameEn: "",
      taxNameMr: "",
      taxCode: "",
      taxOwner: "",
      taxApplyOn: "",
    },
  });

  // ---------- Load dropdowns (DUMMY) ----------
  useEffect(() => {
    // 🔸 DUMMY — replace with real APIs later
    setTaxOwnerOptions([
      { value: "Govt", label: "Govt" },
      { value: "ULB", label: "ULB" },
    ]);

    setTaxApplyOnOptions([
      { value: "1", label: "Bill" },
      { value: "2", label: "Receipt" },
      { value: "3", label: "Both" },
    ]);

    // 🔸 REAL API — uncomment when ready
    // const fetchTaxApplyOn = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.get("getTaxApplyOnDropdown");
    //     if (res?.data?.success && Array.isArray(res.data.data)) {
    //       setTaxApplyOnOptions(
    //         res.data.data.map((item) => ({
    //           value: String(item.ID),
    //           label: item.NAME,
    //         })),
    //       );
    //     } else {
    //       setTaxApplyOnOptions([]);
    //     }
    //   } catch (err) {
    //     console.error("Tax Apply On dropdown error:", err);
    //     setTaxApplyOnOptions([]);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchTaxApplyOn();
  }, []);

  // ---------- Load detail in edit mode (DUMMY) ----------
  useEffect(() => {
    if (!taxId) return;

    // 🔸 DUMMY — replace with apiService.post("getTaxDetail", { taxId: Number(taxId) })
    const dummyDetail = {
      NUM_TAX_ID: taxId,
      VAR_TAX_NAME_EN: "Water Tax",
      VAR_TAX_NAME_MR: "पाणीपट्टी",
      VAR_TAX_CODE: "WT01",
      VAR_TAX_OWNER: "ULB",
      NUM_TAX_APPLY_ON: "1",
    };

    reset({
      taxNameEn: dummyDetail.VAR_TAX_NAME_EN || "",
      taxNameMr: dummyDetail.VAR_TAX_NAME_MR || "",
      taxCode: dummyDetail.VAR_TAX_CODE || "",
      taxOwner: dummyDetail.VAR_TAX_OWNER || "",
      taxApplyOn: String(dummyDetail.NUM_TAX_APPLY_ON || ""),
    });

    // 🔸 REAL API — uncomment when ready
    // const fetchDetail = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.post("getTaxDetail", {
    //       taxId: Number(taxId),
    //     });
    //     if (res?.data?.success && res?.data?.data?.length > 0) {
    //       const d = res.data.data[0];
    //       reset({
    //         taxNameEn: d.VAR_TAX_NAME_EN || "",
    //         taxNameMr: d.VAR_TAX_NAME_MR || "",
    //         taxCode: d.VAR_TAX_CODE || "",
    //         taxOwner: d.VAR_TAX_OWNER || "",
    //         taxApplyOn: String(d.NUM_TAX_APPLY_ON || ""),
    //       });
    //     } else {
    //       alert(res?.data?.errorMessage || "Tax detail not found");
    //     }
    //   } catch (err) {
    //     console.error("Tax detail error:", err);
    //     alert("Failed to fetch tax detail.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchDetail();
  }, [taxId, reset]);

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
        in_TaxId: isEdit ? Number(taxId) : null,
        in_TaxNameEn: data.taxNameEn.trim(),
        in_TaxNameMr: data.taxNameMr.trim(),
        in_TaxCode: data.taxCode.trim(),
        in_TaxOwner: data.taxOwner,
        in_TaxApplyOn: Number(data.taxApplyOn),
        in_UlbId: Number(ulbid),
        in_ipaddress: ip,
        in_source: config.source,
      };

      // 🔸 DUMMY — replace with real endpoint when ready
      console.log("Tax payload →", payload);
      alert("Saved successfully (dummy)");
      navigate("/Masters/FrmTaxMasterList");

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.post("aoio_tax_ins", payload);
      // if (res?.data?.success && res?.data?.errorCode === 9999) {
      //   alert(res.data.errorMessage);
      //   navigate("/Masters/FrmTaxMasterList");
      // } else {
      //   alert(
      //     res?.data?.errorMessage ||
      //       res?.data?.message ||
      //       "Failed to save tax",
      //   );
      // }
    } catch (error) {
      console.error("Error saving tax:", error);
      alert("API Error — check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Tax Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Tax Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        {/* 2 columns per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. कराचे इंग्रजी नाव */}
          <div>
            <Label text="कराचे इंग्रजी नाव : " required />
            <input
              type="text"
              placeholder="Enter tax name (English)"
              className={`form-input-box ${
                errors.taxNameEn ? "border-red-500" : ""
              }`}
              {...register("taxNameEn", {
                required: "Tax name (English) is required",
                validate: (v) =>
                  v.trim().length > 0 || "Tax name cannot be empty",
              })}
            />
            {errors.taxNameEn && (
              <p className="text-sm text-red-500 mt-1">
                {errors.taxNameEn.message}
              </p>
            )}
          </div>

          {/* 2. कराचे मराठी नाव */}
          <div>
            <Label text="कराचे मराठी नाव : " required />
            <input
              type="text"
              placeholder="कराचे मराठी नाव प्रविष्ट करा"
              className={`form-input-box ${
                errors.taxNameMr ? "border-red-500" : ""
              }`}
              {...register("taxNameMr", {
                required: "Tax name (Marathi) is required",
                validate: (v) =>
                  v.trim().length > 0 || "Tax name cannot be empty",
              })}
            />
            {errors.taxNameMr && (
              <p className="text-sm text-red-500 mt-1">
                {errors.taxNameMr.message}
              </p>
            )}
          </div>

          {/* 3. कराचा कोड */}
          <div>
            <Label text="कराचा कोड : " required />
            <input
              type="text"
              placeholder="Enter tax code"
              className={`form-input-box ${
                errors.taxCode ? "border-red-500" : ""
              }`}
              {...register("taxCode", {
                required: "Tax code is required",
                validate: (v) =>
                  v.trim().length > 0 || "Tax code cannot be empty",
              })}
            />
            {errors.taxCode && (
              <p className="text-sm text-red-500 mt-1">
                {errors.taxCode.message}
              </p>
            )}
          </div>

          {/* 4. Tax Owner */}
          <div>
            <Label text="Tax Owner : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${errors.taxOwner ? "border-red-500" : ""}`}
              {...register("taxOwner", {
                required: "Tax Owner is required",
              })}
            >
              <option value="">-- Select Tax Owner --</option>
              {taxOwnerOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.taxOwner && (
              <p className="text-sm text-red-500 mt-1">
                {errors.taxOwner.message}
              </p>
            )}
          </div>

          {/* 5. Tax Apply On */}
          <div>
            <Label text="Tax Apply On : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${errors.taxApplyOn ? "border-red-500" : ""}`}
              {...register("taxApplyOn", {
                required: "Tax Apply On is required",
              })}
            >
              <option value="">-- Select Tax Apply On --</option>
              {taxApplyOnOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.taxApplyOn && (
              <p className="text-sm text-red-500 mt-1">
                {errors.taxApplyOn.message}
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
            onClick={() => navigate("/Masters/FrmTaxMasterList")}
          >
            Back
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmTaxMasterMst;
