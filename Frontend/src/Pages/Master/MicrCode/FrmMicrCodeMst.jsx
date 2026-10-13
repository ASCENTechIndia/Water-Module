import React, { useEffect } from "react";
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

const FrmMicrCodeMst = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const micrId = state?.micrId;
  const isEdit = !!micrId;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      micrCode: "",
      bankName: "",
    },
  });

  // ---------- Load detail in edit mode (DUMMY) ----------
  useEffect(() => {
    if (!micrId) return;

    // 🔸 DUMMY — replace with apiService.post("getMicrCodeDetail", { micrId: Number(micrId) })
    const dummyDetail = {
      NUM_MICR_ID: micrId,
      VAR_MICR_CODE: "411002001",
      VAR_BANK_NAME: "State Bank of India",
    };

    reset({
      micrCode: String(dummyDetail.VAR_MICR_CODE || ""),
      bankName: dummyDetail.VAR_BANK_NAME || "",
    });

    // 🔸 REAL API — uncomment when ready
    // const fetchDetail = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.post("getMicrCodeDetail", {
    //       micrId: Number(micrId),
    //     });
    //     if (res?.data?.success && res?.data?.data?.length > 0) {
    //       const d = res.data.data[0];
    //       reset({
    //         micrCode: String(d.VAR_MICR_CODE || ""),
    //         bankName: d.VAR_BANK_NAME || "",
    //       });
    //     } else {
    //       alert(res?.data?.errorMessage || "MICR code detail not found");
    //     }
    //   } catch (err) {
    //     console.error("MICR code detail error:", err);
    //     alert("Failed to fetch MICR code detail.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchDetail();
  }, [micrId, reset]);

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
        in_MicrId: isEdit ? Number(micrId) : null,
        in_MicrCode: data.micrCode.trim(),
        in_BankName: data.bankName.trim(),
        in_UlbId: Number(ulbid),
        in_ipaddress: ip,
        in_source: config.source,
      };

      // 🔸 DUMMY — replace with real endpoint when ready
      console.log("MICR Code payload →", payload);
      alert("Saved successfully (dummy)");
      navigate("/Masters/FrmMicrCodeList");

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.post("aoio_micrcode_ins", payload);
      // if (res?.data?.success && res?.data?.errorCode === 9999) {
      //   alert(res.data.errorMessage);
      //   navigate("/Masters/FrmMicrCodeList");
      // } else {
      //   alert(
      //     res?.data?.errorMessage ||
      //       res?.data?.message ||
      //       "Failed to save MICR code",
      //   );
      // }
    } catch (error) {
      console.error("Error saving MICR code:", error);
      alert("API Error — check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Only digits allowed
  const allowOnlyDigits = (e) => {
    e.target.value = e.target.value.replace(/\D/g, "");
  };

  return (
    <Layout
      title="MICR Code Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "MICR Code Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        {/* 2 columns per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. MICR Code — digits only */}
          <div>
            <Label text="MICR Code : " required />
            <input
              type="text"
              inputMode="numeric"
              placeholder="Enter MICR code"
              className={`form-input-box ${
                errors.micrCode ? "border-red-500" : ""
              }`}
              onInput={allowOnlyDigits}
              {...register("micrCode", {
                required: "MICR code is required",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Only numbers are allowed",
                },
              })}
            />
            {errors.micrCode && (
              <p className="text-sm text-red-500 mt-1">
                {errors.micrCode.message}
              </p>
            )}
          </div>

          {/* 2. Bank Name */}
          <div>
            <Label text="Bank Name : " required />
            <input
              type="text"
              placeholder="Enter bank name"
              className={`form-input-box ${
                errors.bankName ? "border-red-500" : ""
              }`}
              {...register("bankName", {
                required: "Bank name is required",
                validate: (v) =>
                  v.trim().length > 0 || "Bank name cannot be empty",
              })}
            />
            {errors.bankName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.bankName.message}
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
            onClick={() => navigate("/Masters/FrmMicrCodeList")}
          >
            Back
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmMicrCodeMst;