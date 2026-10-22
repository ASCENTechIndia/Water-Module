import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Layout from "../../../Components/Layout";
import Label from "../../../Components/Label";
import Button from "../../../Components/Button";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";
import apiService from "../../../../apiService.js";

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
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      micrCode: "",
      bankName: "",
    },
  });

  // Prefill form
  useEffect(() => {
    if (!isEdit) return;
    setValue("micrCode", String(state?.micrCode || ""));
    setValue("bankName", state?.bankName || "");
  }, [isEdit, state, setValue]);

  // Submit
  const onSubmit = async (data) => {
    if (!userId || !ulbid) {
      alert("User Id or Ulb Id is not set");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        in_userid: userId,
        in_MICRCodeid: isEdit ? Number(micrId) : null,
        in_MICRCode: Number(data.micrCode),
        in_BankName: data.bankName.trim(),
        in_Mode: isEdit ? 2 : 1,
        in_ulbid: Number(ulbid),
      };

      const res = await apiService.post("/master/aowt_micrcode_ins", payload);

      if (res?.success && res?.data?.out_ErrCode === 9999) {
        alert(res.data.out_ErrMsg || "Record saved successfully");
        navigate("/Masters/FrmMicrCodeList");
      } else {
        alert(
          res?.data?.out_ErrMsg || res?.message || "Failed to Insert or update",
        );
      }
    } catch (err) {
      console.error("Error saving MICR code:", err);
      alert(err.message);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* MICR Code */}
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

          {/* Bank Name */}
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
