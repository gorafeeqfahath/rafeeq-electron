const {
  app,
  BrowserWindow,
  screen,
  Tray,
  Menu,
  dialog,
  remote,
  Notification,
} = require("electron");
const path = require("path");

const setupEvents = require("./installers/setupEvents");

let win;

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
    closable: false,

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

    // setTimeout(() => {
    //   let notification = new Notification({
    //     urgency: "normal",
    //     title: "Hello World",
    //     icon: "assets/icons/win/favicon.ico",

    //   });
    //   notification.show();
    // }, 3000);
  });

  // win.on("close", function (event) {
  //   event.preventDefault();
  //   win.setSkipTaskbar(true);
  //   tray = createTray();
  //   win.minimize();
  // });

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
      label: "About",
      click: function () {
        win.webContents.executeJavaScript(`
        
          alert('Rafeeq Vendor Dashboard - Version : 1.0.0 - \u00A9 2021')
        
        `);
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
    win.show();
  });
  appIcon.setToolTip("Rafeeq Vendor");
  appIcon.setContextMenu(contextMenu);
  appIcon.displayBalloon({
    title: "Rafeeq",
    content: "The app is minimized and it will be running on background",
    icon: "assets/icons/win/favicon.ico",
  });

  // appIcon.on("balloon-click", () => {
  //   win.show();
  //   win.setSkipTaskbar(false);
  //   tray.destroy();
  // });
  return appIcon;
}
