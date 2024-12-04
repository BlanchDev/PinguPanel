import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./DashboardPage.scss";
import ConnectionInfo from "./components/ConnectionInfo/ConnectionInfo";
import JsVersionControl from "./components/JsVersionControl/JsVersionControl";
import WebApps from "./components/WebApps/WebApps";
import { useConnection } from "./context/Context";

function DashboardPage() {
  const navigate = useNavigate();

  const { myConn, myConnLoading } = useConnection();

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

  if (!myConn || myConnLoading) {
    return (
      <div className='dashboard-page column aic jcc gap25'>
        <div className='loading-spinner' />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className='dashboard-page column gap20'>
      <div className='connection-info column gap10'>
        <div className='info-grid'>
          <ConnectionInfo />
          <JsVersionControl />
        </div>
        <WebApps />
      </div>
    </div>
  );
}

export default DashboardPage;
