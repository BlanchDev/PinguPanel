import PropTypes from "prop-types";
import { useState } from "react";
import ModalTemplate from "../../../../../../../../../components/modals/ModalTemplate/ModalTemplate";
import useCRUDFilterTable from "../hooks/useCRUDFilterTable";

function AddParentOrChildModal({ modalClose, target, chainName }) {
  const [loading, setLoading] = useState(false);
  const [rule, setRule] = useState("");

  const { handleCreateRule } = useCRUDFilterTable();

  const handleSubmitAddParentOrChild = async (e) => {
    e.preventDefault();
    setLoading(true);

    let ruleCommand = "";

    ruleCommand =
      target === "parent"
        ? `-A ${rule} -j ${chainName}`
        : `-A ${chainName} -j ${rule}`;

    handleCreateRule(ruleCommand)
      .then(() => {
        modalClose();
      })
      .finally(() => {
        setLoading(false);
      });
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
                <label htmlFor='window-size'>Parent Name</label>
                <input
                  autoFocus
                  type='text'
                  value={rule}
                  onChange={(e) => setRule(e.target.value)}
                  placeholder='INPUT'
                />
                <code>
                  iptables -A {rule || "`RULE`"} -j {chainName}
                </code>
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
                <label htmlFor='window-size'>Child Name</label>
                <input
                  autoFocus
                  type='text'
                  value={rule}
                  onChange={(e) => setRule(e.target.value)}
                  placeholder='MY_CHILD'
                />
                <code>
                  iptables -A {chainName} -j {rule || "`RULE`"}
                </code>
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
  target: PropTypes.string.isRequired,
  chainName: PropTypes.string.isRequired,
};

export default AddParentOrChildModal;
