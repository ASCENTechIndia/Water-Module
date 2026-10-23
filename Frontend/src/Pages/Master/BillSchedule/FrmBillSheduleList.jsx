import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Label from "../../../Components/Label";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmBillSheduleList = () => {
  const { user } = useAuth();
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const [ulbOptions, setUlbOptions] = useState([]);
  const [tableData, setTableData] = useState([]);

  const tableHeader = [
    "Select",
    "Billing Frequency",
    "From Month",
    "To Month",
    "Schedule Status",
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

  // Bill schedule list
  const fetchBillSheduleList = async () => {
    if (!ulbid) {
      alert("UlbId is not set");
      setTableData([]);
      return;
    }

    try {
      setLoading(true);
      const res = await apiService.get(
        `/master/getBillScheduleList?ulbId=${ulbid}`,
      );

      if (res?.success && res?.data?.length > 0) {
        const data = res.data.map((item) => [
          <Link
            key={item.NUM_BILSCHED_ID}
            state={{ scheduleId: item.NUM_BILSCHED_ID }}
            to={`/Masters/FrmBillSheduleMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.VAR_BILLINGTYPE_NAME || "",
          item.VAR_BILSCHED_FROMMNAME || "",
          item.VAR_BILSCHED_TOMNAME || "",
          item.STATUS || "",
        ]);
        setTableData(data);
      } else {
        setTableData([]);
        alert(res?.message || "Data Not Found");
      }
    } catch (err) {
      console.error("Error fetching bill schedule list:", err);
      setTableData([]);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ulbid) {
      fetchBillSheduleList();
    }
  }, [ulbid]);

  return (
    <Layout
      title="Bill Schedule List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Bill Schedule List",
      }}
    >
      <div className="w-full space-y-6">
        {/* ULB Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label text="ULB Name : " required />
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
          <Link to={"/Masters/FrmBillSheduleMst"}>
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

export default FrmBillSheduleList;
