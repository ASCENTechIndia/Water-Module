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

const FrmMeterOwnerMst = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const meterOwnerId = state?.meterOwnerId;
  const isEdit = !!meterOwnerId;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      meterOwnerName: "",
      isActive: "Y", // ✅ Yes by default
    },
  });

  // ---------- Load detail in edit mode (DUMMY) ----------
  useEffect(() => {
    if (!meterOwnerId) return;

    // 🔸 DUMMY — replace with apiService.post("getMeterOwnerDetail", { meterOwnerId: Number(meterOwnerId) })
    const dummyDetail = {
      NUM_METEROWNER_ID: meterOwnerId,
      VAR_METEROWNER_NAME: "ULB",
      FLG_ISACTIVE: "Y",
    };

    reset({
      meterOwnerName: dummyDetail.VAR_METEROWNER_NAME || "",
      isActive: dummyDetail.FLG_ISACTIVE || "Y",
    });

    // 🔸 REAL API — uncomment when ready
    // const fetchDetail = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.post("getMeterOwnerDetail", {
    //       meterOwnerId: Number(meterOwnerId),
    //     });
    //     if (res?.data?.success && res?.data?.data?.length > 0) {
    //       const d = res.data.data[0];
    //       reset({
    //         meterOwnerName: d.VAR_METEROWNER_NAME || "",
    //         isActive: d.FLG_ISACTIVE || "Y",
    //       });
    //     } else {
    //       alert(res?.data?.errorMessage || "Meter owner detail not found");
    //     }
    //   } catch (err) {
    //     console.error("Meter owner detail error:", err);
    //     alert("Failed to fetch meter owner detail.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchDetail();
  }, [meterOwnerId, reset]);

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
        in_MeterOwnerId: isEdit ? Number(meterOwnerId) : null,
        in_MeterOwnerName: data.meterOwnerName.trim(),
        in_IsActive: data.isActive,
        in_UlbId: Number(ulbid),
        in_ipaddress: ip,
        in_source: config.source,
      };

      // 🔸 DUMMY — replace with real endpoint when ready
      console.log("Meter Owner payload →", payload);
      alert("Saved successfully (dummy)");
      navigate("/Masters/FrmMeterOwnerList");

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.post("aoio_meterowner_ins", payload);
      // if (res?.data?.success && res?.data?.errorCode === 9999) {
      //   alert(res.data.errorMessage);
      //   navigate("/Masters/FrmMeterOwnerList");
      // } else {
      //   alert(
      //     res?.data?.errorMessage ||
      //       res?.data?.message ||
      //       "Failed to save meter owner",
      //   );
      // }
    } catch (error) {
      console.error("Error saving meter owner:", error);
      alert("API Error — check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Meter Owner Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Meter Owner Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        {/* 2 columns per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Meter Owner Name */}
          <div>
            <Label text="Meter Owner Name : " required />
            <input
              type="text"
              placeholder="Enter meter owner name"
              className={`form-input-box ${
                errors.meterOwnerName ? "border-red-500" : ""
              }`}
              {...register("meterOwnerName", {
                required: "Meter owner name is required",
                validate: (v) =>
                  v.trim().length > 0 || "Meter owner name cannot be empty",
              })}
            />
            {errors.meterOwnerName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.meterOwnerName.message}
              </p>
            )}
          </div>

          {/* 2. Status — radio (Yes default) */}
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
            onClick={() => navigate("/Masters/FrmMeterOwnerList")}
          >
            Back
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmMeterOwnerMst;
