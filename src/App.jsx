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
import PM2Page from "./layouts/DashboardLayout/pages/PM2Page/PM2Page";

//TODO: MYSQL sayfasında otomatik template yap. Örneğin users tablosu için user_id, username, password, email, created_at, updated_at gibi kolonlar oluştur. Bu template seçildiğinde otomatik olarak kolonları oluştursun. Hatta düzenlemek istiyor musun diye sorsun.

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
              path='manage-global-packages/:packageCategory'
              element={<ManageGlobalPackagesPage />}
            />

            {/* PM2 */}
            <Route path='pm2' element={<PM2Page />} />

            {/* SECURITY */}
            <Route path='security' element={<SecurityPage />} />
            <Route
              path='security/iptables/:iptablesTable'
              element={<IPTablesPage />}
            />
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
