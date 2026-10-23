import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmBillFreqList = () => {
  const { user } = useAuth();
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const [tableData, setTableData] = useState([]);

  const tableHeader = ["Select", "BillFreq Name", "Status"];

  const fetchBillFreqList = async () => {
    try {
      setLoading(true);
      const res = await apiService.get("/master/getBillFrequencyList");

      if (res?.success && res?.data?.length > 0) {
        const data = res.data.map((item) => [
          <Link
            key={item.NUM_BILLFREQ_ID}
            state={{
              billFreqId: item.NUM_BILLFREQ_ID,
              billFreqName: item.VAR_BILLFREQ_NAME,
              flag: item.ACTIVEFLAG,
            }}
            to={`/Masters/FrmBillFreqMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.VAR_BILLFREQ_NAME || "",
          item.ACTIVEFLAG || "",
        ]);
        setTableData(data);
      } else {
        setTableData([]);
        alert(res?.data?.message || "Data Not Found");
      }
    } catch (err) {
      console.error("Error fetching bill frequency list:", err);
      setTableData([]);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillFreqList();
  }, []);

  return (
    <Layout
      title="Bill Frequency List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Bill Frequency List",
      }}
    >
      <div className="w-full space-y-6">
        {/* Add New */}
        <div className="flex justify-end">
          <Link to={"/Masters/FrmBillFreqMst"}>
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

export default FrmBillFreqList;
