import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Label from "../../../Components/Label";
import Button from "../../../Components/Button.jsx";
import apiService from "../../../../apiService";
import { useLoader } from "../../../Context/LoaderContext";

const FrmChangeOwnershipAuth = () => {
  const navigate = useNavigate();
  const { setLoading } = useLoader();

  const [appNo, setAppNo] = useState("");
  const [rows, setRows] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    const applicationNo = appNo.trim();

    if (!applicationNo) {
      alert("Please Enter Application No.");
      return;
    }

    try {
      setLoading(true);
      const res = await apiService.get(
        `/transaction/getOwnershipAuthList?applicationNo=${applicationNo}`,
      );

      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        setRows(
          res.data.map((item) => ({
            id: item.NUM_SERVAPPLI_ID,
            applicationNo: item.VAR_SERVAPPLI_APPLINO,
            applicantName: item.VAR_SERVAPPLI_APPLICANTNAME,
            remark: "",
            status: "",
          })),
        );
      } else {
        setRows([]);
      }
      setSearched(true);
    } catch (err) {
      console.error("Ownership auth list error:", err);
      setRows([]);
      setSearched(true);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update remark / status of a single row
  const updateRow = (id, field, value) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  };

  // View document (you will implement this)
  const handleView = (row) => {
    console.log("View doc for:", row);
    if (!row.id || !row.applicationNo) {
      alert(
        "Application No and application Id is not set, please search again",
      );
      return;
    }
    window.open(
      `/Transaction/FrmViewDocument?appId=${row.id}&appNo=${row.applicationNo}`,
      "_blank",
      "width=900,height=600",
    );
  };

  // Details (you will implement this)
  const handleDetails = (row) => {
    // TODO: navigate to the master page with the row data
    console.log("Details for:", row);
  };

  // Submit handler (API not wired yet)
  const handleSubmit = () => {
    const selected = rows.filter((r) => r.status);

    if (selected.length === 0) {
      alert("Please select atleast one Approve or Reject");
      return;
    }

    const missingRemark = selected.find((r) => !r.remark.trim());
    if (missingRemark) {
      alert("Please Enter Remark");
      return;
    }

    // Same string format the .NET page builds: id$applicationNo$status$remark#...
    const authString = selected
      .map((r) => `${r.id}$${r.applicationNo}$${r.status}$${r.remark.trim()}`)
      .join("#");

    console.log("Auth string:", authString);
    // TODO: call the submit API when it is ready
  };

  return (
    <Layout
      title="Change Ownership Authorization List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Change Ownership Authorization List",
      }}
    >
      <div className="w-full space-y-6">
        {/* Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div>
            <Label text="Application No: " required />
            <input
              type="text"
              placeholder="Enter application no"
              className="form-input-box w-full"
              value={appNo}
              onChange={(e) => setAppNo(e.target.value)}
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

        {/* Results */}
        {searched && (
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-slate-100/95">
                  <tr className="border-b border-slate-200">
                    {[
                      "अर्ज क्र.",
                      "Application Name",
                      "Attach Doc",
                      "Details",
                      "Remark",
                      "Approval",
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
                        colSpan={6}
                        className="px-3 py-6 text-center text-sm text-slate-500"
                      >
                        No Record Found
                      </td>
                    </tr>
                  ) : (
                    rows.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50">
                        <td className="border border-slate-200 px-3 py-2 text-center text-sm">
                          {row.applicationNo}
                        </td>
                        <td className="border border-slate-200 px-3 py-2 text-center text-sm">
                          {row.applicantName}
                        </td>
                        <td className="border border-slate-200 px-3 py-2 text-center">
                          <Button type="button" onClick={() => handleView(row)}>
                            View
                          </Button>
                        </td>
                        <td className="border border-slate-200 px-3 py-2 text-center">
                          <Button
                            type="button"
                            onClick={() => handleDetails(row)}
                          >
                            Detail
                          </Button>
                        </td>
                        <td className="border border-slate-200 px-2 py-2">
                          <input
                            type="text"
                            placeholder="Enter remark"
                            className="form-input-box w-full"
                            value={row.remark}
                            onChange={(e) =>
                              updateRow(row.id, "remark", e.target.value)
                            }
                          />
                        </td>
                        <td className="border border-slate-200 px-3 py-2">
                          <div className="flex items-center justify-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                              <input
                                type="radio"
                                name={`approval-${row.id}`}
                                value="A"
                                className="w-4 h-4 accent-blue-600 cursor-pointer"
                                checked={row.status === "A"}
                                onChange={() =>
                                  updateRow(row.id, "status", "A")
                                }
                              />
                              Approve
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                              <input
                                type="radio"
                                name={`approval-${row.id}`}
                                value="R"
                                className="w-4 h-4 accent-blue-600 cursor-pointer"
                                checked={row.status === "R"}
                                onChange={() =>
                                  updateRow(row.id, "status", "R")
                                }
                              />
                              Reject
                            </label>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Submit + Close (only when there are results, like the .NET page) */}
        {rows.length > 0 && (
          <div className="flex justify-center gap-2">
            <Button type="button" onClick={handleSubmit}>
              Submit
            </Button>
            <Button type="button" onClick={() => navigate("/dashboard")}>
              Close
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FrmChangeOwnershipAuth;
