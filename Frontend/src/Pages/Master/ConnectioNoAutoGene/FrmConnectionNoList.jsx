import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmConnectionNoList = () => {
  const { user } = useAuth();
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const [tableData, setTableData] = useState([]);

  const tableHeader = ["Select", "ULB Name", "Connection No Status"];

  const fetchConnAutoGenerateList = async () => {
    try {
      setLoading(true);
      const res = await apiService.get("/master/getConnAutoGenerateList");

      if (res?.success && res?.data?.length > 0) {
        const data = res.data.map((item) => [
          <Link
            key={item.NUM_CONNOGEN_ID}
            state={{ connogenId: item.NUM_CONNOGEN_ID }}
            to={`/Masters/FrmConnectionNoMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.ULBNAME || "",
          item.FLAG || "",
        ]);
        setTableData(data);
      } else {
        setTableData([]);
        alert(res?.message || "Data Not Found");
      }
    } catch (err) {
      console.error("Error fetching conn auto generate list:", err);
      setTableData([]);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnAutoGenerateList();
  }, []);

  return (
    <Layout
      title="Connection No List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Connection No List",
      }}
    >
      <div className="w-full space-y-6">
        {/* Add New */}
        <div className="flex justify-end">
          <Link to={"/Masters/FrmConnectionNoMst"}>
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

export default FrmConnectionNoList;
