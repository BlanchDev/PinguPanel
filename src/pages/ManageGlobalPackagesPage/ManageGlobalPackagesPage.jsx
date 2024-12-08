import { useParams } from "react-router-dom";
import { useSystemReqs } from "../../layouts/DashboardLayout/context/Context";
import AppCategoryNav from "./components/AppCategoryNav/AppCategoryNav";
import RequiredPackages from "./components/categories/RequiredPackages/RequiredPackages";
import "./ManageGlobalPackagesPage.scss";
import DockerPackages from "./components/categories/DockerPackages/DockerPackages";
import PM2Packages from "./components/categories/PM2Packages/PM2Packages";
import SSLPackages from "./components/categories/SSLPackages/SSLPackages";

function ManageGlobalPackagesPage() {
  const { requirements, reqsLoading } = useSystemReqs();
  const { category } = useParams();

  // TODO: Add a check for the Node.js or APP version
  // TODO: NGINX and Apache, CERBOT
  // TODO: MAKE TAB SYSTEM
  // TODO: fail2ban

  const appStatus = (app) => {
    if (reqsLoading) {
      return (
        <div className='row aic jcc gap10'>
          <span className='button yellow w100'>Checking...</span>
        </div>
      );
    }

    if (requirements[app].installed == "fwpoakgwaop") {
      return (
        <div className='row aic jcc gap10'>
          <p>Installed {requirements[app].version}</p>
        </div>
      );
    }

    return (
      <div className='w100 row aic gap10'>
        <button className='button green w100'>Install</button>
      </div>
    );
  };

  return (
    <div className='manage-global-packages-page column'>
      <AppCategoryNav />
      <div className='box-container column gap10'>
        {category === "all" && (
          <>
            <RequiredPackages appStatus={appStatus} />
            <DockerPackages appStatus={appStatus} />
            <PM2Packages appStatus={appStatus} />
            <SSLPackages appStatus={appStatus} />
          </>
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
