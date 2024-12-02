import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ConnectionInfo({ connection }) {
  const navigate = useNavigate();

  return (
    <div className='info-item column gap10'>
      <h2 className='yellow-title'>{connection.name}</h2>
      <div className='info-content column gap5'>
        <p>
          IP: <span>{connection.host}</span>
        </p>
        <p>
          Port: <span>{connection.port}</span>
        </p>
        <p>
          User: <span>{connection.username}</span>
        </p>
      </div>
      <button
        className='button red'
        onClick={() => {
          window.Electron.ssh.disconnectSSH().then(() => {
            toast.success("Connection closed successfully!");
            navigate("/");
          });
        }}
      >
        Exit
      </button>
    </div>
  );
}

ConnectionInfo.propTypes = {
  connection: PropTypes.object.isRequired,
};

export default ConnectionInfo;
