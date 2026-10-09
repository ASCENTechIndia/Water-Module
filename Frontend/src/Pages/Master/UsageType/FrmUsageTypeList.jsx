import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmUsageTypeList = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const tableHeader = ["Select", "Usage Type Name"];

  const fetchUsageTypeList = async () => {
    try {
      setLoading(true);

      // 🔸 DUMMY — replace with apiService.get("getUsageTypeList")
      const dummyData = [
        { USAGETYPEID: 1, USAGETYPENAME: "Residential" },
        { USAGETYPEID: 2, USAGETYPENAME: "Commercial" },
        { USAGETYPEID: 3, USAGETYPENAME: "Industrial" },
        { USAGETYPEID: 4, USAGETYPENAME: "Institutional" },
      ];

      if (dummyData.length > 0) {
        const data = dummyData.map((item) => [
          <Link
            key={item.USAGETYPEID}
            state={{ usageTypeId: item.USAGETYPEID }}
            to={`/Masters/FrmUsageTypeMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.USAGETYPENAME || "",
        ]);
        setTableData(data);
      } else {
        alert("No record found");
        setTableData([]);
      }

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.get("getUsageTypeList");
      // if (res?.data?.success && res?.data?.data?.length > 0) {
      //   const data = res.data.data.map((item) => [
      //     <Link
      //       key={item.USAGETYPEID}
      //       state={{ usageTypeId: item.USAGETYPEID }}
      //       to={`/Masters/FrmUsageTypeMst`}
      //       className="text-blue-600 underline hover:text-blue-800 font-medium"
      //     >
      //       Select
      //     </Link>,
      //     item.USAGETYPENAME || "",
      //   ]);
      //   setTableData(data);
      // } else {
      //   alert("No record found");
      //   setTableData([]);
      // }
    } catch (error) {
      setTableData([]);
      console.error("Error fetching usage type list:", error);
      alert("Failed to fetch usage type list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsageTypeList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout
      title="Usage Type List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Usage Type List",
      }}
    >
      <div className="w-full space-y-6">
        {/* ---------- Add New ---------- */}
        <div className="flex justify-end">
          <Link to={"/Masters/FrmUsageTypeMst"}>
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

export default FrmUsageTypeList;
