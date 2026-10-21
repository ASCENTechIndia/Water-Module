import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Label from "../../../Components/Label";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmUsageSubTypeList = () => {
  const { user } = useAuth();
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const [usageTypeOptions, setUsageTypeOptions] = useState([]);
  const [selectedUsageType, setSelectedUsageType] = useState("");
  const [tableData, setTableData] = useState([]);

  const tableHeader = ["Select", "Usage Subtype"];

  // Usage Type dropdown
  useEffect(() => {
    const fetchUsageTypes = async () => {
      try {
        setLoading(true);
        const res = await apiService.get("/master/getUsageTypeDd");
        if (res?.success && Array.isArray(res.data)) {
          setUsageTypeOptions(
            res.data.map((item) => ({
              value: String(item.NUM_USAGETYPE_ID),
              label: item.VAR_USAGETYPE_NAME,
            })),
          );
        } else {
          setUsageTypeOptions([]);
        }
      } catch (err) {
        console.error("Usage Type dropdown error:", err);
        alert(err.message);
        setUsageTypeOptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsageTypes();
  }, []);

  // Usage Sub Type list
  const fetchUsageSubTypeList = async () => {
    if (!selectedUsageType) {
      setTableData([]);
      return;
    }

    try {
      setLoading(true);
      const res = await apiService.get(
        `/master/getUsageSubTypeList?usageId=${selectedUsageType}`,
      );

      if (res?.success && res?.data?.length > 0) {
        const data = res.data.map((item) => [
          <Link
            key={item.NUM_USAGESUBTYPE_ID}
            state={{
              usageSubTypeId: item.NUM_USAGESUBTYPE_ID,
              usageTypeId: item.NUM_USAGESUBTYPE_USAGETYPEID,
              usageSubTypeName: item.VAR_USAGESUBTYPE_NAME,
            }}
            to={`/Masters/FrmUsageSubTypeMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.VAR_USAGESUBTYPE_NAME || "",
        ]);
        setTableData(data);
      } else {
        setTableData([]);
        alert("Data Not Found");
      }
    } catch (err) {
      console.error("Error fetching usage sub type list:", err);
      setTableData([]);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsageSubTypeList();
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
        {/* Usage Type Filter */}
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

        {/* Add New */}
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

export default FrmUsageSubTypeList;
