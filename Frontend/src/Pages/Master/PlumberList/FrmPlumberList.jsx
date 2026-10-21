import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmPlumberList = () => {
  const { user } = useAuth();
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const [tableData, setTableData] = useState([]);

  const tableHeader = ["Select", "Plumber Name", "Plumber Code", "Status"];

  const fetchPlumberList = async () => {
    try {
      setLoading(true);
      const res = await apiService.get("/master/getPlumberList");

      if (res?.success && res?.data?.length > 0) {
        const data = res.data.map((item) => [
          <Link
            key={item.NUM_PLUMBER_ID}
            state={{
              plumberId: item.NUM_PLUMBER_ID,
              plumberName: item.VAR_PLUMBER_NAME,
              plumberCode: item.VAR_PLUMBER_CODE,
              flag: item.ACTIVEFLAG,
            }}
            to={`/Masters/FrmPlumberMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.VAR_PLUMBER_NAME || "",
          item.VAR_PLUMBER_CODE || "",
          item.ACTIVEFLAG || "",
        ]);
        setTableData(data);
      } else {
        setTableData([]);
        alert(res?.data?.message || "Data Not Found");
      }
    } catch (err) {
      console.error("Error fetching plumber list:", err);
      setTableData([]);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlumberList();
  }, []);

  return (
    <Layout
      title="Plumber List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Plumber List",
      }}
    >
      <div className="w-full space-y-6">
        {/* Add New */}
        <div className="flex justify-end">
          <Link to={"/Masters/FrmPlumberMst"}>
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

export default FrmPlumberList;
