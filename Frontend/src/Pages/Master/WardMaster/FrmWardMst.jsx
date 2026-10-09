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

  // ---------- Load ULB dropdown (DUMMY) ----------
  useEffect(() => {
    // 🔸 DUMMY — replace with apiService.get("getUlbDropdown") later
    const dummyUlbs = [
      { value: "1", label: "Pune Municipal Corporation" },
      { value: "2", label: "Mumbai Municipal Corporation" },
      { value: "3", label: "Nashik Municipal Corporation" },
      { value: "4", label: "Nagpur Municipal Corporation" },
    ];
    setUlbOptions(dummyUlbs);

    // Auto-select first ULB by default
    if (dummyUlbs.length > 0) {
      reset((prev) => ({ ...prev, ulbId: dummyUlbs[0].value }));
    }

    // 🔸 REAL API — uncomment when ready
    // const fetchUlb = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.get("getUlbDropdown");
    //     if (res?.data?.success && Array.isArray(res.data.data)) {
    //       const opts = res.data.data.map((item) => ({
    //         value: String(item.CORPORATIONID),
    //         label: item.CORPORATIONNAME,
    //       }));
    //       setUlbOptions(opts);
    //     } else {
    //       setUlbOptions([]);
    //     }
    //   } catch (err) {
    //     console.error("ULB dropdown error:", err);
    //     setUlbOptions([]);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchUlb();
  }, [reset]);

  // ---------- Load detail in edit mode (DUMMY) ----------
  useEffect(() => {
    if (!wardId) return;

    // 🔸 DUMMY — replace with apiService.post("getWardDetail", { wardId: Number(wardId) })
    const dummyDetail = {
      NUM_WARD_ID: wardId,
      NUM_ULB_ID: "1",
      VAR_WARD_NAME: "प्रभाग क्र. १",
      VAR_WARD_CODE: "WARD",
      FLG_ISACTIVE: "Y",
    };

    reset({
      ulbId: String(dummyDetail.NUM_ULB_ID || ""),
      wardName: dummyDetail.VAR_WARD_NAME || "",
      wardCode: dummyDetail.VAR_WARD_CODE || "",
      isActive: dummyDetail.FLG_ISACTIVE || "Y",
    });

    // 🔸 REAL API — uncomment when ready
    // const fetchDetail = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.post("getWardDetail", {
    //       wardId: Number(wardId),
    //     });
    //     if (res?.data?.success && res?.data?.data?.length > 0) {
    //       const d = res.data.data[0];
    //       reset({
    //         ulbId: String(d.NUM_ULB_ID || ""),
    //         wardName: d.VAR_WARD_NAME || "",
    //         wardCode: d.VAR_WARD_CODE || "",
    //         isActive: d.FLG_ISACTIVE || "Y",
    //       });
    //     } else {
    //       alert(res?.data?.errorMessage || "Ward detail not found");
    //     }
    //   } catch (err) {
    //     console.error("Ward detail error:", err);
    //     alert("Failed to fetch ward detail.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchDetail();
  }, [wardId, reset]);

  // ---------- Submit ----------
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
        in_Mode: isEdit ? 2 : 1,
        in_WardId: isEdit ? Number(wardId) : null,
        in_UlbId: Number(data.ulbId),
        in_WardName: data.wardName.trim(),
        in_WardCode: data.wardCode.trim(),
        in_IsActive: data.isActive,
        in_ipaddress: ip,
        in_source: config.source,
      };

      // 🔸 DUMMY — replace with real endpoint when ready
      console.log("Ward payload →", payload);
      alert("Saved successfully (dummy)");
      navigate("/Masters/FrmWardList");

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.post("aoio_ward_ins", payload);
      // if (res?.data?.success && res?.data?.errorCode === 9999) {
      //   alert(res.data.errorMessage);
      //   navigate("/Masters/FrmWardList");
      // } else {
      //   alert(
      //     res?.data?.errorMessage ||
      //       res?.data?.message ||
      //       "Failed to save ward",
      //   );
      // }
    } catch (error) {
      console.error("Error saving ward:", error);
      alert("API Error — check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Only alphabets — used by Ward Code
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
        {/* 2 columns per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. ULB Name */}
          <div>
            <Label text="ULB Name : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${errors.ulbId ? "border-red-500" : ""}`}
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

          {/* 2. Ward Name */}
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

          {/* 3. Ward Code — only alphabets */}
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

          {/* 4. Active — radio */}
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

        {/* Buttons */}
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
