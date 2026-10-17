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

const FrmGapCodeMst = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const gapCodeId = state?.gapCodeId;
  const isEdit = !!gapCodeId;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      gapCodeName: "",
      isActive: "Y",
    },
  });

  // Prefill form
  useEffect(() => {
    if (!isEdit) return;
    setValue("gapCodeName", state?.gapCodeName || "");
    setValue("isActive", state?.flag === "Yes" ? "Y" : "N");
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
        in_GapcodeId: isEdit ? Number(gapCodeId) : null,
        in_Mode: isEdit ? 2 : 1,
        in_GapcodeName: data.gapCodeName.trim(),
        in_GapcodeActiveflag: data.isActive,
        in_ipaddress: ip,
        in_source: config.source,
      };

      const res = await apiService.post("/master/aowt_gapcode_ins", payload);

      if (res?.success && res?.data?.Out_ErrorCode === 9999) {
        alert(res.data.Out_ErrorMsg || "Record saved successfully");
        navigate("/Masters/FrmGapCodeList");
      } else {
        alert(
          res?.data?.Out_ErrorMsg ||
            res?.message ||
            "Failed to Insert or update",
        );
      }
    } catch (err) {
      console.error("Error saving gap code:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Gap Code Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Gap Code Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Gap Code Name */}
          <div>
            <Label text="Gap Code Name : " required />
            <input
              type="text"
              placeholder="Enter gap code name"
              className={`form-input-box ${
                errors.gapCodeName ? "border-red-500" : ""
              }`}
              {...register("gapCodeName", {
                required: "Gap code name is required",
                validate: (v) =>
                  v.trim().length > 0 || "Gap code name cannot be empty",
              })}
            />
            {errors.gapCodeName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.gapCodeName.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <Label text="Status : " required />
            <div className="flex flex-wrap items-center gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                <input
                  type="radio"
                  value="Y"
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                  {...register("isActive", {
                    required: "Status is required",
                  })}
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                <input
                  type="radio"
                  value="N"
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                  {...register("isActive", {
                    required: "Status is required",
                  })}
                />
                <span>No</span>
              </label>
            </div>
            {errors.isActive && (
              <p className="text-sm text-red-500 mt-1">
                {errors.isActive.message}
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
            onClick={() => navigate("/Masters/FrmGapCodeList")}
          >
            Back
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmGapCodeMst;
