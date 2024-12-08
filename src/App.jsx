import { Navigate, Route, Routes } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import TopBar from "./components/TopBar/TopBar";
import DashboardLayout from "./layouts/DashboardLayout/DashboardLayout";
import AppLayout from "./layouts/AppLayout/AppLayout";
import DashboardHome from "./pages/DashboardHome/DashboardHome";
import SystemInfoPage from "./pages/DashboardHome/pages/SystemInfoPage/SystemInfoPage";
import HomePage from "./pages/HomePage/HomePage";
import SaveNewConnectionPage from "./pages/SaveNewConnectionPage/SaveNewConnectionPage";
import ManageGlobalPackagesPage from "./pages/ManageGlobalPackagesPage/ManageGlobalPackagesPage";

function App() {
  return (
    <>
      <TopBar />
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
            <Route path='dashboard-home' element={<DashboardHome />} />
            <Route
              path='dashboard-home/system-info'
              element={<SystemInfoPage />}
            />

            <Route
              path='manage-global-packages/:category'
              element={<ManageGlobalPackagesPage />}
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
