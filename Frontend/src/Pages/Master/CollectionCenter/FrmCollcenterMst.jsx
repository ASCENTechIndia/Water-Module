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

const FrmCollcenterMst = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const collCentreId = state?.collCentreId;
  const isEdit = !!collCentreId;

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
      collCentreName: "",
      collCentreCode: "",
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
    if (!collCentreId) return;

    // 🔸 DUMMY — replace with apiService.post("getCollCentreDetail", { collCentreId: Number(collCentreId) })
    const dummyDetail = {
      NUM_COLLCENTRE_ID: collCentreId,
      NUM_ULB_ID: "1",
      VAR_COLLCENTRE_NAME: "Head Office",
      VAR_COLLCENTRE_CODE: "CC-HO",
      FLG_ISACTIVE: "Y",
    };

    reset({
      ulbId: String(dummyDetail.NUM_ULB_ID || ""),
      collCentreName: dummyDetail.VAR_COLLCENTRE_NAME || "",
      collCentreCode: dummyDetail.VAR_COLLCENTRE_CODE || "",
      isActive: dummyDetail.FLG_ISACTIVE || "Y",
    });

    // 🔸 REAL API — uncomment when ready
    // const fetchDetail = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.post("getCollCentreDetail", {
    //       collCentreId: Number(collCentreId),
    //     });
    //     if (res?.data?.success && res?.data?.data?.length > 0) {
    //       const d = res.data.data[0];
    //       reset({
    //         ulbId: String(d.NUM_ULB_ID || ""),
    //         collCentreName: d.VAR_COLLCENTRE_NAME || "",
    //         collCentreCode: d.VAR_COLLCENTRE_CODE || "",
    //         isActive: d.FLG_ISACTIVE || "Y",
    //       });
    //     } else {
    //       alert(res?.data?.errorMessage || "Collection centre detail not found");
    //     }
    //   } catch (err) {
    //     console.error("Collection centre detail error:", err);
    //     alert("Failed to fetch collection centre detail.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchDetail();
  }, [collCentreId, reset]);

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
        in_CollCentreId: isEdit ? Number(collCentreId) : null,
        in_UlbId: Number(data.ulbId),
        in_CollCentreName: data.collCentreName.trim(),
        in_CollCentreCode: data.collCentreCode.trim(),
        in_IsActive: data.isActive,
        in_ipaddress: ip,
        in_source: config.source,
      };

      // 🔸 DUMMY — replace with real endpoint when ready
      console.log("Collection Centre payload →", payload);
      alert("Saved successfully (dummy)");
      navigate("/Masters/FrmCollcenterList");

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.post("aoio_collcentre_ins", payload);
      // if (res?.data?.success && res?.data?.errorCode === 9999) {
      //   alert(res.data.errorMessage);
      //   navigate("/Masters/FrmCollcenterList");
      // } else {
      //   alert(
      //     res?.data?.errorMessage ||
      //       res?.data?.message ||
      //       "Failed to save collection centre",
      //   );
      // }
    } catch (error) {
      console.error("Error saving collection centre:", error);
      alert("API Error — check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Collection Centre Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Collection Centre Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        {/* 2 columns per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. ULB */}
          <div>
            <Label text="नगरपालिकेचे नाव : " required />
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

          {/* 2. Collection Centre Name */}
          <div>
            <Label text="Collection Centre Name : " required />
            <input
              type="text"
              placeholder="Enter collection centre name"
              className={`form-input-box ${
                errors.collCentreName ? "border-red-500" : ""
              }`}
              {...register("collCentreName", {
                required: "Collection centre name is required",
                validate: (v) =>
                  v.trim().length > 0 ||
                  "Collection centre name cannot be empty",
              })}
            />
            {errors.collCentreName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.collCentreName.message}
              </p>
            )}
          </div>

          {/* 3. Collection Centre Code */}
          <div>
            <Label text="Collection Centre Code : " required />
            <input
              type="text"
              placeholder="Enter collection centre code"
              className={`form-input-box ${
                errors.collCentreCode ? "border-red-500" : ""
              }`}
              {...register("collCentreCode", {
                required: "Collection centre code is required",
                validate: (v) =>
                  v.trim().length > 0 ||
                  "Collection centre code cannot be empty",
              })}
            />
            {errors.collCentreCode && (
              <p className="text-sm text-red-500 mt-1">
                {errors.collCentreCode.message}
              </p>
            )}
          </div>

          {/* 4. सक्रिय — radio (Yes default) */}
          <div>
            <Label text="सक्रिय : " required />
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
            onClick={() => navigate("/Masters/FrmCollcenterList")}
          >
            Back
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmCollcenterMst;
