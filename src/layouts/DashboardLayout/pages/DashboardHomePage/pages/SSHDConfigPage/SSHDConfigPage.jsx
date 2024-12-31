import { useEffect, useState } from "react";
import BreadCrumbs from "../../../../../../components/BreadCrumbs/BreadCrumbs";
import "./SSHDConfigPage.scss";
import { toast } from "react-toastify";

function SSHDConfigPage() {
  const [fetchLoading, setFetchLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [sshdConfig, setSSHDConfig] = useState([]);

  useEffect(() => {
    getSSHDConfig();
  }, []);

  const getSSHDConfig = async () => {
    try {
      const config = await window.Electron.ssh.executeCommand(
        "cat /etc/ssh/sshd_config",
      );
      console.log(config);
      const configLines = config.output.split("\n");
      setSSHDConfig(configLines);
      setFetchLoading(false);
    } catch (error) {
      console.error("Error getting SSHD config:", error);
      setSSHDConfig(["Error loading SSHD config"]);
      setFetchLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const configText = sshdConfig.join("\n").trimEnd();

      const saveConfig = await window.Electron.ssh.executeCommand(
        `echo "${configText}" | sudo tee /etc/ssh/sshd_config`,
      );

      if (!saveConfig.success) {
        throw new Error("Error saving SSHD config");
      }

      const restartSSH = await window.Electron.ssh.executeCommand(
        "sudo systemctl restart sshd",
      );

      if (!restartSSH.success) {
        throw new Error("Error restarting SSHD");
      }

      toast.success("SSHD Config Updated");
    } catch (error) {
      console.error("Error saving SSHD config:", error);
      toast.error("Error saving SSHD config");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className='dashboard-layout-page column'>
      <BreadCrumbs />
      <div className='sshd-config-page column flex1 w100 h100'>
        <div className='box-container noborder flex1'>
          <div className='column aic jcc gap10 flex1 w100 h100 '>
            {fetchLoading ? (
              <div className='column aic jcc gap10'>
                <div className='loading-spinner' />
                <p>Loading Config File...</p>
              </div>
            ) : (
              <form
                className='column aic gap10 flex1 w100 h100'
                onSubmit={(e) => handleSave(e)}
              >
                <div className='column aic gap10 flex1 w100 h100'>
                  <textarea
                    name='sshd-config'
                    id='sshd-config'
                    value={sshdConfig.join("\n")}
                    onChange={(e) => {
                      setSSHDConfig(e.target.value.split("\n"));
                    }}
                  />
                  <div className='w100 row aic'>
                    <button
                      className='button green'
                      type='submit'
                      disabled={saveLoading}
                    >
                      {saveLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SSHDConfigPage;
