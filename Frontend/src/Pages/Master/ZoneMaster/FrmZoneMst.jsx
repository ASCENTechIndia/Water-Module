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
  const wardId = state?.wardId;
  const isEdit = !!zoneId;

  const [ulbOptions, setUlbOptions] = useState([]);
  const [wardOptions, setWardOptions] = useState([]);

  const {
    register,
    handleSubmit,
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
        const res = await apiService.get(
          `/master/getWardName?ulbid=${ulbid}`,
        );

        console.log("res d :", res)
        if (res?.success && Array.isArray(res?.data)) {
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

  // Zone details
  useEffect(() => {
    if (!zoneId || !wardId) return;

    const fetchZoneDetails = async () => {
      try {
        setLoading(true);
        const res = await apiService.get(
          `/master/getZoneDetails?wardId=${wardId}&zoneId=${zoneId}`,
        );

        if (res?.success && res?.data?.length > 0) {
          const d = res.data[0];
          reset({
            ulbId: String(d.NUM_WARD_ULBID || ""),
            wardId: String(d.NUM_ZONE_WARDID || ""),
            zoneName: d.VAR_ZONE_NAME || "",
            zoneCode: d.VAR_ZONE_CODE || "",
            isActive: d.VAR_ZONE_ACTIVEFLAG || "Y",
          });
        } else {
          setTableEmpty();
          alert("Data Not Found");
        }
      } catch (err) {
        console.error("Zone details error:", err);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    const setTableEmpty = () => {
      reset({
        ulbId: String(ulbid || ""),
        wardId: "",
        zoneName: "",
        zoneCode: "",
        isActive: "Y",
      });
    };

    fetchZoneDetails();
  }, [zoneId, wardId, ulbid, reset]);

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
        in_zoneid: isEdit ? Number(zoneId) : null,
        in_zonename: data.zoneName.trim(),
        in_wardid: Number(data.wardId),
        in_zonecode: data.zoneCode.trim(),
        in_activeflag: data.isActive,
        in_ipaddress: ip,
        in_source: config.source,
        in_mode: isEdit ? 2 : 1,
      };

      const res = await apiService.post("/master/aowt_zone_ins", payload);

      if (res?.success && res?.data?.out_errorcode === 9999) {
        alert(res.data.out_errormsg || "Zone saved successfully");
        navigate("/Masters/FrmZoneList");
      } else {
        alert(
          res?.data?.out_errormsg || res?.message || "Failed to Insert or update",
        );
      }
    } catch (err) {
      console.error("Error saving zone:", err);
      alert(err.message);
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

          {/* Zone Name */}
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

          {/* Zone Code */}
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