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
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      usageTypeId: "",
      usageSubTypeName: "",
    },
  });

  // ---------- Load Usage Type dropdown (DUMMY) ----------
  useEffect(() => {
    // 🔸 DUMMY — replace with apiService.get("getUsageTypeDropdown") later
    setUsageTypeOptions([
      { value: "1", label: "Residential" },
      { value: "2", label: "Commercial" },
      { value: "3", label: "Industrial" },
      { value: "4", label: "Institutional" },
    ]);

    // 🔸 REAL API — uncomment when ready
    // const fetchUsageTypes = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.get("getUsageTypeDropdown");
    //     if (res?.data?.success && Array.isArray(res.data.data)) {
    //       setUsageTypeOptions(
    //         res.data.data.map((item) => ({
    //           value: String(item.USAGETYPEID),
    //           label: item.USAGETYPENAME,
    //         })),
    //       );
    //     } else {
    //       setUsageTypeOptions([]);
    //     }
    //   } catch (err) {
    //     console.error("Usage Type dropdown error:", err);
    //     setUsageTypeOptions([]);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchUsageTypes();
  }, []);

  // ---------- Load detail in edit mode (DUMMY) ----------
  useEffect(() => {
    if (!usageSubTypeId) return;

    // 🔸 DUMMY — replace with apiService.post("getUsageSubTypeDetail", { usageSubTypeId: Number(usageSubTypeId) })
    const dummyDetail = {
      NUM_USAGESUBTYPE_ID: usageSubTypeId,
      NUM_USAGETYPE_ID: "1",
      VAR_USAGESUBTYPE_NAME: "Domestic",
    };

    reset({
      usageTypeId: String(dummyDetail.NUM_USAGETYPE_ID || ""),
      usageSubTypeName: dummyDetail.VAR_USAGESUBTYPE_NAME || "",
    });

    // 🔸 REAL API — uncomment when ready
    // const fetchDetail = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.post("getUsageSubTypeDetail", {
    //       usageSubTypeId: Number(usageSubTypeId),
    //     });
    //     if (res?.data?.success && res?.data?.data?.length > 0) {
    //       const d = res.data.data[0];
    //       reset({
    //         usageTypeId: String(d.NUM_USAGETYPE_ID || ""),
    //         usageSubTypeName: d.VAR_USAGESUBTYPE_NAME || "",
    //       });
    //     } else {
    //       alert(res?.data?.errorMessage || "Usage sub type detail not found");
    //     }
    //   } catch (err) {
    //     console.error("Usage sub type detail error:", err);
    //     alert("Failed to fetch usage sub type detail.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchDetail();
  }, [usageSubTypeId, reset]);

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
        in_UsageSubTypeId: isEdit ? Number(usageSubTypeId) : null,
        in_UsageTypeId: Number(data.usageTypeId),
        in_UsageSubTypeName: data.usageSubTypeName.trim(),
        in_UlbId: Number(ulbid),
        in_ipaddress: ip,
        in_source: config.source,
      };

      // 🔸 DUMMY — replace with real endpoint when ready
      console.log("Usage Sub Type payload →", payload);
      alert("Saved successfully (dummy)");
      navigate("/Masters/FrmUsageSubTypeList");

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.post("aoio_usagesubtype_ins", payload);
      // if (res?.data?.success && res?.data?.errorCode === 9999) {
      //   alert(res.data.errorMessage);
      //   navigate("/Masters/FrmUsageSubTypeList");
      // } else {
      //   alert(
      //     res?.data?.errorMessage ||
      //       res?.data?.message ||
      //       "Failed to save usage sub type",
      //   );
      // }
    } catch (error) {
      console.error("Error saving usage sub type:", error);
      alert("API Error — check console for details.");
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
        {/* 2 columns per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Usage Type */}
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

          {/* 2. Usage SubType Name */}
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

        {/* Buttons — centered */}
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
