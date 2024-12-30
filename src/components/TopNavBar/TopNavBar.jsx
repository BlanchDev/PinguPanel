import IndicatorNav from "./IndicatorNav/IndicatorNav";
import "./TopNavBar.scss";
import PropTypes from "prop-types";

function TopNavBar({ buttons, direction = "row", styleTop = "0", children }) {
  return (
    <div
      className={`top-nav-bar ${direction} aic jcsb`}
      style={{ top: styleTop }}
    >
      <IndicatorNav buttons={buttons} direction={direction} />
      {children}
    </div>
  );
}

TopNavBar.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.string).isRequired,
  direction: PropTypes.string,
  styleTop: PropTypes.string,
  children: PropTypes.node,
};

export default TopNavBar;
