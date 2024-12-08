import { motion } from "framer-motion";
import PropTypes from "prop-types";

function RequiredPackages({ appStatus }) {
  return (
    <motion.div
      className='box border column gap25'
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='column gap10'>
        <h2 className='purple-title'>*Required Packages</h2>
        <p>
          The following packages are required for the system to function
          properly.
        </p>
      </div>
      <div className='gridauto gap20'>
        <fieldset className='box column gap10'>
          <legend className='app-title'>apt-transport-https</legend>
          <div className='content column aic jcsb gap10'>
            <p className='app-description noborder small'>
              A package that allows the <span className='highlight'>APT</span>{" "}
              package manager to download and install packages over the HTTPS
              protocol. This ensures that packages are downloaded over more
              secure and encrypted connections.
            </p>
            {appStatus("node")}
          </div>
        </fieldset>
        <fieldset className='box column gap10'>
          <legend className='app-title'>ca-certificates</legend>
          <div className='content column aic jcsb gap10'>
            <p className='app-description noborder small'>
              This package contains the root certificates required for the
              system to recognize trusted digital certificates. These
              certificates are necessary for HTTPS connections and secure web
              operations.
            </p>
            {appStatus("node")}
          </div>
        </fieldset>
        <fieldset className='box column gap10'>
          <legend className='app-title'>curl</legend>
          <div className='content column aic jcsb gap10'>
            <p className='app-description noborder small'>
              <span className='highlight'>Curl</span> is a command-line tool
              that can transfer data over a network. It is commonly used for
              downloading files from URLs or interacting with web APIs.
            </p>
            {appStatus("node")}
          </div>
        </fieldset>
        <fieldset className='box column gap10'>
          <legend className='app-title'>gnupg</legend>
          <div className='content column aic jcsb gap10'>
            <p className='app-description noborder small'>
              <span className='highlight'>GnuPG</span> is a software used for
              encryption and digital signing. It is used to verify package
              signatures and is typically required to check the authenticity of
              signed packages when working with secure software repositories.
            </p>
            {appStatus("node")}
          </div>
        </fieldset>
        <fieldset className='box column gap10'>
          <legend className='app-title'>lsb-release</legend>
          <div className='content column aic jcsb gap10'>
            <p className='app-description noborder small'>
              This package is a tool used to retrieve the system&apos;s
              distribution information (e.g., distribution name, version number,
              etc.). It is especially necessary for correctly performing certain
              tasks related to software and package management.
            </p>
            {appStatus("node")}
          </div>
        </fieldset>
        <fieldset className='box column gap10'>
          <legend className='app-title'>software-properties-common</legend>
          <div className='content column aic jcsb gap10'>
            <p className='app-description noborder small'>
              This package contains tools for managing software repositories.
              For example, it provides the{" "}
              <span className='highlight'>add-apt-repository</span> command,
              which is used to add third-party repositories.
            </p>
            {appStatus("node")}
          </div>
        </fieldset>
      </div>
    </motion.div>
  );
}

RequiredPackages.propTypes = {
  appStatus: PropTypes.func.isRequired,
};

export default RequiredPackages;
