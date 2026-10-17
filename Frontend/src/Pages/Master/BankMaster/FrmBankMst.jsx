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

const FrmBankMst = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const bankId = state?.bankId;
  const isEdit = !!bankId;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      bankName: "",
    },
  });

  // Prefill form
  useEffect(() => {
    if (!isEdit) return;
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
      const ip = await GetIPAddress();

      const payload = {
        in_UserId: userId,
        in_bankid: isEdit ? Number(bankId) : null,
        in_bankname: data.bankName.trim(),
        in_Orgid: Number(ulbid),
        in_ipaddress: ip,
        in_source: config.source,
        in_Mode: isEdit ? 2 : 1,
      };

      const res = await apiService.post("/master/aowt_bank_ins", payload);

      if (res?.success && res?.data?.Out_errorCode === 9999) {
        alert(res.data.Out_ErrorMsg || "Bank saved successfully");
        navigate("/Masters/FrmBankList");
      } else {
        alert(
          res?.data?.Out_ErrorMsg ||
            res?.message ||
            "Failed to Insert or update",
        );
      }
    } catch (err) {
      console.error("Error saving bank:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Bank Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Bank Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            onClick={() => navigate("/Masters/FrmBankList")}
          >
            Back
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmBankMst;
