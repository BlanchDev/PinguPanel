import { useState, useEffect } from "react";

function JsVersionControl() {
  const [loading, setLoading] = useState(true);
  const [versions, setVersions] = useState({
    version: "",
    npm: "",
    nvm: "",
    bun: "",
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
          setVersions({
            version: nodeResult.output.trim(),
            npm: npmResult.output.trim(),
            nvm: nvmResult.output.trim(),
            bun: bunResult.output.trim(),
            pm2: pm2Result.output.trim(),
          });
        } else {
          throw new Error("Version control failed!");
        }

        setLoading(false);
      } catch (error) {
        console.error("Version control failed:", error);
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
              Node.js: <span>{versions.version || "Not installed"}</span>
            </p>
            <p>
              NPM: <span>{versions.npm || "Not installed"}</span>
            </p>
            <p>
              NVM: <span>{versions.nvm || "Not installed"}</span>
            </p>
            <p>
              Bun.js: <span>{versions.bun || "Not installed"}</span>
            </p>
            <p>
              PM2: <span>{versions.pm2 || "Not installed"}</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default JsVersionControl;
