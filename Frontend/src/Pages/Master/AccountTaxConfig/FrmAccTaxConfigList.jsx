import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Label from "../../../Components/Label";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmAccTaxConfigList = () => {
  const { user } = useAuth();
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const [ulbOptions, setUlbOptions] = useState([]);
  const [selectedUlb, setSelectedUlb] = useState("");
  const [tableData, setTableData] = useState([]);

  const tableHeader = [
    "निवडा",
    "Tax Name",
    "Tax Code",
    "AccTax UsageType Code",
    "Arreas MinorCode",
    "Arreas MajorCode",
    "C MinorCode",
    "C MajorCode",
  ];

  // ULB dropdown
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

  // Acc Tax Config list
  const fetchAccTaxConfigList = async () => {
    if (!selectedUlb) {
      setTableData([]);
      return;
    }

    try {
      setLoading(true);
      const res = await apiService.get(
        `/master/getAccTaxConfigList?ulbId=${selectedUlb}`,
      );
      if (res?.success && res?.data?.length > 0) {
        const data = res.data.map((item) => [
          <Link
            key={item.NUM_ACCTAX_ID}
            state={{ taxId: item.NUM_ACCTAX_ID }}
            to={`/Masters/FrmAccTaxConfigMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            निवडा
          </Link>,
          item.VAR_TAX_MNAME || "",
          item.VAR_ACCTAX_TAXCODE || "",
          item.VAR_ACCTAX_USAGETYPE || "",
          item.VAR_ACCTAX_MINORCODE || "",
          item.VAR_ACCTAX_MAJORCODE || "",
          item.VAR_ACCTAX_CMINORCODE || "",
          item.VAR_ACCTAX_CMAJORCODE || "",
        ]);
        setTableData(data);
      } else {
        setTableData([]);
        alert(res?.data?.message || "Data Not Found");
      }
    } catch (err) {
      console.error("Error fetching acc tax config list:", err);
      setTableData([]);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccTaxConfigList();
  }, [selectedUlb]);

  return (
    <Layout
      title="Account Tax Config List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Account Tax Config List",
      }}
    >
      <div className="w-full space-y-6">
        {/* ULB Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label text="Ulb Name : " required />
            <select
              className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              value={selectedUlb}
              onChange={(e) => setSelectedUlb(e.target.value)}
            >
              <option value="">-- Select Ulb --</option>
              {ulbOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add New */}
        <div className="flex justify-end">
          <Link to={"/Masters/FrmAccTaxConfigMst"}>
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

export default FrmAccTaxConfigList;
