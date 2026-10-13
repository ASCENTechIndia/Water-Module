import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmConnectionNoList = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const tableHeader = ["Select", "ULB Name", "Connection No Status"];

  const fetchConnectionNoList = async () => {
    try {
      setLoading(true);

      // 🔸 DUMMY — replace with apiService.get("getConnectionNoList")
      const dummyData = [
        {
          CONNECTIONNOID: 1,
          ULBNAME: "Pune Municipal Corporation",
          CONNFLAG: "Y",
        },
        {
          CONNECTIONNOID: 2,
          ULBNAME: "Mumbai Municipal Corporation",
          CONNFLAG: "N",
        },
        {
          CONNECTIONNOID: 3,
          ULBNAME: "Nashik Municipal Corporation",
          CONNFLAG: "Y",
        },
      ];

      if (dummyData.length > 0) {
        const data = dummyData.map((item) => [
          <Link
            key={item.CONNECTIONNOID}
            state={{ connectionNoId: item.CONNECTIONNOID }}
            to={`/Masters/FrmConnectionNoMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.ULBNAME || "",
          item.CONNFLAG === "Y" ? "Yes" : "No",
        ]);
        setTableData(data);
      } else {
        alert("No record found");
        setTableData([]);
      }

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.get("getConnectionNoList");
      // if (res?.data?.success && res?.data?.data?.length > 0) {
      //   const data = res.data.data.map((item) => [
      //     <Link
      //       key={item.CONNECTIONNOID}
      //       state={{ connectionNoId: item.CONNECTIONNOID }}
      //       to={`/Masters/FrmConnectionNoMst`}
      //       className="text-blue-600 underline hover:text-blue-800 font-medium"
      //     >
      //       Select
      //     </Link>,
      //     item.ULBNAME || "",
      //     item.CONNFLAG === "Y" ? "Yes" : "No",
      //   ]);
      //   setTableData(data);
      // } else {
      //   alert("No record found");
      //   setTableData([]);
      // }
    } catch (error) {
      setTableData([]);
      console.error("Error fetching connection no list:", error);
      alert("Failed to fetch connection no list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnectionNoList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout
      title="Connection No List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Connection No List",
      }}
    >
      <div className="w-full space-y-6">
        {/* ---------- Add New ---------- */}
        <div className="flex justify-end">
          <Link to={"/Masters/FrmConnectionNoMst"}>
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

export default FrmConnectionNoList;