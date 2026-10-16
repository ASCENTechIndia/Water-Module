import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmConnSizeList = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const tableHeader = ["Select", "Conn Size Name", "Status"];

  const fetchConnSizeList = async () => {
    try {
      setLoading(true);

      // 🔸 DUMMY — replace with apiService.get("getConnSizeList")
      const dummyData = [
        { CONNSIZEID: 1, CONNSIZENAME: "15mm", ISACTIVE: "Y" },
        { CONNSIZEID: 2, CONNSIZENAME: "20mm", ISACTIVE: "Y" },
        { CONNSIZEID: 3, CONNSIZENAME: "25mm", ISACTIVE: "N" },
      ];

      if (dummyData.length > 0) {
        const data = dummyData.map((item) => [
          <Link
            key={item.CONNSIZEID}
            state={{ connSizeId: item.CONNSIZEID }}
            to={`/Masters/FrmConnSizeMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.CONNSIZENAME || "",
          item.ISACTIVE === "Y" ? "Yes" : "No",
        ]);
        setTableData(data);
      } else {
        alert("No record found");
        setTableData([]);
      }

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.get("getConnSizeList");
      // if (res?.data?.success && res?.data?.data?.length > 0) {
      //   const data = res.data.data.map((item) => [
      //     <Link
      //       key={item.CONNSIZEID}
      //       state={{ connSizeId: item.CONNSIZEID }}
      //       to={`/Masters/FrmConnSizeMst`}
      //       className="text-blue-600 underline hover:text-blue-800 font-medium"
      //     >
      //       Select
      //     </Link>,
      //     item.CONNSIZENAME || "",
      //     item.ISACTIVE === "Y" ? "Yes" : "No",
      //   ]);
      //   setTableData(data);
      // } else {
      //   alert("No record found");
      //   setTableData([]);
      // }
    } catch (error) {
      setTableData([]);
      console.error("Error fetching conn size list:", error);
      alert("Failed to fetch conn size list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnSizeList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout
      title="Conn Size List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Conn Size List",
      }}
    >
      <div className="w-full space-y-6">
        {/* ---------- Add New ---------- */}
        <div className="flex justify-end">
          <Link to={"/Masters/FrmConnSizeMst"}>
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

export default FrmConnSizeList;
