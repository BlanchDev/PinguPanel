const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("Electron", {
  connections: {
    get: () => ipcRenderer.invoke("get-connections"),
    add: (connection) => ipcRenderer.invoke("add-connection", connection),
    delete: (id) => ipcRenderer.invoke("delete-connection", id),
  },
  ssh: {
    // Mevcut metodlar
    connectSSH: (connectionData) =>
      ipcRenderer.invoke("connect-ssh", connectionData),
    executeCommand: (command) => ipcRenderer.invoke("execute-command", command),
    disconnectSSH: () => ipcRenderer.invoke("disconnect-ssh"),

    // Güncellenen WebSocket metodları
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
