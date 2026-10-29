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

const FrmConnGenericModifyAuthMst = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const stateUlbId = state?.ulbId;
  const stateConnId = state?.connId;
  const stateConnGenModId = state?.connGenModId;

  const [details, setDetails] = useState([]);

  const { register, getValues } = useForm({
    defaultValues: {
      remark: "",
    },
  });

  // Fetch details on mount
  useEffect(() => {
    if (!stateUlbId || !stateConnId || !stateConnGenModId) {
      alert("Missing connection details, please go back and try again");
      return;
    }

    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await apiService.get(
          `/transaction/fetchGenAuthDetails?ulbId=${stateUlbId}&connId=${stateConnId}&connGenModId=${stateConnGenModId}`,
        );
        if (res?.success && res?.data?.length > 0) {
          setDetails(res.data);
        } else {
          setDetails([]);
          alert(res?.message || "Data Not Found");
        }
      } catch (err) {
        console.error("Fetch details error:", err);
        setDetails([]);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [stateUlbId, stateConnId, stateConnGenModId]);

  // Shared submit handler — used by both Approve and Reject buttons
  const submitAuth = async (authStatus) => {
    const remark = getValues("remark")?.trim();

    if (!remark) {
      alert("Please Fill Remark");
      return;
    }
    if (/[#$]/.test(remark)) {
      alert("Remark cannot contain # or $ characters");
      return;
    }
    if (details.length === 0) {
      alert("No details to authorize");
      return;
    }
    if (!userId || !ulbid) {
      alert("User Id or Ulb Id is not set");
      return;
    }

    // Single-record string (all grid rows share the same ulbId/connId/connGenModId)
    // Format: ulbId#connId#connGenModId#authStatus#remark
    const in_Conndetailsstr = `${stateUlbId}#${stateConnId}#${stateConnGenModId}#${authStatus}#${remark}`;

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
        navigate("/Transaction/FrmConnGenericModifyAuthList");
      } else {
        alert(
          res?.data?.Out_ErrorMsg ||
            res?.message ||
            "Failed to process authorization",
        );
      }
    } catch (err) {
      console.error("Master auth error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const connNo = details[0]?.CONNNO || "";

  return (
    <Layout
      title="Connection Generic Modify Authorization Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Connection Generic Modify Authorization Master",
      }}
    >
      <div className="w-full space-y-6">
        {/* Connection No — disabled */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label text="Connection No.: " required />
            <input
              type="text"
              className="form-input-box w-full bg-slate-100 cursor-not-allowed"
              value={connNo}
              disabled
              readOnly
            />
          </div>
        </div>

        {/* Attribute changes table */}
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-100/95">
                <tr className="border-b border-slate-200">
                  <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600 w-1/3"></th>
                  <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                    Existing Value
                  </th>
                  <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                    New Value
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {details.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-3 py-6 text-center text-sm text-slate-500"
                    >
                      No Record Found
                    </td>
                  </tr>
                ) : (
                  details.map((row, idx) => {
                    const isChanged =
                      String(row.OLDVALUE ?? "").trim() !==
                      String(row.NEWVALUE ?? "").trim();

                    return (
                      <tr
                        key={`${row.CONNGENMODID}-${idx}`}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-3 py-2 text-sm text-slate-700">
                          {row.NAME1 || ""}
                        </td>
                        <td
                          className={`px-3 py-2 text-sm ${
                            isChanged
                              ? "text-red-600 font-medium"
                              : "text-slate-700"
                          }`}
                        >
                          {row.OLDVALUE ?? ""}
                        </td>
                        <td
                          className={`px-3 py-2 text-sm ${
                            isChanged
                              ? "text-red-600 font-medium"
                              : "text-slate-700"
                          }`}
                        >
                          {row.NEWVALUE ?? ""}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Remark — enabled */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label text="Remark: " required />
            <input
              type="text"
              placeholder="Enter remark"
              className="form-input-box w-full"
              {...register("remark", { required: "Remark is required" })}
            />
          </div>
        </div>

        {/* Buttons — Approve / Reject / Back */}
        <div className="flex justify-center gap-2">
          <Button
            type="button"
            onClick={() => submitAuth("A")}
            disabled={details.length === 0}
          >
            मंजूर
          </Button>
          <Button
            type="button"
            onClick={() => submitAuth("R")}
            disabled={details.length === 0}
          >
            रद्द
          </Button>
          <Button
            type="button"
            onClick={() =>
              navigate("/Transaction/FrmConnGenericModifyAuthList")
            }
          >
            परत
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default FrmConnGenericModifyAuthMst;
