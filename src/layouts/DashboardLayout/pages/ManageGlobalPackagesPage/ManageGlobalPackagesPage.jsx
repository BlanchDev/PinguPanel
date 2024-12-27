import { useParams } from "react-router-dom";
import { usePackageManager } from "../../context/DashboardLayoutContext";
import "./ManageGlobalPackagesPage.scss";
import PackageCategoryNav from "./components/PackageCategoryNav/PackageCategoryNav";
import DockerPackages from "./components/categories/DockerPackages/DockerPackages";
import PM2Packages from "./components/categories/PM2Packages/PM2Packages";
import RequiredPackages from "./components/categories/RequiredPackages/RequiredPackages";
import SSLPackages from "./components/categories/SSLPackages/SSLPackages";
import SecurityPackages from "./components/categories/SecurityPackages/SecurityPackages";

function ManageGlobalPackagesPage() {
  const { packages, installPackage, uninstallPackage } = usePackageManager();
  const { category } = useParams();

  // TODO: Add a check for the Node.js or APP version
  // TODO: NGINX and Apache, CERBOT
  // TODO: MAKE TAB SYSTEM
  // TODO: fail2ban

  const appStatus = (category, app) => {
    if (packages[category]?.[app]?.loading) {
      return (
        <div className='w100 column aic gap10'>
          <span className='button yellow w100'>Checking...</span>
        </div>
      );
    }

    if (packages[category]?.[app]?.status) {
      return (
        <div className='w100 column aic gap10'>
          <span className='button blue w100'>
            {packages[category]?.[app]?.status}
          </span>
        </div>
      );
    }

    if (packages.isInstallationBusy && packages[category]?.[app]?.installed) {
      return (
        <div className='w100 column aic gap10'>
          <div className='app-status column aic jcc gap5'>
            <span>Version:{packages[category]?.[app]?.version}</span>
            {packages[category]?.[app]?.candidate && (
              <span>Candidate:{packages[category]?.[app]?.candidate}</span>
            )}
          </div>
          <span className='button red'>Busy...</span>
        </div>
      );
    }

    if (packages.isInstallationBusy) {
      return (
        <div className='w100 column aic gap10'>
          <span className='button green w100'>Busy...</span>
        </div>
      );
    }

    if (packages[category]?.[app]?.installed) {
      return (
        <div className='w100 column aic gap10'>
          <div className='app-status column aic jcc gap5'>
            <span>Version:{packages[category]?.[app]?.version}</span>
            {packages[category]?.[app]?.candidate && (
              <span>Candidate:{packages[category]?.[app]?.candidate}</span>
            )}
          </div>
          <button
            type='button'
            className='button red'
            onClick={() => uninstallPackage(category, app)}
          >
            Uninstall
          </button>
        </div>
      );
    }

    return (
      <div className='w100 column aic gap10'>
        <button
          type='button'
          className='button green'
          onClick={() => installPackage(category, app)}
        >
          Install
        </button>
      </div>
    );
  };

  return (
    <div className='manage-global-packages-page dashboard-layout-page column'>
      <PackageCategoryNav />
      <div className='column gap10'>
        {category === "all" && (
          <div className='column aic gap50'>
            <RequiredPackages appStatus={appStatus} />
            <DockerPackages appStatus={appStatus} />
            <PM2Packages appStatus={appStatus} />
            <SSLPackages appStatus={appStatus} />
            <SecurityPackages appStatus={appStatus} />
          </div>
        )}
        {category === "required" && <RequiredPackages appStatus={appStatus} />}
        {category === "docker" && <DockerPackages appStatus={appStatus} />}
        {category === "pm2" && <PM2Packages appStatus={appStatus} />}
        {category === "ssl" && <SSLPackages appStatus={appStatus} />}
        {category === "security" && <SecurityPackages appStatus={appStatus} />}
      </div>
    </div>
  );
}

export default ManageGlobalPackagesPage;
