import PropTypes from "prop-types";
import ModalTemplate from "../../../../../components/modals/ModalTemplate/ModalTemplate";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

function SettingsModal({ modalClose }) {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    windowSize: {
      width: 1024,
      height: 576,
    },
  });

  const [winSize, setWinSize] = useState({
    width: 1024,
    height: 576,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = document.documentElement.clientWidth;
      const height = document.documentElement.clientHeight;
      setWinSize({
        width,
        height,
      });
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSubmitSettings = async (e) => {
    e.preventDefault();

    setLoading(true);
    window.Electron.settings
      .setWinSize({
        width: parseInt(settings.windowSize.width),
        height: parseInt(settings.windowSize.height),
      })
      .then(() => {
        modalClose();
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <ModalTemplate modalClose={modalClose}>
      <form
        className='modal-content column aic gap20'
        onSubmit={(e) => handleSubmitSettings(e)}
      >
        <div className='top row aic jcsb'>
          <h3 className='purple-title'>Settings</h3>
          <button className='button red' type='button' onClick={modalClose}>
            Close
          </button>
        </div>
        <div className='body column aic gap20'>
          <div className='form-item column gap7'>
            <label htmlFor='window-size'>
              Window Size ({winSize.width}x{winSize.height})
            </label>
            <select
              name='window-size'
              id='window-size'
              value={`${settings.windowSize.width}x${settings.windowSize.height}`}
              onChange={(e) => {
                setSettings({
                  ...settings,
                  windowSize: {
                    width: e.target.value.split("x")[0],
                    height: e.target.value.split("x")[1],
                  },
                });
              }}
            >
              <option value='1024x576'>1024x576</option>
              <option value='1280x720'>1280x720</option>
              <option value='1600x900'>1600x900</option>
            </select>
          </div>
        </div>
        <div className='bottom row aic jcc'>
          <button className='button green' type='submit' disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </ModalTemplate>
  );
}

SettingsModal.propTypes = {
  modalClose: PropTypes.func.isRequired,
};

export default SettingsModal;
