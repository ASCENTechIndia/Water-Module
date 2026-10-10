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
import FrmBlockList from "./Pages/Master/BlockMaster/FrmBlockList.jsx";
import FrmBlockMst from "./Pages/Master/BlockMaster/FrmBlockMst.jsx";
import FrmBankList from "./Pages/Master/BankMaster/FrmBankList.jsx";
import FrmBankMst from "./Pages/Master/BankMaster/FrmBankMst.jsx";
import FrmRateList from "./Pages/Master/RateMaster/FrmRateList.jsx";
import FrmRateMst from "./Pages/Master/RateMaster/FrmRateMst.jsx";
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
import FrmUlbTipList from "./Pages/Master/UlbTipMaster/FrmUlbTipList.jsx";
import FrmUlbTipMst from "./Pages/Master/UlbTipMaster/FrmUlbTipMst.jsx";
import FrmUsageTypeList from "./Pages/Master/UsageType/FrmUsageTypeList.jsx";
import FrmUsageTypeMst from "./Pages/Master/UsageType/FrmUsageTypeMst.jsx";
import FrmServiceRateConfigMst from "./Pages/Configuration/FrmServiceRateConfigMst/FrmServiceRateConfigMst.jsx";
import FrmConnectionMst from "./Pages/Water/FrmConnectionMst/FrmConnectionMst.jsx";
import FrmConnSearch from "./Pages/Water/FrmConnSearch/FrmConnSearch.jsx";
import FrmSearchReciptList from "./Pages/Search/FrmSearchReciptList/FrmSearchReciptList.jsx";
import FrmConnectionSearch from "./Pages/Search/FrmConnectionSearch/FrmConnectionSearch.jsx";
import FrmBillGeneration from "./Pages/Transaction/FrmBillGeneration/FrmBillGeneration.jsx";
import FrmReceiptDeleteAuthList from "./Pages/Transaction/FrmReceiptDeleteAuthList/FrmReceiptDeleteAuthList.jsx";

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
                  <Route 
                    path="/Masters/FrmServiceRateConfigMst"
                    element={<FrmServiceRateConfigMst />}
                  />


                  {/* Water */}
                  <Route 
                    path="/Transaction/FrmConnSearch"
                    element={<FrmConnSearch />}
                  />
                  <Route 
                    path="/Transaction/FrmConnectionMst"
                    element={<FrmConnectionMst />}
                  />

                  {/* Search */}
                  <Route 
                    path="/Transaction/FrmSearchReciptList"
                    element={<FrmSearchReciptList />}
                  />
                  <Route 
                    path="/ReportsForm/FrmConnectionSearch"
                    element={<FrmConnectionSearch />}
                  />

                  {/* Transaction */}
                  <Route
                    path="/Transaction/FrmBillGeneration"
                    element={<FrmBillGeneration />}
                  />

                  <Route 
                    path="/Transaction/FrmReceiptDeleteAuthList"
                    element={<FrmReceiptDeleteAuthList />}
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
                  <Route path="/Masters/FrmBlockList" element={<FrmBlockList />} />
                  <Route path="/Masters/FrmBlockMst" element={<FrmBlockMst />} />
                  <Route path="/Masters/FrmBankList" element={<FrmBankList />} />
                  <Route path="/Masters/FrmBankMst" element={<FrmBankMst />} />
                  <Route path="/Masters/FrmRateList" element={<FrmRateList />} />
                  <Route path="/Masters/FrmRateMst" element={<FrmRateMst />} />
                  <Route path="/Masters/FrmUlbTipList" element={<FrmUlbTipList />} />
                  <Route path="/Masters/FrmUlbTipMst" element={<FrmUlbTipMst />} />
                  <Route path="/Masters/FrmUsageTypeList" element={<FrmUsageTypeList />} />
                  <Route path="/Masters/FrmUsageTypeMst" element={<FrmUsageTypeMst />} />
                  

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
