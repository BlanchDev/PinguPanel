import { Navigate, Route, Routes } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import TopBar from "./components/TopBar/TopBar";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import HomePage from "./pages/HomePage/HomePAge";
import SaveNewConnectionPage from "./pages/SaveNewConnectionPage/SaveNewConnectionPage";

function App() {
  return (
    <>
      <TopBar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route
          path='/save-new-connection'
          element={<SaveNewConnectionPage />}
        />
        <Route path='/dashboard/:id' element={<DashboardPage />} />
        <Route path='*' element={<Navigate to='/' />} />
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
