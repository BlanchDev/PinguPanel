import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./DashboardHomePage.scss";
import ConnectionInfo from "./components/ConnectionInfo/ConnectionInfo";
import { useConnection } from "../../context/DashboardLayoutContext";

function DashboardHomePage() {
  const navigate = useNavigate();

  const { myConn } = useConnection();

  useEffect(() => {
    if (!myConn) {
      window.Electron.ssh
        .disconnectSSH()
        .then(() => {
          toast.error("Connection not found!");
          navigate("/");
        })
        .catch((error) => {
          toast.error(`Connection not found: ${error.message}`);
          navigate("/");
        });
    }
  }, [navigate, myConn]);

  if (!myConn) {
    return (
      <div className='dashboard-home-page column aic jcc gap25'>
        <p>Connection not found!</p>
        <button
          className='button green'
          onClick={() => {
            window.Electron.ssh
              .disconnectSSH()
              .then(() => {
                toast.success("Connection closed successfully!");
                navigate("/");
              })
              .catch((error) => {
                toast.error(`An error occurred: ${error.message}`);
              });
          }}
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className='dashboard-home-page dashboard-layout-page column gap20'>
      <div className='box-container noborder column gap10'>
        <div className='grid3'>
          <ConnectionInfo />
          <fieldset className='box column gap10'>
            <legend className='title yellow-title'>Configuration</legend>
            <div className='content column gap10'>
              <fieldset>
                <legend>Fast Actions</legend>
                <button className='button blue'>sshd_config</button>
              </fieldset>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
}

export default DashboardHomePage;
