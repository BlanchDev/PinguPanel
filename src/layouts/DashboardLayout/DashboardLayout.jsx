import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import { useMotion } from "../AppLayout/context/AppLayoutContext";
import DashboardLeftBar from "./components/DashboardLeftBar/DashboardLeftBar";
import { ConnectionProvider } from "./context/ConnectionProvider";
import { PackageManagerProvider } from "./context/PackageManagerProvider";
import { WebAppsProvider } from "./context/WebAppsProvider";
import "./DashboardLayout.scss";
import IPTablesProvider from "./pages/SecurityPage/pages/IPTablesPage/context/IPTablesProvider";

function DashboardLayout() {
  const { isLoginAnimation, setIsLoginAnimation, isLogoutAnimation } =
    useMotion();

  const animation = () => {
    if (isLoginAnimation) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.5, ease: "easeOut" },
        onAnimationComplete: () => {
          setIsLoginAnimation(false);
        },
      };
    }

    if (isLogoutAnimation) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 0 },
        transition: { duration: 0.5, ease: "easeOut" },
      };
    }

    return {};
  };

  return (
    <ConnectionProvider>
      <PackageManagerProvider>
        <WebAppsProvider>
          <IPTablesProvider>
            <motion.div className='dashboard-layout row' {...animation()}>
              <DashboardLeftBar />
              <Outlet />
            </motion.div>
          </IPTablesProvider>
        </WebAppsProvider>
      </PackageManagerProvider>
    </ConnectionProvider>
  );
}

export default DashboardLayout;
