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

const FrmServiceMst = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const serviceId = state?.serviceId;
  const isEdit = !!serviceId;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      serviceNameEn: "",
      serviceNameMr: "",
      isActive: "Y", // ✅ Yes by default
    },
  });

  // ---------- Load detail in edit mode (DUMMY) ----------
  useEffect(() => {
    if (!serviceId) return;

    // 🔸 DUMMY — replace with apiService.post("getServiceDetail", { serviceId: Number(serviceId) })
    const dummyDetail = {
      NUM_SERVICE_ID: serviceId,
      VAR_SERVICE_NAME_EN: "Water Connection",
      VAR_SERVICE_NAME_MR: "पाणी जोडणी",
      FLG_ISACTIVE: "Y",
    };

    reset({
      serviceNameEn: dummyDetail.VAR_SERVICE_NAME_EN || "",
      serviceNameMr: dummyDetail.VAR_SERVICE_NAME_MR || "",
      isActive: dummyDetail.FLG_ISACTIVE || "Y",
    });

    // 🔸 REAL API — uncomment when ready
    // const fetchDetail = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.post("getServiceDetail", {
    //       serviceId: Number(serviceId),
    //     });
    //     if (res?.data?.success && res?.data?.data?.length > 0) {
    //       const d = res.data.data[0];
    //       reset({
    //         serviceNameEn: d.VAR_SERVICE_NAME_EN || "",
    //         serviceNameMr: d.VAR_SERVICE_NAME_MR || "",
    //         isActive: d.FLG_ISACTIVE || "Y",
    //       });
    //     } else {
    //       alert(res?.data?.errorMessage || "Service detail not found");
    //     }
    //   } catch (err) {
    //     console.error("Service detail error:", err);
    //     alert("Failed to fetch service detail.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchDetail();
  }, [serviceId, reset]);

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
        in_ServiceId: isEdit ? Number(serviceId) : null,
        in_ServiceNameEn: data.serviceNameEn.trim(),
        in_ServiceNameMr: data.serviceNameMr.trim(),
        in_IsActive: data.isActive,
        in_UlbId: Number(ulbid),
        in_ipaddress: ip,
        in_source: config.source,
      };

      // 🔸 DUMMY — replace with real endpoint when ready
      console.log("Service payload →", payload);
      alert("Saved successfully (dummy)");
      navigate("/Masters/FrmServiceList");

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.post("aoio_service_ins", payload);
      // if (res?.data?.success && res?.data?.errorCode === 9999) {
      //   alert(res.data.errorMessage);
      //   navigate("/Masters/FrmServiceList");
      // } else {
      //   alert(
      //     res?.data?.errorMessage ||
      //       res?.data?.message ||
      //       "Failed to save service",
      //   );
      // }
    } catch (error) {
      console.error("Error saving service:", error);
      alert("API Error — check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Service Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Service Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        {/* 2 columns per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. सेवाचे नांव (इंग्रेजी) */}
          <div>
            <Label text="सेवाचे नांव (इंग्रेजी) : " required />
            <input
              type="text"
              placeholder="Enter service name (English)"
              className={`form-input-box ${
                errors.serviceNameEn ? "border-red-500" : ""
              }`}
              {...register("serviceNameEn", {
                required: "Service name (English) is required",
                validate: (v) =>
                  v.trim().length > 0 || "Service name cannot be empty",
              })}
            />
            {errors.serviceNameEn && (
              <p className="text-sm text-red-500 mt-1">
                {errors.serviceNameEn.message}
              </p>
            )}
          </div>

          {/* 2. सेवाचे नांव (मराठी) */}
          <div>
            <Label text="सेवाचे नांव (मराठी) : " required />
            <input
              type="text"
              placeholder="सेवेचे नाव प्रविष्ट करा"
              className={`form-input-box ${
                errors.serviceNameMr ? "border-red-500" : ""
              }`}
              {...register("serviceNameMr", {
                required: "Service name (Marathi) is required",
                validate: (v) =>
                  v.trim().length > 0 || "Service name cannot be empty",
              })}
            />
            {errors.serviceNameMr && (
              <p className="text-sm text-red-500 mt-1">
                {errors.serviceNameMr.message}
              </p>
            )}
          </div>

          {/* 3. सक्रिय — radio (Yes default) */}
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
            onClick={() => navigate("/Masters/FrmServiceList")}
          >
            Back
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmServiceMst;
