import { NavLink } from "react-router-dom";
import "./HomePage.scss";
import { useEffect, useState } from "react";
import PassphraseMenu from "./components/PassphraseMenu";

function HomePage() {
  const [connections, setConnections] = useState([]);
  const [passphraseMenu, setPassphraseMenu] = useState({});

  useEffect(() => {
    window.Electron.connections.getConnections().then((data) => {
      if (data.success) {
        setConnections(data.connections);
      }
    });
  }, []);

  const handleDeleteConnection = (id) => {
    window.Electron.connections.deleteConnection(id).then(() => {
      setConnections(connections.filter((connection) => connection.id !== id));
    });
  };

  return (
    <div className='home-page column gap10'>
      <h1>
        Welcome to{" "}
        <span
          style={{
            color: "#f5db41",
            textShadow: "0px 0px 20px #000",
          }}
        >
          PinguPanel
        </span>
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
                <span className='host'>
                  {connection.host}:{connection.port}
                </span>
                <span className='username'>{connection.username}</span>
              </button>
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
