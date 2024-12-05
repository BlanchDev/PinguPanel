import { Outlet } from "react-router-dom";
import "./DashboardLayout.scss";
import { ConnectionProvider } from "../DashboardPage/context/ConnectionProvider";
import { WebAppsProvider } from "../DashboardPage/context/WebAppsProvider";
import { SystemRequirementsProvider } from "../DashboardPage/context/SystemRequirementsProvider";

function DashboardLayout() {
  return (
    <ConnectionProvider>
      <WebAppsProvider>
        <SystemRequirementsProvider>
          <div className='dashboard-layout column'>
            <Outlet />
          </div>
        </SystemRequirementsProvider>
      </WebAppsProvider>
    </ConnectionProvider>
  );
}

export default DashboardLayout;
