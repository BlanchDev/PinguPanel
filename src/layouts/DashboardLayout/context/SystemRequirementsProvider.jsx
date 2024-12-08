import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { SystemRequirementsContext } from "./Context";

export function SystemRequirementsProvider({ children }) {
  const [requirements, setRequirements] = useState({
    distro: null,
    node: { installed: false, version: null },
    npm: { installed: false, version: null },
    pm2: { installed: false, version: null },
    nginx: { installed: false, version: null },
  });
  const [isReqsInstalled, setIsReqsInstalled] = useState(false);
  const [reqsLoading, setReqsLoading] = useState(true);
  const [reqsError, setReqsError] = useState(null);

  const checkRequirements = async () => {
    setReqsLoading(true);
    setReqsError(null);
    try {
      window.Electron.ssh
        .executeCommand("cat /etc/os-release | grep '^ID=' | cut -d'=' -f2")
        .then((res) => {
          setRequirements((prev) => ({ ...prev, distro: res.output.trim() }));
        });

      const checks = {
        node: await window.Electron.ssh.executeCommand("node -v"),
        npm: await window.Electron.ssh.executeCommand("npm -v"),
        pm2: await window.Electron.ssh.executeCommand("pm2 -v"),
        nginx: await window.Electron.ssh.executeCommand(
          `nginx -v 2>&1 | cut -d '/' -f2`,
        ),
      };

      const results = {};
      for (const [key, response] of Object.entries(checks)) {
        results[key] = {
          installed: response.success,
          version: response.success ? response.output.trim() : null,
        };
      }

      setRequirements((prev) => ({ ...prev, ...results }));

      if (Object.values(results).every((value) => value.installed)) {
        setIsReqsInstalled(true);
      }
    } catch (err) {
      setReqsError(err.message);
    } finally {
      setReqsLoading(false);
    }
  };

  useEffect(() => {
    checkRequirements();
  }, []);

  const systemReqsValue = useMemo(
    () => ({
      requirements,
      isReqsInstalled,
      reqsLoading,
      reqsError,
      checkReqsAgain: () => {
        checkRequirements();
      },
    }),
    [requirements, isReqsInstalled, reqsLoading, reqsError],
  );

  return (
    <SystemRequirementsContext.Provider value={systemReqsValue}>
      {children}
    </SystemRequirementsContext.Provider>
  );
}

SystemRequirementsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
