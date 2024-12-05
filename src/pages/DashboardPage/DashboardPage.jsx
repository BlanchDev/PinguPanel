import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./DashboardPage.scss";
import ConnectionInfo from "./components/ConnectionInfo/ConnectionInfo";
import WebApps from "./components/WebApps/WebApps";
import { useConnection, useSystemReqs } from "./context/Context";

function DashboardPage() {
  const navigate = useNavigate();

  const { myConn, myConnLoading } = useConnection();
  const { isReqsInstalled, reqsLoading, error } = useSystemReqs();

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

  if (myConnLoading) {
    return (
      <div className='dashboard-page column aic jcc gap25'>
        <div className='loading-spinner' />
        <p>Loading...</p>
      </div>
    );
  }

  if (!myConn) {
    return (
      <div className='dashboard-page column aic jcc gap25'>
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

  const renderWebApps = () => {
    if (error) {
      return (
        <fieldset className='box column gap10'>
          <legend className='title yellow-title'>Web Apps</legend>
          <div className='content column aic jcc'>
            <p>System requirements check failed: {error}</p>
          </div>
        </fieldset>
      );
    }

    if (reqsLoading) {
      return (
        <fieldset className='box column gap10'>
          <legend className='title yellow-title'>Web Apps</legend>
          <div className='content column aic jcc gap25'>
            <div className='loading-spinner' />
            <p>Checking system requirements...</p>
          </div>
        </fieldset>
      );
    }

    return isReqsInstalled ? (
      <WebApps />
    ) : (
      <fieldset className='box column gap10'>
        <legend className='title yellow-title'>Web Apps</legend>
        <div className='content column aic jcc gap25'>
          <p>
            System requirements not installed! Node.js, NPM, PM2 and Nginx are
            required.
          </p>
        </div>
      </fieldset>
    );
  };

  return (
    <div className='dashboard-page column gap20'>
      <div className='box-container column gap10'>
        <div className='grid3'>
          <ConnectionInfo />
        </div>
        {renderWebApps()}
      </div>
    </div>
  );
}

export default DashboardPage;
