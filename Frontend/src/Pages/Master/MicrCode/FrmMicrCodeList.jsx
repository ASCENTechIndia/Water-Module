import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Label from "../../../Components/Label";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmMicrCodeList = () => {
  const { user } = useAuth();
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const [tableData, setTableData] = useState([]);

  const tableHeader = [
    "Select",
    "MICR Code",
    "Bank Name",
    "Ins By",
    "Ins Date",
  ];

  // MICR code list
  const fetchMicrCodeList = async () => {
    if (!ulbid) {
      alert("UlbId is not set");
      setTableData([]);
      return;
    }

    try {
      setLoading(true);
      const res = await apiService.get(
        `/master/getMicrCodeList?ulbId=${ulbid}`,
      );

      if (res?.success && res?.data?.length > 0) {
        const data = res.data.map((item) => [
          <Link
            key={item.ID}
            state={{
              micrId: item.ID,
              micrCode: item.CODE,
              bankName: item.BANKNAME,
            }}
            to={`/Masters/FrmMicrCodeMst`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.CODE || "",
          item.BANKNAME || "",
          item.INSBY || "",
          item.INSDT || "",
        ]);
        setTableData(data);
      } else {
        setTableData([]);
        alert(res?.data?.message || "Data Not Found");
      }
    } catch (err) {
      console.error("Error fetching MICR code list:", err);
      setTableData([]);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ulbid) {
      fetchMicrCodeList();
    }
  }, [ulbid]);

  return (
    <Layout
      title="MICR Code List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "MICR Code List",
      }}
    >
      <div className="w-full space-y-6">
        {/* Add New */}
        <div className="flex justify-end">
          <Link to={"/Masters/FrmMicrCodeMst"}>
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

export default FrmMicrCodeList;
