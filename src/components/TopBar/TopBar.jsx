import "./TopBar.css";
import logo from "../../assets/penguin.png";

function TopBar() {
  return (
    <div className='electron-top-bar row aic gap7'>
      <img
        src={logo}
        alt='PinguPanel'
        className='logo'
        width={16}
        height={16}
      />{" "}
      PinguPanel
    </div>
  );
}

export default TopBar;
