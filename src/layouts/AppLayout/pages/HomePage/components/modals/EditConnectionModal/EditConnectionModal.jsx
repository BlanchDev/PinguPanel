import { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import ModalTemplate from "../../../../../../../components/modals/ModalTemplate/ModalTemplate";

function EditConnectionModal({ safeConnection, modalClose }) {
  const [loading, setLoading] = useState(false);
  const [editedConnection, setEditedConnection] = useState({
    id: safeConnection.id,
    name: safeConnection.name,
    host: safeConnection.host,
    port: safeConnection.port,
    username: safeConnection.username,
  });

  const handleEditConnection = (e) => {
    e.preventDefault();
    setLoading(true);
    window.Electron.connections
      .editConnection(safeConnection.id, editedConnection)
      .then(() => {
        modalClose();
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <ModalTemplate modalClose={modalClose}>
      <form
        className='modal-content column aic gap20'
        onSubmit={(e) => handleEditConnection(e)}
      >
        <div className='top row aic jcsb'>
          <h3 className='purple-title'>Edit Connection</h3>
          <button className='button red' type='button' onClick={modalClose}>
            Close
          </button>
        </div>
        <div className='body column aic gap20'>
          <div className='form-item column gap7'>
            <label htmlFor='project-name'>Name</label>
            <input
              type='text'
              placeholder='New My Web Server'
              id='project-name'
              value={editedConnection.name}
              onChange={(e) =>
                setEditedConnection((prev) => {
                  return { ...prev, name: e.target.value };
                })
              }
              required
              autoFocus
            />
          </div>
          <div className='form-item column gap7'>
            <label htmlFor='project-name'>Host</label>
            <input
              type='text'
              placeholder='123.456.789.100'
              id='project-name'
              value={editedConnection.host}
              onChange={(e) =>
                setEditedConnection((prev) => {
                  return { ...prev, host: e.target.value };
                })
              }
              required
            />
          </div>
          <div className='form-item column gap7'>
            <label htmlFor='project-name'>Port</label>
            <input
              type='text'
              placeholder='22'
              id='project-name'
              value={editedConnection.port}
              onChange={(e) =>
                setEditedConnection((prev) => {
                  return { ...prev, port: e.target.value };
                })
              }
              required
            />
          </div>
          <div className='form-item column gap7'>
            <label htmlFor='project-name'>Username</label>
            <input
              type='text'
              placeholder='root'
              id='project-name'
              value={editedConnection.username}
              onChange={(e) =>
                setEditedConnection((prev) => {
                  return { ...prev, username: e.target.value };
                })
              }
              required
            />
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

EditConnectionModal.propTypes = {
  safeConnection: PropTypes.object.isRequired,
  modalClose: PropTypes.func.isRequired,
};

export default EditConnectionModal;
