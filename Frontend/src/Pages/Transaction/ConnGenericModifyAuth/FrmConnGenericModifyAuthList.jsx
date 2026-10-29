import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button.jsx";
import apiService from "../../../../apiService";
import GetIPAddress from "../../../utils/ipHelper.jsx";
import config from "../../../utils/config.jsx";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmConnGenericModifyAuthList = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);

  const fetchList = async () => {
    if (!ulbid) {
      alert("UlbId is not set");
      return;
    }
    try {
      setLoading(true);
      const res = await apiService.get(
        `/transaction/getGenModAuthList?ulbId=${ulbid}`,
      );

      if (res?.success && Array.isArray(res.data)) {
        setRows(
          res.data.map((item) => ({
            ...item,
            status: "",
            remark: "",
          })),
        );
      } else {
        setRows([]);
      }
    } catch (err) {
      console.error("Gen mod auth list error:", err);
      setRows([]);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };
  // Fetch list
  useEffect(() => {
    if (ulbid) {
      fetchList();
    }
  }, [ulbid]);

  // Update a single row's field
  const updateRow = (idx, field, value) => {
    setRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r)),
    );
  };

  // Submit bulk authorize
  const handleSubmit = async () => {
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (!r.status) {
        alert("Please select Accept or Reject");
        return;
      }
      if (!r.remark?.trim()) {
        alert("Please Fill Remark");
        return;
      }
      // Guard against reserved chars breaking the string format
      if (/[#$]/.test(r.remark)) {
        alert(`Row ${i + 1}: Remark cannot contains proper # or $ characters`);
        return;
      }
    }

    if (!userId || !ulbid) {
      alert("User Id or Ulb Id is not set");
      return;
    }

    // Format: ulbId#connId#connGenModId#authStatus#remark$ulbId#...
    const in_Conndetailsstr = rows
      .map(
        (r) =>
          `${r.ULBID}#${r.CONNID}#${r.CONNGENMODID}#${r.status}#${r.remark.trim()}`,
      )
      .join("$");

    try {
      setLoading(true);
      const ip = await GetIPAddress();

      const payload = {
        in_UserId: userId,
        in_ULBID: Number(ulbid),
        in_Conndetailsstr,
        in_ipaddress: ip,
        in_source: config.source,
      };

      const res = await apiService.post(
        "/transaction/aowt_Connectiongenericauth_ins",
        payload,
      );

      if (res?.success && res?.data?.Out_errorCode === 9999) {
        alert(res.data.Out_ErrorMsg || "Authorised Successfully");
        fetchList();
      } else {
        alert(
          res?.data?.Out_ErrorMsg ||
            res?.message ||
            "Failed to process authorization",
        );
      }
    } catch (err) {
      console.error("Bulk auth error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Connection Generic Modify Authorization List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Connection Generic Modify Authorization List",
      }}
    >
      <div className="w-full space-y-6">
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[1200px]">
              <thead className="bg-slate-100/95">
                <tr className="border-b border-slate-200">
                  {[
                    "Connection No.",
                    "Zone",
                    "Ward",
                    "Name",
                    "Address",
                    "Details",
                    "User",
                    "Status",
                    "Remark",
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
                      colSpan={9}
                      className="px-3 py-6 text-center text-sm text-slate-500"
                    >
                      No Record Found
                    </td>
                  </tr>
                ) : (
                  rows.map((row, idx) => (
                    <tr
                      key={`${row.CONNGENMODID}-${idx}`}
                      className="hover:bg-slate-50"
                    >
                      <td className="border border-slate-200 px-3 py-2 text-sm text-center">
                        {row.CONNNO}
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-sm text-center">
                        {row.ZONENAME}
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-sm text-center">
                        {row.WARDNAME}
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-sm text-center">
                        {row.OWNRNAME}
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-sm text-center">
                        {row.ADDRESS}
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-center">
                        <Link
                          to="/Transaction/FrmConnGenericModifyAuthMst"
                          state={{
                            ulbId: row.ULBID,
                            connId: row.CONNID,
                            connGenModId: row.CONNGENMODID,
                          }}
                          className="inline-block text-blue-600 underline hover:text-blue-800 font-medium"
                        >
                          Details
                        </Link>
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-sm text-center">
                        {row.USERNAME}
                      </td>
                      <td className="border border-slate-200 px-3 py-2">
                        <div className="flex items-center justify-center gap-4">
                          <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                            <input
                              type="radio"
                              name={`status-${idx}`}
                              value="A"
                              className="w-4 h-4 accent-blue-600 cursor-pointer"
                              checked={row.status === "A"}
                              onChange={() => updateRow(idx, "status", "A")}
                            />
                            Approve
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                            <input
                              type="radio"
                              name={`status-${idx}`}
                              value="R"
                              className="w-4 h-4 accent-blue-600 cursor-pointer"
                              checked={row.status === "R"}
                              onChange={() => updateRow(idx, "status", "R")}
                            />
                            Reject
                          </label>
                        </div>
                      </td>
                      <td className="border border-slate-200 px-2 py-2">
                        <input
                          type="text"
                          placeholder="Enter remark"
                          className="form-input-box w-full"
                          value={row.remark}
                          onChange={(e) =>
                            updateRow(idx, "remark", e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {rows.length > 0 && (
          <div className="flex justify-center gap-2">
            <Button type="button" onClick={handleSubmit}>
              साठवा
            </Button>
            <Button type="button" onClick={() => navigate("/dashboard")}>
              बंद
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FrmConnGenericModifyAuthList;
