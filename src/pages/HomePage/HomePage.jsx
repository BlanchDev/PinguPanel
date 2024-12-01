import { NavLink } from "react-router-dom";
import "./HomePage.css";
import { useEffect, useState } from "react";
import PassphraseMenu from "./components/PassphraseMenu";

function HomePage() {
  const [connections, setConnections] = useState([]);
  const [passphraseMenu, setPassphraseMenu] = useState({});

  useEffect(() => {
    window.Electron.connections.get().then(setConnections);
  }, []);

  const handleDeleteConnection = (id) => {
    window.Electron.connections.delete(id).then(() => {
      setConnections(connections.filter((connection) => connection.id !== id));
    });
  };

  return (
    <div className='home-page column gap10'>
      {Object.keys(passphraseMenu).length > 0 && (
        <PassphraseMenu
          passphraseMenu={passphraseMenu}
          setPassphraseMenu={setPassphraseMenu}
        />
      )}
      <h1>
        Welcome to <span style={{ color: "#f5db41" }}>PinguPanel</span>
      </h1>
      <div className='saved-connections column gap15'>
        <div className='saved-connections-header row aic jcsb'>
          <h3>Saved Connections</h3>
          <div className='row aic gap5'>
            <NavLink to='/save-new-connection' className='button yellow'>
              Save New SSH Connection
            </NavLink>
          </div>
        </div>
        <div className='saved-connections-list row gap10'>
          {connections.map((connection) => (
            <div className='column gap5' key={connection.id}>
              <NavLink
                to={`/connection/${connection.id}`}
                className='saved-connection column gap5'
                onClick={(e) => {
                  e.preventDefault();
                  setPassphraseMenu(connection);
                }}
              >
                <span className='name'>{connection.name}</span>
                <span className='host'>{connection.host}</span>
              </NavLink>
              <div className='w100 row aife gap5'>
                <button className='w100 button gray'>Edit</button>
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
      </div>
    </div>
  );
}

export default HomePage;
