import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Label from "../../../Components/Label";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmUsageSubTypeList = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  const [usageTypeOptions, setUsageTypeOptions] = useState([]);
  const [selectedUsageType, setSelectedUsageType] = useState("");
  const [tableData, setTableData] = useState([]);

  const tableHeader = ["Select", "Usage Subtype"];

  // ---------- Load Usage Type dropdown (DUMMY) ----------
  useEffect(() => {
    // 🔸 DUMMY — replace with apiService.get("getUsageTypeDropdown") later
    setUsageTypeOptions([
      { value: "1", label: "Residential" },
      { value: "2", label: "Commercial" },
      { value: "3", label: "Industrial" },
      { value: "4", label: "Institutional" },
    ]);

    // 🔸 REAL API — uncomment when ready
    // const fetchUsageTypes = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.get("getUsageTypeDropdown");
    //     if (res?.data?.success && Array.isArray(res.data.data)) {
    //       setUsageTypeOptions(
    //         res.data.data.map((item) => ({
    //           value: String(item.USAGETYPEID),
    //           label: item.USAGETYPENAME,
    //         })),
    //       );
    //     } else {
    //       setUsageTypeOptions([]);
    //     }
    //   } catch (err) {
    //     console.error("Usage Type dropdown error:", err);
    //     setUsageTypeOptions([]);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchUsageTypes();
  }, []);

  // ---------- Load Usage Sub Type list (DUMMY) ----------
  const fetchUsageSubTypeList = async () => {
    try {
      setLoading(true);

      // 🔸 DUMMY — replace with apiService.post("getUsageSubTypeList", { usageTypeId: Number(selectedUsageType) })
      const dummyData = [
        { USAGESUBTYPEID: 1, USAGESUBTYPENAME: "Domestic" },
        { USAGESUBTYPEID: 2, USAGESUBTYPENAME: "Slum" },
        { USAGESUBTYPEID: 3, USAGESUBTYPENAME: "Rural" },
      ];

      if (dummyData.length > 0) {
        const data = dummyData.map((item) => [
          <Link
            key={item.USAGESUBTYPEID}
            state={{ usageSubTypeId: item.USAGESUBTYPEID }}
            to={`/Masters/FrmUsageSubTypeMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.USAGESUBTYPENAME || "",
        ]);
        setTableData(data);
      } else {
        alert("No record found");
        setTableData([]);
      }

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.post("getUsageSubTypeList", {
      //   usageTypeId: Number(selectedUsageType),
      //   userId: String(userId),
      // });
      // if (res?.data?.success && res?.data?.data?.length > 0) {
      //   const data = res.data.data.map((item) => [
      //     <Link
      //       key={item.USAGESUBTYPEID}
      //       state={{ usageSubTypeId: item.USAGESUBTYPEID }}
      //       to={`/Masters/FrmUsageSubTypeMst`}
      //       className="text-blue-600 underline hover:text-blue-800 font-medium"
      //     >
      //       Select
      //     </Link>,
      //     item.USAGESUBTYPENAME || "",
      //   ]);
      //   setTableData(data);
      // } else {
      //   alert("No record found");
      //   setTableData([]);
      // }
    } catch (error) {
      setTableData([]);
      console.error("Error fetching usage sub type list:", error);
      alert("Failed to fetch usage sub type list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedUsageType) {
      setTableData([]);
      return;
    }
    fetchUsageSubTypeList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUsageType]);

  return (
    <Layout
      title="Usage Sub Type List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Usage Sub Type List",
      }}
    >
      <div className="w-full space-y-6">
        {/* ---------- Usage Type Filter ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label text="Usage Type : " required />
            <select
              className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              value={selectedUsageType}
              onChange={(e) => setSelectedUsageType(e.target.value)}
            >
              <option value="">-- Select Usage Type --</option>
              {usageTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ---------- Add New ---------- */}
        <div className="flex justify-end">
          <Link to={"/Masters/FrmUsageSubTypeMst"}>
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

export default FrmUsageSubTypeList;
