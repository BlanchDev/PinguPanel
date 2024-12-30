import "./PM2Page.scss";
import WebApps from "../DashboardHomePage/components/WebApps/WebApps";
import { usePackageManager } from "../../context/DashboardLayoutContext";

function PM2Page() {
  const { packages } = usePackageManager();

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
            <p>Checking system requirements...</p>
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
            <p>System requirements not installed!</p>
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
