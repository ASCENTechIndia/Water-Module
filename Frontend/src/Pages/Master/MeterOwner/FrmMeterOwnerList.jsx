import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmMeterOwnerList = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const tableHeader = ["Select", "Meter Owner Name", "Status"];

  const fetchMeterOwnerList = async () => {
    try {
      setLoading(true);

      // 🔸 DUMMY — replace with apiService.get("getMeterOwnerList")
      const dummyData = [
        { METEROWNERID: 1, METEROWNERNAME: "ULB", ISACTIVE: "Y" },
        { METEROWNERID: 2, METEROWNERNAME: "Consumer", ISACTIVE: "Y" },
        { METEROWNERID: 3, METEROWNERNAME: "Third Party", ISACTIVE: "N" },
      ];

      if (dummyData.length > 0) {
        const data = dummyData.map((item) => [
          <Link
            key={item.METEROWNERID}
            state={{ meterOwnerId: item.METEROWNERID }}
            to={`/Masters/FrmMeterOwnerMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.METEROWNERNAME || "",
          item.ISACTIVE === "Y" ? "Yes" : "No",
        ]);
        setTableData(data);
      } else {
        alert("No record found");
        setTableData([]);
      }

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.get("getMeterOwnerList");
      // if (res?.data?.success && res?.data?.data?.length > 0) {
      //   const data = res.data.data.map((item) => [
      //     <Link
      //       key={item.METEROWNERID}
      //       state={{ meterOwnerId: item.METEROWNERID }}
      //       to={`/Masters/FrmMeterOwnerMst`}
      //       className="text-blue-600 underline hover:text-blue-800 font-medium"
      //     >
      //       Select
      //     </Link>,
      //     item.METEROWNERNAME || "",
      //     item.ISACTIVE === "Y" ? "Yes" : "No",
      //   ]);
      //   setTableData(data);
      // } else {
      //   alert("No record found");
      //   setTableData([]);
      // }
    } catch (error) {
      setTableData([]);
      console.error("Error fetching meter owner list:", error);
      alert("Failed to fetch meter owner list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeterOwnerList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout
      title="Meter Owner List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Meter Owner List",
      }}
    >
      <div className="w-full space-y-6">
        {/* ---------- Add New ---------- */}
        <div className="flex justify-end">
          <Link to={"/Masters/FrmMeterOwnerMst"}>
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

export default FrmMeterOwnerList;
