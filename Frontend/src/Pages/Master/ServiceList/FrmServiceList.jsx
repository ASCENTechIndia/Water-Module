import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmServiceList = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const tableHeader = [
    "Select",
    "सेवाचे नाव [ English ]",
    "सेवाचे नाव [ Marathi ]",
    "प्रशासक",
    "सक्रिय",
  ];

  const fetchServiceList = async () => {
    try {
      setLoading(true);

      // 🔸 DUMMY — replace with apiService.get("getServiceList")
      const dummyData = [
        {
          SERVICEID: 1,
          SERVICENAMEEN: "Water Connection",
          SERVICENAMEMR: "पाणी जोडणी",
          ADMINNAME: "Water Dept",
          ISACTIVE: "Y",
        },
        {
          SERVICEID: 2,
          SERVICENAMEEN: "Sewerage Connection",
          SERVICENAMEMR: "गटार जोडणी",
          ADMINNAME: "Sewerage Dept",
          ISACTIVE: "Y",
        },
        {
          SERVICEID: 3,
          SERVICENAMEEN: "Property Tax",
          SERVICENAMEMR: "मालमत्ता कर",
          ADMINNAME: "Tax Dept",
          ISACTIVE: "N",
        },
      ];

      if (dummyData.length > 0) {
        const data = dummyData.map((item) => [
          <Link
            key={item.SERVICEID}
            state={{ serviceId: item.SERVICEID }}
            to={`/Masters/FrmServiceMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.SERVICENAMEEN || "",
          item.SERVICENAMEMR || "",
          item.ADMINNAME || "",
          item.ISACTIVE === "Y" ? "Yes" : "No",
        ]);
        setTableData(data);
      } else {
        alert("No record found");
        setTableData([]);
      }

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.get("getServiceList");
      // if (res?.data?.success && res?.data?.data?.length > 0) {
      //   const data = res.data.data.map((item) => [
      //     <Link
      //       key={item.SERVICEID}
      //       state={{ serviceId: item.SERVICEID }}
      //       to={`/Masters/FrmServiceMst`}
      //       className="text-blue-600 underline hover:text-blue-800 font-medium"
      //     >
      //       Select
      //     </Link>,
      //     item.SERVICENAMEEN || "",
      //     item.SERVICENAMEMR || "",
      //     item.ADMINNAME || "",
      //     item.ISACTIVE === "Y" ? "Yes" : "No",
      //   ]);
      //   setTableData(data);
      // } else {
      //   alert("No record found");
      //   setTableData([]);
      // }
    } catch (error) {
      setTableData([]);
      console.error("Error fetching service list:", error);
      alert("Failed to fetch service list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout
      title="Service List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Service List",
      }}
    >
      <div className="w-full space-y-6">
        {/* ---------- Add New ---------- */}
        <div className="flex justify-end">
          <Link to={"/Masters/FrmServiceMst"}>
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

export default FrmServiceList;
