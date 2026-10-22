import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmMeterOwnerList = () => {
  const { user } = useAuth();
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const [tableData, setTableData] = useState([]);

  const tableHeader = ["Select", "Meter Owner Name", "Status"];

  const fetchMeterOwnerList = async () => {
    try {
      setLoading(true);
      const res = await apiService.get("/master/getMeterOwnerList");

      if (res?.success && res?.data?.length > 0) {
        const data = res.data.map((item) => [
          <Link
            key={item.METEROWNER_ID}
            state={{
              meterOwnerId: item.METEROWNER_ID,
              meterOwnerName: item.METEROWNER_NAME,
              flag: item.ACTIVEFLAG,
            }}
            to={`/Masters/FrmMeterOwnerMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.METEROWNER_NAME || "",
          item.ACTIVEFLAG || "",
        ]);
        setTableData(data);
      } else {
        setTableData([]);
        alert(res?.data?.message || "Data Not Found");
      }
    } catch (err) {
      console.error("Error fetching meter owner list:", err);
      setTableData([]);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeterOwnerList();
  }, []);

  return (
    <Layout
      title="Meter Owner List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Meter Owner List",
      }}
    >
      <div className="w-full space-y-6">
        {/* Add New */}
        <div className="flex justify-end">
          <Link to={"/Masters/FrmMeterOwnerMst"}>
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

export default FrmMeterOwnerList;
