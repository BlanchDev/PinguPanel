import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { usePackageManager } from "../../../../../context/DashboardLayoutContext";
import PackageTemplate from "../../PackageTemplate/PackageTemplate";

function SecurityPackages({ appStatus }) {
  const { packages, installPackage, uninstallPackage } = usePackageManager();
  const { connectionId } = useParams();

  return (
    <motion.div
      className='box-container noborder column gap25'
      initial={{ opacity: 1, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className='column gap10'>
        <h2 className='purple-title'>*Security Packages</h2>
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
        {packages["security"]?.ufw?.version !== "sudo:" &&
          !packages["security"]?.ufw?.loading && (
            <fieldset className='box column gap10'>
              <legend className='app-title'>ufw</legend>
              <div className='content column aic jcsb gap10'>
                <p className='app-description noborder small'>
                  We are using IpTables to manage the firewall rules. So you
                  need to <span className='highlight'>disable UFW</span>.{" "}
                </p>
                {packages["security"]?.ufw?.candidate === "inactive" ? (
                  <button
                    className='button green'
                    onClick={() => installPackage("security", "ufw")}
                  >
                    Enable UFW (Don&apos;t)
                  </button>
                ) : (
                  <button
                    className='button red'
                    onClick={() => uninstallPackage("security", "ufw")}
                  >
                    Disable UFW (Recommended)
                  </button>
                )}
              </div>
            </fieldset>
          )}

        <PackageTemplate
          appName='iptables'
          appDescription='IpTables is a powerful firewall tool included in most Linux distributions. It allows administrators to configure the rules that control the incoming and outgoing network traffic, providing a high level of security for the system.'
          appStatus={appStatus("security", "iptables")}
        />

        <PackageTemplate
          appName='iptables-persistent'
          appDescription='Iptables-persistent is a package that allows you to save your iptables rules so that they are automatically applied when the system boots. This ensures that your firewall rules are persistent across reboots, providing continuous protection without the need to manually reapply the rules each time the system starts.'
          appStatus={appStatus("security", "iptables-persistent")}
        />

        <PackageTemplate
          appName='fail2ban'
          appDescription=' Fail2ban is a security tool that helps protect your server frombrute-force attacks. It monitors log files and bans IP addresses that show malicious signs, such as too many password failures or seeking for exploits.'
          appStatus={appStatus("security", "fail2ban")}
        />

        <PackageTemplate
          appName='chkrootkit'
          appDescription='Chkrootkit is a security scanner that helps detect rootkits on your system. It scans various system binaries and known rootkit signatures to identify potential threats and vulnerabilities.'
          appStatus={appStatus("security", "chkrootkit")}
        />

        <PackageTemplate
          appName='rkhunter'
          appDescription='Rkhunter is a security tool that scans for rootkits, backdoors, and possible local exploits on your system. It helps in identifying and mitigating potential security threats.'
          appStatus={appStatus("security", "rkhunter")}
        />
      </div>
    </motion.div>
  );
}

SecurityPackages.propTypes = {
  appStatus: PropTypes.func.isRequired,
};

export default SecurityPackages;
