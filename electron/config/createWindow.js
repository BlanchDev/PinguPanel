import { BrowserWindow } from "electron";
import { join } from "path";
import process from "process";
import { getPath } from "./path.js";
import settingsStore from "./settingsStore.js";
import WindowManager from "./windowsManager.js";

export function createSplashWindow() {
  const splash = new BrowserWindow({
    width: 250,
    height: 250,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    center: true,
    icon: join(getPath(), "/assets/icon.ico"),
    show: true,
    skipTaskbar: true,

    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  splash.loadFile(join(getPath(), "../splash.html"));
  return splash;
}

export function createWindow() {
  const win = new BrowserWindow({
    width: settingsStore.get("windowSize.width"),
    height: settingsStore.get("windowSize.height"),
    minWidth: 1024,
    minHeight: 576,
    center: true,
    icon: join(getPath(), "/assets/icon.ico"),
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      worldSafeExecuteJavaScript: true,
      enableRemoteModule: false,
      preload: join(getPath(), "preload.cjs"),
      devTools: process.env.NODE_ENV === "development",
      spellcheck: false,
    },
    frame: false,
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#000",
      symbolColor: "#f5db41",
      height: 30,
    },
    paintWhenInitiallyHidden: true,
    backgroundColor: "#000000",
  });

  // CSP ayarları
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          process.env.NODE_ENV === "development"
            ? "default-src 'self'; " +
              "script-src 'self' 'unsafe-inline';" +
              "style-src 'self' 'unsafe-inline';" +
              "connect-src 'self' ws://localhost:* http://localhost:*; " +
              "img-src 'self' data: https:; " +
              "font-src 'self' data:;"
            : "default-src 'self'; " +
              "script-src 'self';" +
              "style-src 'self';" +
              "connect-src 'self';" +
              "img-src 'self' data:;" +
              "font-src 'self' data:;",
        ],
      },
    });
  });

  win.on("resize", () => {
    const [width, height] = win.getSize();
    settingsStore.set("windowSize", { width, height });
  });

  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    win.loadFile(join(getPath(), "../dist/index.html"));
  }

  WindowManager.setMainWindow(win);

  return win;
}
