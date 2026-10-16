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

const FrmBillingMethodMst = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const billingMethodId = state?.billingMethodId;
  const isEdit = !!billingMethodId;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      billingMethodName: "",
      billingMethodCode: "",
    },
  });

  // ---------- Load detail in edit mode (DUMMY) ----------
  useEffect(() => {
    if (!billingMethodId) return;

    // 🔸 DUMMY — replace with apiService.post("getBillingMethodDetail", { billingMethodId: Number(billingMethodId) })
    const dummyDetail = {
      NUM_BILLINGMETHOD_ID: billingMethodId,
      VAR_BILLINGMETHOD_NAME: "Cash",
      VAR_BILLINGMETHOD_CODE: "CSH",
    };

    reset({
      billingMethodName: dummyDetail.VAR_BILLINGMETHOD_NAME || "",
      billingMethodCode: dummyDetail.VAR_BILLINGMETHOD_CODE || "",
    });

    // 🔸 REAL API — uncomment when ready
    // const fetchDetail = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.post("getBillingMethodDetail", {
    //       billingMethodId: Number(billingMethodId),
    //     });
    //     if (res?.data?.success && res?.data?.data?.length > 0) {
    //       const d = res.data.data[0];
    //       reset({
    //         billingMethodName: d.VAR_BILLINGMETHOD_NAME || "",
    //         billingMethodCode: d.VAR_BILLINGMETHOD_CODE || "",
    //       });
    //     } else {
    //       alert(res?.data?.errorMessage || "Billing method detail not found");
    //     }
    //   } catch (err) {
    //     console.error("Billing method detail error:", err);
    //     alert("Failed to fetch billing method detail.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchDetail();
  }, [billingMethodId, reset]);

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
        in_BillingMethodId: isEdit ? Number(billingMethodId) : null,
        in_BillingMethodName: data.billingMethodName.trim(),
        in_BillingMethodCode: data.billingMethodCode.trim(),
        in_UlbId: Number(ulbid),
        in_ipaddress: ip,
        in_source: config.source,
      };

      // 🔸 DUMMY — replace with real endpoint when ready
      console.log("Billing Method payload →", payload);
      alert("Saved successfully (dummy)");
      navigate("/Masters/FrmBillingMethodList");

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.post("aoio_billingmethod_ins", payload);
      // if (res?.data?.success && res?.data?.errorCode === 9999) {
      //   alert(res.data.errorMessage);
      //   navigate("/Masters/FrmBillingMethodList");
      // } else {
      //   alert(
      //     res?.data?.errorMessage ||
      //       res?.data?.message ||
      //       "Failed to save billing method",
      //   );
      // }
    } catch (error) {
      console.error("Error saving billing method:", error);
      alert("API Error — check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Billing Method Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Billing Method Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        {/* 2 columns per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Billing Method Name */}
          <div>
            <Label text="Billing Method Name : " required />
            <input
              type="text"
              placeholder="Enter billing method name"
              className={`form-input-box ${
                errors.billingMethodName ? "border-red-500" : ""
              }`}
              {...register("billingMethodName", {
                required: "Billing method name is required",
                validate: (v) =>
                  v.trim().length > 0 || "Billing method name cannot be empty",
              })}
            />
            {errors.billingMethodName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.billingMethodName.message}
              </p>
            )}
          </div>

          {/* 2. Billing Method Code */}
          <div>
            <Label text="Billing Method Code : " required />
            <input
              type="text"
              placeholder="Enter billing method code"
              className={`form-input-box ${
                errors.billingMethodCode ? "border-red-500" : ""
              }`}
              {...register("billingMethodCode", {
                required: "Billing method code is required",
                validate: (v) =>
                  v.trim().length > 0 || "Billing method code cannot be empty",
              })}
            />
            {errors.billingMethodCode && (
              <p className="text-sm text-red-500 mt-1">
                {errors.billingMethodCode.message}
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
            onClick={() => navigate("/Masters/FrmBillingMethodList")}
          >
            Back
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmBillingMethodMst;
