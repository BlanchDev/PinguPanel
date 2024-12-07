import { Link, useLocation, useParams } from "react-router-dom";
import "./BreadCrumbs.scss";

function BreadCrumbs() {
  const location = useLocation();
  const { connectionId } = useParams();

  const pathnames = location.pathname.split("/").filter((pathItem) => pathItem);

  const getPageTitle = (path) => {
    switch (path) {
      case "save-new-connection":
        return "Save New SSH Connection";

      case "dashboard-home":
        return "Dashboard Home";

      case "system-info":
        return "System Info";

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
        if (name === "dashboard" || name === connectionId) {
          return null;
        }

        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
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
