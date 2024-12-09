import { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { PackageManagerContext } from "./Context";

export function PackageManagerProvider({ children }) {
  const [distro, setDistro] = useState(null);
  const [packages, setPackages] = useState({
    error: null,
    isReqsInstalled: false,
    required: {
      "apt-transport-https": {
        installed: false,
        version: null,
        candidate: null,
        loading: true,
      },
      "ca-certificates": {
        installed: false,
        version: null,
        candidate: null,
        loading: true,
      },
      curl: { installed: false, version: null, candidate: null, loading: true },
      gnupg: {
        installed: false,
        version: null,
        candidate: null,
        loading: true,
      },
      "lsb-release": {
        installed: false,
        version: null,
        candidate: null,
        loading: true,
      },
      "software-properties-common": {
        installed: false,
        version: null,
        candidate: null,
        loading: true,
      },
    },
    docker: {
      "docker-ce": {
        installed: false,
        version: null,
        candidate: null,
        loading: true,
      },
      "docker-ce-cli": {
        installed: false,
        version: null,
        candidate: null,
        loading: true,
      },
      "containerd.io": {
        installed: false,
        version: null,
        candidate: null,
        loading: true,
      },
    },
    pm2: {
      nodejs: {
        installed: false,
        version: null,
        candidate: null,
        loading: true,
      },
      npm: {
        installed: false,
        version: null,
        candidate: null,
        loading: true,
      },
      pm2: {
        installed: false,
        version: null,
        candidate: null,
        loading: true,
      },
      "pm2-logrotate": {
        installed: false,
        version: null,
        candidate: null,
        loading: true,
      },
      "pm2-runtime": {
        installed: false,
        version: null,
        candidate: null,
        loading: true,
      },
    },
  });

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
        "docker-ce":
          "sudo apt-cache policy docker-ce | grep -E 'Installed|Candidate' | awk '{print $2}' | paste -sd ' ' -",
        "docker-ce-cli":
          "sudo apt-cache policy docker-ce-cli | grep -E 'Installed|Candidate' | awk '{print $2}' | paste -sd ' ' -",
        "containerd.io":
          "sudo apt-cache policy containerd.io | grep -E 'Installed|Candidate' | awk '{print $2}' | paste -sd ' ' -",
      },
      pm2: {
        nodejs: "node --version",
        npm: "npm --version",
        pm2: "pm2 --version",
        "pm2-logrotate": "pm2-logrotate --version",
        "pm2-runtime": "pm2-runtime --version",
      },
    }),
    [],
  );

  const checkCategory = useCallback(
    async (packagesType) => {
      const packagesNames = Object.keys(packagesCommands[packagesType]);

      packagesNames.forEach(async (packageName) => {
        try {
          const res = await window.Electron.ssh.executeCommand(
            packagesCommands[packagesType][packageName],
          );

          const version = res.output.trim().split(" ")[0];
          const candidate = res.output.trim().split(" ")[1];
          const isInstalled = !version.includes("none") && version !== "";

          setPackages((currentPackages) => ({
            ...currentPackages,
            [packagesType]: {
              ...currentPackages[packagesType],
              [packageName]: {
                installed: isInstalled,
                version: isInstalled ? version : null,
                candidate: candidate || null,
                loading: false,
              },
            },
          }));
        } catch {
          setPackages((currentPackages) => ({
            ...currentPackages,
            [packagesType]: {
              ...currentPackages[packagesType],
              [packageName]: {
                installed: false,
                version: null,
                candidate: null,
                loading: false,
              },
            },
          }));
        }
      });
    },
    [packagesCommands],
  );

  const checkPackages = useCallback(async () => {
    await checkCategory("required");
    await checkCategory("docker");
    await checkCategory("pm2");
  }, [checkCategory]);

  const installPackage = useCallback(
    async (packagesType, packageName) => {
      if (!/^[a-zA-Z0-9-]+$/.test(packageName)) {
        console.error("Invalid package name");
        return;
      }

      try {
        await updateApt();
        const streamId = `install-${packageName}-${Date.now()}`;

        window.Electron.ssh
          .createWsStream(`sudo apt-get install -y ${packageName}`, streamId)
          .then(() => {
            setPackages((currentPackages) => ({
              ...currentPackages,
              [packagesType]: {
                ...currentPackages[packagesType],
                [packageName]: {
                  ...currentPackages[packagesType][packageName],
                  loading: true,
                },
              },
            }));

            window.Electron.ssh.onWsData(streamId, (data) => {
              console.log(`Installing ${packageName}:`, data);
            });

            window.Electron.ssh.onWsError(streamId, (error) => {
              console.error(`Failed to install ${packageName}:`, error);
            });

            window.Electron.ssh.onWsClose(streamId, () => {
              console.log(`Installation of ${packageName} completed.`);
              window.Electron.ssh.closeWsStream(streamId);
              checkCategory(packagesType);
            });
          });
      } catch (error) {
        console.error(`Failed to install ${packageName}:`, error.message);
      }
    },
    [updateApt, checkCategory],
  );

  const uninstallPackage = useCallback(
    async (packagesType, packageName) => {
      if (!/^[a-zA-Z0-9-]+$/.test(packageName)) {
        console.error("Invalid package name");
        return;
      }

      try {
        await updateApt();
        const streamId = `uninstall-${packageName}-${Date.now()}`;

        window.Electron.ssh
          .createWsStream(`sudo apt-get remove -y ${packageName}`, streamId)
          .then(() => {
            window.Electron.ssh.onWsData(streamId, (data) => {
              console.log(`Uninstalling ${packageName}:`, data);
              return data;
            });

            window.Electron.ssh.onWsError(streamId, (error) => {
              console.error(`Failed to uninstall ${packageName}:`, error);
            });

            window.Electron.ssh.onWsClose(streamId, () => {
              console.log(`Uninstallation of ${packageName} completed.`);
              window.Electron.ssh.closeWsStream(streamId);
              checkCategory(packagesType);
            });
          });
      } catch (error) {
        console.error(`Failed to uninstall ${packageName}:`, error.message);
      }
    },
    [updateApt, checkCategory],
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
      packages,
      checkPackages,
      installPackage,
      uninstallPackage,
    }),
    [packages, checkPackages, installPackage, uninstallPackage],
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
