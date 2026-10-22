import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmTaxMasterList = () => {
  const { user } = useAuth();
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const [tableData, setTableData] = useState([]);

  const tableHeader = [
    "निवड",
    "अनुक्रमांक",
    "कराचे इंग्रजी नाव",
    "कराचे मराठी नाव",
    "कराचा कोड इंग्रजी",
    "Tax Owner",
  ];

  const fetchTaxList = async () => {
    try {
      setLoading(true);
      const res = await apiService.get("/master/getTaxList");

      if (res?.success && res?.data?.length > 0) {
        const data = res.data.map((item, index) => [
          <Link
            key={item.ID}
            state={{ taxId: item.ID }}
            to={`/Masters/FrmTaxMasterMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            निवड
          </Link>,
          index + 1,
          item.ENAME || "",
          item.MNAME || "",
          item.CODE || "",
          item.OWNER || "",
        ]);
        setTableData(data);
      } else {
        setTableData([]);
        alert(res?.data?.message || "Data Not Found");
      }
    } catch (err) {
      console.error("Error fetching tax list:", err);
      setTableData([]);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxList();
  }, []);

  return (
    <Layout
      title="Tax Master List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Tax Master List",
      }}
    >
      <div className="w-full space-y-6">
        {/* Add New */}
        <div className="flex justify-end">
          <Link to={"/Masters/FrmTaxMasterMst"}>
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

export default FrmTaxMasterList;
