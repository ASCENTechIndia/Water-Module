import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Layout from "../../../Components/Layout";
import Label from "../../../Components/Label";
import Button from "../../../Components/Button";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";
import apiService from "../../../../apiService.js";
import GetIPAddress from "../../../utils/ipHelper.jsx";
import config from "../../../utils/config.jsx";

const FrmUserAccessNewMst = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const [ulbOptions, setUlbOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [mainMenuOptions, setMainMenuOptions] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      ulbId: "",
      userId: "",
      mainMenuId: "",
    },
  });

  const watchUlbId = watch("ulbId");

  // ---------- ULB dropdown (DUMMY) ----------
  useEffect(() => {
    // 🔸 DUMMY — replace with apiService.get("getUlbDropdown") later
    setUlbOptions([
      { value: "1", label: "Pune Municipal Corporation" },
      { value: "2", label: "Mumbai Municipal Corporation" },
      { value: "3", label: "Nashik Municipal Corporation" },
      { value: "4", label: "Nagpur Municipal Corporation" },
    ]);

    // 🔸 REAL API — uncomment when ready
    // const fetchUlb = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.get("getUlbDropdown");
    //     if (res?.data?.success && Array.isArray(res.data.data)) {
    //       setUlbOptions(
    //         res.data.data.map((item) => ({
    //           value: String(item.CORPORATIONID),
    //           label: item.CORPORATIONNAME,
    //         })),
    //       );
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
  }, []);

  // ---------- Main Menu dropdown (DUMMY) ----------
  useEffect(() => {
    // 🔸 DUMMY — replace with apiService.get("getMainMenuDropdown") later
    setMainMenuOptions([
      { value: "1", label: "Master" },
      { value: "2", label: "Configuration" },
      { value: "3", label: "Inward" },
      { value: "4", label: "Outward" },
      { value: "5", label: "Reports" },
    ]);
  }, []);

  // ---------- User dropdown — reloads when ULB changes (DUMMY) ----------
  useEffect(() => {
    setUserOptions([]);
    setValue("userId", "");

    if (!watchUlbId) return;

    // 🔸 DUMMY — replace with apiService.post("getUserDropdown", { ulbId: Number(watchUlbId) })
    const dummyUsers = {
      1: [
        { value: "1001", label: "Rahul Sharma" },
        { value: "1002", label: "Priya Patil" },
      ],
      2: [
        { value: "2001", label: "Amit Deshmukh" },
        { value: "2002", label: "Sneha Joshi" },
      ],
      3: [{ value: "3001", label: "Vikram Rane" }],
      4: [{ value: "4001", label: "Pooja Kale" }],
    };
    setUserOptions(dummyUsers[watchUlbId] || []);

    // 🔸 REAL API — uncomment when ready
    // const fetchUsers = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.post("getUserDropdown", {
    //       ulbId: Number(watchUlbId),
    //     });
    //     if (res?.data?.success && Array.isArray(res.data.data)) {
    //       setUserOptions(
    //         res.data.data.map((item) => ({
    //           value: String(item.USERID),
    //           label: item.USERNAME,
    //         })),
    //       );
    //     } else {
    //       setUserOptions([]);
    //     }
    //   } catch (err) {
    //     console.error("User dropdown error:", err);
    //     setUserOptions([]);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchUsers();
  }, [watchUlbId, setValue]);

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
        in_Mode: 1,
        in_UlbId: Number(data.ulbId),
        in_AccessUserId: Number(data.userId),
        in_MainMenuId: Number(data.mainMenuId),
        in_ipaddress: ip,
        in_source: config.source,
      };

      // 🔸 DUMMY — replace with real endpoint when ready
      console.log("User Access payload →", payload);
      alert("Saved successfully (dummy)");
      navigate("/Masters/FrmUserAccessNewList");

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.post("aoio_useraccess_ins", payload);
      // if (res?.data?.success && res?.data?.errorCode === 9999) {
      //   alert(res.data.errorMessage);
      //   navigate("/Masters/FrmUserAccessNewList");
      // } else {
      //   alert(
      //     res?.data?.errorMessage ||
      //       res?.data?.message ||
      //       "Failed to save user access",
      //   );
      // }
    } catch (error) {
      console.error("Error saving user access:", error);
      alert("API Error — check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="User Access Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "User Access Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ULB Name */}
          <div>
            <Label text="ULB Name : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${errors.ulbId ? "border-red-500" : ""}`}
              {...register("ulbId", { required: "ULB is required" })}
            >
              <option value="">-- Select ULB --</option>
              {ulbOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.ulbId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.ulbId.message}
              </p>
            )}
          </div>

          {/* User Name */}
          <div>
            <Label text="User Name : " required />
            <select
              disabled={!watchUlbId}
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${!watchUlbId ? "bg-slate-100 cursor-not-allowed" : ""}
                ${errors.userId ? "border-red-500" : ""}`}
              {...register("userId", { required: "User is required" })}
            >
              <option value="">
                {watchUlbId ? "-- Select User --" : "-- Select ULB first --"}
              </option>
              {userOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.userId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.userId.message}
              </p>
            )}
          </div>

          {/* Main Menu */}
          <div>
            <Label text="Main Menu : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${errors.mainMenuId ? "border-red-500" : ""}`}
              {...register("mainMenuId", {
                required: "Main menu is required",
              })}
            >
              <option value="">-- Select Main Menu --</option>
              {mainMenuOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.mainMenuId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.mainMenuId.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <Button type="submit" disabled={isSubmitting}>
            Submit
          </Button>
          <Button
            type="button"
            onClick={() => navigate("/Masters/FrmUserAccessNewList")}
          >
            Back
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmUserAccessNewMst;
