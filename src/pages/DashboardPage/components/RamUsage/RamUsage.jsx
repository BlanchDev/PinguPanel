import { useEffect, useState } from "react";

function RamUsage() {
  const [ram, setRam] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cleanupFunctions = [];
    const streamId = "ram-usage"; // Benzersiz bir ID

    const setupMonitoring = async () => {
      try {
        await window.Electron.ssh.createWsStream(
          "while true; do free -h | grep Mem; sleep 10; done",
          streamId,
        );

        cleanupFunctions.push(
          window.Electron.ssh.onWsData(streamId, (data) => {
            try {
              const ramInfo = data.toString().trim().split(/\s+/);

              if (ramInfo.length >= 7) {
                setRam({
                  total: ramInfo[1] || "N/A",
                  used: ramInfo[2] || "N/A",
                  free: ramInfo[3] || "N/A",
                  shared: ramInfo[4] || "N/A",
                  buffCache: ramInfo[5] || "N/A",
                  available: ramInfo[6] || "N/A",
                });
              }
              setLoading(false);
            } catch (error) {
              console.error("RAM data parse error:", error);
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
          <h2 className='yellow-title'>RAM Usage</h2>
          <div className='info-content column aic jcc'>
            <div className='loading-spinner' />
          </div>
        </div>
      ) : (
        <div className='info-item column gap10'>
          <h2 className='yellow-title'>RAM Usage</h2>
          <div className='info-content column gap5'>
            <p>
              Total: <span>{ram.total}</span>
            </p>
            <p>
              Used: <span>{ram.used}</span>
            </p>
            <p>
              Free: <span>{ram.free}</span>
            </p>
            <p>
              Shared: <span>{ram.shared}</span>
            </p>
            <p>
              Buff/Cache: <span>{ram.buffCache}</span>
            </p>
            <p>
              Available: <span>{ram.available}</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default RamUsage;
