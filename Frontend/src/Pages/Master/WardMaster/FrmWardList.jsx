import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Label from "../../../Components/Label";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmWardList = () => {
  const { user } = useAuth();
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const [ulbOptions, setUlbOptions] = useState([]);
  const [tableData, setTableData] = useState([]);

  const tableHeader = ["निवड", "प्रभागाचे नाव", "प्रभागाचा कोड", "सक्रिय"];

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
          alert("No Data Found");
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

  const fetchWardList = async () => {
    if (!ulbid) {
      alert("UlbId is not set");
      setTableData([]);
      return;
    }

    try {
      setLoading(true);
      const res = await apiService.get(`/master/getWardList?ulbid=${ulbid}`);

      if (res?.success && res?.data?.length > 0) {
        const data = res.data.map((item) => [
          <Link
            key={item.NUM_WARD_ID}
            state={{
              wardId: item.NUM_WARD_ID,
              wardName: item.VAR_WARD_NAME,
              wardCode: item.VAR_WARD_CODE,
              flag: item.ACTIVEFLAG,
            }}
            to={`/Masters/FrmWardMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            निवड
          </Link>,
          item.VAR_WARD_NAME || "",
          item.VAR_WARD_CODE || "",
          item.ACTIVEFLAG || "",
        ]);
        setTableData(data);
      } else {
        setTableData([]);
        alert("Data Not Found");
      }
    } catch (err) {
      console.error("Error fetching ward list:", err);
      setTableData([]);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ulbid) {
      fetchWardList();
    }
  }, [ulbid]);

  return (
    <Layout
      title="Ward List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Ward List",
      }}
    >
      <div className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label text="नगरपालिकेचे नाव : " required />
            <select
              disabled
              className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                bg-slate-100 cursor-not-allowed"
              value={ulbid ? String(ulbid) : ""}
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
          <Link to={"/Masters/FrmWardMst"}>
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

export default FrmWardList;
