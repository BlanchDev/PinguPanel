import { useState, useEffect } from "react";

function SystemInfo() {
  const [loading, setLoading] = useState(true);
  const [nodeVersion, setNodeVersion] = useState({
    version: "",
    npm: "",
    pm2: "",
  });

  useEffect(() => {
    const checkVersions = async () => {
      try {
        // Node.js version
        const nodeResult = await window.Electron.ssh.executeCommand("node -v");
        // NPM version
        const npmResult = await window.Electron.ssh.executeCommand("npm -v");
        // NVM version
        const nvmResult = await window.Electron.ssh.executeCommand("nvm -v");
        // Bun.js version
        const bunResult = await window.Electron.ssh.executeCommand("bun -v");
        // PM2 version
        const pm2Result = await window.Electron.ssh.executeCommand("pm2 -v");

        if (nodeResult.success && npmResult.success && pm2Result.success) {
          setNodeVersion({
            version: nodeResult.output.trim(),
            npm: npmResult.output.trim(),
            nvm: nvmResult.output.trim(),
            bun: bunResult.output.trim(),
            pm2: pm2Result.output.trim(),
          });
        } else {
          throw new Error("Versiyon bilgileri alınamadı");
        }

        setLoading(false);
      } catch (error) {
        console.error("Version kontrol hatası:", error);
        setLoading(false);
      }
    };

    checkVersions();
  }, []);

  return (
    <>
      {loading ? (
        <div className='info-item column gap10'>
          <h2 className='yellow-title'>Js Version Control</h2>
          <div className='info-content column aic jcc'>
            <div className='loading-spinner' />
          </div>
        </div>
      ) : (
        <div className='info-item column gap10'>
          <h2 className='yellow-title'>Js Version Control</h2>
          <div className='info-content column gap5'>
            <p>
              Node.js: <span>{nodeVersion.version || "Not installed"}</span>
            </p>
            <p>
              NPM: <span>{nodeVersion.npm || "Not installed"}</span>
            </p>
            <p>
              NVM: <span>{nodeVersion.nvm || "Not installed"}</span>
            </p>
            <p>
              Bun.js: <span>{nodeVersion.bun || "Not installed"}</span>
            </p>
            <p>
              PM2: <span>{nodeVersion.pm2 || "Not installed"}</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default SystemInfo;
