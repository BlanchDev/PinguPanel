import { useState } from "react";
import PropTypes from "prop-types";
import ModalTemplate from "../../../../../../../components/modals/ModalTemplate/ModalTemplate";
import { useWebApps } from "../../../../../context/Context";
import { toast } from "react-toastify";

function CreateNewWebApp({ modalClose }) {
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const { webAppsDirectory, setMyWebAppsLoading, refreshWebApps } =
    useWebApps();

  const handleCreateNewWebApp = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const checkDir = await window.Electron.ssh.executeCommand(
        `if [ -d "${webAppsDirectory}/${projectName}" ]; then echo "exists"; else echo "not_exists"; fi`,
      );

      if (checkDir.success && checkDir.output.trim() === "exists") {
        toast.error("This web app already exists!");
        return;
      }

      const result = await window.Electron.ssh.executeCommand(
        `mkdir "${webAppsDirectory}/${projectName}"`,
      );

      if (result.success) {
        toast.success("Web app created successfully!");
        setMyWebAppsLoading(true);
        refreshWebApps();
        modalClose();
      } else {
        toast.error(`Failed to create web app: ${result.error}`);
      }
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalTemplate modalClose={modalClose}>
      <form
        className='modal-content column aic gap20'
        onSubmit={(e) => handleCreateNewWebApp(e)}
      >
        <div className='top row aic jcsb'>
          <h3 className='purple-title'>Create New Web App</h3>
          <button className='button red' type='button' onClick={modalClose}>
            Close
          </button>
        </div>
        <div className='body column aic gap20'>
          <div className='form-item column gap7'>
            <label htmlFor='project-directory'>Project Directory</label>
            <input
              type='text'
              placeholder={webAppsDirectory}
              id='project-directory'
              value={webAppsDirectory}
              disabled
            />
          </div>

          <div className='form-item column gap7'>
            <label htmlFor='project-name'>Domain Name</label>
            <input
              type='text'
              placeholder='my-project.com'
              id='project-name'
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
              autoFocus
            />
          </div>
        </div>
        <div className='bottom row aic jcc'>
          <button
            className='button green'
            type='submit'
            disabled={loading || projectName.length === 0}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </ModalTemplate>
  );
}

CreateNewWebApp.propTypes = {
  modalClose: PropTypes.func.isRequired,
};

export default CreateNewWebApp;
