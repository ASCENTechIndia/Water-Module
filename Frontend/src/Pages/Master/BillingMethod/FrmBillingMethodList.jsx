import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmBillingMethodList = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const tableHeader = ["Select", "Billing Method Name", "Billing Method Code"];

  const fetchBillingMethodList = async () => {
    try {
      setLoading(true);

      // 🔸 DUMMY — replace with apiService.get("getBillingMethodList")
      const dummyData = [
        {
          BILLINGMETHODID: 1,
          BILLINGMETHODNAME: "Cash",
          BILLINGMETHODCODE: "CSH",
        },
        {
          BILLINGMETHODID: 2,
          BILLINGMETHODNAME: "Cheque",
          BILLINGMETHODCODE: "CHQ",
        },
        {
          BILLINGMETHODID: 3,
          BILLINGMETHODNAME: "Online",
          BILLINGMETHODCODE: "ONL",
        },
        {
          BILLINGMETHODID: 4,
          BILLINGMETHODNAME: "Demand Draft",
          BILLINGMETHODCODE: "DD",
        },
      ];

      if (dummyData.length > 0) {
        const data = dummyData.map((item) => [
          <Link
            key={item.BILLINGMETHODID}
            state={{ billingMethodId: item.BILLINGMETHODID }}
            to={`/Masters/FrmBillingMethodMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.BILLINGMETHODNAME || "",
          item.BILLINGMETHODCODE || "",
        ]);
        setTableData(data);
      } else {
        alert("No record found");
        setTableData([]);
      }

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.get("getBillingMethodList");
      // if (res?.data?.success && res?.data?.data?.length > 0) {
      //   const data = res.data.data.map((item) => [
      //     <Link
      //       key={item.BILLINGMETHODID}
      //       state={{ billingMethodId: item.BILLINGMETHODID }}
      //       to={`/Masters/FrmBillingMethodMst`}
      //       className="text-blue-600 underline hover:text-blue-800 font-medium"
      //     >
      //       Select
      //     </Link>,
      //     item.BILLINGMETHODNAME || "",
      //     item.BILLINGMETHODCODE || "",
      //   ]);
      //   setTableData(data);
      // } else {
      //   alert("No record found");
      //   setTableData([]);
      // }
    } catch (error) {
      setTableData([]);
      console.error("Error fetching billing method list:", error);
      alert("Failed to fetch billing method list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillingMethodList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout
      title="Billing Method List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Billing Method List",
      }}
    >
      <div className="w-full space-y-6">
        {/* ---------- Add New ---------- */}
        <div className="flex justify-end">
          <Link to={"/Masters/FrmBillingMethodMst"}>
            <Button
              type="button"
              variant="primary"
              className="hover:cursor-pointer"
            >
              Add New
            </Button>
          </Link>
        </div>

        {/* ---------- Table ---------- */}
        <div className="mt-3">
          <Table headers={tableHeader} data={tableData} />
        </div>
      </div>
    </Layout>
  );
};

export default FrmBillingMethodList;
