import { toast } from "react-toastify";
import "./PassphraseMenu.scss";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalTemplate from "../../../../../../../components/modals/ModalTemplate/ModalTemplate";
import { useMotion } from "../../../../../context/AppLayoutContext";

function PassphraseMenu({ passphraseMenu, setPassphraseMenu }) {
  const [passphrase, setPassphrase] = useState("");
  const [loading, setLoading] = useState(false);
  const { setIsLoginAnimation } = useMotion();

  const navigate = useNavigate();

  const handleEnterPassphrase = (e) => {
    e.preventDefault();
    const connectionData = { ...passphraseMenu, passphrase };
    setLoading(true);
    window.Electron.ssh
      .connectSSH(connectionData)
      .then(() => {
        setLoading(false);
        setPassphraseMenu({});
        setPassphrase("");

        setIsLoginAnimation(true);

        setTimeout(() => {
          navigate(`/dashboard/${connectionData.id}/dashboard-home`, {
            replace: true,
          });
        }, 500);
      })
      .catch((error) => {
        setLoading(false);
        setPassphrase("");
        toast.error(error.message);
      });
  };

  return (
    <ModalTemplate modalClose={() => setPassphraseMenu({})}>
      <form
        className='modal-content passphrase-menu-content column aic gap20'
        onSubmit={(e) => handleEnterPassphrase(e)}
      >
        <div className='top row aic jcsb'>
          <h3 className='purple-title'>Connect to {passphraseMenu.name}</h3>
          <button
            className='button red'
            type='button'
            onClick={() => setPassphraseMenu({})}
          >
            Close
          </button>
        </div>
        <div className='body passphrase-menu-body form-item column gap10'>
          <label htmlFor='passphrase'>Enter Passphrase</label>
          <input
            id='passphrase'
            type='password'
            placeholder='Enter passphrase for private key.'
            value={passphrase}
            onChange={(e) => {
              setPassphrase(e.target.value);
              fetch(`/dashboard/${passphraseMenu.id}`);
            }}
            required
            autoFocus
          />
        </div>
        <div className='bottom row aic jcc'>
          <button className='button green' type='submit' disabled={loading}>
            {loading ? "Connecting..." : "Connect"}
          </button>
        </div>
      </form>
    </ModalTemplate>
  );
}

PassphraseMenu.propTypes = {
  passphraseMenu: PropTypes.object.isRequired,
  setPassphraseMenu: PropTypes.func.isRequired,
};

export default PassphraseMenu;
