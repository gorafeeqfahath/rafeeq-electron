const { app, BrowserWindow, screen, Tray, Menu, dialog } = require("electron");
const path = require("path");

const setupEvents = require("./installers/setupEvents");

let win;
let mainWindow;

if (setupEvents.handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    width: width,
    height: height,
    center: true,
    thickFrame: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      devTools: false,
    },
  });
  win.loadURL("http://portal.gorafeeq.com");

  let tray = null;
  win.on("minimize", function (event) {
    event.preventDefault();
    win.setSkipTaskbar(true);
    tray = createTray();
  });

  win.on("restore", function (event) {
    win.show();
    win.setSkipTaskbar(false);
    tray.destroy();
  });

  return win;
}

app.whenReady().then(createWindow);

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

function createTray() {
  let appIcon = new Tray(path.join(__dirname, "assets/icons/win/favicon.ico"));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show",
      click: function () {
        win.show();
      },
    },
    {
      label: "Exit",
      click: function () {
        app.isQuiting = true;
        app.quit();
      },
    },
  ]);

  appIcon.on("double-click", function (event) {
    mainWindow.show();
  });
  appIcon.setToolTip("Rafeeq Vendor");
  appIcon.setContextMenu(contextMenu);
  return appIcon;
}
