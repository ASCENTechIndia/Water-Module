import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import Label from "../../../Components/Label";
import Layout from "../../../Components/Layout";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";
import apiService from "../../../../apiService";
import GetIPAddress from "../../../utils/ipHelper.jsx";
import config from "../../../utils/config.jsx";
import Button from "../../../Components/Button.jsx";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const getToday = () => {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

// Convert YYYY-MM-DD to DD-MMM-YYYY
const formatDateToDdMmmYyyy = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mmm = MONTHS[d.getMonth()];
  const yyyy = d.getFullYear();
  return `${dd}-${mmm}-${yyyy}`;
};

const FrmMeterReadingEntry = () => {
  const { user } = useAuth();
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  const userId = user?.userId;
  const ulbid = user?.ulbId;

  const [checked, setChecked] = useState(false);
  const [wardOptions, setWardOptions] = useState([]);
  const [zoneOptions, setZoneOptions] = useState([]);
  const [blockOptions, setBlockOptions] = useState([]);
  const [gapCodeOptions, setGapCodeOptions] = useState([]);
  const [hasResults, setHasResults] = useState(false);

  const {
    register,
    control,
    watch,
    setValue,
    getValues,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ward: "",
      zone: "",
      block: "",
      fromConnectionNo: "",
      toConnectionNo: "",
      billingCycle1: "",
      billingCycle2: "",
      tableRow: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "tableRow",
  });

  const watchWard = watch("ward");
  const watchZone = watch("zone");

  // Ward dropdown
  useEffect(() => {
    if (!ulbid) return;

    const fetchWard = async () => {
      try {
        setLoading(true);
        const res = await apiService.get(
          `/transaction/getWardDropdown?ulbId=${ulbid}`,
        );
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
      } finally {
        setLoading(false);
      }
    };
    fetchWard();
  }, [ulbid]);

  // Zone dropdown
  useEffect(() => {
    setZoneOptions([]);
    setValue("zone", "");
    setBlockOptions([]);
    setValue("block", "");

    if (!watchWard) return;

    const fetchZone = async () => {
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
  }, [watchWard, setValue]);

  // Block dropdown
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

  // Gap Code dropdown
  useEffect(() => {
    if (!ulbid) return;

    const fetchGapCode = async () => {
      try {
        setLoading(true);
        const res = await apiService.get(
          `/transaction/getGapCodeDropdown?ulbId=${ulbid}`,
        );
        if (res?.success && Array.isArray(res.data)) {
          setGapCodeOptions(
            res.data.map((item) => ({
              value: String(item.NUM_GAPCODE_ID),
              label: item.VAR_GAPCODE_NAME,
            })),
          );
        } else {
          setGapCodeOptions([]);
        }
      } catch (err) {
        console.error("Gap code dropdown error:", err);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGapCode();
  }, [ulbid]);

  // Search handler
  const handleSearch = async () => {
    if (!ulbid) {
      alert("UlbId is not set");
      return;
    }

    const values = getValues();

    let payload = {
      mode: checked ? "range" : "area",
      ulbId: Number(ulbid),
    };

    if (checked) {
      if (!values.fromConnectionNo?.trim()) {
        alert("Please Enter From Connection No");
        return;
      }
      payload.fromConnNo = values.fromConnectionNo.trim();
      payload.toConnNo = values.toConnectionNo?.trim() || "";
    } else {
      if (!values.ward) {
        alert("Please select Ward");
        return;
      }
      if (!values.zone) {
        alert("Please select Zone");
        return;
      }
      if (!values.block) {
        alert("Please select Block");
        return;
      }
      payload.wardId = Number(values.ward);
      payload.zoneId = Number(values.zone);
      payload.blockId = Number(values.block);
    }

    try {
      setLoading(true);
      const res = await apiService.post(
        "/transaction/searchMeterConnections",
        payload,
      );

      if (!res?.success) {
        alert(res?.message || "Search failed");
        replace([]);
        setHasResults(false);
        setValue("billingCycle1", "");
        setValue("billingCycle2", "");
        return;
      }

      const connections = res?.data?.connections || [];
      const billingCycle = res?.data?.billingCycle;

      if (connections.length === 0) {
        alert(res?.message || "No record found");
        replace([]);
        setHasResults(false);
        setValue("billingCycle1", "");
        setValue("billingCycle2", "");
        return;
      }

      const rows = connections.map((c) => {
        const lastReading =
          c.CURRREADING != null && c.CURRREADING !== ""
            ? c.CURRREADING
            : (c.INTILREADING ?? 0);

        return {
          connectionNo: c.CONNNO || "",
          name: c.NAME || "",
          meterNo: c.METERNO || "",
          lastReading: String(lastReading),
          readingPeriod: c.PERIOD || "",
          readingDate: getToday(),
          currentReading: "",
          consumptionQty: "",
          gapCode: "",
        };
      });

      replace(rows);

      if (billingCycle) {
        setValue("billingCycle1", billingCycle.fromMonth || "");
        setValue("billingCycle2", billingCycle.toMonth || "");
      }

      setHasResults(true);
    } catch (err) {
      console.error("Search error:", err);
      alert(err.message);
      replace([]);
      setHasResults(false);
      setValue("billingCycle1", "");
      setValue("billingCycle2", "");
    } finally {
      setLoading(false);
    }
  };

  // Reset handler
  const handleReset = () => {
    setChecked(false);
    setZoneOptions([]);
    setBlockOptions([]);
    setHasResults(false);
    replace([]);
    reset();
  };

  // Current Reading change auto calculate Consumption Qty
  const handleCurrentReadingChange = (index, value) => {
    const lastReading = Number(getValues(`tableRow.${index}.lastReading`) || 0);
    const currentReading = Number(value);

    if (value !== "" && !isNaN(currentReading)) {
      setValue(
        `tableRow.${index}.consumptionQty`,
        String(currentReading - lastReading),
      );
    } else {
      setValue(`tableRow.${index}.consumptionQty`, "");
    }
  };

  // Submit handler
  const onSubmit = async (values) => {
    if (!userId || !ulbid) {
      alert("User Id or Ulb Id is not set");
      return;
    }

    const rows = values.tableRow || [];

    if (rows.length === 0) {
      alert("Please search and add at least one record");
      return;
    }

    // Build the $ seperated string from searched table
    const readingParts = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 1;

      if (!row.connectionNo?.toString().trim()) {
        alert(`Row ${rowNum}: Please Enter Conn No`);
        return;
      }

      if (!row.name?.trim()) {
        alert(`Row ${rowNum}: Please Enter Name`);
        return;
      }

      if (!row.meterNo?.trim()) {
        alert(`Row ${rowNum}: Please Enter Meter No`);
        return;
      }

      if (!row.lastReading?.toString().trim()) {
        alert(`Row ${rowNum}: Please Enter Last Reading`);
        return;
      }

      const hasCurrent =
        row.currentReading !== "" &&
        row.currentReading !== null &&
        row.currentReading !== undefined;

      const hasQty =
        row.consumptionQty !== "" &&
        row.consumptionQty !== null &&
        row.consumptionQty !== undefined;

      if (hasCurrent && hasQty) {
        if (!row.gapCode || row.gapCode === "" || row.gapCode === "0") {
          alert(`Row ${rowNum}: Please Select Gap Code`);
          return;
        }
      }

      // Only include rows with CurrentReading + Qty + GapCode all filled
      if (hasCurrent && hasQty && row.gapCode && row.gapCode !== "0") {
        const formattedDate = formatDateToDdMmmYyyy(row.readingDate);
        if (!formattedDate) {
          alert(`Row ${rowNum}: Invalid Reading Date`);
          return;
        }

        readingParts.push(
          `${row.connectionNo}#${row.lastReading}#${formattedDate}#${row.currentReading}#${row.consumptionQty}#${row.gapCode}`,
        );
      }
    }

    if (readingParts.length === 0) {
      alert("Please Enter AtLeast One Record!");
      return;
    }

    const in_mtrreading_Str = readingParts.join("$");

    try {
      setLoading(true);

      const ip = await GetIPAddress();
      const entryMonth = formatDateToDdMmmYyyy(getToday());

      const payload = {
        in_UserId: userId,
        in_mtrreading_Str,
        in_mtrreading_ulbid: Number(ulbid),
        in_Mode: 1,
        in_RedingEntryMonth: entryMonth,
        in_ipaddr: ip,
        in_source: config.source,
      };

      const res = await apiService.post(
        "/transaction/aowt_mtrreading_ins",
        payload,
      );

      if (res?.success && res?.data?.Out_errorCode === 9999) {
        alert(res.data.Out_ErrorMsg || "Meter reading saved successfully");
        handleReset();
      } else {
        alert(
          res?.data?.Out_ErrorMsg ||
            res?.message ||
            "Failed to save meter reading",
        );
      }
    } catch (err) {
      console.error("Error saving meter reading:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle slab checkbox
  const handleSlabToggle = (e) => {
    const isChecked = e.target.checked;
    setChecked(isChecked);

    if (isChecked) {
      setValue("ward", "");
      setValue("zone", "");
      setValue("block", "");
      setZoneOptions([]);
      setBlockOptions([]);
    } else {
      setValue("fromConnectionNo", "");
      setValue("toConnectionNo", "");
    }
  };

  return (
    <Layout
      title="Meter Reading Entry"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Meter Reading Entry",
      }}
    >
      <form className="w-full space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label text={"Ward"} required />
            <select
              disabled={checked}
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                ${checked ? "bg-slate-200 cursor-not-allowed" : ""}`}
              {...register("ward")}
            >
              <option value="">-- Select --</option>
              {wardOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label text={"Zone"} required />
            <select
              disabled={checked}
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                ${checked ? "bg-slate-200 cursor-not-allowed" : ""}`}
              {...register("zone")}
            >
              <option value="">-- Select --</option>
              {zoneOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label text={"Register No / Block"} required />
            <select
              disabled={checked}
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                ${checked ? "bg-slate-200 cursor-not-allowed" : ""}`}
              {...register("block")}
            >
              <option value="">-- Select --</option>
              {blockOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <input
                type="checkbox"
                checked={checked}
                onChange={handleSlabToggle}
                className="h-4 w-4"
              />
            </div>
            <div>
              <Label text={"Connection Slab"} />
            </div>
          </div>
          <div>
            <Label text={"From Connection No: "} />
            <input
              type="text"
              className={`form-input-box ${
                checked ? "" : "bg-slate-200 cursor-not-allowed"
              }`}
              {...register("fromConnectionNo")}
              disabled={!checked}
            />
          </div>
          <div>
            <Label text={"To Connection No: "} />
            <input
              type="text"
              className={`form-input-box ${
                checked ? "" : "bg-slate-200 cursor-not-allowed"
              }`}
              {...register("toConnectionNo")}
              disabled={!checked}
            />
          </div>
        </div>

        <div className="flex justify-center gap-2 px-5 py-3 border-t border-slate-200 bg-white flex-shrink-0">
          <Button type="button" onClick={handleSearch}>
            Search
          </Button>
          <Button type="button" onClick={handleReset}>
            Reset
          </Button>
        </div>

        {hasResults && (
          <div className="grid grid-cols-1 border-t border-slate-200 mt-3">
            <div>
              <Label text={"Billing Cycle:"} />
              <div className="flex gap-3">
                <input
                  type="text"
                  className="form-input-box bg-slate-200 cursor-not-allowed"
                  disabled
                  {...register("billingCycle1")}
                />
                <input
                  type="text"
                  className="form-input-box bg-slate-200 cursor-not-allowed"
                  disabled
                  {...register("billingCycle2")}
                />
              </div>
            </div>
          </div>
        )}

        {hasResults && fields.length > 0 && (
          <div className="rounded-xl border border-slate-200 overflow-hidden mt-3">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1500px] table-fixed border-collapse">
                <thead className="bg-slate-100/95">
                  <tr className="border-b border-slate-200">
                    {[
                      "Connection Number",
                      "Name",
                      "Meter Number",
                      "Last Reading",
                      "Reading Period",
                      "Reading Date",
                      "Current Reading",
                      "Consumption Quantity",
                      "GAP Code",
                    ].map((h) => (
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
                  {fields.map((field, index) => (
                    <tr key={field.id} className="hover:bg-slate-50">
                      <td className="border border-slate-200 px-2 py-2">
                        <input
                          type="text"
                          className="form-input-box w-full bg-slate-200 cursor-not-allowed"
                          disabled
                          {...register(`tableRow.${index}.connectionNo`)}
                        />
                      </td>

                      <td className="border border-slate-200 px-2 py-2">
                        <input
                          type="text"
                          className="form-input-box w-full bg-slate-200 cursor-not-allowed"
                          disabled
                          {...register(`tableRow.${index}.name`)}
                        />
                      </td>

                      <td className="border border-slate-200 px-2 py-2">
                        <input
                          type="text"
                          className="form-input-box w-full bg-slate-200 cursor-not-allowed"
                          disabled
                          {...register(`tableRow.${index}.meterNo`)}
                        />
                      </td>

                      <td className="border border-slate-200 px-2 py-2">
                        <input
                          type="number"
                          className="form-input-box w-full bg-slate-200 cursor-not-allowed"
                          disabled
                          {...register(`tableRow.${index}.lastReading`)}
                        />
                      </td>

                      <td className="border border-slate-200 px-2 py-2">
                        <input
                          type="text"
                          className="form-input-box w-full bg-slate-200 cursor-not-allowed"
                          disabled
                          {...register(`tableRow.${index}.readingPeriod`)}
                        />
                      </td>

                      <td className="border border-slate-200 px-2 py-2">
                        <input
                          type="date"
                          className="form-input-box w-full"
                          {...register(`tableRow.${index}.readingDate`)}
                        />
                      </td>

                      <td className="border border-slate-200 px-2 py-2">
                        <input
                          type="number"
                          className="form-input-box w-full"
                          {...register(`tableRow.${index}.currentReading`, {
                            onChange: (e) =>
                              handleCurrentReadingChange(index, e.target.value),
                          })}
                        />
                      </td>

                      <td className="border border-slate-200 px-2 py-2">
                        <input
                          type="number"
                          className="form-input-box w-full bg-slate-200 cursor-not-allowed"
                          disabled
                          {...register(`tableRow.${index}.consumptionQty`)}
                        />
                      </td>

                      <td className="border border-slate-200 px-2 py-2">
                        <select
                          className="form-input-box w-full"
                          {...register(`tableRow.${index}.gapCode`)}
                        >
                          <option value="">-- Select --</option>
                          {gapCodeOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {hasResults && (
          <div className="flex justify-center gap-2 px-5 py-3 border-t border-slate-200 bg-white flex-shrink-0">
            <Button type="submit">Submit</Button>
            <Button type="button" onClick={() => navigate("/dashboard")}>
              Back
            </Button>
          </div>
        )}
      </form>
    </Layout>
  );
};

export default FrmMeterReadingEntry;
