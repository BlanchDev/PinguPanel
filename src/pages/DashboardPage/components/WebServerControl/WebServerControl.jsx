import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./WebServerControl.css";
import CreateNewWebApp from "./components/CreateNewWebApp/CreateNewWebApp";

function WebServerControl() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createNewWebAppModalOpen, setCreateNewWebAppModalOpen] =
    useState(false);

  const fetchSites = async () => {
    try {
      const result = await window.Electron.ssh.executeCommand(
        "ls -1 /etc/nginx/sites-enabled/",
      );

      if (result.success) {
        const siteList = result.output.split("\n").filter(Boolean);

        const sitesWithDetails = await Promise.all(
          siteList.map(async (siteName) => {
            const configResult = await window.Electron.ssh.executeCommand(
              `grep -m 1 "server_name" /etc/nginx/sites-enabled/${siteName}`,
            );

            const serverNameLine = configResult.output.trim();
            const domain = serverNameLine
              ? serverNameLine.split(/\s+/)[1].replace("www.", "")
              : siteName.replace(".conf", "");

            // HTTPS
            const httpsResult = await window.Electron.ssh.executeCommand(
              `curl -Iks --max-time 5 https://${domain} | head -n 1`,
            );

            // HTTP
            const httpResult = await window.Electron.ssh.executeCommand(
              `curl -Iks --max-time 5 http://${domain} | head -n 1`,
            );

            // PM2 komutunu değiştiriyoruz
            const pm2Result = await window.Electron.ssh.executeCommand(
              `pm2 list | grep "${domain.split(".")[0]}" | awk '{print $18}'`,
            );

            return {
              domain,
              nginxStatus:
                httpsResult.success || httpResult.success
                  ? "Active"
                  : "Inactive",
              isHttps:
                httpsResult.success &&
                httpsResult.output?.toLowerCase().includes("http"),
              pm2Status:
                pm2Result.success && pm2Result.output.trim() === "online"
                  ? "Running"
                  : "Stopped",
            };
          }),
        );

        setSites(sitesWithDetails);
      } else {
        throw new Error("Nginx loading error!");
      }
    } catch (error) {
      console.error("Nginx loading error:", error);
      toast.error("Nginx loading error!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
    const interval = setInterval(fetchSites, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {loading ? (
        <div className='info-item column gap10'>
          <h2 className='yellow-title'>Web Apps</h2>
          <div className='info-content column aic jcc'>
            <div className='loading-spinner' />
          </div>
        </div>
      ) : (
        <div className='info-item column gap25'>
          <div className='row aic jcsb'>
            <h2 className='yellow-title'>Web Apps</h2>
            <button
              className='button yellow'
              onClick={() => setCreateNewWebAppModalOpen(true)}
            >
              Create New Web App
            </button>
          </div>
          <div className='info-content column gap5'>
            {sites.length === 0 ? (
              <div className='empty-state'>No Nginx web apps found</div>
            ) : (
              <table className='web-apps-table'>
                <thead>
                  <tr>
                    <th>Domain</th>
                    <th>SSL</th>
                    <th>NGINX</th>
                    <th>PM2</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {sites.map((site) => (
                    <tr key={site.domain}>
                      <td>{site.domain}</td>
                      <td className={`ssl ${!site.isHttps && "no"}`}>
                        {site.isHttps ? "Yes" : "No"}
                      </td>
                      <td
                        className={`nginxStatus ${site.nginxStatus.toLowerCase()}`}
                      >
                        {site.nginxStatus}
                      </td>
                      <td
                        className={`pm2Status ${site.pm2Status.toLowerCase()}`}
                      >
                        {site.pm2Status}
                      </td>
                      <td className='open-button-container'>
                        <button className='open-button row aic jcc'>
                          Open
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {createNewWebAppModalOpen && (
            <CreateNewWebApp
              onClose={() => setCreateNewWebAppModalOpen(false)}
            />
          )}
        </div>
      )}
    </>
  );
}

export default WebServerControl;
