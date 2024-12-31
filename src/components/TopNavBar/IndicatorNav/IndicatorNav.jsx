import { useEffect, useRef, useState } from "react";
import "./IndicatorNav.scss";
import PropTypes from "prop-types";
import { NavLink, useNavigate } from "react-router-dom";

function IndicatorNav({ buttons }) {
  const [activeTab, setActiveTab] = useState("");

  const indicatorRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    resetIndicator();
  }, []);

  const moveIndicator = (e) => {
    indicatorRef.current.style.left = `${e.target?.offsetLeft}px`;
    indicatorRef.current.style.width = `${e.target?.offsetWidth}px`;

    if (e.target.classList.contains("active")) {
      indicatorRef.current.style.borderBottom = `0px solid #6658ff`;
    } else {
      indicatorRef.current.style.borderBottom = `1px solid whitesmoke`;
    }
  };

  const resetIndicator = () => {
    const tabButton = document.querySelector(".nav-button.active");
    indicatorRef.current.style.left = `${tabButton?.offsetLeft}px`;
    indicatorRef.current.style.width = `${tabButton?.offsetWidth}px`;
  };

  return (
    <div className={`indicator-nav row aic`}>
      <div className='indicator' ref={indicatorRef} />
      {buttons.map((button, index) => {
        if (button.type === "navlink") {
          return (
            <NavLink
              key={index + button.text}
              className={`nav-button`}
              onMouseEnter={(e) => moveIndicator(e)}
              onMouseLeave={resetIndicator}
              to={button.link}
            >
              {button.text}
            </NavLink>
          );
        }

        if (button.type === "button") {
          return (
            <button
              key={index + button.text}
              className={`nav-button ${activeTab === button.text && "active"}`}
              onMouseEnter={(e) => moveIndicator(e)}
              onMouseLeave={resetIndicator}
              onClick={() => {
                setActiveTab(button.text);
                navigate(button.link);
              }}
            >
              {button.text}
            </button>
          );
        }
      })}
    </div>
  );
}

IndicatorNav.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(["navlink", "button"]).isRequired,
      text: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default IndicatorNav;
