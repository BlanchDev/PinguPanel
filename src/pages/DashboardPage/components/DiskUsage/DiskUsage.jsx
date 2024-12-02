import { useEffect, useState } from "react";

function DiskUsage() {
  const [disk, setDisk] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cleanupFunctions = [];
    const streamId = "disk-usage"; // Farklı bir ID

    const setupMonitoring = async () => {
      try {
        await window.Electron.ssh.createWsStream(
          "while true; do df -h / | tail -n 1; sleep 10; done",
          streamId,
        );

        cleanupFunctions.push(
          window.Electron.ssh.onWsData(streamId, (data) => {
            try {
              const diskInfo = data.toString().trim().split(/\s+/);

              if (diskInfo.length >= 5) {
                setDisk({
                  total: diskInfo[1] || "N/A",
                  used: diskInfo[2] || "N/A",
                  free: diskInfo[3] || "N/A",
                  usage: diskInfo[4]?.replace("%", "") + "%" || "N/A",
                });
              }
              setLoading(false);
            } catch (error) {
              console.error("Disk data parse error:", error);
            }
          }),
        );

        cleanupFunctions.push(
          window.Electron.ssh.onWsError(streamId, (error) => {
            console.error("Stream error:", error);
          }),
        );

        cleanupFunctions.push(
          window.Electron.ssh.onWsClose(streamId, () => {
            console.log("Stream closed");
          }),
        );
      } catch (error) {
        console.error("Setup error:", error);
        setLoading(false);
      }
    };

    setupMonitoring();

    return () => {
      window.Electron.ssh.closeWsStream(streamId);
      cleanupFunctions.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <>
      {loading ? (
        <div className='info-item column gap10'>
          <h2 className='yellow-title'>Disk Usage</h2>
          <div className='info-content column aic jcc'>
            <div className='loading-spinner' />
          </div>
        </div>
      ) : (
        <div className='info-item column gap10'>
          <h2 className='yellow-title'>Disk Usage</h2>
          <div className='info-content column gap5'>
            <p>
              Total: <span>{disk.total}</span>
            </p>
            <p>
              Used: <span>{disk.used}</span>
            </p>
            <p>
              Free: <span>{disk.free}</span>
            </p>
            <p>
              Usage: <span>{disk.usage}</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default DiskUsage;
