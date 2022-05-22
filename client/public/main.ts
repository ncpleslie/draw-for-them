import { app, BrowserWindow } from "electron";
import isDev from "electron-is-dev";
import path from "path";
import { autoUpdater } from "electron-updater";

const createWindow = () => {
  const window = new BrowserWindow({ width: 800, height: 480 });
  autoUpdater.checkForUpdatesAndNotify();

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

autoUpdater.on("checking-for-update", () => {
  console.log("Checking for updates");
});

autoUpdater.on("update-available", (info) => {
  console.log("Theres an update", info);
});
