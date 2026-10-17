import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useLoader } from "../../../Context/LoaderContext";

const FrmGapCodeList = () => {
  const { setLoading } = useLoader();

  const [tableData, setTableData] = useState([]);

  const tableHeader = ["Select", "Gap Code Name", "Status"];

  const fetchGapCodeList = async () => {
    try {
      setLoading(true);
      const res = await apiService.get("/master/getGapCodeList");

      if (res?.success && res?.data?.length > 0) {
        const data = res.data.map((item) => [
          <Link
            key={item.NUM_GAPCODE_ID}
            state={{
              gapCodeId: item.NUM_GAPCODE_ID,
              gapCodeName: item.VAR_GAPCODE_NAME,
              flag: item.ACTIVEFLAG,
            }}
            to={`/Masters/FrmGapCodeMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.VAR_GAPCODE_NAME || "",
          item.ACTIVEFLAG || "",
        ]);
        setTableData(data);
      } else {
        setTableData([]);
        alert("Data Not Found");
      }
    } catch (err) {
      console.error("Error fetching gap code list:", err);
      setTableData([]);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGapCodeList();
  }, []);

  return (
    <Layout
      title="Gap Code List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Gap Code List",
      }}
    >
      <div className="w-full space-y-6">
        {/* Add New */}
        <div className="flex justify-end">
          <Link to={"/Masters/FrmGapCodeMst"}>
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

export default FrmGapCodeList;
