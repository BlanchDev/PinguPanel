import PropTypes from "prop-types";
import { useState } from "react";
import ModalTemplate from "../../../../../../../components/modals/ModalTemplate/ModalTemplate";
import useCRUDIPTables from "../hooks/useCRUDIPTables";

function AddParentOrChildModal({ modalClose, tableType, target, chainName }) {
  const [loading, setLoading] = useState(false);
  const [rule, setRule] = useState("");

  const { handleCreateRule } = useCRUDIPTables();

  const handleSubmitAddParentOrChild = async (e) => {
    e.preventDefault();
    setLoading(true);

    let ruleCommand = "";

    ruleCommand =
      target === "parent"
        ? `-A ${rule} -j ${chainName}`
        : `-A ${chainName} -j ${rule}`;

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
        onSubmit={(e) => handleSubmitAddParentOrChild(e)}
      >
        {target === "parent" && (
          <>
            <div className='top row aic jcsb'>
              <h3 className='purple-title'>Add Parent to {chainName}</h3>
              <button className='button red' type='button' onClick={modalClose}>
                Close
              </button>
            </div>
            <div className='body column aic gap20'>
              <div className='form-item column gap7'>
                <label htmlFor='parent-name'>Parent Name</label>
                <input
                  autoFocus
                  required
                  type='text'
                  value={rule}
                  onChange={(e) => setRule(e.target.value)}
                  placeholder='INPUT'
                  id='parent-name'
                />
                {tableType === "filter" && (
                  <code>
                    iptables -A {rule || "`RULE`"} -j {chainName}
                  </code>
                )}
                {tableType === "nat" && (
                  <code>
                    iptables -t nat -A {rule || "`RULE`"} -j {chainName}
                  </code>
                )}
                {tableType === "mangle" && (
                  <code>
                    iptables -t mangle -A {rule || "`RULE`"} -j {chainName}
                  </code>
                )}
                {tableType === "raw" && (
                  <code>
                    iptables -t raw -A {rule || "`RULE`"} -j {chainName}
                  </code>
                )}
                {tableType === "security" && (
                  <code>
                    iptables -t security -A {rule || "`RULE`"} -j {chainName}
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

        {target === "child" && (
          <>
            <div className='top row aic jcsb'>
              <h3 className='purple-title'>Add Child to {chainName}</h3>
              <button className='button red' type='button' onClick={modalClose}>
                Close
              </button>
            </div>
            <div className='body column aic gap20'>
              <div className='form-item column gap7'>
                <label htmlFor='child-name'>Child Name</label>
                <input
                  autoFocus
                  required
                  type='text'
                  value={rule}
                  onChange={(e) => setRule(e.target.value)}
                  placeholder='MY_CHILD'
                  id='child-name'
                />
                {tableType === "filter" && (
                  <code>
                    iptables -A {chainName} -j {rule || "`RULE`"}
                  </code>
                )}
                {tableType === "nat" && (
                  <code>
                    iptables -t nat -A {chainName} -j {rule || "`RULE`"}
                  </code>
                )}
                {tableType === "mangle" && (
                  <code>
                    iptables -t mangle -A {chainName} -j {rule || "`RULE`"}
                  </code>
                )}
                {tableType === "raw" && (
                  <code>
                    iptables -t raw -A {chainName} -j {rule || "`RULE`"}
                  </code>
                )}
                {tableType === "security" && (
                  <code>
                    iptables -t security -A {chainName} -j {rule || "`RULE`"}
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
      </form>
    </ModalTemplate>
  );
}

AddParentOrChildModal.propTypes = {
  modalClose: PropTypes.func.isRequired,
  tableType: PropTypes.string.isRequired,
  target: PropTypes.string.isRequired,
  chainName: PropTypes.string.isRequired,
};

export default AddParentOrChildModal;
