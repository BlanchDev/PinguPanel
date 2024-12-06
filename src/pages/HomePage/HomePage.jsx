import { NavLink } from "react-router-dom";
import "./HomePage.scss";
import { useEffect, useState } from "react";
import PassphraseMenu from "./components/modals/PassphraseMenu/PassphraseMenu";
import EditConnectionModal from "./components/modals/EditConnectionModal/EditConnectionModal";

function HomePage() {
  const [connections, setConnections] = useState([]);
  const [passphraseMenu, setPassphraseMenu] = useState({});
  const [safeConnection, setSafeConnection] = useState({});

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

  return (
    <div className='home-page column gap10'>
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
    </div>
  );
}

export default HomePage;
