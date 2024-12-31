import "./PM2Page.scss";
import WebApps from "../DashboardHomePage/components/WebApps/WebApps";
import { usePackageManager } from "../../context/DashboardLayoutContext";
import { Link, useParams } from "react-router-dom";

function PM2Page() {
  const { packages } = usePackageManager();
  const { connectionId } = useParams();

  const renderWebApps = () => {
    if (packages.error) {
      return (
        <fieldset className='box column gap10'>
          <legend className='title yellow-title'>Web Apps</legend>
          <div className='content column aic jcc'>
            <p>System requirements check failed: {packages.error}</p>
          </div>
        </fieldset>
      );
    }

    if (
      !Object.values(packages?.required || {}).every((pkg) => pkg.installed)
    ) {
      return (
        <fieldset className='box column gap10'>
          <legend className='title yellow-title'>Web Apps</legend>
          <div className='content column aic jcc gap25'>
            <p>System requirements not installed!</p>
            <Link
              className='button purple'
              to={`/dashboard/${connectionId}/manage-global-packages/required-packages`}
            >
              Install Requirements
            </Link>
          </div>
        </fieldset>
      );
    }

    if (
      packages.pm2.nodejs.loading ||
      packages.pm2.npm.loading ||
      packages.pm2.pm2.loading ||
      packages.pm2["pm2-logrotate"].loading
    ) {
      return (
        <fieldset className='box column gap10'>
          <legend className='title yellow-title'>Web Apps</legend>
          <div className='content column aic jcc gap25'>
            <div className='loading-spinner' />
            <p>Checking PM2 Packages...</p>
          </div>
        </fieldset>
      );
    }

    if (
      !packages.pm2.nodejs.installed ||
      !packages.pm2.npm.installed ||
      !packages.pm2.pm2.installed
    ) {
      return (
        <fieldset className='box column gap10'>
          <legend className='title yellow-title'>Web Apps</legend>
          <div className='content column aic jcc gap25'>
            <p>PM2 Packages not installed!</p>
            <Link
              className='button purple'
              to={`/dashboard/${connectionId}/manage-global-packages/pm2-packages`}
            >
              Install PM2 Packages
            </Link>
          </div>
        </fieldset>
      );
    }

    return <WebApps />;
  };

  return (
    <div className='pm2-page dashboard-layout-page column gap20'>
      <div className='box-container noborder column gap10'>
        {renderWebApps()}
      </div>
    </div>
  );
}

export default PM2Page;
