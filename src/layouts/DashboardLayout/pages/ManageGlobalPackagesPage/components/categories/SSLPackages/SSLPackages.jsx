import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { usePackageManager } from "../../../../../context/DashboardLayoutContext";
import PackageTemplate from "../../PackageTemplate/PackageTemplate";

function SSLPackages({ appStatus }) {
  const { packages } = usePackageManager();
  const { connectionId } = useParams();

  return (
    <motion.div
      className='box-container noborder column gap25'
      initial={{ opacity: 1, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className='column gap10'>
        <h2 className='purple-title'>*SSL Packages</h2>
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
          appName='certbot'
          appDescription='Certbot is a tool that allows you to easily obtain and renew TLS certificates for your websites. It simplifies the process of obtaining and renewing certificates, ensuring that your websites are secure and accessible over HTTPS.'
          appStatus={appStatus("ssl", "certbot")}
        />

        <PackageTemplate
          appName='python3-certbot-nginx'
          appDescription='Python3-certbot-nginx is a package that provides the necessary Python bindings for Certbot to work with the Nginx web server. It allows Certbot to interact with Nginx to manage SSL certificates and configurations.'
          appStatus={appStatus("ssl", "python3-certbot-nginx")}
        />

        <PackageTemplate
          appName='python3-certbot-apache'
          appDescription='Python3-certbot-apache is a package that provides the necessary Python bindings for Certbot to work with the Apache web server. It allows Certbot to interact with Apache to manage SSL certificates and configurations.'
          appStatus={appStatus("ssl", "python3-certbot-apache")}
        />
      </div>
    </motion.div>
  );
}

SSLPackages.propTypes = {
  appStatus: PropTypes.func.isRequired,
};

export default SSLPackages;
