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

const FrmUlbTipMst = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const tipId = state?.tipId;
  const isEdit = !!tipId;

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
      type: "",
      slogan: "",
      tip: "",
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

    // Auto-select first ULB
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
    if (!tipId) return;

    // 🔸 DUMMY — replace with apiService.post("getUlbTipDetail", { tipId: Number(tipId) })
    const dummyDetail = {
      NUM_TIP_ID: tipId,
      NUM_ULB_ID: "1",
      VAR_TYPE: "Bill",
      VAR_SLOGAN: "Save Water, Save Life.",
      VAR_TIP: "Please pay your water bill on time.",
    };

    reset({
      ulbId: String(dummyDetail.NUM_ULB_ID || ""),
      type: dummyDetail.VAR_TYPE || "",
      slogan: dummyDetail.VAR_SLOGAN || "",
      tip: dummyDetail.VAR_TIP || "",
    });

    // 🔸 REAL API — uncomment when ready
    // const fetchDetail = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.post("getUlbTipDetail", {
    //       tipId: Number(tipId),
    //     });
    //     if (res?.data?.success && res?.data?.data?.length > 0) {
    //       const d = res.data.data[0];
    //       reset({
    //         ulbId: String(d.NUM_ULB_ID || ""),
    //         type: d.VAR_TYPE || "",
    //         slogan: d.VAR_SLOGAN || "",
    //         tip: d.VAR_TIP || "",
    //       });
    //     } else {
    //       alert(res?.data?.errorMessage || "ULB tip detail not found");
    //     }
    //   } catch (err) {
    //     console.error("ULB tip detail error:", err);
    //     alert("Failed to fetch ULB tip detail.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchDetail();
  }, [tipId, reset]);

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
        in_TipId: isEdit ? Number(tipId) : null,
        in_UlbId: Number(data.ulbId),
        in_Type: data.type,
        in_Slogan: data.slogan.trim(),
        in_Tip: data.tip.trim(),
        in_ipaddress: ip,
        in_source: config.source,
      };

      // 🔸 DUMMY — replace with real endpoint when ready
      console.log("ULB Tip payload →", payload);
      alert("Saved successfully (dummy)");
      navigate("/Masters/FrmUlbTipList");

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.post("aoio_ulbtip_ins", payload);
      // if (res?.data?.success && res?.data?.errorCode === 9999) {
      //   alert(res.data.errorMessage);
      //   navigate("/Masters/FrmUlbTipList");
      // } else {
      //   alert(
      //     res?.data?.errorMessage ||
      //       res?.data?.message ||
      //       "Failed to save ULB tip",
      //   );
      // }
    } catch (error) {
      console.error("Error saving ULB tip:", error);
      alert("API Error — check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="ULB Tip Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "ULB Tip Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        {/* 2 columns per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. ULB */}
          <div>
            <Label text="नगरपालिकेचे नाव : " required />
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

          {/* 2. Type — radio */}
          <div>
            <Label text="Type : " required />
            <div className="flex flex-wrap items-center gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                <input
                  type="radio"
                  value="Bill"
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                  {...register("type", { required: "Type is required" })}
                />
                <span>Bill</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                <input
                  type="radio"
                  value="Receipt"
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                  {...register("type", { required: "Type is required" })}
                />
                <span>Receipt</span>
              </label>
            </div>
            {errors.type && (
              <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>
            )}
          </div>

          {/* 3. Slogan */}
          <div>
            <Label text="Slogan : " required />
            <textarea
              rows={4}
              style={{ height: "150px" }}
              placeholder="Enter slogan"
              className={`form-input-box w-full ${
                errors.slogan ? "border-red-500" : ""
              }`}
              {...register("slogan", {
                required: "Slogan is required",
                validate: (v) =>
                  v.trim().length > 0 || "Slogan cannot be empty",
              })}
            />
            {errors.slogan && (
              <p className="text-sm text-red-500 mt-1">
                {errors.slogan.message}
              </p>
            )}
          </div>

          {/* 4. Tip */}
          <div>
            <Label text="Tip : " required />
            <textarea
              rows={4}
              placeholder="Enter tip"
              style={{ height: "150px" }}
              className={`form-input-box w-full ${
                errors.tip ? "border-red-500" : ""
              }`}
              {...register("tip", {
                required: "Tip is required",
                validate: (v) => v.trim().length > 0 || "Tip cannot be empty",
              })}
            />
            {errors.tip && (
              <p className="text-sm text-red-500 mt-1">{errors.tip.message}</p>
            )}
          </div>
        </div>

        {/* ---------- Buttons ---------- */}
        <div className="flex justify-center gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isEdit ? "Update" : "Submit"}
          </Button>
          <Button
            type="button"
            onClick={() => navigate("/Masters/FrmUlbTipList")}
          >
            Back
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmUlbTipMst;
