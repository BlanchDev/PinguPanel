import { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import appsIcon from "../../../../assets/dashboardLeftBar/app.png";
import homeIcon from "../../../../assets/dashboardLeftBar/home.png";
import shieldIcon from "../../../../assets/dashboardLeftBar/shield.png";
import logoutIcon from "../../../../assets/dashboardLeftBar/logout.png";
import dockerIcon from "../../../../assets/dashboardLeftBar/docker.png";
import "./DashboardLeftBar.scss";
import DisconnectConnModal from "./components/modals/DisconnectConnModal/DisconnectConnModal";

function DashboardLeftBar() {
  const [tooltipPosition, setTooltipPosition] = useState(null);
  const [disconnectModalOpen, setDisconnectModalOpen] = useState(false);
  const { connectionId } = useParams();

  const handleMouseEnter = (e) => {
    const buttonRect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition(buttonRect.top + 10);
  };

  const handleMouseLeave = () => {
    setTooltipPosition(null);
  };

  const renderButton = (icon, tooltip, to) => (
    <NavLink
      className='btn'
      to={to}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className='icon-container'>
        <img src={icon} className='icon' alt='icon' />
      </div>
      {tooltip && (
        <div
          className='tooltip'
          style={tooltipPosition ? { top: tooltipPosition } : {}}
        >
          <p>{tooltip}</p>
        </div>
      )}
    </NavLink>
  );

  return (
    <div className='dashboard-left-bar column aic jcsb'>
      <div className='top column aic'>
        {renderButton(
          homeIcon,
          "Dashboard Home",
          `/dashboard/${connectionId}/dashboard-home`,
        )}
        {renderButton(
          appsIcon,
          "Manage Apps",
          `/dashboard/${connectionId}/manage-global-apps`,
        )}
        {renderButton(
          shieldIcon,
          "Security",
          `/dashboard/${connectionId}/security`,
        )}
        {renderButton(
          dockerIcon,
          "Docker",
          `/dashboard/${connectionId}/docker`,
        )}
      </div>

      <div className='bottom column aic gap10'>
        <button
          className='btn'
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => setDisconnectModalOpen(true)}
        >
          <div className='icon-container'>
            <img src={logoutIcon} className='icon' alt='icon' />
          </div>
        </button>
      </div>

      {/* MODALS */}
      {disconnectModalOpen && (
        <DisconnectConnModal modalClose={() => setDisconnectModalOpen(false)} />
      )}
    </div>
  );
}

export default DashboardLeftBar;
