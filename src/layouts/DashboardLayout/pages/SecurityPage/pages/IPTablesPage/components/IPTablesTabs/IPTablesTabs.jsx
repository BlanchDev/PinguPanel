import { useState } from "react";
import "./IPTablesTabs.scss";
import { toast } from "react-toastify";
import FreshStartModal from "./modals/FreshStartModal";
import TopNavBar from "../../../../../../../../components/TopNavBar/TopNavBar";
import { useParams } from "react-router-dom";

function IPTablesTabs() {
  const [freshStartModal, setFreshStartModal] = useState(false);

  const { connectionId } = useParams();

  const handleSave = async () => {
    try {
      const result = await window.Electron.ssh.executeCommand(
        "netfilter-persistent save",
      );
      if (result.success) {
        toast.success("IPTables rules saved successfully");
      } else {
        toast.error(result.output);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const buttons = [
    {
      text: "Filter",
      type: "navlink",
      link: `/dashboard/${connectionId}/security/iptables/filter-table`,
    },
    {
      text: "NAT",
      type: "navlink",
      link: `/dashboard/${connectionId}/security/iptables/nat-table`,
    },
    {
      text: "Mangle",
      type: "navlink",
      link: `/dashboard/${connectionId}/security/iptables/mangle-table`,
    },
    {
      text: "Raw",
      type: "navlink",
      link: `/dashboard/${connectionId}/security/iptables/raw-table`,
    },
    {
      text: "Security",
      type: "navlink",
      link: `/dashboard/${connectionId}/security/iptables/security-table`,
    },
  ];

  return (
    <TopNavBar buttons={buttons} direction='row' styleTop='40px'>
      <div className='right-container row aic gap10'>
        <button className='button green' onClick={handleSave}>
          Save Now
        </button>
        {/* TODO: Docker varsa resetlerken hangi kodları çalıştıracağımızı belirt. Seçim yaptır. nat kuralları silinsin mi silinmesin mi? */}
        <button
          className='button orange'
          onClick={() => setFreshStartModal(true)}
        >
          Fresh Start
        </button>
      </div>
      {freshStartModal && (
        <FreshStartModal modalClose={() => setFreshStartModal(false)} />
      )}
    </TopNavBar>
  );
}

export default IPTablesTabs;
