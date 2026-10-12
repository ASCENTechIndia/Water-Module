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
import FrmConSumerTypeList from "./Pages/Master/ConsumerList/FrmConSumerTypeList.jsx";
import FrmConSumerTypeMst from "./Pages/Master/ConsumerList/FrmConSumerTypeMst.jsx";
import FrmBillFreqList from "./Pages/Master/BillFrequency/FrmBillFreqList.jsx";
import FrmBillFreqMst from "./Pages/Master/BillFrequency/FrmBillFreqMst.jsx";
import FrmUsageSubTypeList from "./Pages/Master/UsageSubType/FrmUsageSubTypeList.jsx";
import FrmUsageSubTypeMst from "./Pages/Master/UsageSubType/FrmUsageSubTypeMst.jsx";
import FrmGapCodeList from "./Pages/Master/GapCode/FrmGapCodeList.jsx";
import FrmGapCodeMst from "./Pages/Master/GapCode/FrmGapCodeMst.jsx";
import FrmPlumberList from "./Pages/Master/PlumberList/FrmPlumberList.jsx";
import FrmPlumberMst from "./Pages/Master/PlumberList/FrmPlumberMst.jsx";
import FrmConnStatusList from "./Pages/Master/ConnectionStatus/FrmConnStatusList.jsx";
import FrmConnStatusMst from "./Pages/Master/ConnectionStatus/FrmConnStatusMst.jsx";
import FrmTaxMasterList from "./Pages/Master/TaxMaster/FrmTaxMasterList.jsx";
import FrmTaxMasterMst from "./Pages/Master/TaxMaster/FrmTaxMasterMst.jsx";
import FrmMeterOwnerList from "./Pages/Master/MeterOwner/FrmMeterOwnerList.jsx";
import FrmMeterOwnerMst from "./Pages/Master/MeterOwner/FrmMeterOwnerMst.jsx";
import FrmConnTypeList from "./Pages/Master/ConnectionType/FrmConnTypeList.jsx";
import FrmConnTypeMst from "./Pages/Master/ConnectionType/FrmConnTypeMst.jsx";
import FrmConnCodeList from "./Pages/Master/ConnCode/FrmConnCodeList.jsx";
import FrmConnCodeMst from "./Pages/Master/ConnCode/FrmConnCodeMst.jsx";

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
                  <Route path="/Masters/FrmConSumerTypeList" element={<FrmConSumerTypeList />} />
                  <Route path="/Masters/FrmConSumerTypeMst" element={<FrmConSumerTypeMst />} />
                  <Route path="/Masters/FrmBillFreqList" element={<FrmBillFreqList />} />
                  <Route path="/Masters/FrmBillFreqMst" element={<FrmBillFreqMst />} />
                  <Route path="/Masters/FrmUsageSubTypeList" element={<FrmUsageSubTypeList />} />
                  <Route path="/Masters/FrmUsageSubTypeMst" element={<FrmUsageSubTypeMst />} />
                  <Route path="/Masters/FrmGapCodeList" element={<FrmGapCodeList />} />
                  <Route path="/Masters/FrmGapCodeMst" element={<FrmGapCodeMst />} />
                  <Route path="/Masters/FrmPlumberList" element={<FrmPlumberList />} />
                  <Route path="/Masters/FrmPlumberMst" element={<FrmPlumberMst />} />
                  <Route path="/Masters/FrmConnStatusList" element={<FrmConnStatusList />} />
                  <Route path="/Masters/FrmConnStatusMst" element={<FrmConnStatusMst />} />
                  <Route path="/Masters/FrmTaxMasterList" element={<FrmTaxMasterList />} />
                  <Route path="/Masters/FrmTaxMasterMst" element={<FrmTaxMasterMst />} />
                  <Route path="/Masters/FrmMeterOwnerList" element={<FrmMeterOwnerList />} />
                  <Route path="/Masters/FrmMeterOwnerMst" element={<FrmMeterOwnerMst />} />
                  <Route path="/Masters/FrmConnTypeList" element={<FrmConnTypeList />} />
                  <Route path="/Masters/FrmConnTypeMst" element={<FrmConnTypeMst />} />
                  <Route path="/Masters/FrmConnCodeList" element={<FrmConnCodeList />} />
                  <Route path="/Masters/FrmConnCodeMst" element={<FrmConnCodeMst />} />

                  

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
