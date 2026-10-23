import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Label from "../../../Components/Label";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmRateList = () => {
  const { user } = useAuth();
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const [ulbOptions, setUlbOptions] = useState([]);
  const [tableData, setTableData] = useState([]);

  const tableHeader = [
    "निवड",
    "Usage Type",
    "Usage Sub Type",
    "Conn Type",
    "Conn Size",
    "Tax",
    "Value Type",
    "From Date",
    "To Date",
    "From Value",
    "To Value",
    "Rate",
    "Min Amt",
  ];

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

  const formatDate = (dateStr) => {
    if (!dateStr) {
      return "-";
    }
    return String(dateStr).split("T")[0].split("-").reverse().join("-");
  };

  // Rate list
  const fetchRateList = async () => {
    if (!ulbid) {
      alert("UlbId is not set");
      setTableData([]);
      return;
    }

    try {
      setLoading(true);
      const res = await apiService.get(`/master/getRateList?ulbId=${ulbid}`);

      if (res?.success && res?.data?.length > 0) {
        const data = res.data.map((item) => [
          <Link
            key={item.RATEID}
            state={{ rateId: item.RATEID }}
            to={`/Masters/FrmRateMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            निवड
          </Link>,
          item.USAGETYPE || "",
          item.USAGESUBTYPE || "",
          item.CONNTYPE || "",
          item.CONNSIZE || "",
          item.TAX || "",
          item.VALUETYPE || "",
          formatDate(item.FROMDATE) || "",
          formatDate(item.TODATE) || "",
          item.FROMVALUE || "",
          item.TOVALUE || "",
          item.RATE || "",
          item.MINAMT || "",
        ]);
        setTableData(data);
      } else {
        setTableData([]);
        alert(res?.data?.message || "Data Not Found");
      }
    } catch (err) {
      console.error("Error fetching rate list:", err);
      setTableData([]);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ulbid) {
      fetchRateList();
    }
  }, [ulbid]);

  return (
    <Layout
      title="Rate List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Rate List",
      }}
    >
      <div className="w-full space-y-6">
        {/* ULB Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label text="नगरपालिकेचे नाव : " required />
            <select
              disabled
              className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                bg-slate-100 cursor-not-allowed"
              value={
                ulbOptions.some((o) => o.value === String(ulbid))
                  ? String(ulbid)
                  : ""
              }
            >
              <option value="">-- Select ULB --</option>
              {ulbOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add New */}
        <div className="flex justify-end">
          <Link to={"/Masters/FrmRateMst"}>
            <Button
              type="button"
              variant="primary"
              className="hover:cursor-pointer"
            >
              Add New
            </Button>
          </Link>
        </div>

        {/* Table */}
        <div className="mt-3">
          {tableData?.length > 0 && (
            <Table headers={tableHeader} data={tableData} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FrmRateList;
