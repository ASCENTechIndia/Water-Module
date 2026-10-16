import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmBillFreqList = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const tableHeader = ["Select", "BillFreq Name", "Status"];

  const fetchBillFreqList = async () => {
    try {
      setLoading(true);

      // 🔸 DUMMY — replace with apiService.get("getBillFreqList")
      const dummyData = [
        { BILLFREQID: 1, BILLFREQNAME: "Monthly", ISACTIVE: "Y" },
        { BILLFREQID: 2, BILLFREQNAME: "Quarterly", ISACTIVE: "Y" },
        { BILLFREQID: 3, BILLFREQNAME: "Half Yearly", ISACTIVE: "N" },
        { BILLFREQID: 4, BILLFREQNAME: "Yearly", ISACTIVE: "Y" },
      ];

      if (dummyData.length > 0) {
        const data = dummyData.map((item) => [
          <Link
            key={item.BILLFREQID}
            state={{ billFreqId: item.BILLFREQID }}
            to={`/Masters/FrmBillFreqMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.BILLFREQNAME || "",
          item.ISACTIVE === "Y" ? "Yes" : "No",
        ]);
        setTableData(data);
      } else {
        alert("No record found");
        setTableData([]);
      }

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.get("getBillFreqList");
      // if (res?.data?.success && res?.data?.data?.length > 0) {
      //   const data = res.data.data.map((item) => [
      //     <Link
      //       key={item.BILLFREQID}
      //       state={{ billFreqId: item.BILLFREQID }}
      //       to={`/Masters/FrmBillFreqMst`}
      //       className="text-blue-600 underline hover:text-blue-800 font-medium"
      //     >
      //       Select
      //     </Link>,
      //     item.BILLFREQNAME || "",
      //     item.ISACTIVE === "Y" ? "Yes" : "No",
      //   ]);
      //   setTableData(data);
      // } else {
      //   alert("No record found");
      //   setTableData([]);
      // }
    } catch (error) {
      setTableData([]);
      console.error("Error fetching bill frequency list:", error);
      alert("Failed to fetch bill frequency list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillFreqList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout
      title="Bill Frequency List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Bill Frequency List",
      }}
    >
      <div className="w-full space-y-6">
        {/* ---------- Add New ---------- */}
        <div className="flex justify-end">
          <Link to={"/Masters/FrmBillFreqMst"}>
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

export default FrmBillFreqList;
