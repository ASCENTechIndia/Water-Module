import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmBankList = () => {
  const { user } = useAuth();
  const { setLoading } = useLoader();

  const [tableData, setTableData] = useState([]);

  const tableHeader = ["Select", "Bank Name"];

  const fetchBankList = async () => {
    try {
      setLoading(true);
      const res = await apiService.get("/master/getBankList");

      if (res?.success && res?.data?.length > 0) {
        const data = res.data.map((item) => [
          <Link
            key={item.NUM_BANK_ID}
            state={{
              bankId: item.NUM_BANK_ID,
              bankName: item.VAR_BANK_NAME,
            }}
            to={`/Masters/FrmBankMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.VAR_BANK_NAME || "",
        ]);
        setTableData(data);
      } else {
        setTableData([]);
        alert("Data Not Found");
      }
    } catch (err) {
      console.error("Error fetching bank list:", err);
      setTableData([]);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankList();
  }, []);

  return (
    <Layout
      title="Bank List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Bank List",
      }}
    >
      <div className="w-full space-y-6">
        {/* Add New */}
        <div className="flex justify-end">
          <Link to={"/Masters/FrmBankMst"}>
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

export default FrmBankList;
