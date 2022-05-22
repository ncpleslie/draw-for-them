import { app, BrowserWindow } from "electron";
import isDev from "electron-is-dev";
import path from "path";

const createWindow = () => {
  const window = new BrowserWindow({ width: 800, height: 480 });

  window.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "./index.html")}`
  );
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
