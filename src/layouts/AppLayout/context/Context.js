import { createContext, useContext } from "react";

export const MotionContext = createContext();
export const useMotion = () => useContext(MotionContext);
