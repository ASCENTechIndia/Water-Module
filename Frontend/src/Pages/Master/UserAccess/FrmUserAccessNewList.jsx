import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Label from "../../../Components/Label";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmUserAccessNewList = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  const [ulbOptions, setUlbOptions] = useState([]);
  const [selectedUlb, setSelectedUlb] = useState("");
  const [tableData, setTableData] = useState([]);

  const tableHeader = [
    "Select",
    "User Name",
    "User ID",
    "Department",
    "Designation",
    "Mobile",
    "OTP Enable",
  ];

  // ---------- Load ULB dropdown (DUMMY) ----------
  useEffect(() => {
    // 🔸 DUMMY — replace with apiService.get("getUlbDropdown") later
    const dummyUlbs = [
      { value: "1", label: "Pune Municipal Corporation" },
      { value: "2", label: "Mumbai Municipal Corporation" },
      { value: "3", label: "Nashik Municipal Corporation" },
      { value: "4", label: "Nagpur Municipal Corporation" },
    ];
    setUlbOptions(dummyUlbs);

    // 🔸 REAL API — uncomment when ready
    // const fetchUlb = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.get("getUlbDropdown");
    //     if (res?.data?.success && Array.isArray(res.data.data)) {
    //       setUlbOptions(
    //         res.data.data.map((item) => ({
    //           value: String(item.CORPORATIONID),
    //           label: item.CORPORATIONNAME,
    //         })),
    //       );
    //     } else {
    //       setUlbOptions([]);
    //     }
    //   } catch (err) {
    //     console.error("ULB dropdown error:", err);
    //     setUlbOptions([]);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchUlb();
  }, []);

  // ---------- Load user list when ULB changes (DUMMY) ----------
  const fetchUserList = async () => {
    try {
      setLoading(true);

      // 🔸 DUMMY — replace with apiService.post("getUserAccessList", { ulbId: Number(selectedUlb) })
      const dummyData = [
        {
          USERID: 1001,
          USERNAME: "Rahul Sharma",
          DEPARTMENT: "Accounts",
          DESIGNATION: "Clerk",
          MOBILE: "9876543210",
          OTP_ENABLE: "Y",
        },
        {
          USERID: 1002,
          USERNAME: "Priya Patil",
          DEPARTMENT: "Health",
          DESIGNATION: "Officer",
          MOBILE: "9123456780",
          OTP_ENABLE: "N",
        },
        {
          USERID: 1003,
          USERNAME: "Amit Deshmukh",
          DEPARTMENT: "Water Supply",
          DESIGNATION: "Supervisor",
          MOBILE: "9988776655",
          OTP_ENABLE: "Y",
        },
      ];

      if (dummyData.length > 0) {
        const data = dummyData.map((item) => [
          <Link
            key={item.USERID}
            state={{ userId: item.USERID }}
            to={`/Masters/FrmUserAccessNewMaster`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.USERNAME || "",
          item.USERID || "",
          item.DEPARTMENT || "-",
          item.DESIGNATION || "-",
          item.MOBILE || "-",
          item.OTP_ENABLE || "-",
        ]);
        setTableData(data);
      } else {
        alert("No record found");
        setTableData([]);
      }

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.post("getUserAccessList", {
      //   ulbId: Number(selectedUlb),
      //   userId: String(userId),
      // });
      // if (res?.data?.success && res?.data?.data?.length > 0) {
      //   const data = res.data.data.map((item) => [
      //     <Link
      //       key={item.USERID}
      //       state={{ userId: item.USERID }}
      //       to={`/Masters/FrmUserAccessNewMaster`}
      //       className="text-blue-600 underline hover:text-blue-800 font-medium"
      //     >
      //       Select
      //     </Link>,
      //     item.USERNAME || "",
      //     item.USERID || "",
      //     item.DEPARTMENT || "-",
      //     item.DESIGNATION || "-",
      //     item.MOBILE || "-",
      //     item.OTP_ENABLE || "-",
      //   ]);
      //   setTableData(data);
      // } else {
      //   alert("No record found");
      //   setTableData([]);
      // }
    } catch (error) {
      setTableData([]);
      console.error("Error fetching user access list:", error);
      alert("Failed to fetch user access list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedUlb) {
      setTableData([]);
      return;
    }
    fetchUserList();
  }, [selectedUlb]);

  return (
    <Layout
      title="User Access List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "User Access List",
      }}
    >
      <div className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label text="ULB Name : " required />
            <select
              className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              value={selectedUlb}
              onChange={(e) => setSelectedUlb(e.target.value)}
            >
              <option value="">-- Select ULB --</option>
              {ulbOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <Link to={"/Masters/FrmUserAccessNewMst"}>
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

export default FrmUserAccessNewList;
