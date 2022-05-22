const { app, dialog, BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");
const { autoUpdater } = require("electron-updater");

const createWindow = () => {
  const window = new BrowserWindow({ width: 800, height: 480 });
  autoUpdater.autoDownload = true;
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

autoUpdater.on('update-available', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'An update was found',
    message: 'This update will be downloaded now...',
  })
})

autoUpdater.on("update-downloaded", () => {
  await dialog.showMessageBox({
    title: "An update has been downloaded",
    message: "An update was downloaded. The application will be quit and install this update..."
  });

  setImmediate(() => autoUpdater.quitAndInstall())
});

