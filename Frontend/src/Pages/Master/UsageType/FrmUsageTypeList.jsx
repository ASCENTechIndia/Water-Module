import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmUsageTypeList = () => {
  const { user } = useAuth();
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const [tableData, setTableData] = useState([]);

  const tableHeader = ["Select", "Usage Type Name"];

  const fetchUsageTypeList = async () => {
    try {
      setLoading(true);
      const res = await apiService.get("/master/usageTypeList");

      if (res?.success && res?.data?.length > 0) {
        const data = res.data.map((item) => [
          <Link
            key={item.NUM_USAGETYPE_ID}
            state={{
              usageTypeId: item.NUM_USAGETYPE_ID,
              usageTypeName: item.VAR_USAGETYPE_NAME,
            }}
            to={`/Masters/FrmUsageTypeMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.VAR_USAGETYPE_NAME || "",
        ]);
        setTableData(data);
      } else {
        setTableData([]);
        alert("Data Not Found");
      }
    } catch (err) {
      console.error("Error fetching usage type list:", err);
      setTableData([]);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsageTypeList();
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
        {/* Add New */}
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

export default FrmUsageTypeList;
