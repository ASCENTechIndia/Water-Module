import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmConnCodeList = () => {
  const { user } = useAuth();
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const [tableData, setTableData] = useState([]);

  const tableHeader = ["Select", "Conn Code Name", "Status"];

  const fetchConnCodeList = async () => {
    try {
      setLoading(true);
      const res = await apiService.get("/master/getConnCodeList");

      if (res?.success && res?.data?.length > 0) {
        const data = res.data.map((item) => [
          <Link
            key={item.NUM_CONNCODE_ID}
            state={{
              connCodeId: item.NUM_CONNCODE_ID,
              connCodeName: item.VAR_CONNCODE_NAME,
              flag: item.VAR_CONNCODE_ACTIVEFLAG,
            }}
            to={`/Masters/FrmConnCodeMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.VAR_CONNCODE_NAME || "",
          item.VAR_CONNCODE_ACTIVEFLAG === "Y" ? "Yes" : "No",
        ]);
        setTableData(data);
      } else {
        setTableData([]);
        alert("Data Not Found");
      }
    } catch (err) {
      console.error("Error fetching conn code list:", err);
      setTableData([]);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnCodeList();
  }, []);

  return (
    <Layout
      title="Conn Code List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Conn Code List",
      }}
    >
      <div className="w-full space-y-6">
        {/* Add New */}
        <div className="flex justify-end">
          <Link to={"/Masters/FrmConnCodeMst"}>
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

export default FrmConnCodeList;
