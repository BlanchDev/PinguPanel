import { Outlet } from "react-router-dom";
import { ConnectionProvider } from "./context/ConnectionProvider";
import { WebAppsProvider } from "./context/WebAppsProvider";
import { SystemRequirementsProvider } from "./context/SystemRequirementsProvider";
import DashboardLeftBar from "../../pages/DashboardHome/components/DashboardLeftBar/DashboardLeftBar";
import { motion } from "framer-motion";
import "./DashboardLayout.scss";
import { useMotion } from "../AppLayout/context/Context";

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
      <WebAppsProvider>
        <SystemRequirementsProvider>
          <motion.div
            className='dashboard-layout w100 h100 row'
            {...animation()}
          >
            <DashboardLeftBar />
            <Outlet />
          </motion.div>
        </SystemRequirementsProvider>
      </WebAppsProvider>
    </ConnectionProvider>
  );
}

export default DashboardLayout;
