import { createContext, useContext } from "react";

export const ConnectionContext = createContext();
export const useConnection = () => useContext(ConnectionContext);

export const WebAppsContext = createContext();
export const useWebApps = () => useContext(WebAppsContext);

export const PackageManagerContext = createContext();
export const usePackageManager = () => useContext(PackageManagerContext);
