import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ModalTemplate from "../../../../../../../../../components/modals/ModalTemplate/ModalTemplate";
import { useWebApps } from "../../../../../../../context/DashboardLayoutContext";

function SelectDirectory({ modalClose }) {
  const [newDirectory, setNewDirectory] = useState("");
  const [loading, setLoading] = useState(false);
  const { connectionId } = useParams();

  const { webAppsDirectory, setWebAppsDirectory } = useWebApps();

  useEffect(() => {
    setNewDirectory(webAppsDirectory || "/var/www");
  }, [webAppsDirectory]);

  const handleSelectDirectory = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await window.Electron.connections.editConnection(
        connectionId,
        {
          "web-apps-directory": newDirectory,
        },
      );

      if (response.success) {
        setWebAppsDirectory(newDirectory);
        toast.success(`Directory updated successfully! : ${newDirectory}`);
        modalClose();
      } else {
        toast.error(`Failed to update directory: ${response.error}`);
      }
    } catch (error) {
      console.error("Error updating directory:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalTemplate modalClose={modalClose}>
      <form
        className='modal-content column aic gap20'
        onSubmit={(e) => handleSelectDirectory(e)}
      >
        <div className='top row aic jcsb'>
          <h3 className='purple-title'>Select Web App Directory</h3>
          <button className='button red' type='button' onClick={modalClose}>
            Close
          </button>
        </div>
        <div className='body column aic gap20'>
          <div className='form-item column gap7'>
            <label htmlFor='project-directory'>Web App Directory</label>
            <input
              type='text'
              placeholder='/var/www'
              id='project-directory'
              value={newDirectory}
              onChange={(e) => setNewDirectory(e.target.value)}
              autoFocus
            />
          </div>
        </div>
        <div className='bottom row aic jcc'>
          <button
            className='button green'
            type='submit'
            disabled={loading || newDirectory === webAppsDirectory}
          >
            {loading ? "Selecting..." : "Select"}
          </button>
        </div>
      </form>
    </ModalTemplate>
  );
}

SelectDirectory.propTypes = {
  modalClose: PropTypes.func.isRequired,
};

export default SelectDirectory;
