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

const FrmPlumberMst = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const plumberId = state?.plumberId;
  const isEdit = !!plumberId;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      plumberName: "",
      plumberCode: "",
      isActive: "Y",
    },
  });

  // Prefill form
  useEffect(() => {
    if (!isEdit) return;
    setValue("plumberName", state?.plumberName || "");
    setValue("plumberCode", state?.plumberCode || "");
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
        in_PlumberId: isEdit ? Number(plumberId) : null,
        in_Mode: isEdit ? 2 : 1,
        in_PlumberName: data.plumberName.trim(),
        in_PlumberCode: data.plumberCode.trim(),
        in_PlumberActiveflag: data.isActive,
        in_ipaddress: ip,
        in_source: config.source,
      };

      const res = await apiService.post("/master/aowt_plumber_ins", payload);

      if (res?.success && res?.data?.Out_ErrorCode === 9999) {
        alert(res.data.Out_ErrorMsg || "Record saved successfully");
        navigate("/Masters/FrmPlumberList");
      } else {
        alert(
          res?.data?.Out_ErrorMsg ||
            res?.message ||
            "Failed to Insert or update",
        );
      }
    } catch (err) {
      console.error("Error saving plumber:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Plumber Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Plumber Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Plumber Name */}
          <div>
            <Label text="Plumber Name : " required />
            <input
              type="text"
              placeholder="Enter plumber name"
              className={`form-input-box ${
                errors.plumberName ? "border-red-500" : ""
              }`}
              {...register("plumberName", {
                required: "Plumber name is required",
                validate: (v) =>
                  v.trim().length > 0 || "Plumber name cannot be empty",
              })}
            />
            {errors.plumberName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.plumberName.message}
              </p>
            )}
          </div>

          {/* Plumber Code */}
          <div>
            <Label text="Plumber Code : " required />
            <input
              type="text"
              placeholder="Enter plumber code"
              className={`form-input-box ${
                errors.plumberCode ? "border-red-500" : ""
              }`}
              {...register("plumberCode", {
                required: "Plumber code is required",
                validate: (v) =>
                  v.trim().length > 0 || "Plumber code cannot be empty",
              })}
            />
            {errors.plumberCode && (
              <p className="text-sm text-red-500 mt-1">
                {errors.plumberCode.message}
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
            onClick={() => navigate("/Masters/FrmPlumberList")}
          >
            Back
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmPlumberMst;
