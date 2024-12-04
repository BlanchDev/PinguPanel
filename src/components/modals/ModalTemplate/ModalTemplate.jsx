import "./ModalTemplate.scss";
import PropTypes from "prop-types";

function ModalTemplate({ children, modalClose }) {
  return (
    <div className='modal-template column aic jcc'>
      <button className='close-container' onClick={modalClose} />
      {children}
    </div>
  );
}

ModalTemplate.propTypes = {
  children: PropTypes.node.isRequired,
  modalClose: PropTypes.func.isRequired,
};

export default ModalTemplate;
