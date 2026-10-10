import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import Label from "../../../Components/Label";
import Layout from "../../../Components/Layout";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";
import apiService from "../../../../apiService";
import ConfigTable from "../../../Components/ConfigTable.jsx";
import Button from "../../../Components/Button.jsx";
import Table from "../../../Components/Table.jsx";

const FrmReceiptDeleteAuthList = () => {
    const { user } = useAuth();
    const { setLoading } = useLoader();
    const navigate = useNavigate();
    const location = useLocation();

    const [tableHeader, setTableHeader] = useState([
        "Sr. No.",
        "Receipt Number",
        "Applicant Name",
        "Select"
    ]);
    const [tableData, setTableData] = useState([]);

    const fetchTableData = async () => {
        try {
            setLoading(true);

            const payload = {};

            const response = await apiService.post("", payload);

            if (response.data.success && Array.isArray(response.data.data)) {
                const formatted = response.data.data.map((item, idx) => ([
                    idx + 1,
                    item.recno,
                    item.appname,
                    <span
                        className="text-blue-400 underline cursor-pointer"
                        onClick={() => {

                        }}
                    >Select</span>
                ]));

                setTableData(formatted);
            } else {
                setTableData([]);
            }
        } catch (error) {
            console.error(error);
            alert(error.message || "Failed to fetch data");
        } finally {
            setLoading(false);
        }
    }

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
                <Table 
                    headers={tableHeader}
                    data={tableData}
                />
            </div>
        </Layout>
    )
};

export default FrmReceiptDeleteAuthList;

