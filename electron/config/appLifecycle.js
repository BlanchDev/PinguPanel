import { app, BrowserWindow } from "electron";
import { createSplashWindow, createWindow } from "./createWindow.js";
import process from "process";
import { setupConnectionHandlers } from "../handlers/connectionHandler.js";
import { setupSSHHandlers } from "../handlers/sshHandler.js";
import setupSettingsHandlers from "../handlers/settingsHandler.js";

let mainWindow = null;

async function appLifecycle() {
  try {
    await app.whenReady();

    const splashWindow = createSplashWindow();
    mainWindow = createWindow();
    mainWindow.hide();

    setTimeout(() => {
      if (!splashWindow.isDestroyed()) {
        splashWindow.hide();
        splashWindow.destroy();
      }
      mainWindow.show();
    }, 2000);

    setupConnectionHandlers();
    setupSSHHandlers(mainWindow);
    setupSettingsHandlers();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        mainWindow = createWindow();
      }
    });
  } catch (error) {
    console.error("App Lifecycle Error:", error);
  }

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
}

export default appLifecycle;
