import "./App.css";
import TopBar from "./components/TopBar/TopBar";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePAge";
import SaveNewConnectionPage from "./pages/SaveNewConnectionPage/SaveNewConnectionPage";
import BreadCrumbs from "./components/BreadCrumbs/BreadCrumbs";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const location = useLocation();

  return (
    <>
      <TopBar />
      {location.pathname !== "/" && <BreadCrumbs />}
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route
          path='/save-new-connection'
          element={<SaveNewConnectionPage />}
        />
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
