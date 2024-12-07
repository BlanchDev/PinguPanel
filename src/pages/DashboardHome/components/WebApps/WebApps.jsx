import { useState, useEffect } from "react";
import "./WebApps.scss";
import CreateNewWebApp from "./components/modals/CreateNewWebApp/CreateNewWebApp";
import SelectDirectory from "./components/modals/SelectDirectory/SelectDirectory";
import SitesTable from "./components/SitesTable/SitesTable";
import { useWebApps } from "../../../../layouts/DashboardLayout/context/Context";

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
        <fieldset className='box column gap10'>
          <legend className='title yellow-title'>Web Apps</legend>
          <div className='content column aic jcc gap25'>
            <div className='loading-spinner' />
            <p>Loading web apps...</p>
          </div>
        </fieldset>
      ) : (
        <fieldset className='box column gap25'>
          <legend className='title yellow-title'>Web Apps</legend>
          <div className='row aic jcsb'>
            <button
              className='button purple'
              onClick={() => setSelectedDirectoryModalOpen(true)}
              disabled={myWebAppsLoading}
            >
              {webAppsDirectory || "*Select Directory"}
            </button>

            <button
              className='button yellow'
              onClick={() => setCreateNewWebAppModalOpen(true)}
              disabled={!webAppsDirectory || myWebAppsLoading}
            >
              Create New Web App
            </button>
          </div>
          <div className='content column gap5'>
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
        </fieldset>
      )}
    </>
  );
}

export default WebApps;
