import { usePackageManager } from "../../context/DashboardLayoutContext";

function JsVersionControl() {
  const { requirements, reqsLoading } = usePackageManager();

  return (
    <>
      {reqsLoading ? (
        <div className='info-item column gap10'>
          <h2 className='yellow-title'>Js Version Control</h2>
          <div className='info-content column aic jcc'>
            <div className='loading-spinner' />
            <p>Checking js versions...</p>
          </div>
        </div>
      ) : (
        <div className='info-item column gap10'>
          <h2 className='yellow-title'>Js Version Control</h2>
          <div className='info-content column gap5'>
            <p>
              Node.js:{" "}
              <span>{requirements.node.version || "Not installed"}</span>
            </p>
            <p>
              NPM: <span>{requirements.npm.version || "Not installed"}</span>
            </p>
            <p>
              PM2: <span>{requirements.pm2.version || "Not installed"}</span>
            </p>
            <p>
              Nginx:{" "}
              <span>{requirements.nginx.version || "Not installed"}</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default JsVersionControl;
