const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("Electron", {
  settings: {
    getWinSize: () => ipcRenderer.invoke("getWinSize"),
    setWinSize: (size) => ipcRenderer.invoke("setWinSize", size),
  },
  connections: {
    getConnections: () => ipcRenderer.invoke("get-connections"),
    addConnection: (connection) =>
      ipcRenderer.invoke("add-connection", connection),
    deleteConnection: (id) => ipcRenderer.invoke("delete-connection", id),
    editConnection: (id, data) =>
      ipcRenderer.invoke("edit-connection", id, data),
  },
  ssh: {
    // SSH
    getActiveSSHConnection: () =>
      ipcRenderer.invoke("get-active-ssh-connection"),
    connectSSH: (connectionData) =>
      ipcRenderer.invoke("connect-ssh", connectionData),
    executeCommand: (command) => ipcRenderer.invoke("execute-command", command),
    disconnectSSH: () => ipcRenderer.invoke("disconnect-ssh"),

    // WebSocket
    createWsStream: (command, streamId) =>
      ipcRenderer.invoke("create-ws-stream", { command, streamId }),

    closeWsStream: (streamId) =>
      ipcRenderer.invoke("close-ws-stream", streamId),

    onWsData: (streamId, callback) => {
      const remove = ipcRenderer.on(`ws-data-${streamId}`, (_, data) =>
        callback(data),
      );
      return () => remove();
    },

    onWsError: (streamId, callback) => {
      const remove = ipcRenderer.on(`ws-error-${streamId}`, (_, error) =>
        callback(error),
      );
      return () => remove();
    },

    onWsClose: (streamId, callback) => {
      const remove = ipcRenderer.on(`ws-close-${streamId}`, () => callback());
      return () => remove();
    },
  },
});
