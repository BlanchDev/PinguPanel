import { app, BrowserWindow } from "electron";
import createWindow from "./createWindow.js";
import process from "process";
import { setupConnectionHandlers } from "../handlers/connectionHandler.js";
import { setupSSHHandlers } from "../handlers/sshHandler.js";
import setupSettingsHandlers from "../handlers/settingsHandler.js";

let mainWindow = null;

async function appLifecycle() {
  try {
    await app.whenReady();

    mainWindow = createWindow();

    setupConnectionHandlers();
    setupSSHHandlers(mainWindow);
    setupSettingsHandlers();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        mainWindow = createWindow();
      }
    });
  } catch (error) {
    console.error("Uygulama yaşam döngüsü başlatılamadı:", error);
  }

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
}

export default appLifecycle;
