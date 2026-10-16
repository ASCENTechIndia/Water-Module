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
  const [tipDetail, setTipDetail] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      ulbId: "",
      type: "",
      slogan: "",
      tip: "",
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

  // ULB Tip details
  useEffect(() => {
    if (!tipId) return;

    const fetchTipDetails = async () => {
      try {
        setLoading(true);
        const res = await apiService.get(
          `/master/getUlbTipDetails?tipId=${tipId}`,
        );
        if (res?.success && res?.data?.length > 0) {
          setTipDetail(res.data[0]);
        } else {
          alert("Data Not Found");
        }
      } catch (err) {
        console.error("Ulb tip details error:", err);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTipDetails();
  }, [tipId]);

  // Prefill fields
  useEffect(() => {
    if (!tipDetail) return;

    setValue("type", tipDetail.VAR_ULBTIP_TYPE || "");
    setValue("slogan", tipDetail.VAR_ULBTIP_SLOGAN || "");
    setValue("tip", tipDetail.VAR_ULBTIP_TIP || "");
  }, [tipDetail, setValue]);

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
        in_ulbid: Number(ulbid),
        in_ulbtipid: isEdit ? Number(tipId) : null,
        in_tip: data.tip.trim(),
        in_slogan: data.slogan.trim(),
        in_status: "Y",
        in_ipaddress: ip,
        in_source: config.source,
        in_mode: isEdit ? 2 : 1,
        in_type: data.type,
      };

      const res = await apiService.post("/master/aowt_ulbtip_ins", payload);

      if (res?.success && res?.data?.out_errorcode === 9999) {
        alert(res.data.out_errormsg || "Record saved successfully");
        navigate("/Masters/FrmUlbTipList");
      } else {
        alert(
          res?.data?.out_errormsg ||
            res?.message ||
            "Failed to Insert or update",
        );
      }
    } catch (err) {
      console.error("Error saving ulb tip:", err);
      alert(err.message);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ULB */}
          <div>
            <Label text="नगरपालिकेचे नाव : " required />
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

          {/* Type */}
          <div>
            <Label text="Type : " required />
            <div className="flex flex-wrap items-center gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                <input
                  type="radio"
                  value="B"
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                  {...register("type", { required: "Type is required" })}
                />
                <span>Bill</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                <input
                  type="radio"
                  value="R"
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

          {/* Slogan */}
          <div>
            <Label text="Slogan : " required />
            <textarea
              rows={4}
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

          {/* Tip */}
          <div>
            <Label text="Tip : " required />
            <textarea
              rows={4}
              placeholder="Enter tip"
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
