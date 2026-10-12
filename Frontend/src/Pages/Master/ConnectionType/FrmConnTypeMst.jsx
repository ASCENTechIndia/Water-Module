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

const FrmConnTypeMst = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const connTypeId = state?.connTypeId;
  const isEdit = !!connTypeId;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      connTypeName: "",
      isActive: "Y", // ✅ Yes by default
    },
  });

  // ---------- Load detail in edit mode (DUMMY) ----------
  useEffect(() => {
    if (!connTypeId) return;

    // 🔸 DUMMY — replace with apiService.post("getConnTypeDetail", { connTypeId: Number(connTypeId) })
    const dummyDetail = {
      NUM_CONNTYPE_ID: connTypeId,
      VAR_CONNTYPE_NAME: "Metered",
      FLG_ISACTIVE: "Y",
    };

    reset({
      connTypeName: dummyDetail.VAR_CONNTYPE_NAME || "",
      isActive: dummyDetail.FLG_ISACTIVE || "Y",
    });

    // 🔸 REAL API — uncomment when ready
    // const fetchDetail = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.post("getConnTypeDetail", {
    //       connTypeId: Number(connTypeId),
    //     });
    //     if (res?.data?.success && res?.data?.data?.length > 0) {
    //       const d = res.data.data[0];
    //       reset({
    //         connTypeName: d.VAR_CONNTYPE_NAME || "",
    //         isActive: d.FLG_ISACTIVE || "Y",
    //       });
    //     } else {
    //       alert(res?.data?.errorMessage || "Conn type detail not found");
    //     }
    //   } catch (err) {
    //     console.error("Conn type detail error:", err);
    //     alert("Failed to fetch conn type detail.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchDetail();
  }, [connTypeId, reset]);

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
        in_ConnTypeId: isEdit ? Number(connTypeId) : null,
        in_ConnTypeName: data.connTypeName.trim(),
        in_IsActive: data.isActive,
        in_UlbId: Number(ulbid),
        in_ipaddress: ip,
        in_source: config.source,
      };

      // 🔸 DUMMY — replace with real endpoint when ready
      console.log("Conn Type payload →", payload);
      alert("Saved successfully (dummy)");
      navigate("/Masters/FrmConnTypeList");

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.post("aoio_conntype_ins", payload);
      // if (res?.data?.success && res?.data?.errorCode === 9999) {
      //   alert(res.data.errorMessage);
      //   navigate("/Masters/FrmConnTypeList");
      // } else {
      //   alert(
      //     res?.data?.errorMessage ||
      //       res?.data?.message ||
      //       "Failed to save conn type",
      //   );
      // }
    } catch (error) {
      console.error("Error saving conn type:", error);
      alert("API Error — check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Conn Type Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Conn Type Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        {/* 2 columns per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Conn Type Name */}
          <div>
            <Label text="Conn Type Name : " required />
            <input
              type="text"
              placeholder="Enter conn type name"
              className={`form-input-box ${
                errors.connTypeName ? "border-red-500" : ""
              }`}
              {...register("connTypeName", {
                required: "Conn type name is required",
                validate: (v) =>
                  v.trim().length > 0 || "Conn type name cannot be empty",
              })}
            />
            {errors.connTypeName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.connTypeName.message}
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
            onClick={() => navigate("/Masters/FrmConnTypeList")}
          >
            Back
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmConnTypeMst;
