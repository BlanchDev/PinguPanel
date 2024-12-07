import { createRoot } from "react-dom/client";
import "./global.scss";
import App from "./App.jsx";
import MainAppRouter from "./MainAppRouter.js";
import MotionProvider from "./layouts/AppLayout/context/MotionProvider.jsx";

createRoot(document.getElementById("root")).render(
  <MainAppRouter>
    <MotionProvider>
      <App />
    </MotionProvider>
  </MainAppRouter>,
);
