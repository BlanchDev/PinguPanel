import { useEffect, useState } from "react";
import { useSystemReqs } from "../../layouts/DashboardLayout/context/Context";
import "./ManageGlobalAppsPage.scss";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

function ManageGlobalAppsPage() {
  const [distro, setDistro] = useState(null);
  const [loading, setLoading] = useState(true);

  const { requirements, reqsLoading } = useSystemReqs();

  // TODO: Add a check for the Node.js or APP version
  // TODO: NGINX and Apache, CERBOT
  // TODO: MAKE TAB SYSTEM
  // TODO: distroyu contextte kontrol et
  // TODO: fail2ban

  useEffect(() => {
    const checkSystemDetails = () => {
      // System Details
      window.Electron.ssh
        .executeCommand("cat /etc/os-release | grep '^ID=' | cut -d'=' -f2")
        .then((res) => {
          setDistro(res.output.trim());
        })
        .catch((err) => {
          toast.error(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    checkSystemDetails();
  }, [requirements]);

  const appStatus = (app) => {
    if (reqsLoading) {
      return (
        <div className='row aic jcc gap10'>
          <span className='button yellow w100'>Checking...</span>
        </div>
      );
    }

    if (requirements[app].installed == "fwpoakgwaop") {
      return (
        <div className='row aic jcc gap10'>
          <p>Installed {requirements[app].version}</p>
        </div>
      );
    }

    return (
      <div className='w100 row aic gap10'>
        <button className='button green w100'>Install</button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className='manage-global-apps-page column gap20'>
        <div className='box-container column gap10'>
          <fieldset className='box column gap10'>
            <legend className='title yellow-title'>
              Manage Global Apps {distro}
            </legend>
            <div className='content column aic jcc gap10'>
              <div className='loading-spinner'></div>
            </div>
          </fieldset>
        </div>
      </div>
    );
  }

  return (
    <div className='manage-global-apps-page column'>
      <div className='box-container column gap10'>
        <fieldset className='box noborder column gap50'>
          <legend className='title yellow-title'>
            Manage Global Apps {distro}
          </legend>

          <motion.div
            className='box-container border column gap25'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className='column gap10'>
              <h2 className='purple-title'>*System Requirements</h2>
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
                    A package that allows the{" "}
                    <span className='highlight'>APT</span> package manager to
                    download and install packages over the HTTPS protocol. This
                    ensures that packages are downloaded over more secure and
                    encrypted connections.
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
                    certificates are necessary for HTTPS connections and secure
                    web operations.
                  </p>
                  {appStatus("node")}
                </div>
              </fieldset>
              <fieldset className='box column gap10'>
                <legend className='app-title'>curl</legend>
                <div className='content column aic jcsb gap10'>
                  <p className='app-description noborder small'>
                    <span className='highlight'>Curl</span> is a command-line
                    tool that can transfer data over a network. It is commonly
                    used for downloading files from URLs or interacting with web
                    APIs.
                  </p>
                  {appStatus("node")}
                </div>
              </fieldset>
              <fieldset className='box column gap10'>
                <legend className='app-title'>gnupg</legend>
                <div className='content column aic jcsb gap10'>
                  <p className='app-description noborder small'>
                    <span className='highlight'>GnuPG</span> is a software used
                    for encryption and digital signing. It is used to verify
                    package signatures and is typically required to check the
                    authenticity of signed packages when working with secure
                    software repositories.
                  </p>
                  {appStatus("node")}
                </div>
              </fieldset>
              <fieldset className='box column gap10'>
                <legend className='app-title'>lsb-release</legend>
                <div className='content column aic jcsb gap10'>
                  <p className='app-description noborder small'>
                    This package is a tool used to retrieve the system&apos;s
                    distribution information (e.g., distribution name, version
                    number, etc.). It is especially necessary for correctly
                    performing certain tasks related to software and package
                    management.
                  </p>
                  {appStatus("node")}
                </div>
              </fieldset>
              <fieldset className='box column gap10'>
                <legend className='app-title'>
                  software-properties-common
                </legend>
                <div className='content column aic jcsb gap10'>
                  <p className='app-description noborder small'>
                    This package contains tools for managing software
                    repositories. For example, it provides the{" "}
                    <span className='highlight'>add-apt-repository</span>{" "}
                    command, which is used to add third-party repositories.
                  </p>
                  {appStatus("node")}
                </div>
              </fieldset>
            </div>
          </motion.div>

          <motion.div
            className='box-container border column gap25'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className='column gap10'>
              <h2 className='purple-title'>*Docker Requirements</h2>
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
                    Docker-CE{" "}
                    <span className='highlight'>(Community Edition)</span> is an
                    open-source platform for developing, shipping, and running
                    applications in containers, allowing for consistent
                    environments across different systems. It&apos;s the free
                    version of Docker, commonly used by developers for building
                    and managing containers.
                  </p>
                  {appStatus("node")}
                </div>
              </fieldset>
              <fieldset className='box column gap10'>
                <legend className='app-title'>docker-ce-cli</legend>
                <div className='content column aic jcsb gap10'>
                  <p className='app-description noborder small'>
                    Docker-CE-CLI is the{" "}
                    <span className='highlight'>command-line interface</span>{" "}
                    for Docker Community Edition. It provides commands to
                    interact with Docker, such as managing containers, images,
                    and networks.
                  </p>
                  {appStatus("node")}
                </div>
              </fieldset>
              <fieldset className='box column gap10'>
                <legend className='app-title'>containerd.io</legend>
                <div className='content column aic jcsb gap10'>
                  <p className='app-description noborder small'>
                    containerd.io is an industry-standard core container
                    runtime. It manages the lifecycle of containers, including
                    image transfer and storage, container execution, and
                    supervision. It is used by Docker and other container
                    platforms to handle container-related tasks.
                  </p>
                  {appStatus("node")}
                </div>
              </fieldset>
            </div>
          </motion.div>

          <motion.div
            className='box-container border column gap25'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className='column gap10'>
              <h2 className='purple-title'>*PM2 Requirements</h2>
              <p>
                PM2 is a production process manager for Node.js applications
                with a built-in load balancer. It allows you to keep your
                applications alive forever, to reload them without downtime and
                to facilitate common system admin tasks.
              </p>
            </div>
            <div className='gridauto gap20'>
              <fieldset className='box column gap10'>
                <legend className='app-title'>nodejs & npm</legend>
                <div className='content column aic jcsb gap10'>
                  <p className='app-description noborder small'>
                    Node.js is an open-source, cross-platform JavaScript runtime
                    environment that allows you to run JavaScript code outside
                    of a browser. It is commonly used for server-side
                    programming, building web applications, and creating
                    command-line tools.
                  </p>
                  {appStatus("node")}
                </div>
              </fieldset>
              <fieldset className='box column gap10'>
                <legend className='app-title'>pm2</legend>
                <div className='content column aic jcsb gap10'>
                  <p className='app-description noborder small'>
                    PM2 is a production process manager for Node.js applications
                    with a built-in load balancer. It allows you to keep your
                    applications alive forever, to reload them without downtime
                    and to facilitate common system admin tasks.
                  </p>
                  {appStatus("node")}
                </div>
              </fieldset>
              <fieldset className='box column gap10'>
                <legend className='app-title'>pm2-logrotate</legend>
                <div className='content column aic jcsb gap10'>
                  <p className='app-description noborder small'>
                    PM2-logrotate is a tool that automatically rotates and
                    manages the log files of PM2-managed applications. It helps
                    prevent log files from growing too large and ensures that
                    logs are properly archived and managed.
                  </p>
                  {appStatus("node")}
                </div>
              </fieldset>

              <fieldset className='box column gap10'>
                <legend className='app-title'>pm2-runtime</legend>
                <div className='content column aic jcsb gap10'>
                  <p className='app-description noborder small'>
                    PM2-runtime is a tool that automatically rotates and manages
                    the runtime of PM2-managed applications. It helps prevent
                    runtime files from growing too large and ensures that
                    runtime files are properly archived and managed.
                  </p>
                  {appStatus("node")}
                </div>
              </fieldset>
            </div>
          </motion.div>

          <motion.div
            className='box-container border column gap25'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className='column gap10'>
              <h2 className='purple-title'>*SSL Requirements</h2>
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
                    Cerbot is a tool that allows you to easily obtain and renew
                    TLS certificates for your websites. It simplifies the
                    process of obtaining and renewing certificates, ensuring
                    that your websites are secure and accessible over HTTPS.
                  </p>
                  {appStatus("node")}
                </div>
              </fieldset>
              <fieldset className='box column gap10'>
                <legend className='app-title'>python3-certbot-nginx </legend>
                <div className='content column aic jcsb gap10'>
                  <p className='app-description noborder small'>
                    Python3-certbot-nginx is a package that provides the
                    necessary Python bindings for Certbot to work with the Nginx
                    web server. It allows Certbot to interact with Nginx to
                    manage SSL certificates and configurations.
                  </p>
                  {appStatus("node")}
                </div>
              </fieldset>
              <fieldset className='box column gap10'>
                <legend className='app-title'>python3-certbot-apache </legend>
                <div className='content column aic jcsb gap10'>
                  <p className='app-description noborder small'>
                    Python3-certbot-apache is a package that provides the
                    necessary Python bindings for Certbot to work with the
                    Apache web server. It allows Certbot to interact with Apache
                    to manage SSL certificates and configurations.
                  </p>
                  {appStatus("node")}
                </div>
              </fieldset>
            </div>
          </motion.div>
        </fieldset>
      </div>
    </div>
  );
}

export default ManageGlobalAppsPage;
