import { useNavigate } from "react-router-dom";
import "./SaveNewConnectionPage.css";
import { useState } from "react";
function SaveNewConnectionPage() {
  const [serverData, setServerData] = useState({
    id: crypto.randomUUID(),
    name: "",
    host: "",
    port: "22",
    username: "",
    privateKey: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isSaved = await window.Electron.connections.add(serverData);

    if (isSaved) {
      navigate("/");
    } else {
      alert("Failed to save server data");
    }
  };

  return (
    <div className='save-new-connection-page column'>
      <form
        className='save-new-connection-form column gap10'
        onSubmit={handleSubmit}
      >
        <div className='row aic gap10 w100'>
          <div className='form-item column gap5'>
            <label htmlFor='name'>Server Name</label>
            <input
              type='text'
              id='name'
              placeholder='My Web Server'
              value={serverData.name}
              required
              onChange={(e) =>
                setServerData({ ...serverData, name: e.target.value })
              }
            />
          </div>
          <div className='form-item column gap5'>
            <label htmlFor='host'>Host</label>
            <input
              type='text'
              id='host'
              placeholder='123.456.789.100'
              value={serverData.host}
              required
              onChange={(e) =>
                setServerData({ ...serverData, host: e.target.value })
              }
            />
          </div>
          <div className='form-item column gap5'>
            <label htmlFor='port'>Port</label>
            <input
              type='text'
              id='port'
              placeholder='22'
              value={serverData.port}
              required
              onChange={(e) =>
                setServerData({ ...serverData, port: e.target.value })
              }
            />
          </div>
          <div className='form-item column gap5'>
            <label htmlFor='username'>Username</label>
            <input
              type='text'
              id='username'
              placeholder='root'
              value={serverData.username}
              required
              onChange={(e) =>
                setServerData({ ...serverData, username: e.target.value })
              }
            />
          </div>
        </div>
        <div className='form-item column gap5'>
          <label htmlFor='privateKey'>Private SSH Key</label>
          <textarea
            id='privateKey'
            placeholder='Enter server private SSH key'
            value={serverData.privateKey}
            required
            onChange={(e) =>
              setServerData({ ...serverData, privateKey: e.target.value })
            }
            rows={10}
          />
        </div>
        <button className='button yellow' type='submit'>
          Save
        </button>
      </form>
    </div>
  );
}

export default SaveNewConnectionPage;
