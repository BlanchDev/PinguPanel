import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./AppLayout.scss";
import { useEffect } from "react";
import { toast } from "react-toastify";

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.includes("dashboard")) {
      return;
    }

    window.Electron.ssh
      .getActiveSSHConnection()
      .then((data) => {
        if (data.success) {
          navigate(-2);
          console.debug(data);
          toast.warning(
            "If you want to connect to another SSH server, please disconnect the current connection.",
          );
        }
      })
      .catch((err) => {
        console.debug(err);
      });
  }, [location.pathname, navigate]);

  return (
    <div className='app-layout column'>
      <Outlet />
    </div>
  );
}

export default AppLayout;
