import { Link, useLocation, useParams } from "react-router-dom";
import "./BreadCrumbs.scss";

function BreadCrumbs() {
  const location = useLocation();
  const { connectionId, iptablesTable } = useParams();

  const pathnames = location.pathname.split("/").filter((pathItem) => {
    const pathItemTrimmed = pathItem.trim();

    switch (pathItemTrimmed) {
      case "":
        return false;

      case "dashboard":
        return false;

      case connectionId:
        return false;

      case iptablesTable:
        return false;

      default:
        return true;
    }
  });

  console.log(pathnames);

  const getPageTitle = (path) => {
    switch (path) {
      case "save-new-connection":
        return "Save New SSH Connection";

      case "dashboard-home":
        return "Dashboard Home";

      case "system-info":
        return "System Info";

      case "security":
        return "Security";

      case "iptables":
        return "IPTables";

      default:
        return path;
    }
  };

  return (
    <div className='bread-crumbs row aic'>
      {!connectionId && (
        <div className='bread-crumbs-item'>
          <Link to='/'>Home</Link>
          <span className='separator'>/</span>
        </div>
      )}

      {pathnames.map((name, index) => {
        let routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;

        if (connectionId) {
          routeTo = `/dashboard/${connectionId}${routeTo}`;
        }

        const isLast = index === pathnames.length - 1;

        return (
          <div key={routeTo} className='bread-crumbs-item'>
            {isLast ? (
              <span className='current'>{getPageTitle(name)}</span>
            ) : (
              <>
                <Link to={routeTo}>{getPageTitle(name)}</Link>
                <span className='separator'>/</span>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default BreadCrumbs;
