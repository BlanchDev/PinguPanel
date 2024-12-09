import { Outlet } from "react-router-dom";
import { ConnectionProvider } from "./context/ConnectionProvider";
import { WebAppsProvider } from "./context/WebAppsProvider";
import DashboardLeftBar from "../../pages/DashboardHome/components/DashboardLeftBar/DashboardLeftBar";
import { motion } from "framer-motion";
import "./DashboardLayout.scss";
import { useMotion } from "../AppLayout/context/Context";
import { PackageManagerProvider } from "./context/PackageManagerProvider";

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
          <motion.div
            className='dashboard-layout w100 h100 row'
            {...animation()}
          >
            <DashboardLeftBar />
            <Outlet />
          </motion.div>
        </WebAppsProvider>
      </PackageManagerProvider>
    </ConnectionProvider>
  );
}

export default DashboardLayout;
