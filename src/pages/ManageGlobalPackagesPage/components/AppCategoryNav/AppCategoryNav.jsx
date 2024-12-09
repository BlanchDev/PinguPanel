import { useEffect, useRef } from "react";
import "./AppCategoryNav.scss";
import { NavLink, useParams } from "react-router-dom";

function AppCategoryNav() {
  const indicatorRef = useRef(null);
  const { connectionId, category } = useParams();

  useEffect(() => {
    resetIndicator();
  }, [category]);

  const moveIndicator = (e) => {
    indicatorRef.current.style.left = `${e.target?.offsetLeft}px`;
    indicatorRef.current.style.width = `${e.target?.offsetWidth}px`;

    if (e.target.classList.contains("active")) {
      indicatorRef.current.style.borderBottom = `1px solid #6658ff`;
    } else {
      indicatorRef.current.style.borderBottom = `1px solid whitesmoke`;
    }
  };

  const resetIndicator = () => {
    const tabButton = document.querySelector(".tab-button.active");
    indicatorRef.current.style.left = `${tabButton?.offsetLeft}px`;
    indicatorRef.current.style.width = `${tabButton?.offsetWidth}px`;
  };

  return (
    <div className='app-category-nav row aic'>
      <div className='indicator' ref={indicatorRef} />
      <NavLink
        className='tab-button'
        onMouseEnter={moveIndicator}
        onMouseLeave={resetIndicator}
        to={`/dashboard/${connectionId}/manage-global-packages/all`}
      >
        All
      </NavLink>
      <NavLink
        className='tab-button'
        onMouseEnter={moveIndicator}
        onMouseLeave={resetIndicator}
        to={`/dashboard/${connectionId}/manage-global-packages/required`}
      >
        Required
      </NavLink>
      <NavLink
        className='tab-button'
        onMouseEnter={moveIndicator}
        onMouseLeave={resetIndicator}
        to={`/dashboard/${connectionId}/manage-global-packages/docker`}
      >
        Docker
      </NavLink>
      <NavLink
        className='tab-button'
        onMouseEnter={moveIndicator}
        onMouseLeave={resetIndicator}
        to={`/dashboard/${connectionId}/manage-global-packages/pm2`}
      >
        PM2
      </NavLink>
      <NavLink
        className='tab-button'
        onMouseEnter={moveIndicator}
        onMouseLeave={resetIndicator}
        to={`/dashboard/${connectionId}/manage-global-packages/ssl`}
      >
        SSL
      </NavLink>
    </div>
  );
}

export default AppCategoryNav;
