import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useConnection } from "../../context/Context";

function ConnectionInfo() {
  const navigate = useNavigate();

  const { myConn } = useConnection();

  return (
    <div className='info-item column gap10'>
      <h2 className='yellow-title'>{myConn.name}</h2>
      <div className='info-content column gap5'>
        <p>
          IP: <span>{myConn.host}</span>
        </p>
        <p>
          Port: <span>{myConn.port}</span>
        </p>
        <p>
          User: <span>{myConn.username}</span>
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

export default ConnectionInfo;
