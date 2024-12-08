import { motion } from "framer-motion";
import PropTypes from "prop-types";
function DockerPackages({ appStatus }) {
  return (
    <motion.div
      className='box-container border column gap25'
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='column gap10'>
        <h2 className='purple-title'>*Docker Packages</h2>
        <p>
          Docker is a platform for developing, shipping, and running
          applications in containers. It provides a consistent environment
          across different systems, allowing for efficient deployment and
          scaling of applications.
        </p>
      </div>
      <div className='gridauto gap20'>
        <fieldset className='box column gap10'>
          <legend className='app-title'>docker-ce</legend>
          <div className='content column aic jcsb gap10'>
            <p className='app-description noborder small'>
              Docker-CE <span className='highlight'>(Community Edition)</span>{" "}
              is an open-source platform for developing, shipping, and running
              applications in containers, allowing for consistent environments
              across different systems. It&apos;s the free version of Docker,
              commonly used by developers for building and managing containers.
            </p>
            {appStatus("node")}
          </div>
        </fieldset>
        <fieldset className='box column gap10'>
          <legend className='app-title'>docker-ce-cli</legend>
          <div className='content column aic jcsb gap10'>
            <p className='app-description noborder small'>
              Docker-CE-CLI is the{" "}
              <span className='highlight'>command-line interface</span> for
              Docker Community Edition. It provides commands to interact with
              Docker, such as managing containers, images, and networks.
            </p>
            {appStatus("node")}
          </div>
        </fieldset>
        <fieldset className='box column gap10'>
          <legend className='app-title'>containerd.io</legend>
          <div className='content column aic jcsb gap10'>
            <p className='app-description noborder small'>
              containerd.io is an industry-standard core container runtime. It
              manages the lifecycle of containers, including image transfer and
              storage, container execution, and supervision. It is used by
              Docker and other container platforms to handle container-related
              tasks.
            </p>
            {appStatus("node")}
          </div>
        </fieldset>
      </div>
    </motion.div>
  );
}

DockerPackages.propTypes = {
  appStatus: PropTypes.func.isRequired,
};

export default DockerPackages;
