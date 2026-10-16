import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmBankList = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const tableHeader = ["Select", "Bank Name"];

  const fetchBankList = async () => {
    try {
      setLoading(true);

      // 🔸 DUMMY — replace with apiService.get("getBankList")
      const dummyData = [
        { BANKID: 1, BANKNAME: "State Bank of India" },
        { BANKID: 2, BANKNAME: "HDFC Bank" },
        { BANKID: 3, BANKNAME: "ICICI Bank" },
        { BANKID: 4, BANKNAME: "Bank of Maharashtra" },
      ];

      if (dummyData.length > 0) {
        const data = dummyData.map((item) => [
          <Link
            key={item.BANKID}
            state={{ bankId: item.BANKID }}
            to={`/Masters/FrmBankMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.BANKNAME || "",
        ]);
        setTableData(data);
      } else {
        alert("No record found");
        setTableData([]);
      }

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.get("getBankList");
      // if (res?.data?.success && res?.data?.data?.length > 0) {
      //   const data = res.data.data.map((item) => [
      //     <Link
      //       key={item.BANKID}
      //       state={{ bankId: item.BANKID }}
      //       to={`/Masters/FrmBankMst`}
      //       className="text-blue-600 underline hover:text-blue-800 font-medium"
      //     >
      //       Select
      //     </Link>,
      //     item.BANKNAME || "",
      //   ]);
      //   setTableData(data);
      // } else {
      //   alert("No record found");
      //   setTableData([]);
      // }
    } catch (error) {
      setTableData([]);
      console.error("Error fetching bank list:", error);
      alert("Failed to fetch bank list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout
      title="Bank List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Bank List",
      }}
    >
      <div className="w-full space-y-6">
        {/* ---------- Add New ---------- */}
        <div className="flex justify-end">
          <Link to={"/Masters/FrmBankMst"}>
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

export default FrmBankList;
