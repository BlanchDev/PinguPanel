import BreadCrumbs from "../../../../../../components/BreadCrumbs/BreadCrumbs";
import "./IPTablesPage.scss";
import IPTablesTabs from "./components/IPTablesTabs/IPTablesTabs";
import { useIPTables } from "./context/IPTablesContext";
import IPTablesTable from "./components/IPTablesTable/IPTablesTable";
import { useParams } from "react-router-dom";

function IPTablesPage() {
  const {
    isLoading,
    filterRules,
    natRules,
    mangleRules,
    rawRules,
    securityRules,
  } = useIPTables();

  const { iptablesTable } = useParams();

  if (isLoading) {
    return (
      <div className='dashboard-layout-page'>
        <div className='box-container noborder column aic jcc gap10 w100 h100'>
          <div className='loading-spinner' />
          <p>IPTables Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='dashboard-layout-page'>
      <BreadCrumbs />
      <IPTablesTabs />
      <div className='iptables-page column w100 h100'>
        <div className='iptables-content'>
          {iptablesTable === "filter-table" && (
            <IPTablesTable tableType='filter' tableRules={filterRules} />
          )}
          {iptablesTable === "nat-table" && (
            <IPTablesTable tableType='nat' tableRules={natRules} />
          )}
          {iptablesTable === "mangle-table" && (
            <IPTablesTable tableType='mangle' tableRules={mangleRules} />
          )}
          {iptablesTable === "raw-table" && (
            <IPTablesTable tableType='raw' tableRules={rawRules} />
          )}
          {iptablesTable === "security-table" && (
            <IPTablesTable tableType='security' tableRules={securityRules} />
          )}
        </div>
      </div>
    </div>
  );
}

export default IPTablesPage;
