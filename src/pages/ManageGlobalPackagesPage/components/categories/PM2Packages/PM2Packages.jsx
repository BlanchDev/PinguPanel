import { motion } from "framer-motion";
import PropTypes from "prop-types";

function PM2Packages({ appStatus }) {
  return (
    <motion.div
      className='box-container border column gap25'
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='column gap10'>
        <h2 className='purple-title'>*PM2 Packages</h2>
        <p>
          PM2 is a production process manager for Node.js applications with a
          built-in load balancer. It allows you to keep your applications alive
          forever, to reload them without downtime and to facilitate common
          system admin tasks.
        </p>
      </div>
      <div className='gridauto gap20'>
        <fieldset className='box column gap10'>
          <legend className='app-title'>nodejs & npm</legend>
          <div className='content column aic jcsb gap10'>
            <p className='app-description noborder small'>
              Node.js is an open-source, cross-platform JavaScript runtime
              environment that allows you to run JavaScript code outside of a
              browser. It is commonly used for server-side programming, building
              web applications, and creating command-line tools.
            </p>
            {appStatus("node")}
          </div>
        </fieldset>
        <fieldset className='box column gap10'>
          <legend className='app-title'>pm2</legend>
          <div className='content column aic jcsb gap10'>
            <p className='app-description noborder small'>
              PM2 is a production process manager for Node.js applications with
              a built-in load balancer. It allows you to keep your applications
              alive forever, to reload them without downtime and to facilitate
              common system admin tasks.
            </p>
            {appStatus("node")}
          </div>
        </fieldset>
        <fieldset className='box column gap10'>
          <legend className='app-title'>pm2-logrotate</legend>
          <div className='content column aic jcsb gap10'>
            <p className='app-description noborder small'>
              PM2-logrotate is a tool that automatically rotates and manages the
              log files of PM2-managed applications. It helps prevent log files
              from growing too large and ensures that logs are properly archived
              and managed.
            </p>
            {appStatus("node")}
          </div>
        </fieldset>

        <fieldset className='box column gap10'>
          <legend className='app-title'>pm2-runtime</legend>
          <div className='content column aic jcsb gap10'>
            <p className='app-description noborder small'>
              PM2-runtime is a tool that automatically rotates and manages the
              runtime of PM2-managed applications. It helps prevent runtime
              files from growing too large and ensures that runtime files are
              properly archived and managed.
            </p>
            {appStatus("node")}
          </div>
        </fieldset>
      </div>
    </motion.div>
  );
}

PM2Packages.propTypes = {
  appStatus: PropTypes.func.isRequired,
};

export default PM2Packages;
