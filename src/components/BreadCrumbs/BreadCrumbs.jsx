import { Link, useLocation, useParams } from "react-router-dom";
import "./BreadCrumbs.scss";
import { useConnection } from "../../pages/DashboardPage/context/Context";

function BreadCrumbs() {
  const location = useLocation();
  const { connectionId } = useParams();
  const connectionContext = useConnection();
  const myConn = connectionContext ? connectionContext.myConn : undefined;

  const pathnames = location.pathname.split("/").filter((x) => x);

  const getPageTitle = (path) => {
    switch (path) {
      case "save-new-connection":
        return "Save New SSH Connection";

      case connectionId:
        return myConn.name;

      case "system-info":
        return "System Info";

      default:
        return path;
    }
  };

  return (
    <div className='bread-crumbs row aic'>
      {connectionId ? (
        <div className='bread-crumbs-item'>
          <Link to={`/dashboard/${connectionId}`}>
            {getPageTitle(connectionId)}
          </Link>
        </div>
      ) : (
        <div className='bread-crumbs-item'>
          <Link to='/'>Home</Link>
        </div>
      )}

      {pathnames.map((name, index) => {
        if (name === "dashboard" || name === connectionId) {
          return null;
        }

        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;

        return (
          <div key={routeTo} className='bread-crumbs-item'>
            <span className='separator'>/</span>
            {isLast ? (
              <span className='current'>{getPageTitle(name)}</span>
            ) : (
              <Link to={routeTo}>{getPageTitle(name)}</Link>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default BreadCrumbs;
