import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmChargesTypeList = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const tableHeader = ["Select", "Charges Name", "Status"];

  const fetchChargesTypeList = async () => {
    try {
      setLoading(true);

      // 🔸 DUMMY — replace with apiService.get("getChargesTypeList")
      const dummyData = [
        { CHARGESTYPEID: 1, CHARGESNAME: "Late Fee", ISACTIVE: "Y" },
        { CHARGESTYPEID: 2, CHARGESNAME: "Penalty", ISACTIVE: "Y" },
        { CHARGESTYPEID: 3, CHARGESNAME: "Service Charge", ISACTIVE: "N" },
      ];

      if (dummyData.length > 0) {
        const data = dummyData.map((item) => [
          <Link
            key={item.CHARGESTYPEID}
            state={{ chargesTypeId: item.CHARGESTYPEID }}
            to={`/Masters/FrmChargesTypeMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.CHARGESNAME || "",
          item.ISACTIVE === "Y" ? "Yes" : "No",
        ]);
        setTableData(data);
      } else {
        alert("No record found");
        setTableData([]);
      }

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.get("getChargesTypeList");
      // if (res?.data?.success && res?.data?.data?.length > 0) {
      //   const data = res.data.data.map((item) => [
      //     <Link
      //       key={item.CHARGESTYPEID}
      //       state={{ chargesTypeId: item.CHARGESTYPEID }}
      //       to={`/Masters/FrmChargesTypeMst`}
      //       className="text-blue-600 underline hover:text-blue-800 font-medium"
      //     >
      //       Select
      //     </Link>,
      //     item.CHARGESNAME || "",
      //     item.ISACTIVE === "Y" ? "Yes" : "No",
      //   ]);
      //   setTableData(data);
      // } else {
      //   alert("No record found");
      //   setTableData([]);
      // }
    } catch (error) {
      setTableData([]);
      console.error("Error fetching charges type list:", error);
      alert("Failed to fetch charges type list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChargesTypeList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout
      title="Charges Type List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Charges Type List",
      }}
    >
      <div className="w-full space-y-6">
        {/* ---------- Add New ---------- */}
        <div className="flex justify-end">
          <Link to={"/Masters/FrmChargesTypeMst"}>
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

export default FrmChargesTypeList;
