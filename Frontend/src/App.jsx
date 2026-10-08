import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./HOC/Login/Login";
import ProtectedRoute from "./HOC/ProtectedRoute.jsx";
import Dashboard from "./Pages/Dashboard/Dashboard.jsx";
import FrmMenuList from "./Pages/Master/MenuMaster/FrmMenuList.jsx";
import FrmMenuMst from "./Pages/Master/MenuMaster/FrmMenuMst.jsx";
import FrmUserAccessNewList from "./Pages/Master/UserAccess/FrmUserAccessNewList.jsx";
import FrmUserAccessNewMst from "./Pages/Master/UserAccess/FrmUserAccessNewMst.jsx";

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
