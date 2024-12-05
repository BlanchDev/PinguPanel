import { useConnection } from "../../context/Context";
import { useState } from "react";
import DisconnectConnModal from "./components/modals/DisconnectConnModal/DisconnectConnModal";
import { Link } from "react-router-dom";

function ConnectionInfo() {
  const [disconnectModalOpen, setDisconnectModalOpen] = useState(false);

  const { myConn } = useConnection();

  return (
    <fieldset className='box column gap10'>
      <legend className='title yellow-title'>{myConn.name}</legend>
      <div className='content column gap10'>
        <fieldset>
          <legend>IP</legend>
          <span>{myConn.host}</span>
        </fieldset>
      </div>
      <div className='row aic gap15'>
        <button
          className='button red'
          onClick={() => setDisconnectModalOpen(true)}
        >
          Exit
        </button>
        <Link to='system-info' className='button blue'>
          System Info
        </Link>
      </div>

      {/* MODALS */}
      {disconnectModalOpen && (
        <DisconnectConnModal modalClose={() => setDisconnectModalOpen(false)} />
      )}
    </fieldset>
  );
}

export default ConnectionInfo;
