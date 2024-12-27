import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { usePackageManager } from "../../../../../context/DashboardLayoutContext";
import PackageTemplate from "../../PackageTemplate/PackageTemplate";

function DockerPackages({ appStatus }) {
  const { packages, distro } = usePackageManager();
  const { connectionId } = useParams();

  const checkDockerStep = (dependencyPackage, app) => {
    let message;

    switch (dependencyPackage) {
      case "GPG":
        message = "Follow the STEP 1) first";
        break;
      case "repository":
        message = "Follow the STEP 2)";
        break;
      case "docker-ce":
        message = "Need docker-ce";
        break;
    }

    if (
      packages["docker"]?.[app]?.installed ||
      packages["docker"]?.[app]?.status
    ) {
      return appStatus("docker", app);
    }

    return packages["docker"]?.[dependencyPackage]?.installed ? (
      appStatus("docker", app)
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
        <h2 className='purple-title'>*Docker Packages</h2>
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
          appName='1) GPG directory & key'
          appDescription='Create GPG directory & download Docker GPG key. Install the Docker GPG key.'
          appStatus={appStatus("docker", "GPG")}
        />

        <PackageTemplate
          appName='2) Docker Repository'
          appDescription={`${
            distro?.charAt(0)?.toUpperCase() + distro?.slice(1)
          } Docker Repository. Install the Docker Repository.`}
          appStatus={checkDockerStep("GPG", "repository")}
        />

        <PackageTemplate
          appName='docker-ce'
          appDescription={`docker-ce is the core package for Docker, providing the essential tools to create, deploy, and run applications using containers. It is required to manage Docker containers on your system. \n\n Note: This package automatically installs the docker-ce-cli, containerd.io and docker-compose-plugin packages.`}
          appStatus={checkDockerStep("repository", "docker-ce")}
        />

        <PackageTemplate
          appName='docker-ce-cli'
          appDescription='docker-ce-cli is the command line interface for Docker, allowing you to manage Docker containers and images. It is required to interact with Docker from the command line.'
          appStatus={checkDockerStep("docker-ce", "docker-ce-cli")}
        />

        <PackageTemplate
          appName='containerd.io'
          appDescription='containerd.io is the container runtime for Docker, providing the core functionality for managing containerized applications. It is required to run Docker containers.'
          appStatus={checkDockerStep("docker-ce", "containerd.io")}
        />

        <PackageTemplate
          appName='docker-compose-plugin'
          appDescription='docker-compose-plugin is the Docker Compose plugin, providing the core functionality for managing containerized applications. It is required to run Docker containers.'
          appStatus={checkDockerStep("docker-ce", "docker-compose-plugin")}
        />

        <PackageTemplate
          appName='cgroupfs-mount'
          appDescription='cgroupfs-mount enables Docker to use cgroups for resource management and isolation.'
          appStatus={checkDockerStep("docker-ce", "cgroupfs-mount")}
        />
      </div>
    </motion.div>
  );
}

DockerPackages.propTypes = {
  appStatus: PropTypes.func.isRequired,
};

export default DockerPackages;
