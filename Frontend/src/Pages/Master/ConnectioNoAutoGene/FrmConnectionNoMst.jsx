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

const FrmConnectionNoMst = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const connogenId = state?.connogenId;
  const isEdit = !!connogenId;

  const [ulbOptions, setUlbOptions] = useState([]);
  const [connogenDetail, setConnogenDetail] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      ulbId: "",
      connFlag: "Y",
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

  // Conn auto generate details (edit mode)
  useEffect(() => {
    if (!connogenId) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await apiService.get(
          `/master/getConnAutoGerateDetails?connId=${connogenId}`,
        );
        if (res?.success && res?.data?.length > 0) {
          setConnogenDetail(res.data[0]);
        } else {
          alert(res?.message || "Data Not Found");
        }
      } catch (err) {
        console.error("Conn auto generate details error:", err);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [connogenId]);

  // Prefill flag
  useEffect(() => {
    if (!connogenDetail) return;
    setValue("connFlag", connogenDetail.NUM_CONNOGEN_FLAG || "Y");
  }, [connogenDetail, setValue]);

  // Prefill ULB
  useEffect(() => {
    if (!connogenDetail || ulbOptions.length === 0) return;
    const id = String(connogenDetail.NUM_CONNOGEN_ULBID || "");
    if (ulbOptions.some((o) => o.value === id)) {
      setValue("ulbId", id);
    }
  }, [connogenDetail, ulbOptions, setValue]);

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
        in_UserId: userId,
        in_Connoid: isEdit ? Number(connogenId) : null,
        in_ulbid: Number(data.ulbId),
        in_activeflag: data.connFlag,
        in_ipaddress: ip,
        in_source: config.source,
        in_Mode: isEdit ? 2 : 1,
      };

      const res = await apiService.post(
        "/master/aowt_connectionnoconfig_ins",
        payload,
      );

      if (res?.success && res?.data?.Out_errorCode === 9999) {
        alert(res.data.Out_ErrorMsg || "Record saved successfully");
        navigate("/Masters/FrmConnectionNoList");
      } else {
        alert(
          res?.data?.Out_ErrorMsg ||
            res?.message ||
            "Failed to Insert or update",
        );
      }
    } catch (err) {
      console.error("Error saving conn auto generate config:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Connection No Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Connection No Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ULB Name — user selects */}
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

          {/* Connection Flag */}
          <div>
            <Label text="Connection Flag : " required />
            <div className="flex flex-wrap items-center gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                <input
                  type="radio"
                  value="Y"
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                  {...register("connFlag", {
                    required: "Connection flag is required",
                  })}
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                <input
                  type="radio"
                  value="N"
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                  {...register("connFlag", {
                    required: "Connection flag is required",
                  })}
                />
                <span>No</span>
              </label>
            </div>
            {errors.connFlag && (
              <p className="text-sm text-red-500 mt-1">
                {errors.connFlag.message}
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
            onClick={() => navigate("/Masters/FrmConnectionNoList")}
          >
            Back
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmConnectionNoMst;
