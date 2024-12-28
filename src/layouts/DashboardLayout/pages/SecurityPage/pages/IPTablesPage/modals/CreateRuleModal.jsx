import PropTypes from "prop-types";
import { useState } from "react";
import ModalTemplate from "../../../../../../../components/modals/ModalTemplate/ModalTemplate";
import useCRUDIPTables from "../hooks/useCRUDIPTables";

function CreateRuleModal({ modalClose, tableType, ruleType, chainName }) {
  const [loading, setLoading] = useState(false);
  const [rule, setRule] = useState("");

  const { handleCreateRule } = useCRUDIPTables();

  const handleSubmitCreateRule = async (e) => {
    e.preventDefault();
    setLoading(true);

    const ruleCommand = `-${ruleType} ${chainName || ""} ${rule}`;

    try {
      const result = await handleCreateRule(tableType, ruleCommand);
      if (result) {
        modalClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalTemplate modalClose={modalClose}>
      <form
        className='modal-content column aic gap20'
        onSubmit={(e) => handleSubmitCreateRule(e)}
      >
        {ruleType === "A" && (
          <>
            <div className='top row aic jcsb'>
              <h3 className='purple-title'>Create Rule for {chainName}</h3>
              <button className='button red' type='button' onClick={modalClose}>
                Close
              </button>
            </div>
            <div className='body column aic gap20'>
              <div className='form-item column gap7'>
                <label htmlFor='window-size'>Rule</label>
                <input
                  autoFocus
                  required
                  type='text'
                  value={rule}
                  onChange={(e) => setRule(e.target.value)}
                  placeholder='-s 192.168.1.1 -j ACCEPT'
                />
                {tableType === "filter" && (
                  <code>
                    iptables -A {chainName} {rule || "`RULE`"}
                  </code>
                )}
                {tableType === "nat" && (
                  <code>
                    iptables -t nat -A {chainName} {rule || "`RULE`"}
                  </code>
                )}
              </div>
            </div>
            <div className='bottom row aic jcc'>
              <button className='button green' type='submit' disabled={loading}>
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </>
        )}

        {ruleType === "N" && (
          <>
            <div className='top row aic jcsb'>
              <h3 className='purple-title'>Create New Custom Chain</h3>
              <button className='button red' type='button' onClick={modalClose}>
                Close
              </button>
            </div>
            <div className='body column aic gap20'>
              <div className='form-item column gap7'>
                <label htmlFor='window-size'>Chain Name</label>
                <input
                  autoFocus
                  required
                  type='text'
                  value={rule}
                  onChange={(e) => setRule(e.target.value)}
                  placeholder='MY_CHAIN'
                />
                {tableType === "filter" && (
                  <code>iptables -N {rule || "`RULE`"}</code>
                )}
                {tableType === "nat" && (
                  <code>iptables -t nat -N {rule || "`RULE`"}</code>
                )}
              </div>
            </div>
            <div className='bottom row aic jcc'>
              <button className='button green' type='submit' disabled={loading}>
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </>
        )}
      </form>
    </ModalTemplate>
  );
}

CreateRuleModal.propTypes = {
  modalClose: PropTypes.func.isRequired,
  tableType: PropTypes.string.isRequired,
  ruleType: PropTypes.string.isRequired,
  chainName: PropTypes.string,
};

export default CreateRuleModal;
