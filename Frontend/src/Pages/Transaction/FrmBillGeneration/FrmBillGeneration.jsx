import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Label from "../../../Components/Label";
import Layout from "../../../Components/Layout";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";
import apiService from "../../../../apiService";
import GetIPAddress from "../../../utils/ipHelper.jsx";
import config from "../../../utils/config.jsx";
import Button from "../../../Components/Button.jsx";

const getToday = () => {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

const FrmBillGeneration = () => {
  const { user } = useAuth();
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  const userId = user?.userId;
  const ulbid = user?.ulbId;

  const [zoneOptions, setZoneOptions] = useState([]);
  const [blockOptions, setBlockOptions] = useState([]);

  const {
    register,
    watch,
    setValue,
    getValues,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      zone: "",
      block: "",
      connectionNo: "",
      dueDate: getToday(),
      billDate: getToday(),
    },
  });

  const watchZone = watch("zone");

  // Zone dropdown
  useEffect(() => {
    if (!ulbid) return;

    const fetchZone = async () => {
      try {
        setLoading(true);
        const res = await apiService.get(
          `/transaction/getZoneDropdownWithUlbId?ulbId=${ulbid}`,
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
      } finally {
        setLoading(false);
      }
    };
    fetchZone();
  }, [ulbid]);

  // Block dropdown will triggered when zone changes
  useEffect(() => {
    setBlockOptions([]);
    setValue("block", "");

    if (!watchZone) return;

    const fetchBlock = async () => {
      try {
        setLoading(true);
        const res = await apiService.get(
          `/transaction/getBlockDropdown?zoneId=${watchZone}`,
        );
        if (res?.success && Array.isArray(res.data)) {
          setBlockOptions(
            res.data.map((item) => ({
              value: String(item.NUM_BLOCK_ID),
              label: item.VAR_BLOCK_NAME,
            })),
          );
        } else {
          setBlockOptions([]);
        }
      } catch (err) {
        console.error("Block dropdown error:", err);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlock();
  }, [watchZone, setValue]);

  // Reset handler
  const handleReset = () => {
    setBlockOptions([]);
    reset({
      zone: "",
      block: "",
      connectionNo: "",
      dueDate: getToday(),
      billDate: getToday(),
    });
  };

  // Generate handler
  const onSubmit = async (values) => {
    if (!userId || !ulbid) {
      alert("User Id or Ulb Id is not set");
      return;
    }

    if (!values.zone) {
      alert("Please Select Zone");
      return;
    }
    if (!values.block) {
      alert("Please Select Block");
      return;
    }

    const today = getToday();

    if (values.billDate < today) {
      alert("Bill Date Can Not Be Past Date");
      return;
    }

    if (!values.dueDate) {
      alert("Please Select Due Date");
      return;
    }

    if (values.dueDate < today) {
      alert("Due Date Can Not Be Past Date");
      return;
    }

    try {
      setLoading(true);
      const ip = await GetIPAddress();

      const payload = {
        in_userid: userId,
        in_ULBId: Number(ulbid),
        in_zoneid: Number(values.zone),
        in_blockno: Number(values.block),
        in_conno: values.connectionNo?.trim() || "",
        in_billdate: values.billDate,
        in_duedate: values.dueDate,
        in_ipaddress: ip,
        in_source: config.source,
      };

      const res = await apiService.post(
        "/transaction/aowt_billgen_ins",
        payload,
      );

      // procedure returning -100 for success error code instead of 9999 like other procedure does
      if (res?.success && res?.data?.out_errorcode === -100) {
        alert(res.data.out_errormsg || "Bill generated successfully");
        handleReset();
      } else {
        alert(
          res?.data?.out_errormsg || res?.message || "Failed to generate bill",
        );
      }
    } catch (err) {
      console.error("Error generating bill:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Bill Generation"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Bill Generation",
      }}
    >
      <form className="w-full space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Zone */}
          <div>
            <Label text={"Zone"} required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                ${errors.zone ? "border-red-500" : ""}`}
              {...register("zone", { required: "Zone is required" })}
            >
              <option value="">-- Select --</option>
              {zoneOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.zone && (
              <p className="text-sm text-red-500 mt-1">{errors.zone.message}</p>
            )}
          </div>

          {/* Block */}
          <div>
            <Label text={"Block"} required />
            <select
              disabled={!watchZone}
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                ${!watchZone ? "bg-slate-200 cursor-not-allowed" : ""}
                ${errors.block ? "border-red-500" : ""}`}
              {...register("block", { required: "Block is required" })}
            >
              <option value="">
                {watchZone ? "-- Select --" : "-- Select Zone first --"}
              </option>
              {blockOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.block && (
              <p className="text-sm text-red-500 mt-1">
                {errors.block.message}
              </p>
            )}
          </div>

          {/* Connection No — optional */}
          <div>
            <Label text={"Connection No"} />
            <input
              type="text"
              placeholder="Enter connection no (optional)"
              className="form-input-box w-full"
              {...register("connectionNo")}
            />
          </div>

          {/* Due Date */}
          <div>
            <Label text={"Due Date"} required />
            <input
              type="date"
              className={`form-input-box w-full ${
                errors.dueDate ? "border-red-500" : ""
              }`}
              {...register("dueDate", {
                required: "Due Date is required",
              })}
            />
            {errors.dueDate && (
              <p className="text-sm text-red-500 mt-1">
                {errors.dueDate.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-3 px-5 py-3 border-t border-slate-200 bg-white flex-shrink-0">
          <Button type="submit">Generate</Button>
          <Button type="button" onClick={() => navigate("/dashboard")}>
            Close
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmBillGeneration;
