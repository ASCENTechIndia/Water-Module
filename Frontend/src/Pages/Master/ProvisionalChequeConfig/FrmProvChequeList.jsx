import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmProvChequeList = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const tableHeader = ["Select", "ULB Names", "Connection No Status"];

  const fetchProvChequeList = async () => {
    try {
      setLoading(true);

      // 🔸 DUMMY — replace with apiService.get("getProvChequeList")
      const dummyData = [
        {
          PROVCHEQUEID: 1,
          ULBNAME: "Pune Municipal Corporation",
          CONNOFLAG: "Y",
        },
        {
          PROVCHEQUEID: 2,
          ULBNAME: "Mumbai Municipal Corporation",
          CONNOFLAG: "N",
        },
        {
          PROVCHEQUEID: 3,
          ULBNAME: "Nashik Municipal Corporation",
          CONNOFLAG: "Y",
        },
      ];

      if (dummyData.length > 0) {
        const data = dummyData.map((item) => [
          <Link
            key={item.PROVCHEQUEID}
            state={{ provChequeId: item.PROVCHEQUEID }}
            to={`/Masters/FrmProvChequeMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.ULBNAME || "",
          item.CONNOFLAG === "Y" ? "Yes" : "No",
        ]);
        setTableData(data);
      } else {
        alert("No record found");
        setTableData([]);
      }

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.get("getProvChequeList");
      // if (res?.data?.success && res?.data?.data?.length > 0) {
      //   const data = res.data.data.map((item) => [
      //     <Link
      //       key={item.PROVCHEQUEID}
      //       state={{ provChequeId: item.PROVCHEQUEID }}
      //       to={`/Masters/FrmProvChequeMst`}
      //       className="text-blue-600 underline hover:text-blue-800 font-medium"
      //     >
      //       Select
      //     </Link>,
      //     item.ULBNAME || "",
      //     item.CONNOFLAG === "Y" ? "Yes" : "No",
      //   ]);
      //   setTableData(data);
      // } else {
      //   alert("No record found");
      //   setTableData([]);
      // }
    } catch (error) {
      setTableData([]);
      console.error("Error fetching prov cheque list:", error);
      alert("Failed to fetch prov cheque list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProvChequeList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout
      title="Prov Cheque List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Prov Cheque List",
      }}
    >
      <div className="w-full space-y-6">
        {/* ---------- Add New ---------- */}
        <div className="flex justify-end">
          <Link to={"/Masters/FrmProvChequeMst"}>
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

export default FrmProvChequeList;
