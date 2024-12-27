import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { usePackageManager } from "../../../../../context/DashboardLayoutContext";
import PackageTemplate from "../../PackageTemplate/PackageTemplate";

function PM2Packages({ appStatus }) {
  const { packages } = usePackageManager();
  const { connectionId } = useParams();

  const checkPM2Step = (dependencyPackage, app) => {
    let message;

    switch (dependencyPackage) {
      case "nodejs":
        message = "Need nodejs";
        break;
      case "npm":
        message = "Need npm";
        break;
      case "pm2":
        message = "Need pm2";
        break;
    }

    if (packages["pm2"]?.[app]?.installed || packages["pm2"]?.[app]?.status) {
      return appStatus("pm2", app);
    }

    return packages["pm2"]?.[dependencyPackage]?.installed ? (
      appStatus("pm2", app)
    ) : (
      <div className='w100 column aic gap10'>
        <span className='button yellow w100'>{message}</span>
      </div>
    );
  };

  return (
    <motion.div
      className='box-container noborder column gap25'
      initial={{ opacity: 1, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className='column gap10'>
        <h2 className='purple-title'>*PM2 Packages</h2>
      </div>
      {!Object.values(packages?.required || {}).every(
        (pkg) => pkg.installed,
      ) && (
        <div className='need-to-install-required column aic jcc'>
          <div className='box column aic jcc gap25'>
            <h4>You need to install the required packages first</h4>
            <Link
              to={`/dashboard/${connectionId}/manage-global-packages/required`}
              className='button green'
            >
              Go to required packages
            </Link>
          </div>
        </div>
      )}
      <div className='gridauto gap20'>
        <PackageTemplate
          appName='nodejs'
          appDescription='Node.js is an open-source, cross-platform JavaScript runtime environment that allows you to run JavaScript code outside of a browser. It is commonly used for server-side programming, building web applications, and creating command-line tools.'
          appStatus={appStatus("pm2", "nodejs")}
        />

        <PackageTemplate
          appName='npm'
          appDescription='npm is a package manager for Node.js and the npm registry hosts over one million packages of free, reusable code.'
          appStatus={checkPM2Step("nodejs", "npm")}
        />

        <PackageTemplate
          appName='pm2'
          appDescription='PM2 is a production process manager for Node.js applications with a built-in load balancer. It allows you to keep your applications alive forever, to reload them without downtime and to facilitate common system admin tasks.'
          appStatus={checkPM2Step("npm", "pm2")}
        />

        <PackageTemplate
          appName='pm2-logrotate'
          appDescription='PM2-logrotate is a tool that automatically rotates and manages the log files of PM2-managed applications. It helps prevent log files from growing too large and ensures that logs are properly archived and managed.'
          appStatus={checkPM2Step("pm2", "pm2-logrotate")}
        />
      </div>
    </motion.div>
  );
}

PM2Packages.propTypes = {
  appStatus: PropTypes.func.isRequired,
};

export default PM2Packages;
