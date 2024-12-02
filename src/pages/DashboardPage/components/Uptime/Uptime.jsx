import { useEffect, useState } from "react";

function Uptime() {
  const [uptime, setUptime] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUptime = async () => {
    const uptimeResult = await window.Electron.ssh.executeCommand("uptime -p");
    const uptime = uptimeResult.output.trim();
    setUptime(uptime);
    setLoading(false);
  };

  useEffect(() => {
    fetchUptime();

    const interval = setInterval(fetchUptime, 65_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {loading ? (
        <div className='info-item column gap10'>
          <h2 className='yellow-title'>Uptime</h2>
          <div className='info-content column aic jcc'>
            <div className='loading-spinner' />
          </div>
        </div>
      ) : (
        <div className='info-item column gap10'>
          <h2 className='yellow-title'>Uptime</h2>
          <div className='info-content column gap5'>
            <p>
              <span>{uptime}</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Uptime;
