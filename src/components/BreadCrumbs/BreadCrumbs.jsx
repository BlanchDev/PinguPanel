import { Link, useLocation } from "react-router-dom";
import "./BreadCrumbs.scss";

function BreadCrumbs() {
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter((x) => x);

  const getPageTitle = (path) => {
    switch (path) {
      case "save-new-connection":
        return "Save New SSH Connection";

      default:
        return path;
    }
  };

  return (
    <div className='bread-crumbs row aic'>
      <div className='bread-crumbs-item'>
        <Link to='/'>Home</Link>
      </div>

      {pathnames.map((name, index) => {
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
