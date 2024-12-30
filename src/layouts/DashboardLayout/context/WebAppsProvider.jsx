import { useState, useMemo, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useConnection, WebAppsContext } from "./DashboardLayoutContext";
import { toast } from "react-toastify";

export function WebAppsProvider({ children }) {
  const [webAppsDirectory, setWebAppsDirectory] = useState("");
  const [sites, setSites] = useState([]);
  const [myWebAppsLoading, setMyWebAppsLoading] = useState(true);

  const { myConn } = useConnection();

  const fetchSites = useCallback(async () => {
    setMyWebAppsLoading(true);
    setSites([]);

    try {
      const result = await window.Electron.ssh.executeCommand(
        `cd ${webAppsDirectory} && find . -maxdepth 1 -type d -not -name "." | cut -d'/' -f2`,
      );

      if (!result.success) {
        throw new Error("Directory list could not be fetched!");
      }

      const siteList = result.output.split("\n").filter(Boolean);

      for (const siteName of siteList) {
        setSites((prev) => {
          if (prev.some((site) => site.domain === siteName)) {
            return prev;
          }

          return [
            ...prev,
            {
              domain: siteName,
              nginxStatus: "Loading...",
              sslStatus: "Loading...",
              pm2Status: "Loading...",
            },
          ];
        });
      }

      const getSslStatus = (output) => {
        if (!output) return "No";

        if (output.toLowerCase().includes("http")) {
          if (output.includes("308")) return "Yes (Forced 308)";
          if (output.includes("301")) return "Yes (Forced 301)";
          if (output.includes("302")) return "Yes (Temp 302)";
          if (output.includes("200")) return "Yes (Direct)";
        }

        return "No";
      };

      for (const siteName of siteList) {
        const httpsResult = await window.Electron.ssh.executeCommand(
          `curl -Iks --max-time 5 https://${siteName} | head -n 1`,
        );

        const nginxResult = await window.Electron.ssh.executeCommand(
          `if [ -f "/etc/nginx/sites-enabled/${siteName}" ] && nginx -t 2>/dev/null; then echo "active"; else echo "inactive"; fi`,
        );

        const pm2Result = await window.Electron.ssh.executeCommand(
          `pm2 describe ${
            siteName.split(".")[0]
          } | grep status | awk '{print $4}'`,
        );

        setSites((prev) => {
          return prev.map((site) => {
            if (site.domain === siteName) {
              return {
                ...site,
                nginxStatus:
                  nginxResult.success && nginxResult.output.trim() === "active"
                    ? "Active"
                    : "Inactive",
                sslStatus: getSslStatus(httpsResult.output),
                pm2Status:
                  pm2Result.success && pm2Result.output.trim() === "online"
                    ? "Running"
                    : "Stopped",
              };
            }
            return site;
          });
        });
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setMyWebAppsLoading(false);
    }
  }, [webAppsDirectory]);

  useEffect(() => {
    if (myConn) {
      setWebAppsDirectory(myConn["web-apps-directory"] || "");
    }
  }, [myConn]);

  useEffect(() => {
    if (webAppsDirectory) {
      fetchSites();
    }
  }, [webAppsDirectory, fetchSites]);

  const webAppsValue = useMemo(
    () => ({
      webAppsDirectory,
      sites,
      setWebAppsDirectory,
      myWebAppsLoading,
      fetchSites,
    }),
    [webAppsDirectory, sites, myWebAppsLoading, fetchSites],
  );

  return (
    <WebAppsContext.Provider value={webAppsValue}>
      {children}
    </WebAppsContext.Provider>
  );
}

WebAppsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
