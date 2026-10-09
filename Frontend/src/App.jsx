import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./HOC/Login/Login";
import ProtectedRoute from "./HOC/ProtectedRoute.jsx";
import Dashboard from "./Pages/Dashboard/Dashboard.jsx";
import FrmMenuList from "./Pages/Master/MenuMaster/FrmMenuList.jsx";
import FrmMenuMst from "./Pages/Master/MenuMaster/FrmMenuMst.jsx";
import FrmUserAccessNewList from "./Pages/Master/UserAccess/FrmUserAccessNewList.jsx";
import FrmUserAccessNewMst from "./Pages/Master/UserAccess/FrmUserAccessNewMst.jsx";
import FrmPremiseTypeConfig from "./Pages/Configuration/FrmPremiseTypeConfig/FrmPremiseTypeConfig.jsx";
import FrmUsageTypeConfig from "./Pages/Configuration/FrmUsageTypeConfig/FrmUsageTypeConfig.jsx";
import FrmUsageSubTypeConfig from "./Pages/Configuration/FrmUsageSubTypeConfig/FrmUsageSubTypeConfig.jsx";
import FrmBillingMethodConfig from "./Pages/Configuration/FrmBillingMethodConfig/FrmBillingMethodConfig.jsx";
import FrmUserList from "./Pages/Master/UserCreation/FrmUserList.jsx";
import FrmUserMst from "./Pages/Master/UserCreation/FrmUserMst.jsx";
import FrmWardList from "./Pages/Master/WardMaster/FrmWardList.jsx";
import FrmWardMst from "./Pages/Master/WardMaster/FrmWardMst.jsx";
import FrmZoneList from "./Pages/Master/ZoneMaster/FrmZoneList.jsx";
import FrmZoneMst from "./Pages/Master/ZoneMaster/FrmZoneMst.jsx";

function App() {
  const hostname = window.location.hostname;
  const module = hostname.split(".")[0];
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Routes>
                  {/* Dashboard */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  {/* Configuration */}
                  <Route path="/Masters/FrmPremiseTypeConfig" element={<FrmPremiseTypeConfig />} />
                  <Route 
                    path="/Masters/FrmUsageTypeConfig"
                    element={<FrmUsageTypeConfig />}
                  />
                  <Route 
                    path="/Masters/FrmUsageSubTypeConfig"
                    element={<FrmUsageSubTypeConfig />}
                  />
                  <Route 
                    path="/Masters/FrmBillingMethodConfig"
                    element={<FrmBillingMethodConfig />}
                  />
                  {/* Master routes */}
                  <Route path="/Masters/FrmMenuList" element={<FrmMenuList />} />
                  <Route path="/Masters/FrmMenuMst" element={<FrmMenuMst />} />
                  <Route path="/Masters/FrmUserAccessNewList" element={<FrmUserAccessNewList />} />
                  <Route path="/Masters/FrmUserAccessNewMst" element={<FrmUserAccessNewMst />} />
                  <Route path="/Masters/FrmUserList" element={<FrmUserList />} />
                  <Route path="/Masters/FrmUserMst" element={<FrmUserMst />} />
                  <Route path="/Masters/FrmWardList" element={<FrmWardList />} />
                  <Route path="/Masters/FrmWardMst" element={<FrmWardMst />} />
                  <Route path="/Masters/FrmZoneList" element={<FrmZoneList />} />
                  <Route path="/Masters/FrmZoneMst" element={<FrmZoneMst />} />
                  

                  {/* Water */}

                  

                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
