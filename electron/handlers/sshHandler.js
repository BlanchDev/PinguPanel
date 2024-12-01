import { Client } from "ssh2";
import { ipcMain } from "electron";

export function setupSSHHandlers() {
  ipcMain.handle("connect-ssh", async (_, connectionData) => {
    try {
      const conn = new Client();

      return new Promise((resolve, reject) => {
        conn.on("ready", () => {
          resolve({ success: true, message: "Connection successful" });
        });

        conn.on("error", (err) => {
          reject(new Error(err.message));
        });

        const config = {
          host: connectionData.host,
          port: connectionData.port,
          username: connectionData.username,
          privateKey: connectionData.privateKey,
        };

        if (connectionData.passphrase) {
          config.passphrase = connectionData.passphrase;
        }

        conn.connect(config);
      });
    } catch (error) {
      return { success: false, message: error.message };
    }
  });
}
