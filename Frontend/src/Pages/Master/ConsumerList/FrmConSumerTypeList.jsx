import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmConSumerTypeList = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const tableHeader = ["Select", "Consumer Type Name", "Status"];

  const fetchConsumerTypeList = async () => {
    try {
      setLoading(true);

      // 🔸 DUMMY — replace with apiService.get("getConsumerTypeList")
      const dummyData = [
        { CONSUMERTYPEID: 1, CONSUMERTYPENAME: "Domestic", ISACTIVE: "Y" },
        { CONSUMERTYPEID: 2, CONSUMERTYPENAME: "Commercial", ISACTIVE: "Y" },
        { CONSUMERTYPEID: 3, CONSUMERTYPENAME: "Industrial", ISACTIVE: "N" },
      ];

      if (dummyData.length > 0) {
        const data = dummyData.map((item) => [
          <Link
            key={item.CONSUMERTYPEID}
            state={{ consumerTypeId: item.CONSUMERTYPEID }}
            to={`/Masters/FrmConSumerTypeMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.CONSUMERTYPENAME || "",
          item.ISACTIVE === "Y" ? "Yes" : "No",
        ]);
        setTableData(data);
      } else {
        alert("No record found");
        setTableData([]);
      }

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.get("getConsumerTypeList");
      // if (res?.data?.success && res?.data?.data?.length > 0) {
      //   const data = res.data.data.map((item) => [
      //     <Link
      //       key={item.CONSUMERTYPEID}
      //       state={{ consumerTypeId: item.CONSUMERTYPEID }}
      //       to={`/Masters/FrmConSumerTypeMst`}
      //       className="text-blue-600 underline hover:text-blue-800 font-medium"
      //     >
      //       Select
      //     </Link>,
      //     item.CONSUMERTYPENAME || "",
      //     item.ISACTIVE === "Y" ? "Yes" : "No",
      //   ]);
      //   setTableData(data);
      // } else {
      //   alert("No record found");
      //   setTableData([]);
      // }
    } catch (error) {
      setTableData([]);
      console.error("Error fetching consumer type list:", error);
      alert("Failed to fetch consumer type list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsumerTypeList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout
      title="Consumer Type List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Consumer Type List",
      }}
    >
      <div className="w-full space-y-6">
        {/* ---------- Add New ---------- */}
        <div className="flex justify-end">
          <Link to={"/Masters/FrmConSumerTypeMst"}>
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

export default FrmConSumerTypeList;
