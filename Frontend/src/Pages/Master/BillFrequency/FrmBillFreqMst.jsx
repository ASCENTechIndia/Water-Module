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

const FrmBillFreqMst = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const billFreqId = state?.billFreqId;
  const isEdit = !!billFreqId;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      billFreqName: "",
      isActive: "Y", // ✅ Yes by default
    },
  });

  // ---------- Load detail in edit mode (DUMMY) ----------
  useEffect(() => {
    if (!billFreqId) return;

    // 🔸 DUMMY — replace with apiService.post("getBillFreqDetail", { billFreqId: Number(billFreqId) })
    const dummyDetail = {
      NUM_BILLFREQ_ID: billFreqId,
      VAR_BILLFREQ_NAME: "Monthly",
      FLG_ISACTIVE: "Y",
    };

    reset({
      billFreqName: dummyDetail.VAR_BILLFREQ_NAME || "",
      isActive: dummyDetail.FLG_ISACTIVE || "Y",
    });

    // 🔸 REAL API — uncomment when ready
    // const fetchDetail = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.post("getBillFreqDetail", {
    //       billFreqId: Number(billFreqId),
    //     });
    //     if (res?.data?.success && res?.data?.data?.length > 0) {
    //       const d = res.data.data[0];
    //       reset({
    //         billFreqName: d.VAR_BILLFREQ_NAME || "",
    //         isActive: d.FLG_ISACTIVE || "Y",
    //       });
    //     } else {
    //       alert(res?.data?.errorMessage || "Bill frequency detail not found");
    //     }
    //   } catch (err) {
    //     console.error("Bill frequency detail error:", err);
    //     alert("Failed to fetch bill frequency detail.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchDetail();
  }, [billFreqId, reset]);

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
        in_BillFreqId: isEdit ? Number(billFreqId) : null,
        in_BillFreqName: data.billFreqName.trim(),
        in_IsActive: data.isActive,
        in_UlbId: Number(ulbid),
        in_ipaddress: ip,
        in_source: config.source,
      };

      // 🔸 DUMMY — replace with real endpoint when ready
      console.log("Bill Frequency payload →", payload);
      alert("Saved successfully (dummy)");
      navigate("/Masters/FrmBillFreqList");

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.post("aoio_billfreq_ins", payload);
      // if (res?.data?.success && res?.data?.errorCode === 9999) {
      //   alert(res.data.errorMessage);
      //   navigate("/Masters/FrmBillFreqList");
      // } else {
      //   alert(
      //     res?.data?.errorMessage ||
      //       res?.data?.message ||
      //       "Failed to save bill frequency",
      //   );
      // }
    } catch (error) {
      console.error("Error saving bill frequency:", error);
      alert("API Error — check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Bill Frequency Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Bill Frequency Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        {/* 2 columns per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. BillFreq Name */}
          <div>
            <Label text="BillFreq Name : " required />
            <input
              type="text"
              placeholder="Enter bill frequency name"
              className={`form-input-box ${
                errors.billFreqName ? "border-red-500" : ""
              }`}
              {...register("billFreqName", {
                required: "Bill frequency name is required",
                validate: (v) =>
                  v.trim().length > 0 || "Bill frequency name cannot be empty",
              })}
            />
            {errors.billFreqName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.billFreqName.message}
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
            onClick={() => navigate("/Masters/FrmBillFreqList")}
          >
            Back
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmBillFreqMst;
