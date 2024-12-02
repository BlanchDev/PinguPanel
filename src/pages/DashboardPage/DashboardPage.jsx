import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./DashboardPage.css";
import ConnectionInfo from "./components/ConnectionInfo/ConnectionInfo";
import JsVersionControl from "./components/JsVersionControl/JsVersionControl";
import WebServerControl from "./components/WebServerControl/WebServerControl";

function DashboardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    window.Electron.connections.get().then((connections) => {
      const conn = connections.find((c) => c.id === id);
      if (conn) {
        setConnection(conn);
      } else {
        toast.error("Bağlantı bulunamadı!");
        navigate("/");
      }
    });
  }, [id, navigate]);

  if (!connection) {
    return (
      <div className='dashboard-page column aic jcc'>
        <div className='loading-spinner' />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className='dashboard-page column gap20'>
      <div className='connection-info column gap10'>
        <div className='info-grid'>
          <ConnectionInfo connection={connection} />
          <JsVersionControl />
        </div>
        <WebServerControl />
      </div>
    </div>
  );
}

export default DashboardPage;
