import { ipcMain } from "electron";
import fs from "fs/promises";
import { CONNECTIONS_FILE, initStorage } from "./storageHandler.js";

export async function setupConnectionHandlers() {
  await initStorage();

  ipcMain.handle("get-connections", async () => {
    try {
      const data = await fs.readFile(CONNECTIONS_FILE, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Bağlantılar okunamadı:", error);
      return [];
    }
  });

  ipcMain.handle("add-connection", async (_, connection) => {
    try {
      const data = await fs.readFile(CONNECTIONS_FILE, "utf8");
      const connections = JSON.parse(data);
      connections.push(connection);
      await fs.writeFile(
        CONNECTIONS_FILE,
        JSON.stringify(connections, null, 2),
      );
      return true;
    } catch (error) {
      console.error("Bağlantı eklenemedi:", error);
      return false;
    }
  });

  ipcMain.handle("delete-connection", async (_, id) => {
    try {
      const data = await fs.readFile(CONNECTIONS_FILE, "utf8");
      const connections = JSON.parse(data);
      const newConnections = connections.filter((conn) => conn.id !== id);
      await fs.writeFile(
        CONNECTIONS_FILE,
        JSON.stringify(newConnections, null, 2),
      );
      return true;
    } catch (error) {
      console.error("Bağlantı silinemedi:", error);
      return false;
    }
  });
}
