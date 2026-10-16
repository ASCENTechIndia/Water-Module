import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Label from "../../../Components/Label";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmUserAccessNewList = () => {
  const { user } = useAuth();
  const ulbid = user?.ulbId;
  const deptId = user?.deptId;
  const { setLoading } = useLoader();

  const [ulbOptions, setUlbOptions] = useState([]);
  const [selectedUlb, setSelectedUlb] = useState("");
  const [isUlbLocked, setIsUlbLocked] = useState(false);
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

  useEffect(() => {
    const fetchUlbDropdown = async () => {
      try {
        setLoading(true);
        const res = await apiService.get("/master/getUlbDropdownController");
        if (res?.success && Array.isArray(res.data)) {
          setUlbOptions(
            res.data.map((item) => ({
              value: String(item.CORPORATIONID),
              label: item.CORPORATIONNAME,
            })),
          );
        } else {
          setUlbOptions([]);
        }
      } catch (err) {
        console.error("ULB dropdown error:", err);
        alert(err.message);
        setUlbOptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUlbDropdown();
  }, []);

  useEffect(() => {
    if (ulbid && ulbOptions.length > 0) {
      const match = ulbOptions.find((o) => o.value === String(ulbid));
      if (match) {
        setSelectedUlb(match.value);
        setIsUlbLocked(true);
      }
    }
  }, [ulbid, ulbOptions]);

  const fetchUserList = async () => {
    if (!selectedUlb || !deptId) {
      setTableData([]);
      return;
    }

    try {
      setLoading(true);
      const res = await apiService.get(
        `/Master/getUserList?ulbid=${selectedUlb}&deptid=${deptId}`,
      );

      if (res?.success && res?.data?.length > 0) {
        const data = res.data.map((item) => [
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
          item.DEPTNAME || "-",
          item.DESIGNAME || "-",
          item.MOBNO || "-",
          item.OTPENABLED || "-",
        ]);
        setTableData(data);
      } else {
        setTableData([]);
        alert("No Data Found");
      }
    } catch (error) {
      console.error("Error fetching user list:", error);
      setTableData([]);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, [selectedUlb, deptId]);

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
              disabled={isUlbLocked}
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${isUlbLocked ? "bg-slate-100 cursor-not-allowed" : ""}`}
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
          {tableData?.length > 0 && (
            <Table headers={tableHeader} data={tableData} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FrmUserAccessNewList;
