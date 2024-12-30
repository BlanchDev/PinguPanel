import "./SecurityPage.scss";
import { usePackageManager } from "../../context/DashboardLayoutContext";
import { useNavigate } from "react-router-dom";

function SecurityPage() {
  const { packages } = usePackageManager();
  const navigate = useNavigate();

  return (
    <div className='security-page dashboard-layout-page column gap20'>
      <div className='box-container noborder column gap10'>
        <div className='column gap10'>
          <h2 className='purple-title'>Security</h2>
        </div>
        <div className='grid3'>
          <fieldset className='box column gap10'>
            <legend className='title yellow-title'>Firewalls</legend>

            <div className='row aic gap15'>
              <button
                className='button blue'
                disabled={!packages["security"]?.iptables?.installed}
                onClick={() => navigate("iptables/filter-table")}
              >
                IPTables
              </button>
            </div>
          </fieldset>

          <fieldset className='box column gap10'>
            <legend className='title yellow-title'>System Security</legend>

            <div className='row aic gap15'>
              <button
                className='button blue'
                disabled={!packages["security"]?.fail2ban?.installed}
              >
                Fail2Ban
              </button>
              <button
                className='button blue'
                disabled={!packages["security"]?.chkrootkit?.installed}
              >
                ChkRootKit
              </button>
              <button
                className='button blue'
                disabled={!packages["security"]?.rkhunter?.installed}
              >
                RkHunter
              </button>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
}

export default SecurityPage;
