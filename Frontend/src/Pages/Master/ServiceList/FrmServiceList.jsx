import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmServiceList = () => {
  const { user } = useAuth();
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

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
      const res = await apiService.get("/master/getServiceList");

      if (res?.success && res?.data?.length > 0) {
        const data = res.data.map((item) => [
          <Link
            key={item.SERVICE_ID}
            state={{
              serviceId: item.SERVICE_ID,
              serviceNameEn: item.SERVICE_ENAME,
              serviceNameMr: item.SERVICE_MNAME,
              flag: item.SERVICE_ACTIVEFLAG,
            }}
            to={`/Masters/FrmServiceMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.SERVICE_ENAME || "",
          item.SERVICE_MNAME || "",
          item.SERVICE_INSBY || "",
          item.SERVICE_ACTIVEFLAG === "Y" ? "Yes" : "No",
        ]);
        setTableData(data);
      } else {
        setTableData([]);
        alert("Data Not Found");
      }
    } catch (err) {
      console.error("Error fetching service list:", err);
      setTableData([]);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceList();
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
        {/* Add New */}
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

        {/* Table */}
        <div className="mt-3">
          {tableData?.length > 0 && (
            <Table headers={tableHeader} data={tableData} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FrmServiceList;
