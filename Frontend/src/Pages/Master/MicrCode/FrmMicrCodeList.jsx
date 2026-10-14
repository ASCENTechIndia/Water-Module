import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmMicrCodeList = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const tableHeader = ["Select", "MICR Code", "Bank Name", "Ins By", "Ins Date"];

  const fetchMicrCodeList = async () => {
    try {
      setLoading(true);

      // 🔸 DUMMY — replace with apiService.get("getMicrCodeList")
      const dummyData = [
        {
          MICRID: 1,
          MICRCODE: "411002001",
          BANKNAME: "State Bank of India",
          INS_BY: "admin",
          INS_DATE: "2024-04-01",
        },
        {
          MICRID: 2,
          MICRCODE: "411002002",
          BANKNAME: "HDFC Bank",
          INS_BY: "admin",
          INS_DATE: "2024-04-02",
        },
        {
          MICRID: 3,
          MICRCODE: "411002003",
          BANKNAME: "ICICI Bank",
          INS_BY: "admin",
          INS_DATE: "2024-04-03",
        },
      ];

      if (dummyData.length > 0) {
        const data = dummyData.map((item) => [
          <Link
            key={item.MICRID}
            state={{ micrId: item.MICRID }}
            to={`/Masters/FrmMicrCodeMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.MICRCODE || "",
          item.BANKNAME || "",
          item.INS_BY || "",
          item.INS_DATE || "",
        ]);
        setTableData(data);
      } else {
        alert("No record found");
        setTableData([]);
      }

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.get("getMicrCodeList");
      // if (res?.data?.success && res?.data?.data?.length > 0) {
      //   const data = res.data.data.map((item) => [
      //     <Link
      //       key={item.MICRID}
      //       state={{ micrId: item.MICRID }}
      //       to={`/Masters/FrmMicrCodeMst`}
      //       className="text-blue-600 underline hover:text-blue-800 font-medium"
      //     >
      //       Select
      //     </Link>,
      //     item.MICRCODE || "",
      //     item.BANKNAME || "",
      //     item.INS_BY || "",
      //     item.INS_DATE || "",
      //   ]);
      //   setTableData(data);
      // } else {
      //   alert("No record found");
      //   setTableData([]);
      // }
    } catch (error) {
      setTableData([]);
      console.error("Error fetching MICR code list:", error);
      alert("Failed to fetch MICR code list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMicrCodeList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout
      title="MICR Code List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "MICR Code List",
      }}
    >
      <div className="w-full space-y-6">
        {/* ---------- Add New ---------- */}
        <div className="flex justify-end">
          <Link to={"/Masters/FrmMicrCodeMst"}>
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

export default FrmMicrCodeList;