import { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { PackageManagerContext } from "./DashboardLayoutContext";
import { toast } from "react-toastify";

export function PackageManagerProvider({ children }) {
  const [distro, setDistro] = useState(null);
  const [packages, setPackages] = useState({
    error: null,
    isInstallationBusy: false,
    required: {
      "apt-transport-https": { loading: true },
      "ca-certificates": { loading: true },
      curl: { loading: true },
      gnupg: { loading: true },
      "lsb-release": { loading: true },
      "software-properties-common": { loading: true },
    },
    docker: {
      GPG: { loading: true },
      repository: { loading: true },
      "docker-ce": { loading: true },
      "docker-ce-cli": { loading: true },
      "containerd.io": { loading: true },
    },
    pm2: {
      nodejs: { loading: true },
      npm: { loading: true },
      pm2: { loading: true },
      "pm2-logrotate": { loading: true },
    },
    ssl: {
      certbot: { loading: true },
      "python3-certbot-nginx": { loading: true },
      "python3-certbot-apache": { loading: true },
    },
    security: {
      ufw: { loading: true },
      iptables: { loading: true },
      "iptables-persistent": { loading: true },
      fail2ban: { loading: true },
      rkhunter: { loading: true },
      chkrootkit: { loading: true },
    },
  });

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const updateApt = useCallback(async () => {
    try {
      await window.Electron.ssh.executeCommand("sudo apt update");
    } catch {
      return false;
    }

    return true;
  }, []);

  const checkDistro = useCallback(async () => {
    updateApt();
    try {
      const res = await window.Electron.ssh.executeCommand(
        "cat /etc/os-release | grep '^ID=' | cut -d'=' -f2",
      );
      setDistro(res.output.trim());
    } catch {
      setDistro(null);
    }
  }, [updateApt]);

  const packagesCommands = useMemo(
    () => ({
      required: {
        "apt-transport-https":
          "sudo apt-cache policy apt-transport-https | grep -E 'Installed|Candidate' | awk '{print $2}' | paste -sd ' ' -",
        "ca-certificates":
          "sudo apt-cache policy ca-certificates | grep -E 'Installed|Candidate' | awk '{print $2}' | paste -sd ' ' -",
        curl: "sudo apt-cache policy curl | grep -E 'Installed|Candidate' | awk '{print $2}' | paste -sd ' ' -",
        gnupg:
          "sudo apt-cache policy gnupg | grep -E 'Installed|Candidate' | awk '{print $2}' | paste -sd ' ' -",
        "lsb-release":
          "sudo apt-cache policy lsb-release | grep -E 'Installed|Candidate' | awk '{print $2}' | paste -sd ' ' -",
        "software-properties-common":
          "sudo apt-cache policy software-properties-common | grep -E 'Installed|Candidate' | awk '{print $2}' | paste -sd ' ' -",
      },
      docker: {
        GPG: `
        test -d /etc/apt/keyrings &&
        test -f /etc/apt/keyrings/docker.gpg &&
        echo 'Exists'`,
        repository: `
        test -f /etc/apt/sources.list.d/docker.list && echo 'Exists'`,
        "docker-ce":
          "sudo apt-cache policy docker-ce | grep -E 'Installed|Candidate' | awk '{print $2}' | paste -sd ' ' -",
        "docker-ce-cli":
          "sudo apt-cache policy docker-ce-cli | grep -E 'Installed|Candidate' | awk '{print $2}' | paste -sd ' ' -",
        "containerd.io":
          "sudo apt-cache policy containerd.io | grep -E 'Installed|Candidate' | awk '{print $2}' | paste -sd ' ' -",
        "docker-compose-plugin":
          "sudo apt-cache policy docker-compose-plugin | grep -E 'Installed|Candidate' | awk '{print $2}' | paste -sd ' ' -",
        "cgroupfs-mount":
          "sudo apt-cache policy cgroupfs-mount | grep -E 'Installed|Candidate' | awk '{print $2}' | paste -sd ' ' -",
      },
      pm2: {
        nodejs: "node -v",
        npm: "npm -v",
        pm2: "pm2 -v",
        "pm2-logrotate": "pm2 list | grep pm2-logrotate | awk '{print $6}'",
      },
      ssl: {
        certbot:
          "sudo apt-cache policy certbot | grep -E 'Installed|Candidate' | awk '{print $2}' | paste -sd ' ' -",
        "python3-certbot-nginx":
          "sudo apt-cache policy python3-certbot-nginx | grep -E 'Installed|Candidate' | awk '{print $2}' | paste -sd ' ' -",
        "python3-certbot-apache":
          "sudo apt-cache policy python3-certbot-apache | grep -E 'Installed|Candidate' | awk '{print $2}' | paste -sd ' ' -",
      },
      security: {
        ufw: "sudo ufw status",
        iptables:
          "sudo apt-cache policy iptables | grep -E 'Installed|Candidate' | awk '{print $2}' | paste -sd ' ' -",
        "iptables-persistent":
          "sudo apt-cache policy iptables-persistent | grep -E 'Installed|Candidate' | awk '{print $2}' | paste -sd ' ' -",
        fail2ban:
          "sudo apt-cache policy fail2ban | grep -E 'Installed|Candidate' | awk '{print $2}' | paste -sd ' ' -",
        rkhunter:
          "sudo apt-cache policy rkhunter | grep -E 'Installed|Candidate' | awk '{print $2}' | paste -sd ' ' -",
        chkrootkit:
          "sudo apt-cache policy chkrootkit | grep -E 'Installed|Candidate' | awk '{print $2}' | paste -sd ' ' -",
      },
    }),
    [],
  );

  const checkCategory = useCallback(
    async (packagesType) => {
      const packagesNames = Object.keys(packagesCommands[packagesType]);

      await Promise.all(
        packagesNames.map(async (packageName) => {
          try {
            const res = await window.Electron.ssh.executeCommand(
              packagesCommands[packagesType][packageName],
            );

            const version = res.output.trim().split(" ")[0];
            const candidate = res.output.trim().split(" ")[1];
            const isInstalled = !version.includes("none") && version !== "";

            setPackages((currentPackages) => ({
              ...currentPackages,
              isInstallationBusy: false,
              [packagesType]: {
                ...currentPackages[packagesType],
                [packageName]: {
                  installed: isInstalled,
                  version: isInstalled ? version : null,
                  candidate: candidate || null,
                  loading: false,
                  status: null,
                },
              },
            }));
            return true;
          } catch {
            setPackages((currentPackages) => ({
              ...currentPackages,
              isInstallationBusy: false,
              [packagesType]: {
                ...currentPackages[packagesType],
                [packageName]: {
                  installed: false,
                  version: null,
                  candidate: null,
                  loading: false,
                  status: null,
                },
              },
            }));
            return false;
          }
        }),
      );
    },
    [packagesCommands],
  );

  const checkPackages = useCallback(async () => {
    try {
      await delay(500);
      await checkCategory("required");
      await delay(250);
      await checkCategory("docker");
      await delay(250);
      await checkCategory("pm2");
      await delay(250);
      await checkCategory("ssl");
      await delay(250);
      await checkCategory("security");
      await delay(500);
    } catch (error) {
      console.error("Error checking packages:", error);
    }
  }, [checkCategory]);

  const specialCommands = useMemo(
    () => ({
      docker: {
        GPG: {
          install: `
            sudo install -m 0755 -d /etc/apt/keyrings
            curl -fsSL https://download.docker.com/linux/${distro}/gpg | sudo gpg --dearmor --yes -o /etc/apt/keyrings/docker.gpg
            sudo chmod a+r /etc/apt/keyrings/docker.gpg`,
          uninstall: `
            sudo rm -rf /etc/apt/keyrings/docker.gpg --force
            sudo rm -rf /etc/apt/trusted.gpg.d/docker.gpg --force
          `,
        },
        repository: {
          install: `
          echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/${distro} $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null 2>&1`,
          uninstall: `sudo rm -f /etc/apt/sources.list.d/docker.list --force`,
        },
      },
      pm2: {
        "pm2-logrotate": {
          install: "pm2 install pm2-logrotate -f",
          uninstall: "pm2 uninstall pm2-logrotate -f",
        },
      },
      security: {
        ufw: {
          install: `
          sudo systemctl start ufw --force
          sudo systemctl enable ufw --force
          sudo ufw --force enable`,
          uninstall: `
          sudo systemctl stop ufw --force
          sudo systemctl disable ufw --force
          sudo ufw disable --force`,
        },
      },
    }),
    [distro],
  );

  const installPackage = useCallback(
    async (packagesType, packageName) => {
      setPackages((currentPackages) => ({
        ...currentPackages,
        isInstallationBusy: true,
        [packagesType]: {
          ...currentPackages[packagesType],
          [packageName]: {
            ...currentPackages[packagesType][packageName],
            status: "Installing...",
          },
        },
      }));

      try {
        await updateApt();
        const streamId = `install-${packageName}-${Date.now()}`;
        let installationCommand = "";

        if (specialCommands[packagesType]?.[packageName]) {
          installationCommand =
            specialCommands[packagesType][packageName].install;
        } else {
          installationCommand = `sudo apt-get install -y ${packageName} --allow-downgrades --allow-remove-essential --allow-change-held-packages`;
        }

        window.Electron.ssh
          .createWsStream(installationCommand, streamId)
          .then(() => {
            window.Electron.ssh.onWsData(streamId, (data) => {
              console.debug(`Installing ${packageName}:`, data);
            });

            window.Electron.ssh.onWsError(streamId, (e) => {
              console.error(`Failed to install ${packageName}:`, e);
            });

            window.Electron.ssh.onWsClose(streamId, () => {
              console.debug(`Installation of ${packageName} completed.`);
              window.Electron.ssh.closeWsStream(streamId);
              checkCategory(packagesType);
            });
          });
      } catch (error) {
        console.error(`Failed to install ${packageName}:`, error.message);
        toast.error(`Failed to install ${packageName}: ${error.message}`);
        setPackages((currentPackages) => ({
          ...currentPackages,
          isInstallationBusy: false,
          [packagesType]: {
            ...currentPackages[packagesType],
            [packageName]: {
              ...currentPackages[packagesType][packageName],
              status: null,
            },
          },
        }));
      }
    },
    [updateApt, checkCategory, specialCommands],
  );

  const uninstallPackage = useCallback(
    async (packagesType, packageName) => {
      setPackages((currentPackages) => ({
        ...currentPackages,
        isInstallationBusy: true,
        [packagesType]: {
          ...currentPackages[packagesType],
          [packageName]: {
            ...currentPackages[packagesType][packageName],
            status: "Uninstalling...",
          },
        },
      }));

      try {
        await updateApt();
        const streamId = `uninstall-${packageName}-${Date.now()}`;
        let uninstallationCommand = "";

        if (specialCommands[packagesType]?.[packageName]) {
          uninstallationCommand =
            specialCommands[packagesType][packageName].uninstall;
        } else {
          uninstallationCommand = `sudo apt-get remove -y ${packageName} --allow-downgrades --allow-remove-essential --allow-change-held-packages`;
        }

        window.Electron.ssh
          .createWsStream(uninstallationCommand, streamId)
          .then(() => {
            window.Electron.ssh.onWsData(streamId, (data) => {
              console.debug(`Uninstalling ${packageName}:`, data);
            });

            window.Electron.ssh.onWsError(streamId, (e) => {
              console.error(`Failed to uninstall ${packageName}:`, e);
            });

            window.Electron.ssh.onWsClose(streamId, () => {
              console.debug(`Uninstallation of ${packageName} completed.`);
              window.Electron.ssh.closeWsStream(streamId);
              checkCategory(packagesType);
            });
          });
      } catch (error) {
        console.error(`Failed to uninstall ${packageName}:`, error.message);
        toast.error(`Failed to uninstall ${packageName}: ${error.message}`);
        setPackages((currentPackages) => ({
          ...currentPackages,
          isInstallationBusy: false,
          [packagesType]: {
            ...currentPackages[packagesType],
            [packageName]: {
              ...currentPackages[packagesType][packageName],
              status: null,
            },
          },
        }));
      }
    },
    [updateApt, checkCategory, specialCommands],
  );

  useEffect(() => {
    const checkSystemRequirements = async () => {
      await checkDistro();
      await checkPackages();
    };

    checkSystemRequirements();
  }, [checkDistro, checkPackages]);

  const systemReqsValue = useMemo(
    () => ({
      distro,
      packages,
      checkPackages,
      installPackage,
      uninstallPackage,
    }),
    [distro, packages, checkPackages, installPackage, uninstallPackage],
  );

  return (
    <PackageManagerContext.Provider value={systemReqsValue}>
      {children}
    </PackageManagerContext.Provider>
  );
}

PackageManagerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
