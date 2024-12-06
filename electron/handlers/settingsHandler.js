import { ipcMain } from "electron";
import WindowManager from "../config/windowsManager.js";

function setupSettingsHandlers() {
  const win = WindowManager.getMainWindow();

  ipcMain.handle("getWinSize", () => {
    const [width, height] = win.getSize();
    return { width, height };
  });

  ipcMain.handle("setWinSize", (_, size) => {
    const width = parseInt(size.width);
    const height = parseInt(size.height);

    if (!isNaN(width) && !isNaN(height)) {
      win.setSize(width, height);
    } else {
      throw new TypeError(
        "Error invoking remote method 'setWinSize': TypeError: Error processing argument at index 1, conversion failure from " +
          JSON.stringify(size),
      );
    }
  });
}

export default setupSettingsHandlers;
