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

const FrmPremiseTypeMst = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const premiseTypeId = state?.premiseTypeId;
  const isEdit = !!premiseTypeId;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      premiseTypeName: "",
      isActive: "Y", // ✅ Yes by default
    },
  });

  // ---------- Load detail in edit mode (DUMMY) ----------
  useEffect(() => {
    if (!premiseTypeId) return;

    // 🔸 DUMMY — replace with apiService.post("getPremiseTypeDetail", { premiseTypeId: Number(premiseTypeId) })
    const dummyDetail = {
      NUM_PREMISETYPE_ID: premiseTypeId,
      VAR_PREMISETYPE_NAME: "Residential",
      FLG_ISACTIVE: "Y",
    };

    reset({
      premiseTypeName: dummyDetail.VAR_PREMISETYPE_NAME || "",
      isActive: dummyDetail.FLG_ISACTIVE || "Y",
    });

    // 🔸 REAL API — uncomment when ready
    // const fetchDetail = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.post("getPremiseTypeDetail", {
    //       premiseTypeId: Number(premiseTypeId),
    //     });
    //     if (res?.data?.success && res?.data?.data?.length > 0) {
    //       const d = res.data.data[0];
    //       reset({
    //         premiseTypeName: d.VAR_PREMISETYPE_NAME || "",
    //         isActive: d.FLG_ISACTIVE || "Y",
    //       });
    //     } else {
    //       alert(res?.data?.errorMessage || "Premise type detail not found");
    //     }
    //   } catch (err) {
    //     console.error("Premise type detail error:", err);
    //     alert("Failed to fetch premise type detail.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchDetail();
  }, [premiseTypeId, reset]);

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
        in_PremiseTypeId: isEdit ? Number(premiseTypeId) : null,
        in_PremiseTypeName: data.premiseTypeName.trim(),
        in_IsActive: data.isActive,
        in_UlbId: Number(ulbid),
        in_ipaddress: ip,
        in_source: config.source,
      };

      // 🔸 DUMMY — replace with real endpoint when ready
      console.log("Premise Type payload →", payload);
      alert("Saved successfully (dummy)");
      navigate("/Masters/FrmPremiseTypeList");

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.post("aoio_premisetype_ins", payload);
      // if (res?.data?.success && res?.data?.errorCode === 9999) {
      //   alert(res.data.errorMessage);
      //   navigate("/Masters/FrmPremiseTypeList");
      // } else {
      //   alert(
      //     res?.data?.errorMessage ||
      //       res?.data?.message ||
      //       "Failed to save premise type",
      //   );
      // }
    } catch (error) {
      console.error("Error saving premise type:", error);
      alert("API Error — check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Premise Type Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Premise Type Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        {/* 2 columns per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Premise Type Name */}
          <div>
            <Label text="Premise Type Name : " required />
            <input
              type="text"
              placeholder="Enter premise type name"
              className={`form-input-box ${
                errors.premiseTypeName ? "border-red-500" : ""
              }`}
              {...register("premiseTypeName", {
                required: "Premise type name is required",
                validate: (v) =>
                  v.trim().length > 0 || "Premise type name cannot be empty",
              })}
            />
            {errors.premiseTypeName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.premiseTypeName.message}
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
            onClick={() => navigate("/Masters/FrmPremiseTypeList")}
          >
            Back
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmPremiseTypeMst;
