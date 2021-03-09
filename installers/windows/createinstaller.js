const createWindowsInstaller = require("electron-winstaller")
  .createWindowsInstaller;
const path = require("path");

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error);
    process.exit(1);
  });

function getInstallerConfig() {
  console.log("Creating Windows Installer");
  const rootPath = path.join("./");
  const outPath = path.join(rootPath, "release-builds");

  return Promise.resolve({
    appDirectory: path.join(outPath, "Rafeeq Vendor Dashboard-win32-ia32/"),
    authors: "mtmfahath",
    noMsi: true,
    outputDirectory: path.join(outPath, "windows-installer"),
    exe: "Rafeeq Vendor Dashboard.exe",
    setupExe: "RafeeqDashboarInstaller.exe",
    setupIcon: path.join(rootPath, "assets", "icons", "win", "favicon.ico"),
  });
}
