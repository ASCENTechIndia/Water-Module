import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmConnStatusList = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const tableHeader = ["Select", "ConnStatus Name", "Status"];

  const fetchConnStatusList = async () => {
    try {
      setLoading(true);

      // 🔸 DUMMY — replace with apiService.get("getConnStatusList")
      const dummyData = [
        { CONNSTATUSID: 1, CONNSTATUSNAME: "Active", ISACTIVE: "Y" },
        { CONNSTATUSID: 2, CONNSTATUSNAME: "Inactive", ISACTIVE: "Y" },
        { CONNSTATUSID: 3, CONNSTATUSNAME: "Disconnected", ISACTIVE: "N" },
      ];

      if (dummyData.length > 0) {
        const data = dummyData.map((item) => [
          <Link
            key={item.CONNSTATUSID}
            state={{ connStatusId: item.CONNSTATUSID }}
            to={`/Masters/FrmConnStatusMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.CONNSTATUSNAME || "",
          item.ISACTIVE === "Y" ? "Yes" : "No",
        ]);
        setTableData(data);
      } else {
        alert("No record found");
        setTableData([]);
      }

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.get("getConnStatusList");
      // if (res?.data?.success && res?.data?.data?.length > 0) {
      //   const data = res.data.data.map((item) => [
      //     <Link
      //       key={item.CONNSTATUSID}
      //       state={{ connStatusId: item.CONNSTATUSID }}
      //       to={`/Masters/FrmConnStatusMst`}
      //       className="text-blue-600 underline hover:text-blue-800 font-medium"
      //     >
      //       Select
      //     </Link>,
      //     item.CONNSTATUSNAME || "",
      //     item.ISACTIVE === "Y" ? "Yes" : "No",
      //   ]);
      //   setTableData(data);
      // } else {
      //   alert("No record found");
      //   setTableData([]);
      // }
    } catch (error) {
      setTableData([]);
      console.error("Error fetching conn status list:", error);
      alert("Failed to fetch conn status list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnStatusList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout
      title="Conn Status List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Conn Status List",
      }}
    >
      <div className="w-full space-y-6">
        {/* ---------- Add New ---------- */}
        <div className="flex justify-end">
          <Link to={"/Masters/FrmConnStatusMst"}>
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

export default FrmConnStatusList;
