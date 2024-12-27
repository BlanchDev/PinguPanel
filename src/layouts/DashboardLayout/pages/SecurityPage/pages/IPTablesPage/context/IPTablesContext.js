import { createContext, useContext } from "react";

export const IPTablesContext = createContext();
export const useIPTables = () => useContext(IPTablesContext);
