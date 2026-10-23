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

const getToday = () => {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

const formatDateForDisplay = (dateStr) => {
  if (!dateStr) return "";
  const datePart = String(dateStr).split("T")[0];
  if (!datePart) return "";
  const [y, m, d] = datePart.split("-");
  if (!y || !m || !d) return datePart;
  return `${d}-${m}-${y}`;
};

const getFinancialYear = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const startYear = month >= 4 ? year : year - 1;
  const endYear = startYear + 1;
  return `${startYear}-${String(endYear).slice(-2)}`;
};

const FrmChequeBounce = () => {
  const { user } = useAuth();
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  const userId = user?.userId;
  const ulbid = user?.ulbId;

  const [ulbOptions, setUlbOptions] = useState([]);
  const [zoneOptions, setZoneOptions] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);
  const [reasonOptions, setReasonOptions] = useState([]);
  const [hasResults, setHasResults] = useState(false);

  const { register, control, watch, setValue, getValues, reset } = useForm({
    defaultValues: {
      ulbName: "",
      zoneName: "",
      chequeNumber: "",
      bankName: "",
      chequeAmount: "",
      receiptDate: "",
      mobileNumber: "",
      reason: "",
      tableRow: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "tableRow",
  });

  const watchChequeNumber = watch("chequeNumber");
  const watchTableRows = watch("tableRow");

  // Load ULB dropdown
  useEffect(() => {
    const fetchUlb = async () => {
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
        }
      } catch (err) {
        console.error("ULB dropdown error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUlb();
  }, []);

  useEffect(() => {
    if (ulbid && ulbOptions.length > 0) {
      const match = ulbOptions.find((o) => o.value === String(ulbid));
      if (match) setValue("ulbName", match.value);
    }
  }, [ulbid, ulbOptions, setValue]);

  // Load Zone dropdown
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
        }
      } catch (err) {
        console.error("Zone dropdown error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchZones();
  }, [ulbid]);

  // Load Reason dropdown
  useEffect(() => {
    const fetchReasons = async () => {
      try {
        const res = await apiService.get("/transaction/getReasonDropdown");
        if (res?.success && Array.isArray(res.data)) {
          setReasonOptions(
            res.data.map((item) => ({
              value: String(item.NUM_DELETEREASON_ID),
              label: item.VAR_DELETEREASON_REASON,
            })),
          );
        }
      } catch (err) {
        console.error("Reason dropdown error:", err);
      }
    };
    fetchReasons();
  }, []);

  // Clear results when cheque number changes
  useEffect(() => {
    if (hasResults) {
      setHasResults(false);
      replace([]);
      setValue("reason", "");
    }
  }, [watchChequeNumber]);

  // Load banks on cheque number
  const loadBanks = async (chqNo) => {
    if (!chqNo) {
      setBankOptions([]);
      setValue("bankName", "");
      return;
    }
    try {
      setLoading(true);
      const res = await apiService.get(
        `/transaction/getBankDropdown?chequeNo=${chqNo}`,
      );
      if (res?.success && Array.isArray(res.data)) {
        const banks = res.data.map((item) => ({
          value: String(item.NUM_REC_BANKID),
          label: item.VAR_REC_BANKNM,
        }));
        setBankOptions(banks);
        if (banks.length === 1) {
          setValue("bankName", banks[0].value);
        } else {
          setValue("bankName", "");
        }
      } else {
        setBankOptions([]);
        setValue("bankName", "");
      }
    } catch (err) {
      alert(err.message);
      setBankOptions([]);
      setValue("bankName", "");
    } finally {
      setLoading(false);
    }
  };

  const handleChequeBlur = async () => {
    const chqNo = getValues("chequeNumber")?.trim();
    await loadBanks(chqNo);
  };

  // Search handler
  const handleSearch = async () => {
    const values = getValues();

    if (!values.chequeNumber?.trim()) {
      alert("Please enter Cheque no");
      return;
    }
    if (!values.bankName) {
      alert("Please select Bank");
      return;
    }

    const payload = {
      ulbId: Number(ulbid),
      chequeNo: values.chequeNumber.trim(),
      bankId: Number(values.bankName),
    };

    if (values.zoneName) payload.zoneId = Number(values.zoneName);
    if (values.chequeAmount) payload.chequeAmount = Number(values.chequeAmount);
    if (values.receiptDate) payload.receiptDate = values.receiptDate;
    if (values.mobileNumber?.trim())
      payload.mobileNo = values.mobileNumber.trim();

    try {
      setLoading(true);
      const res = await apiService.post(
        "/transaction/searchChequeBounce",
        payload,
      );

      if (res?.success && res?.data?.length > 0) {
        const rows = res.data.map((r) => ({
          checked: false,
          ZONEID: r.ZONEID,
          ZONENAME: r.ZONENAME,
          WARDNO: r.WARDNO,
          CONNID: r.CONNID,
          REC_ID: r.REC_ID,
          RECEIPTNO: r.RECEIPTNO,
          BOOKNO: r.BOOKNO,
          OWNERNAME: r.OWNERNAME,
          AMOUNT: r.AMOUNT,
          RECEIPTDATE: r.RECEIPTDATE,
          MOBILE: r.MOBILE,
        }));
        replace(rows);
        setHasResults(true);
      } else {
        alert("No data found");
        replace([]);
        setHasResults(false);
      }
    } catch (err) {
      console.error("Search error:", err);
      alert(err.message);
      replace([]);
      setHasResults(false);
    } finally {
      setLoading(false);
    }
  };

  // Process handler
  const handleProcess = async () => {
    const values = getValues();

    if (!values.chequeNumber?.trim()) {
      alert("Enter Cheque No");
      return;
    }
    if (!values.bankName) {
      alert("Invalid bank selection");
      return;
    }
    if (!values.reason) {
      alert("Please select Reason");
      return;
    }

    const rows = values.tableRow || [];
    const checkedRows = rows.filter((r) => r.checked);

    if (checkedRows.length === 0) {
      alert("Select atleast one Connection");
      return;
    }

    // zone_id$Connection Id$Receipt No
    const connrecstr = checkedRows
      .map((r) => `${r.ZONEID}$${r.CONNID}$${r.REC_ID}`)
      .join("#");

    const zoneId = values.zoneName || checkedRows[0].ZONEID;

    try {
      setLoading(true);
      const ip = await GetIPAddress();

      const payload = {
        in_userid: userId,
        in_ulbid: Number(ulbid),
        in_zoneid: Number(zoneId),
        in_chequeno: Number(values.chequeNumber),
        in_bankid: Number(values.bankName),
        in_proprecstr: connrecstr,
        in_remark: String(values.reason),
        in_ipaddress: ip,
        in_source: config.source,
        in_FinYear: getFinancialYear(),
      };

      const res = await apiService.post(
        "/transaction/aowt_chequebounce_ins",
        payload,
      );

      if (res?.success && res?.data?.out_errorcode === 9999) {
        alert(res.data.out_errormssg || "Cheque bounce processed successfully");
        handleReset();
      } else {
        alert(
          res?.data?.out_errormssg ||
            res?.message ||
            "Failed to process cheque bounce",
        );
      }
    } catch (err) {
      console.error("Process error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset
  const handleReset = () => {
    setBankOptions([]);
    replace([]);
    setHasResults(false);
    reset({
      ulbName: String(ulbid || ""),
      zoneName: "",
      chequeNumber: "",
      bankName: "",
      chequeAmount: "",
      receiptDate: getToday(),
      mobileNumber: "",
      reason: "",
      tableRow: [],
    });
  };

  // Checkbox handlers
  const handleToggleAll = (checked) => {
    const updated = (watchTableRows || []).map((r) => ({ ...r, checked }));
    setValue("tableRow", updated);
  };

  const handleToggleRow = (index, checked) => {
    setValue(`tableRow.${index}.checked`, checked);
  };

  const allChecked =
    fields.length > 0 && (watchTableRows || []).every((r) => r.checked);

  // Total (all rows, matches .NET footer)
  const totalAmount = (watchTableRows || []).reduce(
    (sum, r) => sum + (Number(r.AMOUNT) || 0),
    0,
  );

  // Only digits
  const allowOnlyDigits = (e) => {
    e.target.value = e.target.value.replace(/\D/g, "");
  };

  return (
    <Layout
      title="Cheque Bounce"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Cheque Bounce",
      }}
    >
      <form className="w-full space-y-6" onSubmit={(e) => e.preventDefault()}>
        {/* Row 1: ULB */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label text="ULB Name: " required />
            <select
              disabled
              className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm bg-slate-100 cursor-not-allowed"
              {...register("ulbName")}
            >
              <option value="">-- Select --</option>
              {ulbOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Zone, Cheque No, Bank */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label text="Zone: " required />
            <select
              className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
              {...register("zoneName")}
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
            <Label text="Cheque Number: " required />
            <input
              type="text"
              maxLength={6}
              placeholder="Enter cheque number"
              className="form-input-box w-full"
              onInput={allowOnlyDigits}
              {...register("chequeNumber")}
              onBlur={handleChequeBlur}
            />
          </div>
          <div>
            <Label text="Bank: " required />
            <select
              className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
              {...register("bankName")}
            >
              <option value="">-- Select --</option>
              {bankOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3: Cheque Amt, Receipt Date, Mobile, Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div>
            <Label text="Cheque Amount: " />
            <input
              type="text"
              placeholder="Enter cheque amount"
              className="form-input-box w-full"
              {...register("chequeAmount")}
            />
          </div>
          <div>
            <Label text="Receipt Date: " />
            <input
              type="date"
              className="form-input-box w-full"
              {...register("receiptDate")}
            />
          </div>
          <div>
            <Label text="Mobile Number: " />
            <input
              type="text"
              maxLength={10}
              placeholder="Enter mobile no"
              className="form-input-box w-full"
              onInput={allowOnlyDigits}
              {...register("mobileNumber")}
            />
          </div>
          <div>
            <Button type="button" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </div>

        {/* Grid */}
        {hasResults && fields.length > 0 && (
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[1000px]">
                <thead className="bg-slate-100/95">
                  <tr className="border-b border-slate-200">
                    <th className="px-3 py-3 text-center w-10">
                      <input
                        type="checkbox"
                        className="h-4 w-4 cursor-pointer"
                        checked={allChecked}
                        onChange={(e) => handleToggleAll(e.target.checked)}
                      />
                    </th>
                    <th className="px-3 py-3 text-center text-[12px] font-bold uppercase tracking-wider text-slate-600">
                      Zone Name
                    </th>
                    <th className="px-3 py-3 text-center text-[12px] font-bold uppercase tracking-wider text-slate-600">
                      Connection Id
                    </th>
                    <th className="px-3 py-3 text-center text-[12px] font-bold uppercase tracking-wider text-slate-600">
                      Receipt No
                    </th>
                    <th className="px-3 py-3 text-center text-[12px] font-bold uppercase tracking-wider text-slate-600">
                      Owner Name
                    </th>
                    <th className="px-3 py-3 text-center text-[12px] font-bold uppercase tracking-wider text-slate-600">
                      Amount
                    </th>
                    <th className="px-3 py-3 text-center text-[12px] font-bold uppercase tracking-wider text-slate-600">
                      Receipt Date
                    </th>
                    <th className="px-3 py-3 text-center text-[12px] font-bold uppercase tracking-wider text-slate-600">
                      Mobile
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fields.map((field, index) => (
                    <tr key={field.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2 text-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 cursor-pointer"
                          checked={watchTableRows?.[index]?.checked || false}
                          onChange={(e) =>
                            handleToggleRow(index, e.target.checked)
                          }
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        {field.ZONENAME}
                      </td>
                      <td className="px-3 py-2 text-center">{field.CONNID}</td>
                      <td className="px-3 py-2 text-center">{field.REC_ID}</td>
                      <td className="px-3 py-2">{field.OWNERNAME}</td>
                      <td className="px-3 py-2 text-right">{field.AMOUNT}</td>
                      <td className="px-3 py-2 text-center">
                        {formatDateForDisplay(field.RECEIPTDATE)}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {field.MOBILE || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-100/95">
                  <tr className="border-t border-slate-200">
                    <td colSpan={5} className="px-3 py-2 font-bold text-right">
                      Total
                    </td>
                    <td className="px-3 py-2 font-bold text-right">
                      {totalAmount}
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Reason + Process + Close */}
        {hasResults && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label text="Reason: " required />
                <select
                  className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm"
                  {...register("reason")}
                >
                  <option value="">-- Select --</option>
                  {reasonOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center gap-2 px-5 py-3 border-t border-slate-200 bg-white">
              <Button type="button" onClick={handleProcess}>
                Process
              </Button>
              <Button type="button" onClick={() => navigate("/dashboard")}>
                Close
              </Button>
            </div>
          </>
        )}
      </form>
    </Layout>
  );
};

export default FrmChequeBounce;
