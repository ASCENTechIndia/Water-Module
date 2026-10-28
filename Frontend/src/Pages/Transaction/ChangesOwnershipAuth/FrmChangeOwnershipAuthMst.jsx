import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Layout from "../../../Components/Layout";
import Label from "../../../Components/Label";
import Button from "../../../Components/Button.jsx";
import apiService from "../../../../apiService";
import GetIPAddress from "../../../utils/ipHelper.jsx";
import config from "../../../utils/config.jsx";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmChangeOwnershipAuthMst = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const applicationNo = state?.applicationNo;
  const applicationId = state?.applicationId;

  const [wardOptions, setWardOptions] = useState([]);
  const [zoneOptions, setZoneOptions] = useState([]);
  const [blockOptions, setBlockOptions] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [detail, setDetail] = useState(null);
  const [charges, setCharges] = useState([]);

  const { register, setValue, watch, handleSubmit } = useForm({
    defaultValues: {
      ward: "",
      zone: "",
      block: "",
      applicationNo: "",
      consumerNo: "",
      applicantName: "",
      oldOwnerName: "",
      newOwnerName: "",
      oldAddress: "",
      newAddress: "",
      service: "",
      amount: "",
      remark: "",
      authType: "",
    },
  });

  const watchWard = watch("ward");
  const watchZone = watch("zone");
  const consumerNo = watch("consumerNo");
  const serviceId = watch("service");

  useEffect(() => {
    if (!ulbid) return;

    const loadDropdowns = async () => {
      try {
        setLoading(true);
        const results = await Promise.allSettled([
          apiService.get(`/transaction/getWardDropdown?ulbId=${ulbid}`),
          apiService.get(`/transaction/getOwnershipServiceDropdown`),
        ]);

        const [wardRes, serviceRes] = results;

        if (wardRes.status === "fulfilled" && wardRes.value?.success) {
          setWardOptions(
            wardRes.value.data.map((item) => ({
              value: String(item.NUM_WARD_ID),
              label: item.VAR_WARD_NAME,
            })),
          );
        } else {
          setWardOptions([]);
        }

        if (serviceRes.status === "fulfilled" && serviceRes.value?.success) {
          setServiceOptions(
            serviceRes.value.data.map((item) => ({
              value: String(item.NUM_SERVICE_ID),
              label: item.VAR_SERVICE_MNAME,
            })),
          );
        } else {
          setServiceOptions([]);
        }
      } catch (err) {
        console.error("Dropdown load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDropdowns();
  }, [ulbid]);

  // Fetch ownership details
  const fetchDetails = async () => {
    if (!applicationNo || !applicationId || !ulbid) return;
    try {
      setLoading(true);
      const res = await apiService.get(
        `/transaction/fetchOwnershipDetails?applicationNo=${applicationNo}&applicationId=${applicationId}&ulbId=${ulbid}`,
      );
      if (res?.success && res?.data?.length > 0) {
        setDetail(res.data[0]);
      } else {
        alert(res?.message || "Data Not Found");
      }
    } catch (err) {
      console.error("Fetch details error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [applicationNo, applicationId, ulbid]);

  // Prefill simple fields
  useEffect(() => {
    if (!detail) return;
    setValue("applicationNo", detail.VAR_SERVAPPLI_APPLINO || "");
    setValue("consumerNo", detail.NUM_SERVAPPLI_CONNNO || "");
    setValue("applicantName", detail.VAR_SERVAPPLI_APPLICANTNAME || "");
    setValue("oldOwnerName", detail.VAR_SERVAPPLI_OLDOWNERNAME || "");
    setValue("newOwnerName", detail.VAR_SERVAPPLI_NEWOWNERNAME || "");
    setValue("oldAddress", detail.VAR_SERVAPPLI_OLDADDRESS || "");
    setValue("newAddress", detail.VAR_SERVAPPLI_NEWADDRESS || "");
    setValue("amount", String(detail.NUM_SERVAPPLI_AMMOUNT ?? ""));
  }, [detail, setValue]);

  // Prefill Ward
  useEffect(() => {
    if (!detail || wardOptions.length === 0) return;
    const id = String(detail.NUM_SERVAPPLI_WARDID || "");
    if (wardOptions.some((o) => o.value === id)) setValue("ward", id);
  }, [detail, wardOptions, setValue]);

  // Prefill Service
  useEffect(() => {
    if (!detail || serviceOptions.length === 0) return;
    const id = String(detail.NUM_SERVAPPLI_SERVICEID || "");
    if (serviceOptions.some((o) => o.value === id)) setValue("service", id);
  }, [detail, serviceOptions, setValue]);

  // Load Zone when Ward changes
  useEffect(() => {
    setZoneOptions([]);
    setValue("zone", "");
    setBlockOptions([]);
    setValue("block", "");

    if (!watchWard) return;

    const fetchZones = async () => {
      try {
        setLoading(true);
        const res = await apiService.get(
          `/transaction/getZoneDropdown?wardId=${watchWard}`,
        );
        if (res?.success && Array.isArray(res.data)) {
          setZoneOptions(
            res.data.map((item) => ({
              value: String(item.NUM_ZONE_ID),
              label: item.VAR_ZONE_NAME,
            })),
          );
        }
      } catch (err) {
        console.error("Zone dropdown error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchZones();
  }, [watchWard, setValue]);

  // Prefill Zone
  useEffect(() => {
    if (!detail || zoneOptions.length === 0) return;
    const id = String(detail.NUM_SERVAPPLI_ZONEID || "");
    if (zoneOptions.some((o) => o.value === id)) setValue("zone", id);
  }, [detail, zoneOptions, setValue]);

  // Load Block when Zone changes
  useEffect(() => {
    setBlockOptions([]);
    setValue("block", "");

    if (!watchZone) return;

    const fetchBlocks = async () => {
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
        }
      } catch (err) {
        console.error("Block dropdown error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlocks();
  }, [watchZone, setValue]);

  // Prefill Block
  useEffect(() => {
    if (!detail || blockOptions.length === 0) return;
    const id = String(detail.NUM_SERVAPPLI_BLOCKID || "");
    if (blockOptions.some((o) => o.value === id)) setValue("block", id);
  }, [detail, blockOptions, setValue]);

  const fetchCharges = async () => {
    if (!ulbid || !serviceId || !consumerNo) {
      alert(
        "UlbId or service Id or consumer number is not found, please search ownership details again from list page",
      );
      return;
    }
    try {
      const res = await apiService.get(
        `/Transaction/getOwnershipCharges?ulbId=${ulbid}&serviceId=${serviceId}&consumerNo=${consumerNo}`,
      );

      if (res?.success && res?.data?.length > 0) {
        setCharges(
          res.data.map((item) => ({
            id: item.CHARGID,
            name: item.CHARGNAME,
            value: item.CHARGVALUE,
          })),
        );
      } else {
        setCharges([]);
      }
    } catch (error) {
      setCharges([]);
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (consumerNo && ulbid && serviceId) {
      fetchCharges();
    }
  }, [consumerNo, ulbid, serviceId]);

  // Submit handler
  const onSubmit = async (values) => {
    if (!values.applicantName?.trim()) {
      alert("Enter Applicant Name");
      return;
    }
    if (!values.oldOwnerName?.trim()) {
      alert("Enter Old Owner Name");
      return;
    }
    if (!values.newOwnerName?.trim()) {
      alert("Enter New Owner Name");
      return;
    }
    if (!values.oldAddress?.trim()) {
      alert("Enter Old Address");
      return;
    }
    if (!values.newAddress?.trim()) {
      alert("Enter New Address");
      return;
    }
    if (!values.service) {
      alert("Select Service");
      return;
    }
    if (!values.amount?.toString().trim()) {
      alert("Enter Amount");
      return;
    }
    if (!values.authType) {
      alert("Please select Approve or Reject");
      return;
    }
    if (!values.remark?.trim()) {
      alert("Please Enter Remark");
      return;
    }
    if (!userId || !ulbid) {
      alert("User Id or Ulb Id is not set");
      return;
    }
    if (!applicationId || !applicationNo) {
      alert(
        "Application details are missing, please go back to list and try again",
      );
      return;
    }

    try {
      setLoading(true);
      const ip = await GetIPAddress();

      // Format: applicationId$applicationNo$status$remark
      const in_str = `${applicationId}$${applicationNo}$${values.authType}$${values.remark.trim()}`;

      const payload = {
        in_UserId: userId,
        in_ULBID: Number(ulbid),
        in_str,
        in_mode: 1,
        in_ipaddress: ip,
        in_source: config.source,
      };

      console.log("Ownership auth payload →", payload);

      const res = await apiService.post(
        "/transaction/aowt_serviceapprovalauth_ins",
        payload,
      );

      console.log("auth res :", res);
      const isSuccess = res?.success && res?.data?.Out_errorCode === 9999;

      if (isSuccess) {
        alert(
          res?.data?.Out_ErrorMsg ||
            "Ownership authorization processed successfully",
        );
        navigate("/Transaction/FrmChangeOwnershipAuth");
      } else {
        alert(
          res?.data?.Out_ErrorMsg ||
            res?.message ||
            "Failed to process ownership authorization",
        );
      }
    } catch (err) {
      console.error("Ownership auth error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const disabledInput = "form-input-box w-full bg-slate-100 cursor-not-allowed";
  const disabledSelect =
    "form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm bg-slate-100 cursor-not-allowed";
  const enabledInput = "form-input-box w-full";

  return (
    <Layout
      title="Change Ownership Authorization"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Change Ownership Authorization",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        {/* Row 1: Ward, Zone, Block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label text="Ward: " required />
            <select className={disabledSelect} disabled {...register("ward")}>
              <option value="">-- Select --</option>
              {wardOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label text="Zone: " required />
            <select className={disabledSelect} disabled {...register("zone")}>
              <option value="">-- Select --</option>
              {zoneOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label text="Block: " required />
            <select className={disabledSelect} disabled {...register("block")}>
              <option value="">-- Select --</option>
              {blockOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Application No, Consumer No, Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div>
            <Label text="Application Number: " required />
            <input
              type="text"
              className={disabledInput}
              disabled
              {...register("applicationNo")}
            />
          </div>
          <div>
            <Label text="Consumer Number: " required />
            <input
              type="text"
              className={disabledInput}
              disabled
              {...register("consumerNo")}
            />
          </div>
          <div>
            <Button type="button" onClick={fetchDetails}>
              Search
            </Button>
          </div>
        </div>

        <hr className="border-slate-200" />

        {/* Applicant Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label text="Applicant Name: " required />
            <input
              type="text"
              className={disabledInput}
              disabled
              {...register("applicantName")}
            />
          </div>
        </div>

        {/* Old / New Owner Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label text="Old Owner Name: " required />
            <input
              type="text"
              className={disabledInput}
              disabled
              {...register("oldOwnerName")}
            />
          </div>
          <div>
            <Label text="New Owner Name: " required />
            <input
              type="text"
              className={disabledInput}
              disabled
              {...register("newOwnerName")}
            />
          </div>
        </div>

        {/* Old / New Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label text="Old Address: " required />
            <input
              type="text"
              className={disabledInput}
              disabled
              {...register("oldAddress")}
            />
          </div>
          <div>
            <Label text="New Address: " required />
            <input
              type="text"
              className={disabledInput}
              disabled
              {...register("newAddress")}
            />
          </div>
        </div>

        {/* Service, Amount, Document */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <Label text="Service: " required />
            <select
              className={disabledSelect}
              disabled
              {...register("service")}
            >
              <option value="">-- Select --</option>
              {serviceOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label text="Amount Applicable: " required />
            <input
              type="text"
              className={disabledInput}
              disabled
              {...register("amount")}
            />
          </div>
          <div>
            <Label text="Attached Document: " />
            <input
              type="file"
              className={`${disabledInput} p-1`}
              accept=".jpg,.jpeg,.pdf"
              disabled
            />
          </div>
          <div className="flex items-end">
            <div className="text-xs text-slate-500">
              (Document preview API pending)
            </div>
          </div>
        </div>

        {/* Fees */}
        <div className="grid grid-cols-2">
          {charges && charges?.length > 0 ? (
            <div className="border border-slate-300 rounded-md p-4">
              <h6 className="text-sm font-semibold text-slate-700 -mt-6 bg-white px-2 inline-block">
                Fees
              </h6>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-slate-100/95">
                      <tr className="border-b border-slate-200">
                        <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                          Charges Name
                        </th>
                        <th className="px-3 py-3 text-right text-[12px] font-bold uppercase tracking-wider text-slate-600 w-32">
                          Fees
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {charges.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="px-3 py-2 text-sm text-slate-700">
                            {item.name}
                          </td>
                          <td className="px-3 py-2 text-sm text-slate-700 text-right font-medium">
                            {item.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50/40 py-6">
              <p className="text-sm text-slate-500 text-center">
                No Record Found
              </p>
            </div>
          )}
        </div>

        {/* Remark + Approval */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <Label text="Remark: " required />
            <input
              type="text"
              className={enabledInput}
              {...register("remark", { required: "Remark is required" })}
            />
          </div>
          <div>
            <Label text="Approval: " required />
            <div className="flex items-center gap-4 mt-2">
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  value="A"
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                  {...register("authType", {
                    required: "Approval is required",
                  })}
                />
                <span>मंजूर</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  value="R"
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                  {...register("authType", {
                    required: "Approval is required",
                  })}
                />
                <span>रद्द</span>
              </label>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-2">
          <Button type="submit">Submit</Button>
          <Button
            type="button"
            onClick={() => navigate("/Transaction/FrmChangeOwnershipAuth")}
          >
            Back
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmChangeOwnershipAuthMst;
