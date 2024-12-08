import { motion } from "framer-motion";
import PropTypes from "prop-types";

function SSLPackages({ appStatus }) {
  return (
    <motion.div
      className='box-container border column gap25'
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='column gap10'>
        <h2 className='purple-title'>*SSL Packages</h2>
        <p>
          The following packages are required for the system to function
          properly.
        </p>
      </div>
      <div className='gridauto gap20'>
        <fieldset className='box column gap10'>
          <legend className='app-title'>cerbot</legend>
          <div className='content column aic jcsb gap10'>
            <p className='app-description noborder small'>
              Cerbot is a tool that allows you to easily obtain and renew TLS
              certificates for your websites. It simplifies the process of
              obtaining and renewing certificates, ensuring that your websites
              are secure and accessible over HTTPS.
            </p>
            {appStatus("node")}
          </div>
        </fieldset>
        <fieldset className='box column gap10'>
          <legend className='app-title'>python3-certbot-nginx </legend>
          <div className='content column aic jcsb gap10'>
            <p className='app-description noborder small'>
              Python3-certbot-nginx is a package that provides the necessary
              Python bindings for Certbot to work with the Nginx web server. It
              allows Certbot to interact with Nginx to manage SSL certificates
              and configurations.
            </p>
            {appStatus("node")}
          </div>
        </fieldset>
        <fieldset className='box column gap10'>
          <legend className='app-title'>python3-certbot-apache </legend>
          <div className='content column aic jcsb gap10'>
            <p className='app-description noborder small'>
              Python3-certbot-apache is a package that provides the necessary
              Python bindings for Certbot to work with the Apache web server. It
              allows Certbot to interact with Apache to manage SSL certificates
              and configurations.
            </p>
            {appStatus("node")}
          </div>
        </fieldset>
      </div>
    </motion.div>
  );
}

SSLPackages.propTypes = {
  appStatus: PropTypes.func.isRequired,
};

export default SSLPackages;
