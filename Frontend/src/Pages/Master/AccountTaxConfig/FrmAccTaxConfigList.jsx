import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Label from "../../../Components/Label";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmAccTaxConfigList = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  const [ulbOptions, setUlbOptions] = useState([]);
  const [selectedUlb, setSelectedUlb] = useState("");
  const [tableData, setTableData] = useState([]);

  const tableHeader = [
    "निवडा",
    "Tax Name",
    "Tax Code",
    "AccTax UsageType Code",
    "Arreas MinorCode",
    "Arreas MajorCode",
    "C MinorCode",
    "C MajorCode",
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

  // ---------- Load Acc Tax Config list (DUMMY) ----------
  const fetchAccTaxConfigList = async () => {
    try {
      setLoading(true);

      // 🔸 DUMMY — replace with apiService.post("getAccTaxConfigList", { ulbId: Number(selectedUlb) })
      const dummyData = [
        {
          ACCTAXCONFIGID: 1,
          TAXNAME: "Water Tax",
          TAXCODE: "WT01",
          USAGETYPECODE: "RES",
          ARREASMINORCODE: "AR-MIN-01",
          ARREASMAJORCODE: "AR-MAJ-01",
          CMINORCODE: "C-MIN-01",
          CMAJORCODE: "C-MAJ-01",
        },
        {
          ACCTAXCONFIGID: 2,
          TAXNAME: "Sewerage Tax",
          TAXCODE: "ST01",
          USAGETYPECODE: "COM",
          ARREASMINORCODE: "AR-MIN-02",
          ARREASMAJORCODE: "AR-MAJ-02",
          CMINORCODE: "C-MIN-02",
          CMAJORCODE: "C-MAJ-02",
        },
      ];

      if (dummyData.length > 0) {
        const data = dummyData.map((item) => [
          <Link
            key={item.ACCTAXCONFIGID}
            state={{ accTaxConfigId: item.ACCTAXCONFIGID }}
            to={`/Masters/FrmAccTaxConfigMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            निवडा
          </Link>,
          item.TAXNAME || "",
          item.TAXCODE || "",
          item.USAGETYPECODE || "",
          item.ARREASMINORCODE || "",
          item.ARREASMAJORCODE || "",
          item.CMINORCODE || "",
          item.CMAJORCODE || "",
        ]);
        setTableData(data);
      } else {
        alert("No record found");
        setTableData([]);
      }

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.post("getAccTaxConfigList", {
      //   ulbId: Number(selectedUlb),
      //   userId: String(userId),
      // });
      // if (res?.data?.success && res?.data?.data?.length > 0) {
      //   const data = res.data.data.map((item) => [
      //     <Link
      //       key={item.ACCTAXCONFIGID}
      //       state={{ accTaxConfigId: item.ACCTAXCONFIGID }}
      //       to={`/Masters/FrmAccTaxConfigMst`}
      //       className="text-blue-600 underline hover:text-blue-800 font-medium"
      //     >
      //       निवडा
      //     </Link>,
      //     item.TAXNAME || "",
      //     item.TAXCODE || "",
      //     item.USAGETYPECODE || "",
      //     item.ARREASMINORCODE || "",
      //     item.ARREASMAJORCODE || "",
      //     item.CMINORCODE || "",
      //     item.CMAJORCODE || "",
      //   ]);
      //   setTableData(data);
      // } else {
      //   alert("No record found");
      //   setTableData([]);
      // }
    } catch (error) {
      setTableData([]);
      console.error("Error fetching acc tax config list:", error);
      alert("Failed to fetch account tax config list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedUlb) {
      setTableData([]);
      return;
    }
    fetchAccTaxConfigList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUlb]);

  return (
    <Layout
      title="Account Tax Config List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Account Tax Config List",
      }}
    >
      <div className="w-full space-y-6">
        {/* ---------- ULB Filter ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label text="Ulb Name : " required />
            <select
              className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              value={selectedUlb}
              onChange={(e) => setSelectedUlb(e.target.value)}
            >
              <option value="">-- Select Ulb --</option>
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
          <Link to={"/Masters/FrmAccTaxConfigMst"}>
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

export default FrmAccTaxConfigList;