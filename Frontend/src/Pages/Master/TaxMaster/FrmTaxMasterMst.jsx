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

  const [taxApplyOnOptions, setTaxApplyOnOptions] = useState([]);
  const [taxDetail, setTaxDetail] = useState(null);

  // Hardcoded Tax Owner
  const taxOwnerOptions = [
    { value: "G", label: "Govt" },
    { value: "V", label: "ULB" },
  ];

  const {
    register,
    handleSubmit,
    setValue,
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

  // Tax Apply On dropdown
  useEffect(() => {
    const fetchApplyOn = async () => {
      try {
        setLoading(true);
        const res = await apiService.get("/master/getApplyOnDropdown");
        if (res?.success && Array.isArray(res.data)) {
          setTaxApplyOnOptions(
            res.data.map((item) => ({
              value: String(item.NUM_TAXAPPLYON_ID),
              label: item.VAR_TAXAPPLYON_NAME,
            })),
          );
        } else {
          setTaxApplyOnOptions([]);
        }
      } catch (err) {
        console.error("Tax Apply On dropdown error:", err);
        alert(err.message);
        setTaxApplyOnOptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApplyOn();
  }, []);

  // Tax details
  useEffect(() => {
    if (!taxId) return;

    const fetchTaxDetails = async () => {
      try {
        setLoading(true);
        const res = await apiService.get(
          `/master/getTaxDetails?taxId=${taxId}`,
        );
        if (res?.success && res?.data?.length > 0) {
          setTaxDetail(res.data[0]);
        } else {
          alert("Data Not Found");
        }
      } catch (err) {
        console.error("Tax details error:", err);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTaxDetails();
  }, [taxId]);

  // Prefill simple fields
  useEffect(() => {
    if (!taxDetail) return;
    setValue("taxNameEn", taxDetail.ENAME || "");
    setValue("taxNameMr", taxDetail.MNAME || "");
    setValue("taxCode", taxDetail.CODE || "");
    setValue("taxOwner", taxDetail.OWNER || "");
  }, [taxDetail, setValue]);

  // Prefill Tax Apply On (after options load)
  useEffect(() => {
    if (!taxDetail || taxApplyOnOptions.length === 0) return;
    const id = String(taxDetail.APPLYON || "");
    if (taxApplyOnOptions.some((o) => o.value === id)) {
      setValue("taxApplyOn", id);
    }
  }, [taxDetail, taxApplyOnOptions, setValue]);

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
        in_taxid: isEdit ? Number(taxId) : null,
        in_ename: data.taxNameEn.trim(),
        in_mname: data.taxNameMr.trim(),
        in_code: data.taxCode.trim(),
        in_owner: data.taxOwner,
        in_ipaddress: ip,
        in_source: config.source,
        in_Mode: isEdit ? 2 : 1,
        in_ApplyOn: Number(data.taxApplyOn),
      };

      const res = await apiService.post("/master/aowt_tax_ins", payload);

      const isSuccess =
        res?.success &&
        (res?.data?.Out_errorCode === 9999 ||
          res?.data?.Out_errorCode === null ||
          res?.data?.Out_errorCode === undefined);

      if (isSuccess) {
        alert(res?.data?.Out_ErrorMsg || "Record saved successfully");
        navigate("/Masters/FrmTaxMasterList");
      } else {
        alert(
          res?.data?.Out_ErrorMsg ||
            res?.message ||
            "Failed to Insert or update",
        );
      }
    } catch (err) {
      console.error("Error saving tax:", err);
      alert(err.message);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* कराचे इंग्रजी नाव */}
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

          {/* कराचे मराठी नाव */}
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

          {/* कराचा कोड */}
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

          {/* Tax Owner */}
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

          {/* Tax Apply On */}
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
