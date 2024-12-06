import "./TopBar.scss";
import logo from "../../assets/penguin.png";
import settings from "../../assets/settings.png";
import SettingsModal from "./components/modals/SettingsModal/SettingsModal";
import { useState } from "react";
import { useLocation } from "react-router-dom";

function TopBar() {
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const location = useLocation();

  return (
    <div className='electron-top-bar row aic jcsb gap7'>
      <div className='top-bar-title row aic gap7'>
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
