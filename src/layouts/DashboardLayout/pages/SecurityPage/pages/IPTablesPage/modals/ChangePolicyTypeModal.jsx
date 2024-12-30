import PropTypes from "prop-types";
import { useState } from "react";
import ModalTemplate from "../../../../../../../components/modals/ModalTemplate/ModalTemplate";
import useCRUDIPTables from "../hooks/useCRUDIPTables";

function ChangePolicyTypeModal({ modalClose, tableType, policyName }) {
  const [loading, setLoading] = useState(false);
  const [policyType, setPolicyType] = useState("ACCEPT");

  const { handleChangePolicyType } = useCRUDIPTables();

  const handleSubmitChangePolicyType = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await handleChangePolicyType(
        tableType,
        policyName,
        policyType,
      );
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
        onSubmit={(e) => handleSubmitChangePolicyType(e)}
      >
        <div className='top row aic jcsb'>
          <h3 className='purple-title'>Change Policy Type | {policyName}</h3>
          <button className='button red' type='button' onClick={modalClose}>
            Close
          </button>
        </div>
        <div className='body column aic gap20'>
          <div className='form-item column gap7'>
            <label htmlFor='window-size'>Policy Target</label>
            <select
              value={policyType}
              onChange={(e) => setPolicyType(e.target.value)}
            >
              <option value='ACCEPT'>ACCEPT</option>
              <option value='DROP'>DROP</option>
              <option value='REJECT'>REJECT</option>
              <option value='RETURN'>RETURN</option>
            </select>
          </div>
        </div>
        <div className='bottom row aic jcc'>
          <button className='button green' type='submit' disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </ModalTemplate>
  );
}

ChangePolicyTypeModal.propTypes = {
  modalClose: PropTypes.func.isRequired,
  tableType: PropTypes.string.isRequired,
  policyName: PropTypes.string,
};

export default ChangePolicyTypeModal;
