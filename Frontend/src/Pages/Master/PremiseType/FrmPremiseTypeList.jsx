import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmPremiseTypeList = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const tableHeader = ["Select", "Premise Type Name", "Status"];

  const fetchPremiseTypeList = async () => {
    try {
      setLoading(true);

      // 🔸 DUMMY — replace with apiService.get("getPremiseTypeList")
      const dummyData = [
        { PREMISETYPEID: 1, PREMISETYPENAME: "Residential", ISACTIVE: "Y" },
        { PREMISETYPEID: 2, PREMISETYPENAME: "Commercial", ISACTIVE: "Y" },
        { PREMISETYPEID: 3, PREMISETYPENAME: "Industrial", ISACTIVE: "N" },
      ];

      if (dummyData.length > 0) {
        const data = dummyData.map((item) => [
          <Link
            key={item.PREMISETYPEID}
            state={{ premiseTypeId: item.PREMISETYPEID }}
            to={`/Masters/FrmPremiseTypeMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.PREMISETYPENAME || "",
          item.ISACTIVE === "Y" ? "Yes" : "No",
        ]);
        setTableData(data);
      } else {
        alert("No record found");
        setTableData([]);
      }

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.get("getPremiseTypeList");
      // if (res?.data?.success && res?.data?.data?.length > 0) {
      //   const data = res.data.data.map((item) => [
      //     <Link
      //       key={item.PREMISETYPEID}
      //       state={{ premiseTypeId: item.PREMISETYPEID }}
      //       to={`/Masters/FrmPremiseTypeMst`}
      //       className="text-blue-600 underline hover:text-blue-800 font-medium"
      //     >
      //       Select
      //     </Link>,
      //     item.PREMISETYPENAME || "",
      //     item.ISACTIVE === "Y" ? "Yes" : "No",
      //   ]);
      //   setTableData(data);
      // } else {
      //   alert("No record found");
      //   setTableData([]);
      // }
    } catch (error) {
      setTableData([]);
      console.error("Error fetching premise type list:", error);
      alert("Failed to fetch premise type list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPremiseTypeList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout
      title="Premise Type List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Premise Type List",
      }}
    >
      <div className="w-full space-y-6">
        {/* ---------- Add New ---------- */}
        <div className="flex justify-end">
          <Link to={"/Masters/FrmPremiseTypeMst"}>
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

export default FrmPremiseTypeList;
