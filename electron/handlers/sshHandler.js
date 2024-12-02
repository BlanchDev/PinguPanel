import { Client } from "ssh2";
import { ipcMain } from "electron";

let activeConnection = null;
let activeStreams = new Map();

function handleStreamData(stream) {
  return new Promise((resolve, reject) => {
    let output = "";
    let errorOutput = "";

    stream.on("data", (data) => {
      console.log("Data:", data.toString());
      output += data.toString();
    });

    stream.stderr.on("data", (data) => {
      console.log("Error:", data.toString());
      errorOutput += data.toString();
    });

    stream.on("close", (code, signal) => {
      console.log("Stream closed:", { code, signal });
      resolve({
        success: true,
        output: output || errorOutput,
      });
    });

    stream.on("error", (err) => {
      console.error("Stream error:", err);
      reject(new Error(err.message));
    });
  });
}

function executeSSHCommand(command) {
  return new Promise((resolve, reject) => {
    if (!activeConnection) {
      reject(new Error("SSH bağlantısı bulunamadı!"));
      return;
    }

    activeConnection.exec(command, async (err, stream) => {
      if (err) {
        reject(new Error(err.message));
        return;
      }

      try {
        const result = await handleStreamData(stream);
        resolve(result);
      } catch (error) {
        reject(new Error(error.message));
      }
    });
  });
}

function setupWebSocketStream(stream, mainWindow, streamId) {
  activeStreams.set(streamId, stream);

  stream.on("data", (data) => {
    mainWindow.webContents.send(`ws-data-${streamId}`, data.toString());
  });

  stream.stderr.on("data", (data) => {
    mainWindow.webContents.send(`ws-error-${streamId}`, data.toString());
  });

  stream.on("close", () => {
    mainWindow.webContents.send(`ws-close-${streamId}`);
    activeStreams.delete(streamId);
  });

  stream.on("error", (err) => {
    mainWindow.webContents.send(`ws-error-${streamId}`, err.message);
  });
}

export function setupSSHHandlers(mainWindow) {
  // Mevcut handler'lar aynı kalıyor
  ipcMain.handle("connect-ssh", async (_, connectionData) => {
    try {
      const conn = new Client();

      return new Promise((resolve, reject) => {
        conn.on("ready", () => {
          activeConnection = conn;
          resolve({ success: true, message: "Bağlantı başarılı" });
        });

        conn.on("error", (err) => {
          reject(new Error(err.message));
        });

        const config = {
          host: connectionData.host,
          port: connectionData.port,
          username: connectionData.username,
          privateKey: connectionData.privateKey,
          passphrase: connectionData.passphrase || undefined,
        };

        conn.connect(config);
      });
    } catch (error) {
      return { success: false, message: error.message };
    }
  });

  ipcMain.handle("execute-command", async (_, command) => {
    try {
      const result = await executeSSHCommand(command);
      return result;
    } catch (error) {
      return { success: false, message: error.message };
    }
  });

  ipcMain.handle("disconnect-ssh", async () => {
    try {
      if (activeConnection) {
        // Tüm aktif streamleri kapat
        for (const stream of activeStreams.values()) {
          stream.end();
        }
        activeStreams.clear();
        activeConnection.end();
        activeConnection = null;
      }
      return { success: true, message: "Bağlantı kapatıldı" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  });

  // WebSocket stream oluşturma handler'ı
  ipcMain.handle("create-ws-stream", async (_, { command, streamId }) => {
    try {
      if (!activeConnection) {
        throw new Error("SSH bağlantısı bulunamadı!");
      }

      // Eğer aynı ID'li bir stream varsa kapat
      if (activeStreams.has(streamId)) {
        activeStreams.get(streamId).end();
        activeStreams.delete(streamId);
      }

      return new Promise((resolve, reject) => {
        activeConnection.exec(command, (err, stream) => {
          if (err) {
            reject(new Error(err.message));
            return;
          }

          setupWebSocketStream(stream, mainWindow, streamId);
          resolve({ success: true });
        });
      });
    } catch (error) {
      return { success: false, message: error.message };
    }
  });

  // Stream'i kapatma handler'ı
  ipcMain.handle("close-ws-stream", (_, streamId) => {
    try {
      if (activeStreams.has(streamId)) {
        activeStreams.get(streamId).end();
        activeStreams.delete(streamId);
      }
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  });
}
