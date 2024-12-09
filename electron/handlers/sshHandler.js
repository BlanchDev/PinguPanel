import { Client } from "ssh2";
import { ipcMain } from "electron";
import process from "process";

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

    stream.stderr?.on("data", (data) => {
      console.log("Error:", data.toString());
      errorOutput += data.toString();
    });

    stream.on("close", (code, signal) => {
      console.log("Stream closed:", { code, signal });
      resolve({
        success: true,
        output: output || errorOutput,
        code,
        signal,
      });
    });

    stream.on("error", (err) => {
      console.error("Stream error:", err);
      reject(new Error(err.message));
    });
  });
}

async function executeSSHCommand(command) {
  if (!activeConnection) {
    throw new Error("SSH bağlantısı bulunamadı!");
  }

  return new Promise((resolve, reject) => {
    activeConnection.exec(command, async (err, stream) => {
      if (err) {
        console.error("Command execution error:", err);
        throw new Error(err.message);
      }

      try {
        const result = await handleStreamData(stream);
        resolve(result);
      } catch (error) {
        console.error("Stream handling error:", error);
        reject(new Error(error.message));
      }
    });
  });
}

function setupWebSocketStream(stream, mainWindow, streamId) {
  if (!stream || !mainWindow || !streamId) {
    throw new Error("Invalid WebSocket stream parameters");
  }

  activeStreams.set(streamId, stream);

  stream.on("data", (data) => {
    try {
      mainWindow.webContents.send(`ws-data-${streamId}`, data.toString());
    } catch (error) {
      console.error(`WebSocket data error (${streamId}):`, error);
    }
  });

  stream.stderr?.on("data", (data) => {
    try {
      mainWindow.webContents.send(`ws-error-${streamId}`, data.toString());
    } catch (error) {
      console.error(`WebSocket stderr error (${streamId}):`, error);
    }
  });

  stream.on("close", () => {
    try {
      mainWindow.webContents.send(`ws-close-${streamId}`);
      activeStreams.delete(streamId);
    } catch (error) {
      console.error(`WebSocket close error (${streamId}):`, error);
    }
  });

  stream.on("error", (err) => {
    try {
      mainWindow.webContents.send(`ws-error-${streamId}`, err.message);
    } catch (error) {
      console.error(`WebSocket error handling error (${streamId}):`, error);
    }
  });
}

export function setupSSHHandlers(mainWindow) {
  if (!mainWindow) {
    throw new Error("MainWindow is required for SSH handlers");
  }

  ipcMain.handle("get-active-ssh-connection", async () => {
    try {
      if (!activeConnection) {
        throw new Error("No active connection found");
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error("Get connections handler error:", error);
      return { success: false, message: error.message };
    }
  });

  ipcMain.handle("connect-ssh", async (_, connectionData) => {
    try {
      if (
        !connectionData?.host ||
        !connectionData?.username ||
        !connectionData?.privateKey
      ) {
        throw new Error("Invalid connection data");
      }

      const conn = new Client();

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Connection timeout"));
        }, 30_000); // 30 saniye timeout

        conn.on("ready", () => {
          clearTimeout(timeout);
          activeConnection = conn;
          resolve({ success: true, message: "Connected" });
        });

        conn.on("error", (err) => {
          clearTimeout(timeout);
          console.error("SSH connection error:", err);
          reject(new Error(err.message));
        });

        const config = {
          host: connectionData.host,
          port: connectionData.port,
          username: connectionData.username,
          privateKey: connectionData.privateKey,
          passphrase: connectionData.passphrase,
          readyTimeout: 30_000,
          keepaliveInterval: 30_000,
          keepaliveCountMax: 3,
          debug:
            process.env.NODE_ENV === "development" ? console.log : undefined,
          algorithms: {
            kex: [
              "ecdh-sha2-nistp256",
              "ecdh-sha2-nistp384",
              "ecdh-sha2-nistp521",
              "diffie-hellman-group-exchange-sha256",
              "diffie-hellman-group14-sha1",
            ],
            cipher: [
              "aes128-ctr",
              "aes192-ctr",
              "aes256-ctr",
              "aes128-gcm",
              "aes256-gcm",
            ],
            serverHostKey: [
              "ssh-rsa",
              "ecdsa-sha2-nistp256",
              "ecdsa-sha2-nistp384",
              "ecdsa-sha2-nistp521",
            ],
            hmac: ["hmac-sha2-256", "hmac-sha2-512", "hmac-sha1"],
          },
        };

        conn.connect(config);
      });
    } catch (error) {
      console.error("SSH connection setup error:", error);
      return { success: false, message: error.message };
    }
  });

  ipcMain.handle("execute-command", async (_, command) => {
    try {
      if (!command) {
        throw new Error("Command is required");
      }
      const result = await executeSSHCommand(command);
      return result;
    } catch (error) {
      console.error("Command execution handler error:", error);
      return { success: false, message: error.message };
    }
  });

  ipcMain.handle("disconnect-ssh", async () => {
    try {
      if (activeConnection) {
        for (const [streamId, stream] of activeStreams.entries()) {
          try {
            stream.end();
            activeStreams.delete(streamId);
          } catch (error) {
            console.error(`Error closing stream ${streamId}:`, error);
          }
        }
        activeStreams.clear();
        activeConnection.end();
        activeConnection = null;
      }
      return { success: true, message: "Disconnected" };
    } catch (error) {
      console.error("Disconnect error:", error);
      return { success: false, message: error.message };
    }
  });

  ipcMain.handle("create-ws-stream", async (_, { command, streamId }) => {
    try {
      if (!command || !streamId) {
        throw new Error("Command and streamId are required");
      }

      if (!activeConnection) {
        throw new Error("SSH connection not found!");
      }

      if (activeStreams.has(streamId)) {
        try {
          activeStreams.get(streamId).end();
          activeStreams.delete(streamId);
        } catch (error) {
          console.error(`Error closing existing stream ${streamId}:`, error);
        }
      }

      return new Promise((resolve, reject) => {
        activeConnection.exec(command, (err, stream) => {
          if (err) {
            console.error("WebSocket stream creation error:", err);
            reject(new Error(err.message));
            return;
          }

          try {
            setupWebSocketStream(stream, mainWindow, streamId);
            resolve({ success: true });
          } catch (error) {
            console.error("WebSocket stream setup error:", error);
            throw new Error(error.message);
          }
        });
      });
    } catch (error) {
      console.error("Create WebSocket stream handler error:", error);
      return { success: false, message: error.message };
    }
  });

  ipcMain.handle("close-ws-stream", (_, streamId) => {
    try {
      if (!streamId) {
        throw new Error("StreamId is required");
      }

      if (activeStreams.has(streamId)) {
        try {
          activeStreams.get(streamId).end();
          activeStreams.delete(streamId);
        } catch (error) {
          console.error(`Error closing stream ${streamId}:`, error);
          throw new Error(error.message);
        }
      }
      return { success: true };
    } catch (error) {
      console.error("Close WebSocket stream handler error:", error);
      return { success: false, message: error.message };
    }
  });
}
