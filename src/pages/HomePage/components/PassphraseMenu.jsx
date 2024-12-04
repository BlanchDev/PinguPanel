import { toast } from "react-toastify";
import "./PassphraseMenu.scss";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalTemplate from "../../../components/modals/ModalTemplate/ModalTemplate";

function PassphraseMenu({ passphraseMenu, setPassphraseMenu }) {
  const [passphrase, setPassphrase] = useState("");
  const [loading, setLoading] = useState(false);

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
        toast.success("Connection successful");
        setPassphrase("");
        navigate(`/dashboard/${connectionData.id}`);
      })
      .catch((error) => {
        setLoading(false);
        setPassphrase("");
        console.log(error);
        toast.error(error.message);
      });
  };

  return (
    <ModalTemplate modalClose={() => setPassphraseMenu({})}>
      <form
        className='modal-content passphrase-menu-content column aic jcsb'
        onSubmit={(e) => handleEnterPassphrase(e)}
      >
        <div className='passphrase-menu-header row aic jcsb'>
          <h4>
            Connect to {passphraseMenu.host}:{passphraseMenu.port}
          </h4>
          <button
            className='button red'
            type='button'
            onClick={() => setPassphraseMenu({})}
          >
            Close
          </button>
        </div>
        <div className='passphrase-menu-body form-item column gap10'>
          <label htmlFor='passphrase'>Enter Passphrase</label>
          <input
            id='passphrase'
            type='password'
            placeholder='Enter passphrase for private key.'
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            required
            autoFocus
          />
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
