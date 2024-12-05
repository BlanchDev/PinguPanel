import { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import ModalTemplate from "../../../../../../../components/modals/ModalTemplate/ModalTemplate";
import { useNavigate } from "react-router-dom";

function DisconnectConnModal({ modalClose }) {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleDisconnectConn = async (e) => {
    e.preventDefault();

    setLoading(true);

    window.Electron.ssh
      .disconnectSSH()
      .then(() => {
        toast.success("Connection closed successfully!");
        navigate("/");
      })
      .catch((error) => {
        toast.error(`An error occurred: ${error.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <ModalTemplate modalClose={modalClose}>
      <form
        className='modal-content column aic gap50'
        onSubmit={(e) => handleDisconnectConn(e)}
      >
        <div className='top row aic jcsb'>
          <h3 className='purple-title'>Disconnect Connection</h3>
          <button className='button red' type='button' onClick={modalClose}>
            Close
          </button>
        </div>
        <div className='body column aic gap20'>
          <div className='form-item column aic jcc gap7'>
            <h4>Are you sure you want to disconnect this connection?</h4>
          </div>
        </div>
        <div className='bottom row aic jcc gap50'>
          <button className='button red' type='submit' disabled={loading}>
            {loading ? "Disconnecting..." : "Disconnect"}
          </button>

          <button className='button green' type='button' onClick={modalClose}>
            Cancel
          </button>
        </div>
      </form>
    </ModalTemplate>
  );
}

DisconnectConnModal.propTypes = {
  modalClose: PropTypes.func.isRequired,
};

export default DisconnectConnModal;
