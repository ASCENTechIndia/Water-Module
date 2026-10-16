import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmTaxMasterList = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();
  const navigate = useNavigate();

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

      // 🔸 DUMMY — replace with apiService.get("getTaxList")
      const dummyData = [
        {
          TAXID: 1,
          TAXNAMEEN: "Water Tax",
          TAXNAMEMR: "पाणीपट्टी",
          TAXCODE: "WT01",
          TAXOWNER: "ULB",
        },
        {
          TAXID: 2,
          TAXNAMEEN: "Sewerage Tax",
          TAXNAMEMR: "गटार कर",
          TAXCODE: "ST01",
          TAXOWNER: "ULB",
        },
        {
          TAXID: 3,
          TAXNAMEEN: "Property Tax",
          TAXNAMEMR: "मालमत्ता कर",
          TAXCODE: "PT01",
          TAXOWNER: "Govt",
        },
      ];

      if (dummyData.length > 0) {
        const data = dummyData.map((item, index) => [
          <Link
            key={item.TAXID}
            state={{ taxId: item.TAXID }}
            to={`/Masters/FrmTaxMasterMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            निवड
          </Link>,
          index + 1,
          item.TAXNAMEEN || "",
          item.TAXNAMEMR || "",
          item.TAXCODE || "",
          item.TAXOWNER || "",
        ]);
        setTableData(data);
      } else {
        alert("No record found");
        setTableData([]);
      }

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.get("getTaxList");
      // if (res?.data?.success && res?.data?.data?.length > 0) {
      //   const data = res.data.data.map((item, index) => [
      //     <Link
      //       key={item.TAXID}
      //       state={{ taxId: item.TAXID }}
      //       to={`/Masters/FrmTaxMasterMst`}
      //       className="text-blue-600 underline hover:text-blue-800 font-medium"
      //     >
      //       निवड
      //     </Link>,
      //     index + 1,
      //     item.TAXNAMEEN || "",
      //     item.TAXNAMEMR || "",
      //     item.TAXCODE || "",
      //     item.TAXOWNER || "",
      //   ]);
      //   setTableData(data);
      // } else {
      //   alert("No record found");
      //   setTableData([]);
      // }
    } catch (error) {
      setTableData([]);
      console.error("Error fetching tax list:", error);
      alert("Failed to fetch tax list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        {/* ---------- Add New ---------- */}
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

        {/* ---------- Table ---------- */}
        <div className="mt-3">
          <Table headers={tableHeader} data={tableData} />
        </div>
      </div>
    </Layout>
  );
};

export default FrmTaxMasterList;
