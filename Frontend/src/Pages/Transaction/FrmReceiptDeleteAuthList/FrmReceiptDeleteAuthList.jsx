import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../Components/Layout";
import { Link } from "react-router-dom";
import Table from "../../../Components/Table.jsx";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmReceiptDeleteAuthList = () => {
  const { user } = useAuth();
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const tableHeader = [
    "PTN No",
    "Zone",
    "Ward",
    "Name",
    "Address",
    "User",
    "Receipt No",
    "Details",
  ];

  const fetchTableData = async () => {
    if (!ulbid) {
      alert("UlbId is not set");
      return;
    }

    try {
      setLoading(true);
      const res = await apiService.get(
        `/transaction/getReceiptDeleteAuthList?ulbId=${ulbid}`,
      );

      if (res?.success && res?.data?.length > 0) {
        const data = res.data.map((item) => [
          item.CONNNO || "",
          item.ZONENAME || "",
          item.WARDNAME || "",
          item.OWNERNAME || "",
          item.ADDRESS || "",
          item.INSBY || "",
          item.RECNO || "",
          <Link
            key={item.RECID}
            type="button"
            className="text-blue-600 underline hover:text-blue-800 font-medium"
            to={"/Transaction/FrmReceiptDeleteAuthMst"}
            state={{
              recId: item.RECID,
              recNo: item.RECNO,
              connId: item.CONNID,
              wardId: item.WARDID,
              zoneId: item.ZONEID,
              blockId: item.BLOCKID,
            }}
          >
            Detail
          </Link>,
        ]);
        setTableData(data);
      } else {
        setTableData([]);
        alert(res?.message || "Data Not Found");
      }
    } catch (err) {
      console.error("Error fetching receipt delete auth list:", err);
      setTableData([]);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ulbid) {
      fetchTableData();
    }
  }, [ulbid]);

  return (
    <Layout
      title="Receipt Delete Authorization List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Receipt Delete Authorization List",
      }}
    >
      <div className="mt-3">
        {tableData?.length > 0 && (
          <Table headers={tableHeader} data={tableData} />
        )}
      </div>
    </Layout>
  );
};

export default FrmReceiptDeleteAuthList;
