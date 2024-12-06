import fs from "fs/promises";
import path from "path";
import { app } from "electron";

const STORAGE_PATH = path.join(app.getPath("userData"), "storage");
const CONNECTIONS_FILE = path.join(STORAGE_PATH, "connections.json");

async function initStorage(file) {
  try {
    await fs.mkdir(STORAGE_PATH, { recursive: true });
    try {
      await fs.access(file);
    } catch {
      await fs.writeFile(file, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.error("Storage not initialized:", error);
  }
}

export { STORAGE_PATH, CONNECTIONS_FILE, initStorage };
