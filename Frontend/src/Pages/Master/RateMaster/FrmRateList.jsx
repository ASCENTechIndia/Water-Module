import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Label from "../../../Components/Label";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmRateList = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  const [ulbOptions, setUlbOptions] = useState([]);
  const [selectedUlb, setSelectedUlb] = useState("");
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

  // ---------- Load ULB dropdown (DUMMY) ----------
  useEffect(() => {
    // 🔸 DUMMY — replace with apiService.get("getUlbDropdown") later
    setUlbOptions([
      { value: "1", label: "Pune Municipal Corporation" },
      { value: "2", label: "Mumbai Municipal Corporation" },
      { value: "3", label: "Nashik Municipal Corporation" },
      { value: "4", label: "Nagpur Municipal Corporation" },
    ]);

    // 🔸 REAL API — uncomment when ready
    // const fetchUlb = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.get("getUlbDropdown");
    //     if (res?.data?.success && Array.isArray(res.data.data)) {
    //       setUlbOptions(
    //         res.data.data.map((item) => ({
    //           value: String(item.CORPORATIONID),
    //           label: item.CORPORATIONNAME,
    //         })),
    //       );
    //     } else {
    //       setUlbOptions([]);
    //     }
    //   } catch (err) {
    //     console.error("ULB dropdown error:", err);
    //     setUlbOptions([]);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchUlb();
  }, []);

  // ---------- Load rate list when ULB changes (DUMMY) ----------
  const fetchRateList = async () => {
    try {
      setLoading(true);

      // 🔸 DUMMY — replace with apiService.post("getRateList", { ulbId: Number(selectedUlb) })
      const dummyData = [
        {
          RATEID: 1,
          USAGETYPE: "Residential",
          USAGESUBTYPE: "Domestic",
          CONNTYPE: "Metered",
          CONNSIZE: "15mm",
          TAX: "5%",
          VALUETYPE: "Slab",
          FROMDATE: "01/04/2024",
          TODATE: "31/03/2025",
          FROMVALUE: "0",
          TOVALUE: "10",
          RATE: "12.50",
          MINAMT: "100",
        },
        {
          RATEID: 2,
          USAGETYPE: "Commercial",
          USAGESUBTYPE: "Shop",
          CONNTYPE: "Metered",
          CONNSIZE: "25mm",
          TAX: "12%",
          VALUETYPE: "Slab",
          FROMDATE: "01/04/2024",
          TODATE: "31/03/2025",
          FROMVALUE: "11",
          TOVALUE: "25",
          RATE: "25.00",
          MINAMT: "250",
        },
      ];

      if (dummyData.length > 0) {
        const data = dummyData.map((item) => [
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
          item.FROMDATE || "",
          item.TODATE || "",
          item.FROMVALUE || "",
          item.TOVALUE || "",
          item.RATE || "",
          item.MINAMT || "",
        ]);
        setTableData(data);
      } else {
        alert("No record found");
        setTableData([]);
      }

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.post("getRateList", {
      //   ulbId: Number(selectedUlb),
      //   userId: String(userId),
      // });
      // if (res?.data?.success && res?.data?.data?.length > 0) {
      //   const data = res.data.data.map((item) => [
      //     <Link
      //       key={item.RATEID}
      //       state={{ rateId: item.RATEID }}
      //       to={`/Masters/FrmRateMst`}
      //       className="text-blue-600 underline hover:text-blue-800 font-medium"
      //     >
      //       निवड
      //     </Link>,
      //     item.USAGETYPE || "",
      //     item.USAGESUBTYPE || "",
      //     item.CONNTYPE || "",
      //     item.CONNSIZE || "",
      //     item.TAX || "",
      //     item.VALUETYPE || "",
      //     item.FROMDATE || "",
      //     item.TODATE || "",
      //     item.FROMVALUE || "",
      //     item.TOVALUE || "",
      //     item.RATE || "",
      //     item.MINAMT || "",
      //   ]);
      //   setTableData(data);
      // } else {
      //   alert("No record found");
      //   setTableData([]);
      // }
    } catch (error) {
      setTableData([]);
      console.error("Error fetching rate list:", error);
      alert("Failed to fetch rate list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedUlb) {
      setTableData([]);
      return;
    }
    fetchRateList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUlb]);

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
        {/* ---------- ULB Filter ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label text="नगरपालिकेचे नाव : " required />
            <select
              className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              value={selectedUlb}
              onChange={(e) => setSelectedUlb(e.target.value)}
            >
              <option value="" disabled>
                -- Select ULB --
              </option>
              {ulbOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ---------- Add New ---------- */}
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

        {/* ---------- Table ---------- */}
        <div className="mt-3">
          <Table headers={tableHeader} data={tableData} />
        </div>
      </div>
    </Layout>
  );
};

export default FrmRateList;
