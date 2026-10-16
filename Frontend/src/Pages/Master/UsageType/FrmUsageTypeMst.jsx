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
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      usageTypeName: "",
    },
  });

  // ---------- Load detail in edit mode (DUMMY) ----------
  useEffect(() => {
    if (!usageTypeId) return;

    // 🔸 DUMMY — replace with apiService.post("getUsageTypeDetail", { usageTypeId: Number(usageTypeId) })
    const dummyDetail = {
      NUM_USAGETYPE_ID: usageTypeId,
      VAR_USAGETYPE_NAME: "Residential",
    };

    reset({
      usageTypeName: dummyDetail.VAR_USAGETYPE_NAME || "",
    });

    // 🔸 REAL API — uncomment when ready
    // const fetchDetail = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.post("getUsageTypeDetail", {
    //       usageTypeId: Number(usageTypeId),
    //     });
    //     if (res?.data?.success && res?.data?.data?.length > 0) {
    //       const d = res.data.data[0];
    //       reset({
    //         usageTypeName: d.VAR_USAGETYPE_NAME || "",
    //       });
    //     } else {
    //       alert(res?.data?.errorMessage || "Usage type detail not found");
    //     }
    //   } catch (err) {
    //     console.error("Usage type detail error:", err);
    //     alert("Failed to fetch usage type detail.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchDetail();
  }, [usageTypeId, reset]);

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
        in_UsageTypeId: isEdit ? Number(usageTypeId) : null,
        in_UsageTypeName: data.usageTypeName.trim(),
        in_UlbId: Number(ulbid),
        in_ipaddress: ip,
        in_source: config.source,
      };

      // 🔸 DUMMY — replace with real endpoint when ready
      console.log("Usage Type payload →", payload);
      alert("Saved successfully (dummy)");
      navigate("/Masters/FrmUsageTypeList");

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.post("aoio_usagetype_ins", payload);
      // if (res?.data?.success && res?.data?.errorCode === 9999) {
      //   alert(res.data.errorMessage);
      //   navigate("/Masters/FrmUsageTypeList");
      // } else {
      //   alert(
      //     res?.data?.errorMessage ||
      //       res?.data?.message ||
      //       "Failed to save usage type",
      //   );
      // }
    } catch (error) {
      console.error("Error saving usage type:", error);
      alert("API Error — check console for details.");
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
        {/* Single field — half width on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Buttons — centered */}
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
