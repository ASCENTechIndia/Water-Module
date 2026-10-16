import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmConnTypeList = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const tableHeader = ["Select", "Conn Type Name", "Status"];

  const fetchConnTypeList = async () => {
    try {
      setLoading(true);

      // 🔸 DUMMY — replace with apiService.get("getConnTypeList")
      const dummyData = [
        { CONNTYPEID: 1, CONNTYPENAME: "Metered", ISACTIVE: "Y" },
        { CONNTYPEID: 2, CONNTYPENAME: "Non-Metered", ISACTIVE: "Y" },
        { CONNTYPEID: 3, CONNTYPENAME: "Bulk", ISACTIVE: "N" },
      ];

      if (dummyData.length > 0) {
        const data = dummyData.map((item) => [
          <Link
            key={item.CONNTYPEID}
            state={{ connTypeId: item.CONNTYPEID }}
            to={`/Masters/FrmConnTypeMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.CONNTYPENAME || "",
          item.ISACTIVE === "Y" ? "Yes" : "No",
        ]);
        setTableData(data);
      } else {
        alert("No record found");
        setTableData([]);
      }

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.get("getConnTypeList");
      // if (res?.data?.success && res?.data?.data?.length > 0) {
      //   const data = res.data.data.map((item) => [
      //     <Link
      //       key={item.CONNTYPEID}
      //       state={{ connTypeId: item.CONNTYPEID }}
      //       to={`/Masters/FrmConnTypeMst`}
      //       className="text-blue-600 underline hover:text-blue-800 font-medium"
      //     >
      //       Select
      //     </Link>,
      //     item.CONNTYPENAME || "",
      //     item.ISACTIVE === "Y" ? "Yes" : "No",
      //   ]);
      //   setTableData(data);
      // } else {
      //   alert("No record found");
      //   setTableData([]);
      // }
    } catch (error) {
      setTableData([]);
      console.error("Error fetching conn type list:", error);
      alert("Failed to fetch conn type list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnTypeList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout
      title="Conn Type List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Conn Type List",
      }}
    >
      <div className="w-full space-y-6">
        {/* ---------- Add New ---------- */}
        <div className="flex justify-end">
          <Link to={"/Masters/FrmConnTypeMst"}>
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

export default FrmConnTypeList;
