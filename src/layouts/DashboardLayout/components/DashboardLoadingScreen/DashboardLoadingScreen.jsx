import PropTypes from "prop-types";
import {
  useConnection,
  usePackageManager,
  useWebApps,
} from "../../context/DashboardLayoutContext";
import { useIPTables } from "../../pages/SecurityPage/pages/IPTablesPage/context/IPTablesContext";
import { useEffect, useState } from "react";

function DashboardLoadingScreen({ children }) {
  const { myConnLoading } = useConnection();
  const { packages } = usePackageManager();
  const { isIPTablesLoading } = useIPTables();
  const { sites } = useWebApps();

  const [dashboardLoadingPassed, setDashboardLoadingPassed] = useState({
    myConnLoadingPassed: false,
    packagesLoadingPassed: false,
    IPTablesLoadingPassed: false,
    webAppsLoadingPassed: false,
  });

  const {
    myConnLoadingPassed,
    packagesLoadingPassed,
    IPTablesLoadingPassed,
    webAppsLoadingPassed,
  } = dashboardLoadingPassed;

  useEffect(() => {
    const newLoadingState = {
      myConnLoadingPassed: !myConnLoading,
      packagesLoadingPassed: !Object.values(packages?.required || {}).every(
        (pkg) => pkg.loading,
      ),
      IPTablesLoadingPassed: !isIPTablesLoading,
      webAppsLoadingPassed: Object.values(sites).every((site) => site.domain),
    };

    if (
      JSON.stringify(newLoadingState) !== JSON.stringify(dashboardLoadingPassed)
    ) {
      setDashboardLoadingPassed(newLoadingState);
    }
  }, [
    dashboardLoadingPassed,
    myConnLoading,
    packages,
    isIPTablesLoading,
    sites,
  ]);

  const style = {
    opacity: 0.5,
  };

  const renderLoading = () => {
    const loadingItems = [
      {
        title: "Checking Connection",
        passed: myConnLoadingPassed,
      },
      {
        title: "Checking Requirements",
        passed: packagesLoadingPassed,
      },
      {
        title: "Checking IPTables",
        passed: IPTablesLoadingPassed,
      },
      {
        title: "Checking Web Apps",
        passed: webAppsLoadingPassed,
      },
    ];

    return (
      <div className='dashboard-loading-screen w100 h100 row aic jcc'>
        <div className='box row aic gap50'>
          <div className='loading-spinner' />
          <ul className='column gap10'>
            {loadingItems.map((item) => (
              <li key={item.title}>
                {item.passed ? (
                  <del style={style}>{item.title}</del>
                ) : (
                  <p>{item.title}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return Object.values(dashboardLoadingPassed).every((passed) => passed)
    ? children
    : renderLoading();
}

DashboardLoadingScreen.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLoadingScreen;
