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

const FrmuserallMst = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const userAllId = state?.userAllId;
  const isEdit = !!userAllId;

  const [ulbOptions, setUlbOptions] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      ulbId: "",
      userId: "",
      isActive: "Y",
    },
  });

  // ULB dropdown
  useEffect(() => {
    const fetchUlbDropdown = async () => {
      try {
        setLoading(true);
        const res = await apiService.get("/master/getUlbDropdownController");
        if (res?.success && Array.isArray(res.data)) {
          setUlbOptions(
            res.data.map((item) => ({
              value: String(item.CORPORATIONID),
              label: item.CORPORATIONNAME,
            })),
          );
        } else {
          setUlbOptions([]);
        }
      } catch (err) {
        console.error("ULB dropdown error:", err);
        alert(err.message);
        setUlbOptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUlbDropdown();
  }, []);

  // Auto-select ULB
  useEffect(() => {
    if (ulbid && ulbOptions.length > 0) {
      const match = ulbOptions.find((o) => o.value === String(ulbid));
      if (match) {
        setValue("ulbId", match.value);
      }
    }
  }, [ulbid, ulbOptions, setValue]);

  // Prefill form
  useEffect(() => {
    if (!isEdit) return;
    setValue("userId", state?.userId || "");
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
        in_id: isEdit ? Number(userAllId) : null,
        in_UserId: data.userId.trim(),
        in_activeflag: data.isActive,
        in_Orgid: Number(ulbid),
        in_ipaddress: ip,
        in_source: config.source,
        in_Mode: isEdit ? 2 : 1,
      };

      const res = await apiService.post(
        "/master/aowt_userallconfig_ins",
        payload,
      );

      if (res?.success && res?.data?.Out_errorCode === 9999) {
        alert(res.data.Out_ErrorMsg || "Record saved successfully");
        navigate("/Masters/FrmuserallList");
      } else {
        alert(
          res?.data?.Out_ErrorMsg ||
            res?.message ||
            "Failed to Insert or update",
        );
      }
    } catch (err) {
      console.error("Error saving user all config:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="User All Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "User All Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ULB */}
          <div>
            <Label text="ULB : " required />
            <select
              disabled
              className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                bg-slate-100 cursor-not-allowed"
              {...register("ulbId", { required: "ULB name is required" })}
            >
              <option value="">-- Select ULB --</option>
              {ulbOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.ulbId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.ulbId.message}
              </p>
            )}
          </div>

          {/* User ID */}
          <div>
            <Label text="User ID : " required />
            <input
              type="text"
              placeholder="Enter user id"
              className={`form-input-box ${
                errors.userId ? "border-red-500" : ""
              }`}
              {...register("userId", {
                required: "User ID is required",
                validate: (v) =>
                  v.trim().length > 0 || "User ID cannot be empty",
              })}
            />
            {errors.userId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.userId.message}
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
            onClick={() => navigate("/Masters/FrmuserallList")}
          >
            Back
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmuserallMst;
