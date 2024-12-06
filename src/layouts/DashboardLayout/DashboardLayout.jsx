import { Outlet } from "react-router-dom";
import { ConnectionProvider } from "../../pages/DashboardPage/context/ConnectionProvider";
import { WebAppsProvider } from "../../pages/DashboardPage/context/WebAppsProvider";
import { SystemRequirementsProvider } from "../../pages/DashboardPage/context/SystemRequirementsProvider";

function DashboardLayout() {
  return (
    <ConnectionProvider>
      <WebAppsProvider>
        <SystemRequirementsProvider>
          <Outlet />
        </SystemRequirementsProvider>
      </WebAppsProvider>
    </ConnectionProvider>
  );
}

export default DashboardLayout;
