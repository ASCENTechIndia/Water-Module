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
import FrmConsumerTypeConfig from "./Pages/Configuration/FrmConsumerTypeConfig/FrmConsumerTypeConfig.jsx";
import FrmConnCodeConfig from "./Pages/Configuration/FrmConnCodeConfig/FrmConnCodeConfig.jsx";
import FrmMeterOwnerConfig from "./Pages/Configuration/FrmMeterOwnerConfig/FrmMeterOwnerConfig.jsx";
import FrmBankConfig from "./Pages/Configuration/FrmBankConfig/FrmBankConfig.jsx";
import FrmBillingFrequencyConfig from "./Pages/Configuration/FrmBillingFrequencyConfig/FrmBillingFrequencyConfig.jsx";
import FrmConnSizeConfig from "./Pages/Configuration/FrmConnSizeConfig/FrmConnSizeConfig.jsx";
import FrmConnStatusConfig from "./Pages/Configuration/FrmConnStatusConfig/FrmConnStatusConfig.jsx";
import FrmMeterGapCodeConfig from "./Pages/Configuration/FrmMeterGapCodeConfig/FrmMeterGapCodeConfig.jsx";
import FrmTaxMasterConfig from "./Pages/Configuration/FrmTaxMasterConfig/FrmTaxMasterConfig.jsx";
import FrmConnTypeConfig from "./Pages/Configuration/FrmConnTypeConfig/FrmConnTypeConfig.jsx";
import FrmCollCenterConfig from "./Pages/Configuration/FrmCollCenterConfig/FrmCollCenterConfig.jsx";
import FrmServiceConfig from "./Pages/Configuration/FrmServiceConfig/FrmServiceConfig.jsx";
import FrmChargesTypeConfig from "./Pages/Configuration/FrmChargesTypeConfig/FrmChargesTypeConfig.jsx";
import FrmUserCollectionConfig from "./Pages/Configuration/FrmUserCollectionConfig/FrmUserCollectionConfig.jsx";
import FrmServiceRateConfigList from "./Pages/Configuration/FrmServiceRateConfigList/FrmServiceRateConfigList.jsx";

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
                  <Route 
                    path="/Masters/FrmConsumerTypeConfig"
                    element={<FrmConsumerTypeConfig />}
                  />
                  <Route 
                    path="/Masters/FrmConnCodeConfig"
                    element={<FrmConnCodeConfig />}
                  />
                  <Route 
                    path="/Masters/FrmMeterOwnerConfig"
                    element={<FrmMeterOwnerConfig />}
                  />
                  <Route 
                    path="/Masters/FrmBankConfig"
                    element={<FrmBankConfig />}
                  />
                  <Route 
                    path="/Masters/FrmBillingFrequencyConfig"
                    element={<FrmBillingFrequencyConfig />}
                  />
                  <Route 
                    path="/Masters/FrmConnSizeConfig"
                    element={<FrmConnSizeConfig />}
                  />
                  <Route 
                    path="/Masters/FrmConnStatusConfig"
                    element={<FrmConnStatusConfig />}
                  />
                  <Route 
                    path="/Masters/FrmMeterGapCodeConfig"
                    element={<FrmMeterGapCodeConfig />}
                  />
                  <Route 
                    path="/Masters/FrmTaxMasterConfig"
                    element={<FrmTaxMasterConfig />}
                  />
                  <Route 
                    path="/Masters/FrmConnTypeConfig"
                    element={<FrmConnTypeConfig />}
                  />
                  <Route 
                    path="/Masters/FrmCollcenterConfig"
                    element={<FrmCollCenterConfig />}
                  />
                  <Route 
                    path="/Masters/FrmServiceConfig"
                    element={<FrmServiceConfig />}
                  />
                  <Route 
                    path="/Masters/FrmChargesTypeConfig"
                    element={<FrmChargesTypeConfig />}
                  />
                  <Route 
                    path="/Transaction/FrmUserCollectionConfig"
                    element={<FrmUserCollectionConfig />}
                  />
                  <Route 
                    path="/Masters/FrmServiceRateConfigList"
                    element={<FrmServiceRateConfigList />}
                  />
                  {/* Master routes */}
                  <Route path="/Masters/FrmMenuList" element={<FrmMenuList />} />
                  <Route path="/Masters/FrmMenuMst" element={<FrmMenuMst />} />
                  <Route path="/Masters/FrmUserAccessNewList" element={<FrmUserAccessNewList />} />
                  <Route path="/Masters/FrmUserAccessNewMst" element={<FrmUserAccessNewMst />} />
                  

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
