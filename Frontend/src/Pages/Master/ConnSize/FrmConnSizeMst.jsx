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

const FrmConnSizeMst = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const connSizeId = state?.connSizeId;
  const isEdit = !!connSizeId;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      connSizeName: "",
      isActive: "Y", // ✅ Yes by default
    },
  });

  // ---------- Load detail in edit mode (DUMMY) ----------
  useEffect(() => {
    if (!connSizeId) return;

    // 🔸 DUMMY — replace with apiService.post("getConnSizeDetail", { connSizeId: Number(connSizeId) })
    const dummyDetail = {
      NUM_CONNSIZE_ID: connSizeId,
      VAR_CONNSIZE_NAME: "15mm",
      FLG_ISACTIVE: "Y",
    };

    reset({
      connSizeName: dummyDetail.VAR_CONNSIZE_NAME || "",
      isActive: dummyDetail.FLG_ISACTIVE || "Y",
    });

    // 🔸 REAL API — uncomment when ready
    // const fetchDetail = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.post("getConnSizeDetail", {
    //       connSizeId: Number(connSizeId),
    //     });
    //     if (res?.data?.success && res?.data?.data?.length > 0) {
    //       const d = res.data.data[0];
    //       reset({
    //         connSizeName: d.VAR_CONNSIZE_NAME || "",
    //         isActive: d.FLG_ISACTIVE || "Y",
    //       });
    //     } else {
    //       alert(res?.data?.errorMessage || "Conn size detail not found");
    //     }
    //   } catch (err) {
    //     console.error("Conn size detail error:", err);
    //     alert("Failed to fetch conn size detail.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchDetail();
  }, [connSizeId, reset]);

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
        in_ConnSizeId: isEdit ? Number(connSizeId) : null,
        in_ConnSizeName: data.connSizeName.trim(),
        in_IsActive: data.isActive,
        in_UlbId: Number(ulbid),
        in_ipaddress: ip,
        in_source: config.source,
      };

      // 🔸 DUMMY — replace with real endpoint when ready
      console.log("Conn Size payload →", payload);
      alert("Saved successfully (dummy)");
      navigate("/Masters/FrmConnSizeList");

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.post("aoio_connsize_ins", payload);
      // if (res?.data?.success && res?.data?.errorCode === 9999) {
      //   alert(res.data.errorMessage);
      //   navigate("/Masters/FrmConnSizeList");
      // } else {
      //   alert(
      //     res?.data?.errorMessage ||
      //       res?.data?.message ||
      //       "Failed to save conn size",
      //   );
      // }
    } catch (error) {
      console.error("Error saving conn size:", error);
      alert("API Error — check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Conn Size Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Conn Size Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        {/* 2 columns per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Conn Size Name */}
          <div>
            <Label text="Conn Size Name : " required />
            <input
              type="text"
              placeholder="Enter conn size name"
              className={`form-input-box ${
                errors.connSizeName ? "border-red-500" : ""
              }`}
              {...register("connSizeName", {
                required: "Conn size name is required",
                validate: (v) =>
                  v.trim().length > 0 || "Conn size name cannot be empty",
              })}
            />
            {errors.connSizeName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.connSizeName.message}
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
            onClick={() => navigate("/Masters/FrmConnSizeList")}
          >
            Back
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmConnSizeMst;
