import { useEffect, useState } from "react";

function CpuUsage() {
  const [stats, setStats] = useState({
    cpuUsage: "N/A",
    total: "N/A",
    running: "N/A",
    sleeping: "N/A",
    stopped: "N/A",
    zombie: "N/A",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cleanupFunctions = [];
    const streamId = "cpu-usage";

    const setupMonitoring = async () => {
      try {
        const command = `while true; do
          cpu=$(top -bn1 | grep "Cpu(s)" | awk '{print $2"%"}')
          tasks=$(top -bn1 | grep "Tasks:" | awk '{print $2","$4","$6","$8","$10}')
          echo "$cpu"
          echo "$tasks"
          sleep 1
        done`;

        await window.Electron.ssh.createWsStream(command, streamId);

        cleanupFunctions.push(
          window.Electron.ssh.onWsData(streamId, (data) => {
            try {
              const lines = data.toString().trim().split("\n");
              if (lines.length >= 2) {
                const [cpu, tasks] = lines;
                const [total, running, sleeping, stopped, zombie] =
                  tasks.split(",");
                setStats({
                  cpuUsage: cpu || "N/A",
                  total: total || "N/A",
                  running: running || "N/A",
                  sleeping: sleeping || "N/A",
                  stopped: stopped || "N/A",
                  zombie: zombie || "N/A",
                });
                setLoading(false);
              }
            } catch (error) {
              console.error("Data parse error:", error);
            }
          }),
        );

        // ... rest of the code ...
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
          <h2 className='yellow-title'>System Stats</h2>
          <div className='info-content column aic jcc'>
            <div className='loading-spinner' />
          </div>
        </div>
      ) : (
        <div className='info-item column gap10'>
          <h2 className='yellow-title'>System Stats</h2>
          <div className='info-content column gap5'>
            <p>
              CPU Usage: <span>{stats.cpuUsage}</span>
            </p>
            <p>
              Tasks:{" "}
              <span>
                {stats.total} total, {stats.running} running, {stats.sleeping}{" "}
                sleeping, {stats.stopped} stopped, {stats.zombie} zombie
              </span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default CpuUsage;
