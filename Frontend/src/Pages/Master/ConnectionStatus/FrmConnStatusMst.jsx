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

const FrmConnStatusMst = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const connStatusId = state?.connStatusId;
  const isEdit = !!connStatusId;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      connStatusName: "",
      isActive: "Y",
    },
  });

  // Prefill form
  useEffect(() => {
    if (!isEdit) return;
    setValue("connStatusName", state?.connStatusName || "");
    setValue("isActive", state?.flag === "Active" ? "Y" : "N");
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
        in_Userid: userId,
        in_Connstatusid: isEdit ? Number(connStatusId) : null,
        in_Mode: isEdit ? 2 : 1,
        in_Connstatusname: data.connStatusName.trim(),
        in_connstatusactiveflag: data.isActive,
        in_ipaddress: ip,
        in_source: config.source,
      };

      const res = await apiService.post("/master/aowt_connstatus_ins", payload);

      if (res?.success && res?.data?.Out_ErrorCode === 9999) {
        alert(res.data.Out_ErrorMsg || "Record saved successfully");
        navigate("/Masters/FrmConnStatusList");
      } else {
        alert(
          res?.data?.Out_ErrorMsg ||
            res?.message ||
            "Failed to Insert or update",
        );
      }
    } catch (err) {
      console.error("Error saving conn status:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Conn Status Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Conn Status Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Conn Status Name */}
          <div>
            <Label text="Conn Status Name : " required />
            <input
              type="text"
              placeholder="Enter conn status name"
              className={`form-input-box ${
                errors.connStatusName ? "border-red-500" : ""
              }`}
              {...register("connStatusName", {
                required: "Conn status name is required",
                validate: (v) =>
                  v.trim().length > 0 || "Conn status name cannot be empty",
              })}
            />
            {errors.connStatusName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.connStatusName.message}
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
            onClick={() => navigate("/Masters/FrmConnStatusList")}
          >
            Back
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmConnStatusMst;
