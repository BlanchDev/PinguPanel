import { Navigate, Route, Routes } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import TopBar from "./components/TopBar/TopBar";
import AppLayout from "./layouts/AppLayout/AppLayout";
import HomePage from "./layouts/AppLayout/pages/HomePage/HomePage";
import SaveNewConnectionPage from "./layouts/AppLayout/pages/SaveNewConnectionPage/SaveNewConnectionPage";
import DashboardLayout from "./layouts/DashboardLayout/DashboardLayout";
import DashboardHomePage from "./layouts/DashboardLayout/pages/DashboardHomePage/DashboardHomePage";
import SystemInfoPage from "./layouts/DashboardLayout/pages/DashboardHomePage/pages/SystemInfoPage/SystemInfoPage";
import ManageGlobalPackagesPage from "./layouts/DashboardLayout/pages/ManageGlobalPackagesPage/ManageGlobalPackagesPage";
import SecurityPage from "./layouts/DashboardLayout/pages/SecurityPage/SecurityPage";
import IPTablesPage from "./layouts/DashboardLayout/pages/SecurityPage/pages/IPTablesPage/IPTablesPage";

function App() {
  return (
    <>
      {window.Electron && <TopBar />}
      <Routes>
        {/* HOME */}
        <Route path='/' element={<AppLayout />}>
          {/* HOME PAGES */}
          <Route index element={<HomePage />} />
          <Route
            path='/save-new-connection'
            element={<SaveNewConnectionPage />}
          />

          {/* DASHBOARD */}
          <Route path='/dashboard/:connectionId' element={<DashboardLayout />}>
            <Route index element={<Navigate to='dashboard-home' />} />

            {/* DASHBOARD PAGES */}
            <Route path='dashboard-home' element={<DashboardHomePage />} />
            <Route
              path='dashboard-home/system-info'
              element={<SystemInfoPage />}
            />

            {/* MANAGE GLOBAL PACKAGES */}
            <Route
              path='manage-global-packages/:category'
              element={<ManageGlobalPackagesPage />}
            />

            {/* SECURITY */}
            <Route path='security' element={<SecurityPage />} />
            <Route path='security/iptables' element={<IPTablesPage />} />
          </Route>

          {/* REDIRECTS */}
          <Route path='*' element={<Navigate to='/' />} />
        </Route>
      </Routes>

      <ToastContainer
        position='bottom-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
        transition={Bounce}
      />
    </>
  );
}

export default App;
