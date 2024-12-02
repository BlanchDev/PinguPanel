import { app, BrowserWindow } from "electron";
import createWindow from "./createWindow.js";
import process from "process";
import {
  setupConnectionHandlers,
  setupSSHHandlers,
} from "../handlers/index.js";

let mainWindow = null;

async function appLifecycle() {
  try {
    await app.whenReady();

    mainWindow = createWindow();

    setupConnectionHandlers();
    setupSSHHandlers(mainWindow);

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
