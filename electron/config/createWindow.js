import { BrowserWindow } from "electron";
import { join } from "path";
import process from "process";
import { getPath } from "./path.js";

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 1024,
    minHeight: 576,
    icon: join(getPath(), "../assets/icon.ico"),
    webPreferences: {
      sandbox: true,
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(getPath(), "preload.cjs"),
      devTools: process.env.NODE_ENV === "development",
    },
    frame: false,
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#000",
      symbolColor: "#f5db41",
      height: 30,
    },
  });

  // CSP ayarları
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          process.env.NODE_ENV === "development"
            ? // Development CSP
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-inline' ;" +
              "style-src 'self' 'unsafe-inline'; " +
              "connect-src 'self' ws://localhost:* http://localhost:*; " +
              "img-src 'self' data: https:; " +
              "font-src 'self' data:;"
            : // Production CSP
              "default-src 'self'; " +
              "script-src 'self'; " +
              "style-src 'self' 'unsafe-inline'; " +
              "img-src 'self' data: https:; " +
              "font-src 'self' data:; ",
        ],
      },
    });
  });

  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    win.loadFile(join(getPath(), "../dist/index.html"));
  }

  return win;
}

export default createWindow;
