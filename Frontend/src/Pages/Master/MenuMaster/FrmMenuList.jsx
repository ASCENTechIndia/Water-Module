import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmMenuList = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const tableHeader = [
    "निवड",
    "बदल",
    "Menu Title",
    "Parent",
    "Page Type",
    "Page Path",
  ];

  const fetchMenuList = async () => {
    try {
      setLoading(true);

      // 🔸 DUMMY DATA — replace with apiService.get("getMenuList") later
      const dummyData = [
        {
          MENUID: 1,
          MENUTITLE: "Master",
          PARENT: "-",
          PAGETYPE: "Group",
          PAGEPATH: "",
        },
        {
          MENUID: 101,
          MENUTITLE: "Sender",
          PARENT: "Master",
          PAGETYPE: "Page",
          PAGEPATH: "/Masters/FrmSenderList",
        },
        {
          MENUID: 102,
          MENUTITLE: "Sender Sub Type",
          PARENT: "Master",
          PAGETYPE: "Page",
          PAGEPATH: "/Masters/FrmSenderSubtypeList",
        },
        {
          MENUID: 2,
          MENUTITLE: "Configuration",
          PARENT: "-",
          PAGETYPE: "Group",
          PAGEPATH: "",
        },
        {
          MENUID: 201,
          MENUTITLE: "Sender Type Config",
          PARENT: "Configuration",
          PAGETYPE: "Page",
          PAGEPATH: "/Masters/FrmSenderTypeConfig",
        },
      ];

      if (dummyData.length > 0) {
        const data = dummyData.map((item) => [
          <Link
            key={`select-${item.MENUID}`}
            state={{ menuId: item.MENUID }}
            to={`/Masters/FrmMenuMaster`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            निवड
          </Link>,

          <Link
            key={`edit-${item.MENUID}`}
            state={{ menuId: item.MENUID, isEdit: true }}
            to={`/Masters/FrmMenuMaster`}
            className="text-emerald-600 underline hover:text-emerald-800 font-medium"
          >
            बदल
          </Link>,

          item.MENUTITLE || "",
          item.PARENT || "-",
          item.PAGETYPE || "-",
          item.PAGEPATH || "-",
        ]);
        setTableData(data);
      } else {
        alert("No record found");
        setTableData([]);
      }

      // 🔸 REAL API CALL — uncomment when ready
      // const res = await apiService.get("getMenuList");
      // if (res?.data?.success && res?.data?.data?.length > 0) {
      //   const data = res.data.data.map((item) => [
      //     <Link
      //       key={`select-${item.MENUID}`}
      //       state={{ menuId: item.MENUID }}
      //       to={`/Masters/FrmMenuMst`}
      //       className="text-blue-600 underline hover:text-blue-800 font-medium"
      //     >
      //       निवड
      //     </Link>,
      //     <Link
      //       key={`edit-${item.MENUID}`}
      //       state={{ menuId: item.MENUID, isEdit: true }}
      //       to={`/Masters/FrmMenuMaster`}
      //       className="text-emerald-600 underline hover:text-emerald-800 font-medium"
      //     >
      //       बदल
      //     </Link>,
      //     item.MENUTITLE || "",
      //     item.PARENT || "-",
      //     item.PAGETYPE || "-",
      //     item.PAGEPATH || "-",
      //   ]);
      //   setTableData(data);
      // } else {
      //   alert("No record found");
      //   setTableData([]);
      // }
    } catch (error) {
      setTableData([]);
      console.error("Error fetching menu list:", error);
      alert("Failed to fetch menu list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuList();
  }, []);

  return (
    <Layout
      title="Menu List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Menu List",
      }}
    >
      <div>
        <div className="ml-auto">
          <Link to={"/Masters/FrmMenuMst"}>
            <Button
              type="button"
              variant="primary"
              className="hover:cursor-pointer"
            >
              Add New
            </Button>
          </Link>
        </div>

        <div className="mt-3">
          <Table headers={tableHeader} data={tableData} />
        </div>
      </div>
    </Layout>
  );
};

export default FrmMenuList;
