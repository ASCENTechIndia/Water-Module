import React, { useState, useEffect } from "react";
import Layout from "../../Components/Layout";

const Dashboard = () => {
  return (
    <Layout
      title="Dashboard"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Dashboard",
      }}
    ></Layout>
  );
};

export default Dashboard;
