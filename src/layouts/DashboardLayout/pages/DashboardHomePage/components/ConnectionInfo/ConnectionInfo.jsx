import { Link } from "react-router-dom";
import { useConnection } from "../../../../context/DashboardLayoutContext";

function ConnectionInfo() {
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
        <Link to='system-info' className='button blue'>
          System Info
        </Link>
      </div>
    </fieldset>
  );
}

export default ConnectionInfo;
