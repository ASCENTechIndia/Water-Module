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
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      billingMethodName: "",
      billingMethodCode: "",
    },
  });

  // Prefill form
  useEffect(() => {
    if (!isEdit) return;
    setValue("billingMethodName", state?.billingMethodName || "");
    setValue("billingMethodCode", state?.billingMethodCode || "");
  }, [isEdit, state, setValue]);

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
        in_BillingMethodId: isEdit ? Number(billingMethodId) : null,
        in_Mode: isEdit ? 2 : 1,
        in_BillingMethodName: data.billingMethodName.trim(),
        in_BillingMethodCode: data.billingMethodCode.trim(),
        in_ipaddress: ip,
        in_source: config.source,
      };

      const res = await apiService.post(
        "/master/aowt_billingmethod_ins",
        payload,
      );

      if (res?.success && res?.data?.Out_ErrorCode === 9999) {
        alert(res.data.Out_ErrorMsg || "Record saved successfully");
        navigate("/Masters/FrmBillingMethodList");
      } else {
        alert(
          res?.data?.Out_ErrorMsg ||
            res?.message ||
            "Failed to Insert or update",
        );
      }
    } catch (err) {
      console.error("Error saving billing method:", err);
      alert(err.message);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Billing Method Name */}
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

          {/* Billing Method Code */}
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
