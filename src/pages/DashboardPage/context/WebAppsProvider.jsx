import { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { useConnection, WebAppsContext } from "./Context";

export function WebAppsProvider({ children }) {
  const [webAppsDirectory, setWebAppsDirectory] = useState("");
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [myWebAppsLoading, setMyWebAppsLoading] = useState(true);
  const refreshWebApps = () => setLastRefresh(Date.now());

  const { myConn } = useConnection();

  useEffect(() => {
    if (myConn) {
      setWebAppsDirectory(myConn["web-apps-directory"] || "");
    }
  }, [myConn]);

  const webAppsValue = useMemo(
    () => ({
      webAppsDirectory,
      setWebAppsDirectory,
      lastRefresh,
      refreshWebApps,
      myWebAppsLoading,
      setMyWebAppsLoading,
    }),
    [webAppsDirectory, lastRefresh, myWebAppsLoading],
  );

  return (
    <WebAppsContext.Provider value={webAppsValue}>
      {children}
    </WebAppsContext.Provider>
  );
}

WebAppsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
