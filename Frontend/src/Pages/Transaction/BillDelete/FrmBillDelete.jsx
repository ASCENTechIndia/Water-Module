import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Layout from "../../../Components/Layout";
import Label from "../../../Components/Label";
import Button from "../../../Components/Button.jsx";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";
import GetIPAddress from "../../../utils/ipHelper.jsx";
import config from "../../../utils/config.jsx";

const FrmBillDelete = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const ulbid = user?.ulbId;
  const userId = user?.userId;
  const { setLoading } = useLoader();

  const [zoneOptions, setZoneOptions] = useState([]);
  const [blockOptions, setBlockOptions] = useState([]);
  const [taxRows, setTaxRows] = useState([]);
  const [ownerName, setOwnerName] = useState("");
  const [address, setAddress] = useState("");
  const [showPanel, setShowPanel] = useState(false);
  const [pendingBlockId, setPendingBlockId] = useState("");

  const { register, watch, setValue, getValues, reset } = useForm({
    defaultValues: {
      zoneName: "",
      blockName: "",
      connNo: "",
      flatNo: "",
      remark: "",
    },
  });

  const watchZone = watch("zoneName");

  // Load Zone dropdown on mount
  useEffect(() => {
    if (!ulbid) return;

    const fetchZones = async () => {
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
    fetchZones();
  }, [ulbid]);

  // Load Block dropdown when Zone changes
  useEffect(() => {
    setBlockOptions([]);

    if (!watchZone) {
      setValue("blockName", "");
      return;
    }

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
    fetchBlocks();
  }, [watchZone, setValue]);

  // Apply pending block value once block options are loaded
  useEffect(() => {
    if (pendingBlockId && blockOptions.length > 0) {
      if (blockOptions.some((b) => b.value === pendingBlockId)) {
        setValue("blockName", pendingBlockId);
        setPendingBlockId("");
      }
    }
  }, [blockOptions, pendingBlockId, setValue]);

  // Connection No blur — auto-fill zone + block
  const handleConnNoBlur = async () => {
    const connNo = getValues("connNo")?.trim();

    if (!connNo || !ulbid) return;

    try {
      setLoading(true);
      const res = await apiService.get(
        `/transaction/getConnZoneBlock?ulbId=${ulbid}&connNo=${connNo}`,
      );

      if (res?.success && res?.data?.length > 0) {
        const { ZONEID, BLOCKID } = res.data[0];
        setValue("zoneName", String(ZONEID));
        setPendingBlockId(String(BLOCKID));
      } else {
        alert("No Data Found");
      }
    } catch (err) {
      console.error("Conn zone/block lookup error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Search handler
  const handleSearch = async () => {
    const values = getValues();

    // Validation matching .NET btnSearch_Click
    if (!values.zoneName) {
      alert("Please select zone");
      return;
    }
    if (!values.blockName) {
      alert("Please select Block");
      return;
    }
    if (!values.connNo?.trim()) {
      alert("Connection No can not be blank");
      return;
    }
    if (!ulbid) {
      alert("UlbId is not set");
      return;
    }

    const payload = {
      ulbId: Number(ulbid),
      zoneId: Number(values.zoneName),
      blockId: Number(values.blockName),
      connNo: values.connNo.trim(),
      flatNo: "",
    };

    try {
      setLoading(true);
      const res = await apiService.post(
        "/transaction/getBillDeleteDetails",
        payload,
      );

      if (res?.success && res?.data?.length > 0) {
        const rows = res.data;
        setTaxRows(rows);
        setOwnerName(rows[0].OWNER_NAME || "");
        setAddress(rows[0].ADDRESS || "");
        setShowPanel(true);
      } else {
        setShowPanel(false);
        setTaxRows([]);
        setOwnerName("");
        setAddress("");
        alert("Connection not found");
      }
    } catch (err) {
      console.error("Search error:", err);
      setShowPanel(false);
      setTaxRows([]);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset handler — mirrors .NET btnReset_Click (full page reload)
  const handleReset = () => {
    setShowPanel(false);
    setTaxRows([]);
    setOwnerName("");
    setAddress("");
    setBlockOptions([]);
    setPendingBlockId("");
    reset({
      zoneName: "",
      blockName: "",
      connNo: "",
      flatNo: "",
      remark: "",
    });
  };

  // Delete handler
  const handleDelete = async () => {
    const values = getValues();

    if (!values.zoneName) {
      alert("Please Select Zone");
      return;
    }
    if (!values.blockName) {
      alert("Please Select Block");
      return;
    }
    if (!values.connNo?.trim()) {
      alert("Please Enter connection No");
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

    const connId = taxRows[0]?.CONNID;
    if (!connId) {
      alert("Connection Id not found. Please search again.");
      return;
    }

    // Compute totals for confirmation dialog
    const totalArrears = taxRows.reduce(
      (sum, r) => sum + (Number(r.ARREARS_TAXAMT) || 0),
      0,
    );
    const totalCurrent = taxRows.reduce(
      (sum, r) => sum + (Number(r.CURRENT_TOTAL) || 0),
      0,
    );

    const confirmed = window.confirm(
      `Total Arrears: ${totalArrears} and Total Current: ${totalCurrent} , You Want To Continue?`,
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      const ip = await GetIPAddress();

      const payload = {
        in_userid: userId,
        in_ulbid: Number(ulbid),
        in_zoneid: Number(values.zoneName),
        in_Blockno: Number(values.blockName),
        in_Connid: Number(connId),
        in_Connno: values.connNo.trim(),
        in_remark: values.remark.trim(),
        in_ipaddress: ip,
        in_source: config.source,
        in_flatno: values.flatNo?.trim() || "",
      };

      const res = await apiService.post(
        "/transaction/aowt_billdel_ins",
        payload,
      );

      if (res?.success && Number(res?.data?.out_errorcode) === 9999) {
        alert(res.data.out_errormsg || "Bill deleted successfully");
        handleReset();
      } else {
        alert(
          res?.data?.out_errormsg || res?.message || "Failed to delete bill",
        );
      }
    } catch (err) {
      console.error("Bill delete error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Bill Delete"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Bill Delete",
      }}
    >
      <div className="w-full space-y-6">
        {/* Search filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <Label text="Zone: " required />
            <select
              className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
              disabled={showPanel}
              {...register("zoneName")}
            >
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
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                ${!watchZone ? "bg-slate-200 cursor-not-allowed" : ""}`}
              disabled={showPanel || !watchZone}
              {...register("blockName")}
            >
              <option value="">
                {watchZone ? "-- Select --" : "-- Select Zone first --"}
              </option>
              {blockOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label text="Connection No: " required />
            <input
              type="text"
              placeholder="Enter connection no"
              className={`form-input-box w-full ${
                showPanel ? "bg-slate-100 cursor-not-allowed" : ""
              }`}
              disabled={showPanel}
              {...register("connNo")}
              onBlur={handleConnNoBlur}
            />
          </div>
          <div>
            <Label text="Flat No: " />
            <select
              className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                bg-slate-200"
              {...register("flatNo")}
            >
              <option value="">-- Select --</option>
            </select>
          </div>
        </div>

        {/* Search + Reset */}
        <div className="flex justify-center gap-2">
          <Button
            type="button"
            onClick={handleSearch}
            className={showPanel ? "opacity-50 cursor-not-allowed" : ""}
            disabled={showPanel}
          >
            Search
          </Button>
          <Button type="button" onClick={handleReset}>
            Reset
          </Button>
        </div>

        {/* Main panel — only after successful search */}
        {showPanel && (
          <>
            <hr className="border-slate-200" />

            {/* Owner + Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label text="Property Owner / मालमत्ता धारक: " />
                <input
                  type="text"
                  className="form-input-box w-full bg-slate-100 cursor-not-allowed"
                  value={ownerName}
                  readOnly
                  disabled
                />
              </div>
              <div>
                <Label text="Address / पत्ता: " />
                <input
                  type="text"
                  className="form-input-box w-full bg-slate-100 cursor-not-allowed"
                  value={address}
                  readOnly
                  disabled
                />
              </div>
            </div>

            {/* Tax details grid */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-slate-100/95">
                    <tr className="border-b border-slate-200">
                      {["Tax", "Arrears", "Current"].map((h) => (
                        <th
                          key={h}
                          className="px-3 py-3 text-center text-[12px] font-bold uppercase tracking-wider text-slate-600"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {taxRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="border border-slate-200 px-2 py-2">
                          <input
                            type="text"
                            className="form-input-box w-full bg-slate-200 cursor-not-allowed"
                            value={row.TAX_ENAME || ""}
                            readOnly
                            disabled
                          />
                        </td>
                        <td className="border border-slate-200 px-2 py-2">
                          <input
                            type="text"
                            className="form-input-box w-full bg-slate-200 cursor-not-allowed"
                            value={
                              row.ARREARS_TAXAMT !== null &&
                              row.ARREARS_TAXAMT !== undefined
                                ? row.ARREARS_TAXAMT
                                : 0
                            }
                            readOnly
                            disabled
                          />
                        </td>
                        <td className="border border-slate-200 px-2 py-2">
                          <input
                            type="text"
                            className="form-input-box w-full bg-slate-200 cursor-not-allowed"
                            value={
                              row.CURRENT_TOTAL !== null &&
                              row.CURRENT_TOTAL !== undefined
                                ? row.CURRENT_TOTAL
                                : 0
                            }
                            readOnly
                            disabled
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Remark */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label text="Remark: " required />
                <input
                  type="text"
                  placeholder="Enter remark"
                  className="form-input-box w-full"
                  {...register("remark", {
                    required: "Remark is required",
                  })}
                />
              </div>
            </div>

            {/* Delete + Close */}
            <div className="flex justify-center gap-2">
              <Button type="button" onClick={handleDelete}>
                Delete
              </Button>
              <Button type="button" onClick={() => navigate("/dashboard")}>
                Close
              </Button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default FrmBillDelete;
