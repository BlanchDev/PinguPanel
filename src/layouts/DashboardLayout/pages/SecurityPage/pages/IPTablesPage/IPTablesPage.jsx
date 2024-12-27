import BreadCrumbs from "../../../../../../components/BreadCrumbs/BreadCrumbs";
import "./IPTablesPage.scss";
import IPTablesTabs from "./components/IPTablesTabs/IPTablesTabs";
import FilterTable from "./components/FilterTable/FilterTable";
import NatTable from "./components/NatTable/NatTable";
import { useIPTables } from "./context/IPTablesContext";

function IPTablesPage() {
  const { activeTab, setActiveTab, isLoading } = useIPTables();

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
      <IPTablesTabs currentTab={activeTab} setActiveTab={setActiveTab} />
      <div className='iptables-page column w100 h100'>
        <div className='iptables-content'>
          {activeTab === "filter" && <FilterTable />}
          {activeTab === "nat" && <NatTable />}
        </div>
      </div>
    </div>
  );
}

export default IPTablesPage;
