const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("Electron", {
  // Bağlantı işlemleri
  connections: {
    get: () => ipcRenderer.invoke("get-connections"),
    add: (connection) => ipcRenderer.invoke("add-connection", connection),
    delete: (id) => ipcRenderer.invoke("delete-connection", id),
  },
  ssh: {
    connect: (connectionData) =>
      ipcRenderer.invoke("connect-ssh", connectionData),
  },
});
