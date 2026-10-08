import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./HOC/Login/Login";
import ProtectedRoute from "./HOC/ProtectedRoute.jsx";
import Dashboard from "./Pages/Dashboard/Dashboard.jsx";
import FrmPremiseTypeConfig from "./Pages/Configuration/FrmPremiseTypeConfig/FrmPremiseTypeConfig.jsx";
import FrmUsageTypeConfig from "./Pages/Configuration/FrmUsageTypeConfig/FrmUsageTypeConfig.jsx";
import FrmUsageSubTypeConfig from "./Pages/Configuration/FrmUsageSubTypeConfig/FrmUsageSubTypeConfig.jsx";
import FrmBillingMethodConfig from "./Pages/Configuration/FrmBillingMethodConfig/FrmBillingMethodConfig.jsx";

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
