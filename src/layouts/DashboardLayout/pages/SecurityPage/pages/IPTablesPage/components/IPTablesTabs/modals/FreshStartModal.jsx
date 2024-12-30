import PropTypes from "prop-types";
import { useState } from "react";
import ModalTemplate from "../../../../../../../../../components/modals/ModalTemplate/ModalTemplate";
import { toast } from "react-toastify";
import { useConnection } from "../../../../../../../context/DashboardLayoutContext";
import { useIPTables } from "../../../context/IPTablesContext";

function FreshStartModal({ modalClose }) {
  const [loading, setLoading] = useState(false);

  const [isFilterRules, setIsFilterRules] = useState(true);
  const [isNatRules, setIsNatRules] = useState(true);
  const [isMangleRules, setIsMangleRules] = useState(true);
  const [isRawRules, setIsRawRules] = useState(true);
  const [isSecurityRules, setIsSecurityRules] = useState(true);

  const { myConn } = useConnection();
  const { fetchRules } = useIPTables();

  const handleFreshStart = async (e) => {
    e.preventDefault();
    setLoading(true);

    let command = "";

    if (isFilterRules) {
      command += `
      # Reset filter rules
      iptables -F
      iptables -X

      # Policy
      iptables -P INPUT DROP
      iptables -P FORWARD DROP
      iptables -P OUTPUT ACCEPT

      # Create custom chains
      iptables -N SSH_SECURITY
      iptables -N WEB_SECURITY

      # Accept local and established connections
      iptables -A INPUT -i lo -j ACCEPT
      iptables -A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT

      # Bind chains to INPUT
      iptables -A INPUT -j SSH_SECURITY
      iptables -A INPUT -j WEB_SECURITY

      # SSH Security Rules (Brute force protection)
      iptables -A SSH_SECURITY -p tcp --dport ${myConn.port} -m state --state NEW -m recent --set --name SSH --mask 255.255.255.255 --rsource
      iptables -A SSH_SECURITY -p tcp --dport ${myConn.port} -m state --state NEW -m recent --update --seconds 30 --hitcount 5 --name SSH --mask 255.255.255.255 --rsource -j DROP
      iptables -A SSH_SECURITY -p tcp --dport ${myConn.port} -j ACCEPT

      # Web Security Rules
      iptables -A WEB_SECURITY -p tcp --dport 80 -j ACCEPT
      iptables -A WEB_SECURITY -p tcp --dport 443 -j ACCEPT`;
    }

    if (isNatRules) {
      command += `
      iptables -t nat -F
      iptables -t nat -X`;
    }

    if (isMangleRules) {
      command += `
      iptables -t mangle -F
      iptables -t mangle -X`;
    }

    if (isRawRules) {
      command += `
      iptables -t raw -F
      iptables -t raw -X`;
    }

    if (isSecurityRules) {
      command += `
      iptables -t security -F
      iptables -t security -X`;
    }

    try {
      const result = await window.Electron.ssh.executeCommand(command);

      if (result.success) {
        toast.success("IPTables rules hard reset successfully");
        modalClose();
      } else {
        toast.error(result.output);
      }

      const noLoading = false;
      await fetchRules(noLoading);

      return;
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalTemplate modalClose={modalClose}>
      <form
        className='modal-content column aic gap20'
        onSubmit={(e) => handleFreshStart(e)}
      >
        <div className='top row aic jcsb'>
          <h3 className='purple-title'>Do you want to fresh start?</h3>
          <button className='button red' type='button' onClick={modalClose}>
            Close
          </button>
        </div>
        <div className='body column aic gap20'>
          <div className='form-item column aic gap20'>
            <p>
              Choose what you want to reset. Fresh Start automatically adds some
              basic rules.
            </p>
            <div className='maxContentW column aic gap15'>
              <div className='form-item row aic gap5'>
                <input
                  type='checkbox'
                  id='filter-rules'
                  checked={isFilterRules}
                  onChange={() => setIsFilterRules(!isFilterRules)}
                />
                <label htmlFor='filter-rules' className='row aic'>
                  Filter Rules
                </label>
              </div>
              <div className='form-item row aic gap5'>
                <input
                  type='checkbox'
                  id='nat-rules'
                  checked={isNatRules}
                  onChange={() => setIsNatRules(!isNatRules)}
                />
                <label htmlFor='nat-rules' className='row aic'>
                  NAT Rules
                </label>
              </div>
              <div className='form-item row aic gap5'>
                <input
                  type='checkbox'
                  id='mangle-rules'
                  checked={isMangleRules}
                  onChange={() => setIsMangleRules(!isMangleRules)}
                />
                <label htmlFor='mangle-rules' className='row aic'>
                  Mangle Rules
                </label>
              </div>
              <div className='form-item row aic gap5'>
                <input
                  type='checkbox'
                  id='raw-rules'
                  checked={isRawRules}
                  onChange={() => setIsRawRules(!isRawRules)}
                />
                <label htmlFor='raw-rules' className='row aic'>
                  Raw Rules
                </label>
              </div>
              <div className='form-item row aic gap5'>
                <input
                  type='checkbox'
                  id='security-rules'
                  checked={isSecurityRules}
                  onChange={() => setIsSecurityRules(!isSecurityRules)}
                />
                <label htmlFor='security-rules' className='row aic'>
                  Security Rules
                </label>
              </div>
              <div className='form-item row aic gap5'>
                <label htmlFor='port' className='row aic'>
                  Port:
                </label>
                <p id='port' className='purple-title'>
                  {myConn.port}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='bottom row aic jcc'>
          <button className='button green' type='submit' disabled={loading}>
            {loading ? "Loading..." : "Fresh Start"}
          </button>
        </div>
      </form>
    </ModalTemplate>
  );
}

FreshStartModal.propTypes = {
  modalClose: PropTypes.func.isRequired,
};

export default FreshStartModal;
