import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Label from "../../../Components/Label";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmBlockList = () => {
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
    "Ward Name",
    "Zone Name",
    "Block Name",
    "Block Code",
    "Active Flag",
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

    // Auto-select first ULB
    if (dummyUlbs.length > 0) {
      setSelectedUlb(dummyUlbs[0].value);
    }

    // 🔸 REAL API — uncomment when ready
    // const fetchUlb = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await apiService.get("getUlbDropdown");
    //     if (res?.data?.success && Array.isArray(res.data.data)) {
    //       const opts = res.data.data.map((item) => ({
    //         value: String(item.CORPORATIONID),
    //         label: item.CORPORATIONNAME,
    //       }));
    //       setUlbOptions(opts);
    //       if (opts.length > 0) setSelectedUlb(opts[0].value);
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

  // ---------- Load block list (DUMMY) ----------
  const fetchBlockList = async () => {
    try {
      setLoading(true);

      // 🔸 DUMMY — replace with apiService.post("getBlockList", { ulbId: Number(selectedUlb) })
      const dummyData = [
        {
          BLOCKID: 1,
          WARDNAME: "प्रभाग क्र. १",
          ZONENAME: "विभाग क्र. १",
          BLOCKNAME: "ब्लॉक क्र. १",
          BLOCKCODE: "BLK-A",
          ISACTIVE: "Y",
        },
        {
          BLOCKID: 2,
          WARDNAME: "प्रभाग क्र. १",
          ZONENAME: "विभाग क्र. २",
          BLOCKNAME: "ब्लॉक क्र. २",
          BLOCKCODE: "BLK-B",
          ISACTIVE: "N",
        },
        {
          BLOCKID: 3,
          WARDNAME: "प्रभाग क्र. २",
          ZONENAME: "विभाग क्र. ३",
          BLOCKNAME: "ब्लॉक क्र. ३",
          BLOCKCODE: "BLK-C",
          ISACTIVE: "Y",
        },
      ];

      if (dummyData.length > 0) {
        const data = dummyData.map((item) => [
          <Link
            key={item.BLOCKID}
            state={{ blockId: item.BLOCKID }}
            to={`/Masters/FrmBlockMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.WARDNAME || "",
          item.ZONENAME || "",
          item.BLOCKNAME || "",
          item.BLOCKCODE || "",
          item.ISACTIVE === "Y" ? "Yes" : "No",
        ]);
        setTableData(data);
      } else {
        alert("No record found");
        setTableData([]);
      }

      // 🔸 REAL API — uncomment when ready
      // const res = await apiService.post("getBlockList", {
      //   ulbId: Number(selectedUlb),
      //   userId: String(userId),
      // });
      // if (res?.data?.success && res?.data?.data?.length > 0) {
      //   const data = res.data.data.map((item) => [
      //     <Link
      //       key={item.BLOCKID}
      //       state={{ blockId: item.BLOCKID }}
      //       to={`/Masters/FrmBlockMst`}
      //       className="text-blue-600 underline hover:text-blue-800 font-medium"
      //     >
      //       Select
      //     </Link>,
      //     item.WARDNAME || "",
      //     item.ZONENAME || "",
      //     item.BLOCKNAME || "",
      //     item.BLOCKCODE || "",
      //     item.ISACTIVE === "Y" ? "Yes" : "No",
      //   ]);
      //   setTableData(data);
      // } else {
      //   alert("No record found");
      //   setTableData([]);
      // }
    } catch (error) {
      setTableData([]);
      console.error("Error fetching block list:", error);
      alert("Failed to fetch block list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedUlb) {
      setTableData([]);
      return;
    }
    fetchBlockList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUlb]);

  return (
    <Layout
      title="Block List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Block List",
      }}
    >
      <div className="w-full space-y-6">
        {/* ---------- ULB Filter (disabled) ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label text="नगरपालिकेचे नाव : " required />
            <select
              disabled
              className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                bg-slate-100 cursor-not-allowed"
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

        {/* ---------- Add New ---------- */}
        <div className="flex justify-end">
          <Link to={"/Masters/FrmBlockMst"}>
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

export default FrmBlockList;
