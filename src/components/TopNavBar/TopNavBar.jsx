import IndicatorNav from "./IndicatorNav/IndicatorNav";
import "./TopNavBar.scss";
import PropTypes from "prop-types";

function TopNavBar({ buttons, styleTop = "0", children }) {
  return (
    <div className={`top-nav-bar row aic jcsb`} style={{ top: styleTop }}>
      <IndicatorNav buttons={buttons} />
      {children}
    </div>
  );
}

TopNavBar.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(["navlink", "button"]).isRequired,
      text: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    }),
  ).isRequired,
  styleTop: PropTypes.string,
  children: PropTypes.node,
};

export default TopNavBar;
