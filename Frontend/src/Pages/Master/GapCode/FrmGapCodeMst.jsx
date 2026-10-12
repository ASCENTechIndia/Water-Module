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

const FrmGapCodeMst = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const gapCodeId = state?.gapCodeId;
  const isEdit = !!gapCodeId;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      gapCodeName: "",
      isActive: "Y", // ✅ Yes by default
    },
  });

  // ---------- Load detail in edit mode (DUMMY) ----------
  useEffect(() => {
    if (!gapCodeId) return;

    // 🔸 DUMMY — replace with apiService.post("getGapCodeDetail", { gapCodeId: Number(gapCodeId) })
    const dummyDetail = {
      NUM_GAPCODE_ID: gapCodeId,
      VAR_GAPCODE_NAME: "Gap-A",
      FLG_ISACTIVE: "Y",
    };

    reset({
      gapCodeName: dummyDetail.VAR_GAPCODE_NAME || "",
      isActive: dummyDetail.FLG_ISACTIVE || "Y",
    });

    // 🔸 REAL API — uncomment when ready
    // const fetchDetail = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.post("getGapCodeDetail", {
    //       gapCodeId: Number(gapCodeId),
    //     });
    //     if (res?.data?.success && res?.data?.data?.length > 0) {
    //       const d = res.data.data[0];
    //       reset({
    //         gapCodeName: d.VAR_GAPCODE_NAME || "",
    //         isActive: d.FLG_ISACTIVE || "Y",
    //       });
    //     } else {
    //       alert(res?.data?.errorMessage || "Gap code detail not found");
    //     }
    //   } catch (err) {
    //     console.error("Gap code detail error:", err);
    //     alert("Failed to fetch gap code detail.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchDetail();
  }, [gapCodeId, reset]);

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
        in_GapCodeId: isEdit ? Number(gapCodeId) : null,
        in_GapCodeName: data.gapCodeName.trim(),
        in_IsActive: data.isActive,
        in_UlbId: Number(ulbid),
        in_ipaddress: ip,
        in_source: config.source,
      };

      // 🔸 DUMMY — replace with real endpoint when ready
      console.log("Gap Code payload →", payload);
      alert("Saved successfully (dummy)");
      navigate("/Masters/FrmGapCodeList");

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.post("aoio_gapcode_ins", payload);
      // if (res?.data?.success && res?.data?.errorCode === 9999) {
      //   alert(res.data.errorMessage);
      //   navigate("/Masters/FrmGapCodeList");
      // } else {
      //   alert(
      //     res?.data?.errorMessage ||
      //       res?.data?.message ||
      //       "Failed to save gap code",
      //   );
      // }
    } catch (error) {
      console.error("Error saving gap code:", error);
      alert("API Error — check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Gap Code Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Gap Code Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        {/* 2 columns per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Gap Code Name */}
          <div>
            <Label text="Gap Code Name : " required />
            <input
              type="text"
              placeholder="Enter gap code name"
              className={`form-input-box ${
                errors.gapCodeName ? "border-red-500" : ""
              }`}
              {...register("gapCodeName", {
                required: "Gap code name is required",
                validate: (v) =>
                  v.trim().length > 0 || "Gap code name cannot be empty",
              })}
            />
            {errors.gapCodeName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.gapCodeName.message}
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
            onClick={() => navigate("/Masters/FrmGapCodeList")}
          >
            Back
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmGapCodeMst;
