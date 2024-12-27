import { motion } from "framer-motion";
import PropTypes from "prop-types";
import PackageTemplate from "../../PackageTemplate/PackageTemplate";

function RequiredPackages({ appStatus }) {
  return (
    <motion.div
      className='box-container noborder column gap25'
      initial={{ opacity: 1, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className='column gap10'>
        <h2 className='orange-title'>*Required Packages</h2>
      </div>
      <div className='gridauto gap20'>
        <PackageTemplate
          appName='apt-transport-https'
          appDescription='A package that allows the APT package manager to download and install packages over the HTTPS protocol. This ensures that packages are downloaded over more secure and encrypted connections.'
          appStatus={appStatus("required", "apt-transport-https")}
        />

        <PackageTemplate
          appName='ca-certificates'
          appDescription='This package contains the root certificates required for the system to recognize trusted digital certificates. These certificates are necessary for HTTPS connections and secure web operations.'
          appStatus={appStatus("required", "ca-certificates")}
        />

        <PackageTemplate
          appName='curl'
          appDescription='Curl is a command-line tool that can transfer data over a network. It is commonly used for downloading files from URLs or interacting with web APIs.'
          appStatus={appStatus("required", "curl")}
        />

        <PackageTemplate
          appName='gnupg'
          appDescription='GnuPG is a software used for encryption and digital signing. It is used to verify package signatures and is typically required to check the authenticity of signed packages when working with secure software repositories.'
          appStatus={appStatus("required", "gnupg")}
        />

        <PackageTemplate
          appName='lsb-release'
          appDescription="This package is a tool used to retrieve the system's distribution information (e.g., distribution name, version number, etc.). It is especially necessary for correctly performing certain tasks related to software and package management."
          appStatus={appStatus("required", "lsb-release")}
        />

        <PackageTemplate
          appName='software-properties-common'
          appDescription='This package contains tools for managing software repositories. For example, it provides the add-apt-repository command, which is used to add third-party repositories.'
          appStatus={appStatus("required", "software-properties-common")}
        />
      </div>
    </motion.div>
  );
}

RequiredPackages.propTypes = {
  appStatus: PropTypes.func.isRequired,
};

export default RequiredPackages;
