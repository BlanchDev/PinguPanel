import { Outlet } from "react-router-dom";
import "./AppLayout.scss";

function AppLayout() {
  return (
    <div className='app-layout column'>
      <Outlet />
    </div>
  );
}

export default AppLayout;
