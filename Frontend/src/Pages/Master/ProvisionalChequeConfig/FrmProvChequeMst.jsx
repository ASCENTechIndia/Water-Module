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
  const [provChequeDetail, setProvChequeDetail] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      ulbId: "",
      connoFlag: "Y",
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

  // Prov cheque details (edit mode)
  useEffect(() => {
    if (!provChequeId) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await apiService.get(
          `/master/getProvisionalDetails?provChequeId=${provChequeId}`,
        );
        if (res?.success && res?.data?.length > 0) {
          setProvChequeDetail(res.data[0]);
        } else {
          alert(res?.message || "Data Not Found");
        }
      } catch (err) {
        console.error("Prov cheque details error:", err);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [provChequeId]);

  // Prefill flag (raw Y/N)
  useEffect(() => {
    if (!provChequeDetail) return;
    setValue("connoFlag", provChequeDetail.NUM_PROVCHEQUE_FLAG || "Y");
  }, [provChequeDetail, setValue]);

  // Prefill ULB (from details API)
  useEffect(() => {
    if (!provChequeDetail || ulbOptions.length === 0) return;
    const id = String(provChequeDetail.NUM_PROVCHEQUE_ULBID || "");
    if (ulbOptions.some((o) => o.value === id)) {
      setValue("ulbId", id);
    }
  }, [provChequeDetail, ulbOptions, setValue]);

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
        in_provchqid: isEdit ? Number(provChequeId) : null,
        in_ulbid: Number(data.ulbId),
        in_activeflag: data.connoFlag,
        in_ipaddress: ip,
        in_source: config.source,
        in_Mode: isEdit ? 2 : 1,
      };

      const res = await apiService.post(
        "/master/aowt_provchequeconfig_ins",
        payload,
      );

      if (res?.success && res?.data?.Out_errorCode === 9999) {
        alert(res.data.Out_ErrorMsg || "Record saved successfully");
        navigate("/Masters/FrmProvChequeList");
      } else {
        alert(
          res?.data?.Out_ErrorMsg ||
            res?.message ||
            "Failed to Insert or update",
        );
      }
    } catch (err) {
      console.error("Error saving prov cheque config:", err);
      alert(err.message);
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

          {/* Conno Flag */}
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
