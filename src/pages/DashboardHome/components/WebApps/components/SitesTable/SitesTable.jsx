import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fetchSites } from "../../utils/fetchWebApps";
import "./SitesTable.scss";
import { useWebApps } from "../../../../../../layouts/DashboardLayout/context/Context";

function SitesTable() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  const { webAppsDirectory, myConnLoading, setMyWebAppsLoading, lastRefresh } =
    useWebApps();

  const loadSites = useCallback(
    async (loading = true) => {
      if (!webAppsDirectory) return;

      setLoading(loading);
      setMyWebAppsLoading(loading);
      fetchSites(webAppsDirectory)
        .then((newSites) => {
          setSites(newSites);
        })
        .catch((error) => {
          toast.error(`Error: ${error.message}`);
        })
        .finally(() => {
          setLoading(false);
          setMyWebAppsLoading(false);
        });
    },
    [webAppsDirectory, setMyWebAppsLoading],
  );

  useEffect(() => {
    loadSites();

    return () => {
      setSites([]);
    };
  }, [loadSites, lastRefresh]);

  useEffect(() => {
    if (!webAppsDirectory) {
      return;
    }

    const sitesInterval = setInterval(() => loadSites(false), 30_000);
    return () => clearInterval(sitesInterval);
  }, [webAppsDirectory, loadSites]);

  if (loading || myConnLoading || !sites) {
    return (
      <div className='info-content column aic jcc gap25'>
        <div className='loading-spinner' />
        <p>Loading sites...</p>
      </div>
    );
  }

  if (
    sites?.some((site) => site.domain.includes("No such file or directory"))
  ) {
    return (
      <div className='info-content column aic jcc gap25'>
        <p>No web apps found</p>
      </div>
    );
  }

  return (
    <table className='web-apps-table'>
      <thead>
        <tr>
          <th>Domain</th>
          <th>SSL</th>
          <th>NGINX</th>
          <th>PM2</th>
        </tr>
      </thead>
      <tbody>
        {sites?.map((site) => (
          <tr key={site.domain} onClick={() => {}}>
            <td>{site.domain}</td>
            <td className={`sslStatus ${site.sslStatus === "No" && "no"}`}>
              {site.sslStatus}
            </td>
            <td className={`nginxStatus ${site.nginxStatus.toLowerCase()}`}>
              {site.nginxStatus}
            </td>
            <td className={`pm2Status ${site.pm2Status.toLowerCase()}`}>
              {site.pm2Status}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default SitesTable;
