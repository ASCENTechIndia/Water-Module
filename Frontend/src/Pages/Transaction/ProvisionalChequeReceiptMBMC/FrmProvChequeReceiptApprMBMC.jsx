import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Label from "../../../Components/Label";
import Button from "../../../Components/Button.jsx";
import apiService from "../../../../apiService";
import GetIPAddress from "../../../utils/ipHelper.jsx";
import config from "../../../utils/config.jsx";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const formatDateForDisplay = (dateStr) => {
  if (!dateStr) return "";
  const datePart = String(dateStr).split("T")[0];
  if (!datePart) return "";
  const [y, m, d] = datePart.split("-");
  if (!y || !m || !d) return datePart;
  return `${d}-${m}-${y}`;
};

const FrmProvChequeReceiptApprMBMC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const [provRecNo, setProvRecNo] = useState("");
  const [rows, setRows] = useState([]);
  const [remark, setRemark] = useState("");
  const [searched, setSearched] = useState(false);

  // Search handler
  const handleSearch = async () => {
    if (!provRecNo.trim()) {
      alert("Please Enter Provisional Receipt No.");
      return;
    }

    try {
      setLoading(true);
      const res = await apiService.get(
        `/transaction/getProvCheqRecApprDetails?receiptNo=${provRecNo.trim()}`,
      );

      if (res?.success && res?.data?.length > 0) {
        setRows(res.data.map((r) => ({ ...r, checked: true })));
      } else {
        setRows([]);
        alert(res?.message || "No Data Found");
      }
      setSearched(true);
    } catch (err) {
      console.error("Search error:", err);
      setRows([]);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Checkbox handlers
  const handleToggleAll = (checked) => {
    setRows((prev) => prev.map((r) => ({ ...r, checked })));
  };

  const handleToggleRow = (idx, checked) => {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, checked } : r)));
  };

  const getSelectedRows = () => rows.filter((r) => r.checked);

  // Approve handler
  const handleApprove = async () => {
    if (!userId || !ulbid) {
      alert("User Id or Ulb Id is not set");
      return;
    }
    if (!remark.trim()) {
      alert("Please Enter Remark");
      return;
    }

    const selected = getSelectedRows();
    if (selected.length === 0) {
      alert("Please select at least one row");
      return;
    }

    // Format: wardId^zoneId^blockId^connId#...
    const IN_str = selected
      .map((r) => `${r.WARDID}^${r.ZONEID}^${r.BLOCKID}^${r.CONNID}`)
      .join("#");

    try {
      setLoading(true);
      const ip = await GetIPAddress();

      const payload = {
        In_ULBID: Number(ulbid),
        IN_str,
        In_UserId: userId,
        in_ProvRecNo: provRecNo.trim(),
        in_ipaddress: ip,
        in_projectsource: config.source,
        in_Remark: remark.trim(),
      };

      const res = await apiService.post(
        "/transaction/aowt_provrecapprMultiple_ins",
        payload,
      );

      if (res?.success && res?.data?.Out_ErrorCode === 9999) {
        alert(res.data.Out_ErrorMsg || "Receipts approved successfully");

        handleReset();
      } else {
        alert(
          res?.data?.Out_ErrorMsg ||
            res?.message ||
            "Failed to approve receipt(s)",
        );
      }
    } catch (err) {
      console.error("Approve error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Reject handler
  const handleReject = async () => {
    if (!userId || !ulbid) {
      alert("User Id or Ulb Id is not set");
      return;
    }
    if (!remark.trim()) {
      alert("Please Enter Remark");
      return;
    }

    const selected = getSelectedRows();
    if (selected.length === 0) {
      alert("Please select at least one row");
      return;
    }

    // Format: connId^cheqNo#... cheqNo = INSTRUNO
    const in_strprovrej = selected
      .map((r) => `${r.CONNID}^${r.INSTRUNO}`)
      .join("#");

    //last row's values for the In_connID / In_CheqNo
    const lastRow = selected[selected.length - 1];

    try {
      setLoading(true);
      const ip = await GetIPAddress();

      const payload = {
        In_UserId: userId,
        In_ULBID: Number(ulbid),
        In_connID: Number(lastRow.CONNID),
        In_Remark: remark.trim(),
        In_CheqNo: String(lastRow.INSTRUNO),
        In_ProvRecNo: provRecNo.trim(),
        in_mode: 2,
        in_strprovrej,
        in_ipaddress: ip,
        in_projectsource: config.source,
      };

      const res = await apiService.post(
        "/transaction/aowt_provrecreject_ins",
        payload,
      );

      // Reject SP uses -100 for success
      if (res?.success && res?.data?.Out_ErrorCode === -100) {
        alert(res.data.Out_ErrorMsg || "Receipt(s) rejected successfully");

        handleReset();
      } else {
        alert(
          res?.data?.Out_ErrorMsg ||
            res?.message ||
            "Failed to reject receipt(s)",
        );
      }
    } catch (err) {
      console.error("Reject error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset
  const handleReset = () => {
    setProvRecNo("");
    setRows([]);
    setRemark("");
    setSearched(false);
  };

  const allChecked = rows.length > 0 && rows.every((r) => r.checked);

  return (
    <Layout
      title="Provisional Cheque Receipt Approval"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Provisional Cheque Receipt Approval",
      }}
    >
      <div className="w-full space-y-6">
        {/* Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div>
            <Label text="Provisional Receipt No.: " required />
            <input
              type="text"
              placeholder="Enter provisional receipt no"
              className="form-input-box w-full"
              value={provRecNo}
              onChange={(e) => setProvRecNo(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
          </div>
          <div>
            <Button type="button" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </div>

        {/* Table — only shown after search */}
        {searched && (
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[1200px]">
                <thead className="bg-slate-100/95">
                  <tr className="border-b border-slate-200">
                    <th className="px-3 py-3 text-center w-10">
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-blue-600 cursor-pointer"
                        checked={allChecked}
                        onChange={(e) => handleToggleAll(e.target.checked)}
                      />
                    </th>
                    {[
                      "Receipt No.",
                      "Ward",
                      "Zone",
                      "Block",
                      "Book No.",
                      "Owner Name",
                      "Instrument No.",
                      "Receipt Date",
                      "Amount",
                      "Discount",
                      "Payment Mode",
                      "Connection No.",
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
                  {rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={13}
                        className="px-3 py-6 text-center text-sm text-slate-500"
                      >
                        No Record Found
                      </td>
                    </tr>
                  ) : (
                    rows.map((row, idx) => (
                      <tr
                        key={`${row.CONNID}-${idx}`}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-3 py-2 text-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4 accent-blue-600 cursor-pointer"
                            checked={row.checked || false}
                            onChange={(e) =>
                              handleToggleRow(idx, e.target.checked)
                            }
                          />
                        </td>
                        <td className="px-3 py-2 text-sm text-center">
                          {row.PROVRECNO || ""}
                        </td>
                        <td className="px-3 py-2 text-sm text-center">
                          {row.WARD_NAME || ""}
                        </td>
                        <td className="px-3 py-2 text-sm text-center">
                          {row.ZONE_NAME || ""}
                        </td>
                        <td className="px-3 py-2 text-sm text-center">
                          {row.BLOCK_NAME || ""}
                        </td>
                        <td className="px-3 py-2 text-sm text-center">
                          {row.BOOKNO || ""}
                        </td>
                        <td className="px-3 py-2 text-sm text-center">
                          {row.OWNERNAME || ""}
                        </td>
                        <td className="px-3 py-2 text-sm text-center">
                          {row.INSTRUNO || ""}
                        </td>
                        <td className="px-3 py-2 text-sm text-center">
                          {formatDateForDisplay(row.RECEIPTDT)}
                        </td>
                        <td className="px-3 py-2 text-sm text-center">
                          {row.AMOUNT ?? ""}
                        </td>
                        <td className="px-3 py-2 text-sm text-center">
                          {row.TOTDISCAMT ?? ""}
                        </td>
                        <td className="px-3 py-2 text-sm text-center">
                          {row.RECMODNAME || ""}
                        </td>
                        <td className="px-3 py-2 text-sm text-center">
                          {row.CONNNO || ""}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Remark + Buttons — only shown when results exist */}
        {searched && rows.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <Label text="Remark: " required />
                <input
                  type="text"
                  placeholder="Enter remark"
                  className="form-input-box w-full"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-center gap-2">
              <Button type="button" onClick={handleApprove}>
                Approve
              </Button>
              <Button type="button" onClick={handleReject}>
                Reject
              </Button>
              <Button type="button" onClick={() => navigate("/dashboard")}>
                Back
              </Button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default FrmProvChequeReceiptApprMBMC;
