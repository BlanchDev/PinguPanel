import { toast } from "react-toastify";
import "./PassphraseMenu.css";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function PassphraseMenu({ passphraseMenu, setPassphraseMenu }) {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleEnterPassphrase = (e) => {
    e.preventDefault();
    const passphrase = e.target[0].value;
    const connectionData = { ...passphraseMenu, passphrase };
    setLoading(true);
    window.Electron.ssh
      .connectSSH(connectionData)
      .then(() => {
        setLoading(false);
        setPassphraseMenu({});
        toast.success("Connection successful");
        navigate(`/dashboard/${connectionData.id}`);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        toast.error(error.message);
      });
  };

  return (
    <div className='passphrase-menu column aic jcc gap10'>
      <button
        className='close-container'
        onClick={() => setPassphraseMenu({})}
      ></button>
      <div className='passphrase-menu-content column aic jcsb'>
        <div className='passphrase-menu-header row aic jcsb'>
          <h4>
            Connect to {passphraseMenu.host}:{passphraseMenu.port}
          </h4>
          <button className='button red' onClick={() => setPassphraseMenu({})}>
            Close
          </button>
        </div>
        <form
          className='passphrase-menu-body form-item column gap10'
          onSubmit={(e) => handleEnterPassphrase(e)}
        >
          <label htmlFor='passphrase'>Enter Passphrase</label>
          <input
            id='passphrase'
            type='password'
            placeholder='Enter passphrase for private key.'
            required
            autoFocus
          />
          <button className='button green' type='submit' disabled={loading}>
            {loading ? "Connecting..." : "Connect"}
          </button>
        </form>
      </div>
    </div>
  );
}

PassphraseMenu.propTypes = {
  passphraseMenu: PropTypes.object.isRequired,
  setPassphraseMenu: PropTypes.func.isRequired,
};

export default PassphraseMenu;
