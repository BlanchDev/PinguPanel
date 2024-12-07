import { NavLink } from "react-router-dom";
import "./HomePage.scss";
import { useEffect, useState } from "react";
import PassphraseMenu from "./components/modals/PassphraseMenu/PassphraseMenu";
import EditConnectionModal from "./components/modals/EditConnectionModal/EditConnectionModal";
import { motion } from "framer-motion";
import { useMotion } from "../../layouts/AppLayout/context/Context";

function HomePage() {
  const [connections, setConnections] = useState([]);
  const [passphraseMenu, setPassphraseMenu] = useState({});
  const [safeConnection, setSafeConnection] = useState({});

  const { isLoginAnimation, isLogoutAnimation, setIsLogoutAnimation } =
    useMotion();

  //TODO: .ENV FILE WARNING MODAL. Users need change the ENCRYPTION_KEY in .env file.

  useEffect(() => {
    window.Electron.connections.getConnections().then((data) => {
      if (data.success) {
        setConnections(data.connections);
      }
    });
  }, [safeConnection]);

  const handleDeleteConnection = (id) => {
    window.Electron.connections.deleteConnection(id).then(() => {
      setConnections(connections.filter((connection) => connection.id !== id));
    });
  };

  const animation = () => {
    if (isLoginAnimation) {
      return {
        initial: { opacity: 1, y: 0, scale: 1 },
        animate: { opacity: 0, y: -125, scale: 0.85 },
        transition: { duration: 0.5, ease: "easeOut" },
      };
    }

    if (isLogoutAnimation) {
      return {
        initial: { opacity: 0, y: -125, scale: 0.85 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.5, ease: "easeOut" },
        onAnimationComplete: () => {
          setIsLogoutAnimation(false);
        },
      };
    }

    return {};
  };

  return (
    <motion.div className='home-page column gap10' {...animation()}>
      <fieldset className='box-container column gap15'>
        <legend className='title'>Saved Connections</legend>
        <div className='header-buttons w100 row-reverse aic jcsb'>
          <NavLink to='/save-new-connection' className='button yellow'>
            Save New SSH Connection
          </NavLink>
        </div>
        <div className='gridauto gap20'>
          {connections?.map((connection) => (
            <div className='column gap5' key={connection.id}>
              <button
                className='saved-connection column gap5'
                onClick={(e) => {
                  e.preventDefault();
                  setPassphraseMenu(connection);
                }}
                style={
                  passphraseMenu.id === connection.id
                    ? { backgroundColor: "#103e10" }
                    : {}
                }
              >
                <span className='name yellow-title'>{connection.name}</span>
                <span className='host'>{connection.host}</span>
              </button>
              <div className='w100 row aife gap5'>
                <button
                  className='w100 button gray'
                  onClick={() =>
                    setSafeConnection(() => {
                      const safeConnection = { ...connection };
                      delete safeConnection.privateKey;
                      return safeConnection;
                    })
                  }
                >
                  Edit
                </button>
                <button
                  className='w100 button gray'
                  onClick={() => handleDeleteConnection(connection.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </fieldset>
      {/* MODALS */}
      {Object.keys(safeConnection).length > 0 && (
        <EditConnectionModal
          safeConnection={safeConnection}
          modalClose={() => setSafeConnection({})}
        />
      )}
      {Object.keys(passphraseMenu).length > 0 && (
        <PassphraseMenu
          passphraseMenu={passphraseMenu}
          setPassphraseMenu={setPassphraseMenu}
        />
      )}
    </motion.div>
  );
}

export default HomePage;
