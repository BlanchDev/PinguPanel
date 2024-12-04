import { toast } from "react-toastify";

export const fetchSites = async (webAppsDirectory) => {
  try {
    const result = await window.Electron.ssh.executeCommand(
      `cd ${webAppsDirectory} && find . -maxdepth 1 -type d -not -name "." | cut -d'/' -f2`,
    );

    if (result.success) {
      const siteList = result.output.split("\n").filter(Boolean);

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

      const sitesWithDetails = await Promise.all(
        siteList.map(async (siteName) => {
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

          return {
            domain: siteName,
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
        }),
      );

      return sitesWithDetails;
    } else {
      throw new Error("Directory list could not be fetched!");
    }
  } catch (error) {
    toast.error(`Error: ${error.message}`);
  }
};
