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

const FrmBlockMst = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const blockId = state?.blockId;
  const isEdit = !!blockId;

  const [ulbOptions, setUlbOptions] = useState([]);
  const [wardOptions, setWardOptions] = useState([]);
  const [zoneOptions, setZoneOptions] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      ulbId: "",
      wardId: "",
      zoneId: "",
      blockName: "",
      blockCode: "",
      isActive: "Y",
    },
  });

  const watchUlbId = watch("ulbId");
  const watchWardId = watch("wardId");

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

  // ---------- Load Ward dropdown when ULB changes (DUMMY) ----------
  useEffect(() => {
    setWardOptions([]);
    setZoneOptions([]);
    setValue("wardId", "");
    setValue("zoneId", "");

    if (!watchUlbId) return;

    // 🔸 DUMMY — replace with apiService.post("getWardDropdown", { ulbId: Number(watchUlbId) })
    const dummyWards = {
      1: [
        { value: "1", label: "प्रभाग क्र. १" },
        { value: "2", label: "प्रभाग क्र. २" },
      ],
      2: [
        { value: "3", label: "प्रभाग क्र. ३" },
        { value: "4", label: "प्रभाग क्र. ४" },
      ],
      3: [{ value: "5", label: "प्रभाग क्र. ५" }],
      4: [{ value: "6", label: "प्रभाग क्र. ६" }],
    };
    setWardOptions(dummyWards[watchUlbId] || []);

    // 🔸 REAL API — uncomment when ready
    // const fetchWards = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.post("getWardDropdown", {
    //       ulbId: Number(watchUlbId),
    //     });
    //     if (res?.data?.success && Array.isArray(res.data.data)) {
    //       setWardOptions(
    //         res.data.data.map((item) => ({
    //           value: String(item.WARDID),
    //           label: item.WARDNAME,
    //         })),
    //       );
    //     } else {
    //       setWardOptions([]);
    //     }
    //   } catch (err) {
    //     console.error("Ward dropdown error:", err);
    //     setWardOptions([]);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchWards();
  }, [watchUlbId, setValue]);

  // ---------- Load Zone dropdown when Ward changes (DUMMY) ----------
  useEffect(() => {
    setZoneOptions([]);
    setValue("zoneId", "");

    if (!watchWardId) return;

    // 🔸 DUMMY — replace with apiService.post("getZoneDropdown", { ulbId: Number(watchUlbId), wardId: Number(watchWardId) })
    const dummyZones = {
      1: [
        { value: "1", label: "विभाग क्र. १" },
        { value: "2", label: "विभाग क्र. २" },
      ],
      2: [{ value: "3", label: "विभाग क्र. ३" }],
      3: [{ value: "4", label: "विभाग क्र. ४" }],
      4: [{ value: "5", label: "विभाग क्र. ५" }],
      5: [{ value: "6", label: "विभाग क्र. ६" }],
      6: [{ value: "7", label: "विभाग क्र. ७" }],
    };
    setZoneOptions(dummyZones[watchWardId] || []);

    // 🔸 REAL API — uncomment when ready
    // const fetchZones = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.post("getZoneDropdown", {
    //       ulbId: Number(watchUlbId),
    //       wardId: Number(watchWardId),
    //     });
    //     if (res?.data?.success && Array.isArray(res.data.data)) {
    //       setZoneOptions(
    //         res.data.data.map((item) => ({
    //           value: String(item.ZONEID),
    //           label: item.ZONENAME,
    //         })),
    //       );
    //     } else {
    //       setZoneOptions([]);
    //     }
    //   } catch (err) {
    //     console.error("Zone dropdown error:", err);
    //     setZoneOptions([]);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchZones();
  }, [watchWardId, watchUlbId, setValue]);

  // ---------- Load detail in edit mode (DUMMY) ----------
  useEffect(() => {
    if (!blockId) return;

    // 🔸 DUMMY — replace with apiService.post("getBlockDetail", { blockId: Number(blockId) })
    const dummyDetail = {
      NUM_BLOCK_ID: blockId,
      NUM_ULB_ID: "1",
      NUM_WARD_ID: "1",
      NUM_ZONE_ID: "1",
      VAR_BLOCK_NAME: "ब्लॉक क्र. १",
      VAR_BLOCK_CODE: "BLK-A",
      FLG_ISACTIVE: "Y",
    };

    reset({
      ulbId: String(dummyDetail.NUM_ULB_ID || ""),
      wardId: String(dummyDetail.NUM_WARD_ID || ""),
      zoneId: String(dummyDetail.NUM_ZONE_ID || ""),
      blockName: dummyDetail.VAR_BLOCK_NAME || "",
      blockCode: dummyDetail.VAR_BLOCK_CODE || "",
      isActive: dummyDetail.FLG_ISACTIVE || "Y",
    });

    // 🔸 REAL API — uncomment when ready
    // const fetchDetail = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.post("getBlockDetail", {
    //       blockId: Number(blockId),
    //     });
    //     if (res?.data?.success && res?.data?.data?.length > 0) {
    //       const d = res.data.data[0];
    //       reset({
    //         ulbId: String(d.NUM_ULB_ID || ""),
    //         wardId: String(d.NUM_WARD_ID || ""),
    //         zoneId: String(d.NUM_ZONE_ID || ""),
    //         blockName: d.VAR_BLOCK_NAME || "",
    //         blockCode: d.VAR_BLOCK_CODE || "",
    //         isActive: d.FLG_ISACTIVE || "Y",
    //       });
    //     } else {
    //       alert(res?.data?.errorMessage || "Block detail not found");
    //     }
    //   } catch (err) {
    //     console.error("Block detail error:", err);
    //     alert("Failed to fetch block detail.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchDetail();
  }, [blockId, reset]);

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
        in_BlockId: isEdit ? Number(blockId) : null,
        in_UlbId: Number(data.ulbId),
        in_WardId: Number(data.wardId),
        in_ZoneId: Number(data.zoneId),
        in_BlockName: data.blockName.trim(),
        in_BlockCode: data.blockCode.trim(),
        in_IsActive: data.isActive,
        in_ipaddress: ip,
        in_source: config.source,
      };

      // 🔸 DUMMY — replace with real endpoint when ready
      console.log("Block payload →", payload);
      alert("Saved successfully (dummy)");
      navigate("/Masters/FrmBlockList");

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.post("aoio_block_ins", payload);
      // if (res?.data?.success && res?.data?.errorCode === 9999) {
      //   alert(res.data.errorMessage);
      //   navigate("/Masters/FrmBlockList");
      // } else {
      //   alert(
      //     res?.data?.errorMessage ||
      //       res?.data?.message ||
      //       "Failed to save block",
      //   );
      // }
    } catch (error) {
      console.error("Error saving block:", error);
      alert("API Error — check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Block Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Block Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        {/* 2 columns per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. ULB */}
          <div>
            <Label text="नगरपालिका : " required />
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

          {/* 2. Ward */}
          <div>
            <Label text="प्रभागाचे नाव : " required />
            <select
              disabled={!watchUlbId}
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${!watchUlbId ? "bg-slate-100 cursor-not-allowed" : ""}
                ${errors.wardId ? "border-red-500" : ""}`}
              {...register("wardId", { required: "Ward name is required" })}
            >
              <option value="">
                {watchUlbId ? "-- Select Ward --" : "-- Select ULB first --"}
              </option>
              {wardOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.wardId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.wardId.message}
              </p>
            )}
          </div>

          {/* 3. Zone */}
          <div>
            <Label text="विभागाचे नाव : " required />
            <select
              disabled={!watchWardId}
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${!watchWardId ? "bg-slate-100 cursor-not-allowed" : ""}
                ${errors.zoneId ? "border-red-500" : ""}`}
              {...register("zoneId", { required: "Zone name is required" })}
            >
              <option value="">
                {watchWardId ? "-- Select Zone --" : "-- Select Ward first --"}
              </option>
              {zoneOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.zoneId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.zoneId.message}
              </p>
            )}
          </div>

          {/* 4. Block Name */}
          <div>
            <Label text="Block Name : " required />
            <input
              type="text"
              placeholder="Enter block name"
              className={`form-input-box ${
                errors.blockName ? "border-red-500" : ""
              }`}
              {...register("blockName", {
                required: "Block name is required",
                validate: (v) =>
                  v.trim().length > 0 || "Block name cannot be empty",
              })}
            />
            {errors.blockName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.blockName.message}
              </p>
            )}
          </div>

          {/* 5. Block Code */}
          <div>
            <Label text="Block Code : " required />
            <input
              type="text"
              placeholder="Enter block code"
              className={`form-input-box ${
                errors.blockCode ? "border-red-500" : ""
              }`}
              {...register("blockCode", {
                required: "Block code is required",
                validate: (v) =>
                  v.trim().length > 0 || "Block code cannot be empty",
              })}
            />
            {errors.blockCode && (
              <p className="text-sm text-red-500 mt-1">
                {errors.blockCode.message}
              </p>
            )}
          </div>

          {/* 6. Active — radio */}
          <div>
            <Label text="सक्रिय : " required />
            <div className="flex flex-wrap items-center gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                <input
                  type="radio"
                  value="Y"
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                  {...register("isActive", {
                    required: "Active status is required",
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
                    required: "Active status is required",
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
            onClick={() => navigate("/Masters/FrmBlockList")}
          >
            Back
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmBlockMst;
