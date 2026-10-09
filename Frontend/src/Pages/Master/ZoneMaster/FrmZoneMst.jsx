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

const FrmZoneMst = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const zoneId = state?.zoneId;
  const isEdit = !!zoneId;

  const [ulbOptions, setUlbOptions] = useState([]);
  const [wardOptions, setWardOptions] = useState([]);

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
      zoneName: "",
      zoneCode: "",
      isActive: "Y",
    },
  });

  const watchUlbId = watch("ulbId");

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

  // ---------- Load Ward dropdown when ULB changes (DUMMY) ----------
  useEffect(() => {
    setWardOptions([]);
    setValue("wardId", "");

    if (!watchUlbId) return;

    // 🔸 DUMMY — replace with apiService.post("getWardDropdown", { ulbId: Number(watchUlbId) })
    const dummyWards = {
      1: [
        { value: "1", label: "प्रभाग क्र. १" },
        { value: "2", label: "प्रभाग क्र. २" },
        { value: "3", label: "प्रभाग क्र. ३" },
      ],
      2: [
        { value: "4", label: "प्रभाग क्र. ४" },
        { value: "5", label: "प्रभाग क्र. ५" },
      ],
      3: [{ value: "6", label: "प्रभाग क्र. ६" }],
      4: [{ value: "7", label: "प्रभाग क्र. ७" }],
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

  // ---------- Load detail in edit mode (DUMMY) ----------
  useEffect(() => {
    if (!zoneId) return;

    // 🔸 DUMMY — replace with apiService.post("getZoneDetail", { zoneId: Number(zoneId) })
    const dummyDetail = {
      NUM_ZONE_ID: zoneId,
      NUM_ULB_ID: "1",
      NUM_WARD_ID: "1",
      VAR_ZONE_NAME: "विभाग क्र. १",
      VAR_ZONE_CODE: "ZONE-A",
      FLG_ISACTIVE: "Y",
    };

    reset({
      ulbId: String(dummyDetail.NUM_ULB_ID || ""),
      wardId: String(dummyDetail.NUM_WARD_ID || ""),
      zoneName: dummyDetail.VAR_ZONE_NAME || "",
      zoneCode: dummyDetail.VAR_ZONE_CODE || "",
      isActive: dummyDetail.FLG_ISACTIVE || "Y",
    });

    // 🔸 REAL API — uncomment when ready
    // const fetchDetail = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.post("getZoneDetail", {
    //       zoneId: Number(zoneId),
    //     });
    //     if (res?.data?.success && res?.data?.data?.length > 0) {
    //       const d = res.data.data[0];
    //       reset({
    //         ulbId: String(d.NUM_ULB_ID || ""),
    //         wardId: String(d.NUM_WARD_ID || ""),
    //         zoneName: d.VAR_ZONE_NAME || "",
    //         zoneCode: d.VAR_ZONE_CODE || "",
    //         isActive: d.FLG_ISACTIVE || "Y",
    //       });
    //     } else {
    //       alert(res?.data?.errorMessage || "Zone detail not found");
    //     }
    //   } catch (err) {
    //     console.error("Zone detail error:", err);
    //     alert("Failed to fetch zone detail.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchDetail();
  }, [zoneId, reset]);

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
        in_ZoneId: isEdit ? Number(zoneId) : null,
        in_UlbId: Number(data.ulbId),
        in_WardId: Number(data.wardId),
        in_ZoneName: data.zoneName.trim(),
        in_ZoneCode: data.zoneCode.trim(),
        in_IsActive: data.isActive,
        in_ipaddress: ip,
        in_source: config.source,
      };

      // 🔸 DUMMY — replace with real endpoint when ready
      console.log("Zone payload →", payload);
      alert("Saved successfully (dummy)");
      navigate("/Masters/FrmZoneList");

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.post("aoio_zone_ins", payload);
      // if (res?.data?.success && res?.data?.errorCode === 9999) {
      //   alert(res.data.errorMessage);
      //   navigate("/Masters/FrmZoneList");
      // } else {
      //   alert(
      //     res?.data?.errorMessage ||
      //       res?.data?.message ||
      //       "Failed to save zone",
      //   );
      // }
    } catch (error) {
      console.error("Error saving zone:", error);
      alert("API Error — check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Zone Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Zone Master",
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

          {/* 3. Zone Name */}
          <div>
            <Label text="विभागाचे नाव : " required />
            <input
              type="text"
              placeholder="विभागाचे नाव प्रविष्ट करा"
              className={`form-input-box ${
                errors.zoneName ? "border-red-500" : ""
              }`}
              {...register("zoneName", {
                required: "Zone name is required",
                validate: (v) =>
                  v.trim().length > 0 || "Zone name cannot be empty",
              })}
            />
            {errors.zoneName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.zoneName.message}
              </p>
            )}
          </div>

          {/* 4. Zone Code — anything allowed */}
          <div>
            <Label text="विभाग कोड : " required />
            <input
              type="text"
              placeholder="विभाग कोड प्रविष्ट करा"
              className={`form-input-box ${
                errors.zoneCode ? "border-red-500" : ""
              }`}
              {...register("zoneCode", {
                required: "Zone code is required",
                validate: (v) =>
                  v.trim().length > 0 || "Zone code cannot be empty",
              })}
            />
            {errors.zoneCode && (
              <p className="text-sm text-red-500 mt-1">
                {errors.zoneCode.message}
              </p>
            )}
          </div>

          {/* 5. Active — radio */}
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
                <span>होय</span>
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
                <span>नाही</span>
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
            onClick={() => navigate("/Masters/FrmZoneList")}
          >
            Back
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmZoneMst;
