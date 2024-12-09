import { useParams } from "react-router-dom";
import { usePackageManager } from "../../layouts/DashboardLayout/context/Context";
import AppCategoryNav from "./components/AppCategoryNav/AppCategoryNav";
import RequiredPackages from "./components/categories/RequiredPackages/RequiredPackages";
import "./ManageGlobalPackagesPage.scss";
import DockerPackages from "./components/categories/DockerPackages/DockerPackages";
import PM2Packages from "./components/categories/PM2Packages/PM2Packages";
import SSLPackages from "./components/categories/SSLPackages/SSLPackages";

function ManageGlobalPackagesPage() {
  const { packages, installPackage, uninstallPackage } = usePackageManager();
  const { category } = useParams();

  // TODO: Add a check for the Node.js or APP version
  // TODO: NGINX and Apache, CERBOT
  // TODO: MAKE TAB SYSTEM
  // TODO: fail2ban

  console.log(packages);

  const appStatus = (category, app) => {
    if (packages[category]?.[app]?.loading) {
      return (
        <div className='w100 column aic gap10'>
          <span className='button yellow w100'>Checking...</span>
        </div>
      );
    }

    if (packages[category]?.[app]?.installed) {
      return (
        <div className='w100 column aic gap10'>
          <div className='app-status column aic jcc gap5'>
            <span>Version:{packages[category]?.[app]?.version}</span>
            <span>Candidate:{packages[category]?.[app]?.candidate}</span>
          </div>
          <button
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
          className='button green'
          onClick={() => installPackage(category, app)}
        >
          Install
        </button>
      </div>
    );
  };

  return (
    <div className='manage-global-packages-page column'>
      <AppCategoryNav />
      <div className='box-container column gap10'>
        {category === "all" && (
          <div className='column aic gap50'>
            <RequiredPackages appStatus={appStatus} />
            <DockerPackages appStatus={appStatus} />
            <PM2Packages appStatus={appStatus} />
            <SSLPackages appStatus={appStatus} />
          </div>
        )}
        {category === "required" && <RequiredPackages appStatus={appStatus} />}
        {category === "docker" && <DockerPackages appStatus={appStatus} />}
        {category === "pm2" && <PM2Packages appStatus={appStatus} />}
        {category === "ssl" && <SSLPackages appStatus={appStatus} />}
      </div>
    </div>
  );
}

export default ManageGlobalPackagesPage;
