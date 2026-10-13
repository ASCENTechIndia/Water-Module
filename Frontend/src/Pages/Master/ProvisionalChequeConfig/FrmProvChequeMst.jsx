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

const FrmProvChequeMst = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const provChequeId = state?.provChequeId;
  const isEdit = !!provChequeId;

  const [ulbOptions, setUlbOptions] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      ulbId: "",
      connoFlag: "Y", // ✅ Yes by default
    },
  });

  // ---------- Load ULB dropdown (DUMMY) ----------
  useEffect(() => {
    // 🔸 DUMMY — replace with apiService.get("getUlbDropdown") later
    const dummyUlbs = [
      { value: "1", label: "Pune Municipal Corporation" },
      { value: "2", label: "Mumbai Municipal Corporation" },
      { value: "3", label: "Nashik Municipal Corporation" },
      { value: "4", label: "Nagpur Municipal Corporation" },
    ];
    setUlbOptions(dummyUlbs);

    // Auto-select first ULB by default
    if (dummyUlbs.length > 0) {
      setValue("ulbId", dummyUlbs[0].value);
    }

    // 🔸 REAL API — uncomment when ready
    // const fetchUlb = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.get("getUlbDropdown");
    //     if (res?.data?.success && Array.isArray(res.data.data)) {
    //       const opts = res.data.data.map((item) => ({
    //         value: String(item.CORPORATIONID),
    //         label: item.CORPORATIONNAME,
    //       }));
    //       setUlbOptions(opts);
    //     } else {
    //       setUlbOptions([]);
    //     }
    //   } catch (err) {
    //     console.error("ULB dropdown error:", err);
    //     setUlbOptions([]);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchUlb();
  }, [setValue]);

  // ---------- Load detail in edit mode (DUMMY) ----------
  useEffect(() => {
    if (!provChequeId) return;

    // 🔸 DUMMY — replace with apiService.post("getProvChequeDetail", { provChequeId: Number(provChequeId) })
    const dummyDetail = {
      NUM_PROVCHEQUE_ID: provChequeId,
      NUM_ULB_ID: "1",
      FLG_CONNO: "Y",
    };

    reset({
      ulbId: String(dummyDetail.NUM_ULB_ID || ""),
      connoFlag: dummyDetail.FLG_CONNO || "Y",
    });

    // 🔸 REAL API — uncomment when ready
    // const fetchDetail = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.post("getProvChequeDetail", {
    //       provChequeId: Number(provChequeId),
    //     });
    //     if (res?.data?.success && res?.data?.data?.length > 0) {
    //       const d = res.data.data[0];
    //       reset({
    //         ulbId: String(d.NUM_ULB_ID || ""),
    //         connoFlag: d.FLG_CONNO || "Y",
    //       });
    //     } else {
    //       alert(res?.data?.errorMessage || "Prov cheque detail not found");
    //     }
    //   } catch (err) {
    //     console.error("Prov cheque detail error:", err);
    //     alert("Failed to fetch prov cheque detail.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchDetail();
  }, [provChequeId, reset]);

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
        in_ProvChequeId: isEdit ? Number(provChequeId) : null,
        in_UlbId: Number(data.ulbId),
        in_ConnoFlag: data.connoFlag,
        in_ipaddress: ip,
        in_source: config.source,
      };

      // 🔸 DUMMY — replace with real endpoint when ready
      console.log("Prov Cheque payload →", payload);
      alert("Saved successfully (dummy)");
      navigate("/Masters/FrmProvChequeList");

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.post("aoio_provcheque_ins", payload);
      // if (res?.data?.success && res?.data?.errorCode === 9999) {
      //   alert(res.data.errorMessage);
      //   navigate("/Masters/FrmProvChequeList");
      // } else {
      //   alert(
      //     res?.data?.errorMessage ||
      //       res?.data?.message ||
      //       "Failed to save prov cheque",
      //   );
      // }
    } catch (error) {
      console.error("Error saving prov cheque:", error);
      alert("API Error — check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Prov Cheque Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Prov Cheque Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        {/* 2 columns per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. ULB Name */}
          <div>
            <Label text="ULB Name : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${errors.ulbId ? "border-red-500" : ""}`}
              {...register("ulbId", { required: "ULB name is required" })}
            >
              <option value="">-- Select ULB --</option>
              {ulbOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.ulbId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.ulbId.message}
              </p>
            )}
          </div>

          {/* 2. Conno Flag — radio (Yes default) */}
          <div>
            <Label text="Conno Flag : " required />
            <div className="flex flex-wrap items-center gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                <input
                  type="radio"
                  value="Y"
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                  {...register("connoFlag", {
                    required: "Conno flag is required",
                  })}
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                <input
                  type="radio"
                  value="N"
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                  {...register("connoFlag", {
                    required: "Conno flag is required",
                  })}
                />
                <span>No</span>
              </label>
            </div>
            {errors.connoFlag && (
              <p className="text-sm text-red-500 mt-1">
                {errors.connoFlag.message}
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
            onClick={() => navigate("/Masters/FrmProvChequeList")}
          >
            Back
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmProvChequeMst;
