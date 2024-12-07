import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { MotionContext } from "./Context";

function MotionProvider({ children }) {
  const [isLoginAnimation, setIsLoginAnimation] = useState(false);
  const [isLogoutAnimation, setIsLogoutAnimation] = useState(false);

  const motionContextValue = useMemo(
    () => ({
      isLoginAnimation,
      setIsLoginAnimation,
      isLogoutAnimation,
      setIsLogoutAnimation,
    }),
    [isLoginAnimation, isLogoutAnimation],
  );

  return (
    <MotionContext.Provider value={motionContextValue}>
      {children}
    </MotionContext.Provider>
  );
}

MotionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MotionProvider;
