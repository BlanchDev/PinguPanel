import Store from "electron-store";
import { STORAGE_PATH } from "../handlers/storageHandler.js";

const settingsStore = new Store({
  cwd: STORAGE_PATH,
  name: "settings",
  defaults: {
    windowSize: {
      width: 1024,
      height: 576,
    },
  },
});

export default settingsStore;
