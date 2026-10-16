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

const FrmUsageTypeMst = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const usageTypeId = state?.usageTypeId;
  const isEdit = !!usageTypeId;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      usageTypeName: "",
    },
  });

  // Prefill form
  useEffect(() => {
    if (!isEdit) return;
    setValue("usageTypeName", state?.usageTypeName || "");
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
        in_Usagetypeid: isEdit ? Number(usageTypeId) : null,
        in_Mode: isEdit ? 2 : 1,
        in_Usagetypename: data.usageTypeName.trim(),
        in_ipaddress: ip,
        in_source: config.source,
      };

      const res = await apiService.post("/master/aowt_usagetype_ins", payload);

      if (res?.success && res?.data?.Out_ErrorCode === 9999) {
        alert(res.data.Out_ErrorMsg || "Record saved successfully");
        navigate("/Masters/FrmUsageTypeList");
      } else {
        alert(
          res?.data?.Out_ErrorMsg ||
            res?.message ||
            "Failed to Insert or update",
        );
      }
    } catch (err) {
      console.error("Error saving usage type:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Usage Type Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Usage Type Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Usage Type Name */}
          <div>
            <Label text="Usage Type Name : " required />
            <input
              type="text"
              placeholder="Enter usage type name"
              className={`form-input-box ${
                errors.usageTypeName ? "border-red-500" : ""
              }`}
              {...register("usageTypeName", {
                required: "Usage type name is required",
                validate: (v) =>
                  v.trim().length > 0 || "Usage type name cannot be empty",
              })}
            />
            {errors.usageTypeName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.usageTypeName.message}
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
            onClick={() => navigate("/Masters/FrmUsageTypeList")}
          >
            Back
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmUsageTypeMst;
