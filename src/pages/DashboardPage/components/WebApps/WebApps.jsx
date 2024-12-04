import { useState, useEffect } from "react";
import "./WebApps.scss";
import CreateNewWebApp from "./components/modals/CreateNewWebApp/CreateNewWebApp";
import SelectDirectory from "./components/modals/SelectDirectory/SelectDirectory";
import SitesTable from "./components/SitesTable/SitesTable";
import { useWebApps } from "../../context/Context";

function WebApps() {
  const [createNewWebAppModalOpen, setCreateNewWebAppModalOpen] =
    useState(false);
  const [selectedDirectoryModalOpen, setSelectedDirectoryModalOpen] =
    useState(false);

  const {
    webAppsDirectory,
    myConnLoading,
    myWebAppsLoading,
    setMyWebAppsLoading,
  } = useWebApps();

  useEffect(() => {
    if (!webAppsDirectory) {
      setMyWebAppsLoading(false);
    }
  }, [webAppsDirectory, setMyWebAppsLoading]);

  return (
    <>
      {myConnLoading ? (
        <div className='info-item column gap10'>
          <h2 className='yellow-title'>Web Apps</h2>
          <div className='info-content column aic jcc'>
            <div className='loading-spinner' />
          </div>
        </div>
      ) : (
        <div className='info-item column gap25'>
          <div className='row aic jcsb'>
            <div className='row aic gap10'>
              <h2 className='yellow-title'>Web Apps</h2>
              <button
                className='button purple'
                onClick={() => setSelectedDirectoryModalOpen(true)}
                disabled={myWebAppsLoading}
              >
                {webAppsDirectory || "*Select Directory"}
              </button>
            </div>
            <button
              className='button yellow'
              onClick={() => setCreateNewWebAppModalOpen(true)}
              disabled={!webAppsDirectory || myWebAppsLoading}
            >
              Create New Web App
            </button>
          </div>
          <div className='info-content column gap5'>
            {webAppsDirectory ? (
              <SitesTable />
            ) : (
              <div className='empty-state'>Please select a directory</div>
            )}
          </div>
          {/* MODALS */}
          {selectedDirectoryModalOpen && (
            <SelectDirectory
              modalClose={() => setSelectedDirectoryModalOpen(false)}
            />
          )}
          {createNewWebAppModalOpen && (
            <CreateNewWebApp
              modalClose={() => setCreateNewWebAppModalOpen(false)}
            />
          )}
        </div>
      )}
    </>
  );
}

export default WebApps;
