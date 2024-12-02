import { useState } from "react";
import "./CreateNewWebApp.css";
import PropTypes from "prop-types";

function CreateNewWebApp({ onClose }) {
  const [projectDirectory, setProjectDirectory] = useState("/var/www");
  const [projectName, setProjectName] = useState("");

  return (
    <div className='create-new-web-app-modal column aic jcc'>
      <button className='close-container' onClick={onClose} />
      <div className='content column aic gap20'>
        <div className='top row aic jcsb'>
          <h3 className='purple-title'>Create New Web App</h3>
          <button className='button red' onClick={onClose}>
            Close
          </button>
        </div>
        <div className='body column aic gap20'>
          <div className='form-item column gap7'>
            <label htmlFor='project-directory'>Project Directory</label>
            <input
              type='text'
              placeholder='/var/www'
              id='project-directory'
              value={projectDirectory}
              onChange={(e) => setProjectDirectory(e.target.value)}
            />
          </div>

          <div className='form-item column gap7'>
            <label htmlFor='project-name'>Project Folder Name</label>
            <input
              type='text'
              placeholder='my-project.com'
              id='project-name'
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
        </div>
        <div className='bottom row aic jcc'>
          <button className='button green'>Create</button>
        </div>
      </div>
    </div>
  );
}

CreateNewWebApp.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default CreateNewWebApp;
