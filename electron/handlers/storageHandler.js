import fs from "fs/promises";
import path from "path";
import { app } from "electron";

const STORAGE_PATH = path.join(app.getPath("userData"), "storage");
const CONNECTIONS_FILE = path.join(STORAGE_PATH, "connections.json");

async function initStorage() {
  try {
    await fs.mkdir(STORAGE_PATH, { recursive: true });
    try {
      await fs.access(CONNECTIONS_FILE);
    } catch {
      await fs.writeFile(CONNECTIONS_FILE, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.error("Storage başlatılamadı:", error);
  }
}

export { CONNECTIONS_FILE, initStorage };
