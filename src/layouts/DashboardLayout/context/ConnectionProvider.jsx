import { useState, useCallback, useMemo, useEffect } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { ConnectionContext } from "./Context";
import { useParams } from "react-router-dom";

export function ConnectionProvider({ children }) {
  const [myConn, setMyConn] = useState({});
  const [myConnLoading, setMyConnLoading] = useState(true);
  const { connectionId } = useParams();

  const fetchConnection = useCallback(async () => {
    if (!connectionId) return;

    setMyConnLoading(true);
    try {
      const data = await window.Electron.connections.getConnections();
      if (data.success) {
        const conn = data.connections.find((c) => c.id === connectionId);
        if (conn) {
          setMyConn(() => {
            const safeConn = { ...conn };
            delete safeConn["privateKey"];

            return safeConn;
          });
        }
      } else {
        toast.error("Failed to fetch connections!");
      }
    } catch (error) {
      toast.error(`Error fetching connections: ${error.message}`);
    } finally {
      setMyConnLoading(false);
    }
  }, [connectionId]);

  useEffect(() => {
    fetchConnection();
  }, [fetchConnection]);

  const connectionValue = useMemo(
    () => ({
      myConn,
      myConnLoading,
      fetchConnection,
    }),
    [myConn, myConnLoading, fetchConnection],
  );

  return (
    <ConnectionContext.Provider value={connectionValue}>
      {children}
    </ConnectionContext.Provider>
  );
}

ConnectionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
