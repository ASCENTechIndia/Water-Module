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

const FrmPlumberMst = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const plumberId = state?.plumberId;
  const isEdit = !!plumberId;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      plumberName: "",
      plumberCode: "",
      isActive: "Y", // ✅ Yes by default
    },
  });

  // ---------- Load detail in edit mode (DUMMY) ----------
  useEffect(() => {
    if (!plumberId) return;

    // 🔸 DUMMY — replace with apiService.post("getPlumberDetail", { plumberId: Number(plumberId) })
    const dummyDetail = {
      NUM_PLUMBER_ID: plumberId,
      VAR_PLUMBER_NAME: "Rajesh Kumar",
      VAR_PLUMBER_CODE: "PLB001",
      FLG_ISACTIVE: "Y",
    };

    reset({
      plumberName: dummyDetail.VAR_PLUMBER_NAME || "",
      plumberCode: dummyDetail.VAR_PLUMBER_CODE || "",
      isActive: dummyDetail.FLG_ISACTIVE || "Y",
    });

    // 🔸 REAL API — uncomment when ready
    // const fetchDetail = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.post("getPlumberDetail", {
    //       plumberId: Number(plumberId),
    //     });
    //     if (res?.data?.success && res?.data?.data?.length > 0) {
    //       const d = res.data.data[0];
    //       reset({
    //         plumberName: d.VAR_PLUMBER_NAME || "",
    //         plumberCode: d.VAR_PLUMBER_CODE || "",
    //         isActive: d.FLG_ISACTIVE || "Y",
    //       });
    //     } else {
    //       alert(res?.data?.errorMessage || "Plumber detail not found");
    //     }
    //   } catch (err) {
    //     console.error("Plumber detail error:", err);
    //     alert("Failed to fetch plumber detail.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchDetail();
  }, [plumberId, reset]);

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
        in_PlumberId: isEdit ? Number(plumberId) : null,
        in_PlumberName: data.plumberName.trim(),
        in_PlumberCode: data.plumberCode.trim(),
        in_IsActive: data.isActive,
        in_UlbId: Number(ulbid),
        in_ipaddress: ip,
        in_source: config.source,
      };

      // 🔸 DUMMY — replace with real endpoint when ready
      console.log("Plumber payload →", payload);
      alert("Saved successfully (dummy)");
      navigate("/Masters/FrmPlumberList");

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.post("aoio_plumber_ins", payload);
      // if (res?.data?.success && res?.data?.errorCode === 9999) {
      //   alert(res.data.errorMessage);
      //   navigate("/Masters/FrmPlumberList");
      // } else {
      //   alert(
      //     res?.data?.errorMessage ||
      //       res?.data?.message ||
      //       "Failed to save plumber",
      //   );
      // }
    } catch (error) {
      console.error("Error saving plumber:", error);
      alert("API Error — check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Plumber Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Plumber Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        {/* 2 columns per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Plumber Name */}
          <div>
            <Label text="Plumber Name : " required />
            <input
              type="text"
              placeholder="Enter plumber name"
              className={`form-input-box ${
                errors.plumberName ? "border-red-500" : ""
              }`}
              {...register("plumberName", {
                required: "Plumber name is required",
                validate: (v) =>
                  v.trim().length > 0 || "Plumber name cannot be empty",
              })}
            />
            {errors.plumberName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.plumberName.message}
              </p>
            )}
          </div>

          {/* 2. Plumber Code */}
          <div>
            <Label text="Plumber Code : " required />
            <input
              type="text"
              placeholder="Enter plumber code"
              className={`form-input-box ${
                errors.plumberCode ? "border-red-500" : ""
              }`}
              {...register("plumberCode", {
                required: "Plumber code is required",
                validate: (v) =>
                  v.trim().length > 0 || "Plumber code cannot be empty",
              })}
            />
            {errors.plumberCode && (
              <p className="text-sm text-red-500 mt-1">
                {errors.plumberCode.message}
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
            onClick={() => navigate("/Masters/FrmPlumberList")}
          >
            Back
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmPlumberMst;
