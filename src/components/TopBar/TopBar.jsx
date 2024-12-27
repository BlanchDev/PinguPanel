import "./TopBar.scss";
import logo from "../../assets/penguin.png";
import settings from "../../assets/settings.png";
import SettingsModal from "./components/modals/SettingsModal/SettingsModal";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function TopBar() {
  const [isConnected, setIsConnected] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const data = await window.Electron.ssh.getActiveSSHConnection();

        if (data.success) {
          setIsConnected(true);
        } else {
          setIsConnected(false);
          window.Electron.ssh
            .disconnectSSH()
            .then(() => {
              navigate("/", { replace: true });
            })
            .catch((error) => {
              toast.error(`An error occurred: ${error.message}`);
            });
        }
      } catch (error) {
        console.error("Error checking SSH connection:", error);
        setIsConnected(false);

        window.Electron.ssh
          .disconnectSSH()
          .then(() => {
            navigate("/", { replace: true });
          })
          .catch((error) => {
            toast.error(`An error occurred: ${error.message}`);
          });
      }
    };

    let timer = 0;

    if (location.pathname.includes("dashboard")) {
      timer = 3_000;
    } else {
      timer = 3_000_000;
    }

    if (location.pathname === "/") {
      checkConnection();
    }

    const intervalId = setInterval(checkConnection, timer);
    return () => clearInterval(intervalId);
  }, [navigate, isConnected, location.pathname]);

  return (
    <div className='electron-top-bar row aic jcsb gap7'>
      <div className='top-bar-title row aic gap7'>
        <div
          className={`isConnected ${
            isConnected ? "connected" : "disconnected"
          }`}
        />
        <img
          src={logo}
          alt='PinguPanel'
          className='logo'
          width={16}
          height={16}
        />
        <div className='row aic gap7'>
          {location.pathname === "/" && <span className=''>Welcome to</span>}
          <span className='title'>PinguPanel</span>
        </div>
      </div>

      <div className='icon-container row aic gap5'>
        <span className='version'>1.0.0</span>
        <button
          className='icon-item row aic jcc'
          onClick={() => setShowSettingsModal(true)}
        >
          <img
            src={settings}
            alt='settings'
            className='icon'
            width={22}
            height={22}
          />
        </button>
      </div>

      {/* MODALS */}
      {showSettingsModal && (
        <SettingsModal modalClose={() => setShowSettingsModal(false)} />
      )}
    </div>
  );
}

export default TopBar;
