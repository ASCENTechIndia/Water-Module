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
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      ulbId: "",
      userId: "",
      isActive: "Y", // ✅ Yes by default
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
      setValue("ulbId", dummyUlbs[0].value);
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
  }, [setValue]);

  // ---------- Load detail in edit mode (DUMMY) ----------
  useEffect(() => {
    if (!userAllId) return;

    // 🔸 DUMMY — replace with apiService.post("getUserAllDetail", { userAllId })
    const dummyDetail = {
      VAR_USER_ID: userAllId,
      NUM_ULB_ID: "1",
      FLG_ISACTIVE: "Y",
    };

    reset({
      ulbId: String(dummyDetail.NUM_ULB_ID || ""),
      userId: dummyDetail.VAR_USER_ID || "",
      isActive: dummyDetail.FLG_ISACTIVE || "Y",
    });

    // 🔸 REAL API — uncomment when ready
    // const fetchDetail = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.post("getUserAllDetail", {
    //       userAllId: userAllId,
    //     });
    //     if (res?.data?.success && res?.data?.data?.length > 0) {
    //       const d = res.data.data[0];
    //       reset({
    //         ulbId: String(d.NUM_ULB_ID || ""),
    //         userId: d.VAR_USER_ID || "",
    //         isActive: d.FLG_ISACTIVE || "Y",
    //       });
    //     } else {
    //       alert(res?.data?.errorMessage || "User detail not found");
    //     }
    //   } catch (err) {
    //     console.error("User detail error:", err);
    //     alert("Failed to fetch user detail.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchDetail();
  }, [userAllId, reset]);

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
        in_UserAllId: isEdit ? userAllId : null,
        in_UlbId: Number(data.ulbId),
        in_UserCode: data.userId.trim(),
        in_IsActive: data.isActive,
        in_ipaddress: ip,
        in_source: config.source,
      };

      // 🔸 DUMMY — replace with real endpoint when ready
      console.log("User All payload →", payload);
      alert("Saved successfully (dummy)");
      navigate("/Masters/FrmuserallList");

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.post("aoio_userall_ins", payload);
      // if (res?.data?.success && res?.data?.errorCode === 9999) {
      //   alert(res.data.errorMessage);
      //   navigate("/Masters/FrmuserallList");
      // } else {
      //   alert(
      //     res?.data?.errorMessage ||
      //       res?.data?.message ||
      //       "Failed to save user",
      //   );
      // }
    } catch (error) {
      console.error("Error saving user:", error);
      alert("API Error — check console for details.");
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
        {/* 2 columns per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. ULB */}
          <div>
            <Label text="ULB : " required />
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

          {/* 2. User ID */}
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

          {/* 3. Status — radio (Yes default) */}
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

        {/* Buttons — centered */}
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
