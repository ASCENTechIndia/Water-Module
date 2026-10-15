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

const FrmWardMst = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const wardId = state?.wardId;
  const isEdit = !!wardId;

  const [ulbOptions, setUlbOptions] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      ulbId: "",
      wardName: "",
      wardCode: "",
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

  // Auto-select ULB from auth
  useEffect(() => {
    if (ulbid && ulbOptions.length > 0) {
      const match = ulbOptions.find((o) => o.value === String(ulbid));
      if (match) {
        setValue("ulbId", match.value);
      }
    }
  }, [ulbid, ulbOptions, setValue]);

  // Prefill form fields
  useEffect(() => {
    if (!isEdit) return;

    reset((prev) => ({
      ...prev,
      wardName: state?.wardName || "",
      wardCode: state?.wardCode || "",
      isActive: state?.flag === "Yes" ? "Y" : "N",
    }));
  }, [isEdit, state, reset]);

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
        in_userid: userId,
        in_wardid: isEdit ? Number(wardId) : null,
        in_wardname: data.wardName.trim(),
        in_ulbid: Number(ulbid),
        in_wardcode: data.wardCode.trim(),
        in_wardactiveflag: data.isActive,
        in_ipaddress: ip,
        in_source: config.source,
        in_mode: isEdit ? 2 : 1,
      };

      const res = await apiService.post("/master/aowt_ward_ins", payload);

      if (res?.success && res?.data?.out_errorcode === 9999) {
        alert(res.data.out_errormsg || "Ward saved successfully");
        navigate("/Masters/FrmWardList");
      } else {
        alert(
          res?.data?.out_errormsg ||
            res?.message ||
            "Failed to Insert or update",
        );
      }
    } catch (err) {
      console.error("Error saving ward:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Only alphabets
  const allowOnlyAlphabets = (e) => {
    e.target.value = e.target.value.replace(/[^A-Za-z]/g, "");
  };

  return (
    <Layout
      title="Ward Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Ward Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ULB Name */}
          <div>
            <Label text="ULB Name : " required />
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

          {/* Ward Name */}
          <div>
            <Label text="Ward Name : " required />
            <input
              type="text"
              placeholder="Enter ward name"
              className={`form-input-box ${
                errors.wardName ? "border-red-500" : ""
              }`}
              {...register("wardName", {
                required: "Ward name is required",
                validate: (v) =>
                  v.trim().length > 0 || "Ward name cannot be empty",
              })}
            />
            {errors.wardName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.wardName.message}
              </p>
            )}
          </div>

          {/* Ward Code */}
          <div>
            <Label text="Ward Code : " required />
            <input
              type="text"
              placeholder="Enter ward code"
              className={`form-input-box ${
                errors.wardCode ? "border-red-500" : ""
              }`}
              onInput={allowOnlyAlphabets}
              {...register("wardCode", {
                required: "Ward code is required",
                pattern: {
                  value: /^[A-Za-z]+$/,
                  message: "Only alphabets are allowed",
                },
                minLength: {
                  value: 2,
                  message: "Minimum 2 characters required",
                },
              })}
            />
            {errors.wardCode && (
              <p className="text-sm text-red-500 mt-1">
                {errors.wardCode.message}
              </p>
            )}
          </div>

          {/* Active */}
          <div>
            <Label text="Active : " required />
            <div className="flex flex-wrap items-center gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                <input
                  type="radio"
                  value="Y"
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                  {...register("isActive", {
                    required: "Active status is required",
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
                    required: "Active status is required",
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
            onClick={() => navigate("/Masters/FrmWardList")}
          >
            Back
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmWardMst;
