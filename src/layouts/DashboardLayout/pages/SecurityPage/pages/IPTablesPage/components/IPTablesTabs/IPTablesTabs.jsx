import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import "./IPTablesTabs.scss";

function IPTablesTabs({ currentTab, setActiveTab }) {
  const indicatorRef = useRef(null);

  useEffect(() => {
    resetIndicator();
  }, [currentTab]);

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
    <div className='iptables-tabs row aic jcsb'>
      <div className='indicator' ref={indicatorRef} />
      <div className='row aic'>
        <button
          className={`tab-button ${currentTab === "filter" ? "active" : ""}`}
          onMouseEnter={moveIndicator}
          onMouseLeave={resetIndicator}
          onClick={() => setActiveTab("filter")}
        >
          Filter Table
        </button>
        <button
          className={`tab-button ${currentTab === "nat" ? "active" : ""}`}
          onMouseEnter={moveIndicator}
          onMouseLeave={resetIndicator}
          onClick={() => setActiveTab("nat")}
        >
          NAT Table
        </button>
      </div>
      <div className='right-container row aic gap10'>
        <button className='button green'>SAVE</button>
        <button className='button red'>HARD RESET</button>
      </div>
    </div>
  );
}

IPTablesTabs.propTypes = {
  currentTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default IPTablesTabs;
