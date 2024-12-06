import { Navigate, Route, Routes } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import TopBar from "./components/TopBar/TopBar";
import DashboardLayout from "./layouts/DashboardLayout/DashboardLayout";
import AppLayout from "./layouts/AppLayout/AppLayout";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import SystemInfoPage from "./pages/DashboardPage/pages/SystemInfoPage/SystemInfoPage";
import HomePage from "./pages/HomePage/HomePage";
import SaveNewConnectionPage from "./pages/SaveNewConnectionPage/SaveNewConnectionPage";

function App() {
  return (
    <>
      <TopBar />
      <Routes>
        <Route path='/' element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route
            path='/save-new-connection'
            element={<SaveNewConnectionPage />}
          />
          <Route path='/dashboard/:connectionId' element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path='system-info' element={<SystemInfoPage />} />
          </Route>
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
