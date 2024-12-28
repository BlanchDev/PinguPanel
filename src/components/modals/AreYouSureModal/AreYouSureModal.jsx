import { useState } from "react";
import PropTypes from "prop-types";
import ModalTemplate from "../ModalTemplate/ModalTemplate";

function AreYouSureModal({
  modalClose,
  title,
  description,
  buttonText,
  handleConfirm,
}) {
  const [loading, setLoading] = useState(false);

  return (
    <ModalTemplate modalClose={modalClose}>
      <form
        className='modal-content column aic gap50'
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);

          try {
            await handleConfirm(e);
            modalClose();
          } finally {
            setLoading(false);
          }
        }}
      >
        <div className='top row aic jcsb'>
          <h3 className='purple-title'>{title}</h3>
          <button className='button red' type='button' onClick={modalClose}>
            Close
          </button>
        </div>
        <div className='body column aic gap20'>
          <div className='form-item column aic jcc gap7'>
            <p>{description}</p>
          </div>
        </div>
        <div className='bottom row aic jcc gap50'>
          <button className='button red' type='submit' disabled={loading}>
            {loading ? "Loading..." : buttonText}
          </button>

          <button className='button green' type='button' onClick={modalClose}>
            Cancel
          </button>
        </div>
      </form>
    </ModalTemplate>
  );
}

AreYouSureModal.propTypes = {
  modalClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  handleConfirm: PropTypes.func.isRequired,
};

export default AreYouSureModal;
