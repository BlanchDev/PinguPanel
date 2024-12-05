import { ipcMain } from "electron";
import fs from "fs/promises";
import { CONNECTIONS_FILE, initStorage } from "./storageHandler.js";
import { encrypt, decrypt } from "../utils/encryption.js";

export async function setupConnectionHandlers() {
  await initStorage();

  ipcMain.handle("get-connections", async () => {
    try {
      const fileData = await fs.readFile(CONNECTIONS_FILE, "utf8");
      if (!fileData) return { success: true, connections: [] };

      const connections = await decrypt(fileData);
      console.log("Read connections:", connections.length);
      return { success: true, connections };
    } catch (error) {
      console.error("Failed to retrieve connections:", error);
      return { success: true, connections: [] };
    }
  });

  ipcMain.handle("add-connection", async (_, connection) => {
    try {
      let connections = [];
      try {
        const fileData = await fs.readFile(CONNECTIONS_FILE, "utf8");
        if (fileData) {
          connections = await decrypt(fileData);
        }
      } catch {
        console.log("Failed to read existing connections, creating a new list");
      }

      if (!Array.isArray(connections)) {
        connections = [];
      }

      connections.push(connection);
      console.log("Connections to be saved:", connections.length);

      const encryptedData = await encrypt(connections);
      await fs.writeFile(CONNECTIONS_FILE, encryptedData);

      const verifyData = await fs.readFile(CONNECTIONS_FILE, "utf8");
      const verifiedConnections = await decrypt(verifyData);
      console.log(
        "Connections after verification:",
        verifiedConnections.length,
      );

      return { success: true, connections: verifiedConnections };
    } catch (error) {
      console.error("Failed to add connection:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("delete-connection", async (_, id) => {
    try {
      const fileData = await fs.readFile(CONNECTIONS_FILE, "utf8");
      const connections = await decrypt(fileData);
      const newConnections = connections.filter((conn) => conn.id !== id);
      const encryptedData = await encrypt(newConnections);
      await fs.writeFile(CONNECTIONS_FILE, encryptedData);
      return { success: true };
    } catch (error) {
      console.error("Failed to delete connection:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("edit-connection", async (_, id, data) => {
    try {
      const fileData = await fs.readFile(CONNECTIONS_FILE, "utf8");
      const connections = await decrypt(fileData);
      const index = connections.findIndex((conn) => conn.id === id);

      if (index === -1) {
        console.error("Connection not found:", id);
        return { success: false, error: "Connection not found" };
      }

      connections[index] = { ...connections[index], ...data };
      const encryptedData = await encrypt(connections);
      await fs.writeFile(CONNECTIONS_FILE, encryptedData);
      return { success: true };
    } catch (error) {
      console.error("Failed to edit connection:", error);
      return { success: false, error: error.message };
    }
  });
}
