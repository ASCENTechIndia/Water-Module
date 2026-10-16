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
    getValues,
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

  const watchWardId = watch("wardId");

  // ULB dropdown
  useEffect(() => {
    const fetchUlbDropdown = async () => {
      try {
        setLoading(true);
        const res = await apiService.get("/master/getUlbDropdownController");
        if (res?.success && Array.isArray(res.data)) {
          setUlbOptions(
            res.data.map((item) => ({
              value: String(item.CORPORATIONID),
              label: item.CORPORATIONNAME,
            })),
          );
        } else {
          setUlbOptions([]);
        }
      } catch (err) {
        console.error("ULB dropdown error:", err);
        alert(err.message);
        setUlbOptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUlbDropdown();
  }, []);

  // Auto-select ULB
  useEffect(() => {
    if (ulbid && ulbOptions.length > 0) {
      const match = ulbOptions.find((o) => o.value === String(ulbid));
      if (match) {
        setValue("ulbId", match.value);
      }
    }
  }, [ulbid, ulbOptions, setValue]);

  // Ward dropdown
  useEffect(() => {
    if (!ulbid) return;

    const fetchWardDropdown = async () => {
      try {
        setLoading(true);
        const res = await apiService.get(`/master/getWardName?ulbid=${ulbid}`);
        if (res?.success && Array.isArray(res.data)) {
          setWardOptions(
            res.data.map((item) => ({
              value: String(item.NUM_WARD_ID),
              label: item.VAR_WARD_NAME,
            })),
          );
        } else {
          setWardOptions([]);
        }
      } catch (err) {
        console.error("Ward dropdown error:", err);
        alert(err.message);
        setWardOptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWardDropdown();
  }, [ulbid]);

  // Zone dropdown
  useEffect(() => {
    if (!watchWardId) {
      setZoneOptions([]);
      return;
    }

    const fetchZoneDropdown = async () => {
      try {
        setLoading(true);
        const res = await apiService.get(
          `/master/getZoneDropdown?wardId=${watchWardId}`,
        );
        if (res?.success && Array.isArray(res.data)) {
          setZoneOptions(
            res.data.map((item) => ({
              value: String(item.NUM_ZONE_ID),
              label: item.VAR_ZONE_NAME,
            })),
          );
        } else {
          setZoneOptions([]);
        }
      } catch (err) {
        console.error("Zone dropdown error:", err);
        alert(err.message);
        setZoneOptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchZoneDropdown();
  }, [watchWardId, getValues, setValue]);

  useEffect(() => {
    if (!isEdit) return;
    setValue("blockName", state?.blockName || "");
    setValue("blockCode", state?.blockCode || "");
    setValue("isActive", state?.flag === "Yes" ? "Y" : "N");
  }, [isEdit, state, setValue]);

  useEffect(() => {
    if (!isEdit || wardOptions.length === 0) return;
    const wid = String(state?.wardId || "");
    if (wardOptions.some((o) => o.value === wid)) {
      setValue("wardId", wid);
    }
  }, [isEdit, wardOptions, state, setValue]);

  useEffect(() => {
    if (!isEdit || zoneOptions.length === 0) return;
    const zid = String(state?.zoneId || "");
    if (zoneOptions.some((o) => o.value === zid)) {
      setValue("zoneId", zid);
    }
  }, [isEdit, zoneOptions, state, setValue]);

  // Submit
  const onSubmit = async (data) => {
    if (!userId || !ulbid) {
      alert("User Id or Ulb Id is not set");
      return;
    }

    try {
      setLoading(true);
      const ip = await GetIPAddress();

      const payload = {
        in_userid: userId,
        in_blockid: isEdit ? Number(blockId) : null,
        in_blockname: data.blockName.trim(),
        in_zoneid: Number(data.zoneId) || null,
        in_blockcode: data.blockCode.trim(),
        in_activeflag: data.isActive,
        in_ipaddress: ip,
        in_source: config.source,
        in_mode: isEdit ? 2 : 1,
      };

      const res = await apiService.post("/master/aowt_block_ins", payload);

      if (res?.success && res?.data?.out_errorcode === 9999) {
        alert(res.data.out_errormsg || "Block saved successfully");
        navigate("/Masters/FrmBlockList");
      } else {
        alert(
          res?.data?.out_errormsg ||
            res?.message ||
            "Failed to Insert or update",
        );
      }
    } catch (err) {
      console.error("Error saving block:", err);
      alert(err.message);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ULB */}
          <div>
            <Label text="नगरपालिका : " required />
            <select
              disabled
              className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                bg-slate-100 cursor-not-allowed"
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

          {/* Ward */}
          <div>
            <Label text="प्रभागाचे नाव : " required />
            <select
              disabled={isEdit}
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${isEdit ? "bg-slate-100 cursor-not-allowed" : ""}
                ${errors.wardId ? "border-red-500" : ""}`}
              {...register("wardId", { required: "Ward name is required" })}
            >
              <option value="">-- Select Ward --</option>
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

          {/* Zone */}
          <div>
            <Label text="विभागाचे नाव : " required />
            <select
              disabled={isEdit}
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${isEdit ? "bg-slate-100 cursor-not-allowed" : ""}
                ${errors.zoneId ? "border-red-500" : ""}`}
              {...register("zoneId", { required: "Zone name is required" })}
            >
              <option value="">
                {isEdit
                  ? "-- Zone --"
                  : watchWardId
                    ? "-- Select Zone --"
                    : "-- Select Ward first --"}
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

          {/* Block Name */}
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

          {/* Block Code */}
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

          {/* Active */}
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
