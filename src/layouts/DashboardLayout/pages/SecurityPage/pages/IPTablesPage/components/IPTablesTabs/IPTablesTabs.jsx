import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import "./IPTablesTabs.scss";
import { toast } from "react-toastify";
import FreshStartModal from "./modals/FreshStartModal";

function IPTablesTabs({ currentTab, setActiveTab }) {
  const [freshStartModal, setFreshStartModal] = useState(false);
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

  const handleSave = async () => {
    try {
      const result = await window.Electron.ssh.executeCommand(
        "netfilter-persistent save",
      );
      if (result.success) {
        toast.success("IPTables rules saved successfully");
      } else {
        toast.error(result.output);
      }
    } catch (error) {
      toast.error(error.message);
    }
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
        <button className='button green' onClick={handleSave}>
          Save
        </button>
        {/* TODO: Docker varsa resetlerken hangi kodları çalıştıracağımızı belirt. Seçim yaptır. nat kuralları silinsin mi silinmesin mi? */}
        <button className='button red' onClick={() => setFreshStartModal(true)}>
          Fresh Start
        </button>
      </div>
      {freshStartModal && (
        <FreshStartModal modalClose={() => setFreshStartModal(false)} />
      )}
    </div>
  );
}

IPTablesTabs.propTypes = {
  currentTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default IPTablesTabs;
