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

const FrmUsageSubTypeMst = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const usageSubTypeId = state?.usageSubTypeId;
  const isEdit = !!usageSubTypeId;

  const [usageTypeOptions, setUsageTypeOptions] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      usageTypeId: "",
      usageSubTypeName: "",
    },
  });

  // Usage Type dropdown
  useEffect(() => {
    const fetchUsageTypes = async () => {
      try {
        setLoading(true);
        const res = await apiService.get("/master/getUsageTypeDd");
        if (res?.success && Array.isArray(res.data)) {
          setUsageTypeOptions(
            res.data.map((item) => ({
              value: String(item.NUM_USAGETYPE_ID),
              label: item.VAR_USAGETYPE_NAME,
            })),
          );
        } else {
          setUsageTypeOptions([]);
        }
      } catch (err) {
        console.error("Usage Type dropdown error:", err);
        alert(err.message);
        setUsageTypeOptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsageTypes();
  }, []);

  // Prefill simple fields
  useEffect(() => {
    if (!isEdit) return;
    setValue("usageSubTypeName", state?.usageSubTypeName || "");
  }, [isEdit, state, setValue]);

  // Prefill Usage Type (after dropdown options load)
  useEffect(() => {
    if (!isEdit || usageTypeOptions.length === 0) return;
    const id = String(state?.usageTypeId || "");
    if (usageTypeOptions.some((o) => o.value === id)) {
      setValue("usageTypeId", id);
    }
  }, [isEdit, usageTypeOptions, state, setValue]);

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
        in_Usagesubtypeid: isEdit ? Number(usageSubTypeId) : null,
        in_Usagetypeid: Number(data.usageTypeId),
        in_mode: isEdit ? 2 : 1,
        in_Usagesubtypename: data.usageSubTypeName.trim(),
        in_ipaddress: ip,
        in_source: config.source,
      };

      const res = await apiService.post(
        "/master/aowt_usagesubtype_ins",
        payload,
      );

      if (res?.success && res?.data?.Out_ErrorCode === 9999) {
        alert(res.data.Out_ErrorMsg || "Record saved successfully");
        navigate("/Masters/FrmUsageSubTypeList");
      } else {
        alert(
          res?.data?.Out_ErrorMsg ||
            res?.message ||
            "Failed to Insert or update",
        );
      }
    } catch (err) {
      console.error("Error saving usage sub type:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Usage Sub Type Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Usage Sub Type Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Usage Type */}
          <div>
            <Label text="Usage Type : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${errors.usageTypeId ? "border-red-500" : ""}`}
              {...register("usageTypeId", {
                required: "Usage Type is required",
              })}
            >
              <option value="">-- Select Usage Type --</option>
              {usageTypeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.usageTypeId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.usageTypeId.message}
              </p>
            )}
          </div>

          {/* Usage SubType Name */}
          <div>
            <Label text="Usage SubType Name : " required />
            <input
              type="text"
              placeholder="Enter usage sub type name"
              className={`form-input-box ${
                errors.usageSubTypeName ? "border-red-500" : ""
              }`}
              {...register("usageSubTypeName", {
                required: "Usage sub type name is required",
                validate: (v) =>
                  v.trim().length > 0 || "Usage sub type name cannot be empty",
              })}
            />
            {errors.usageSubTypeName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.usageSubTypeName.message}
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
            onClick={() => navigate("/Masters/FrmUsageSubTypeList")}
          >
            Back
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmUsageSubTypeMst;
