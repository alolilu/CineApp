const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  //   mainWindow.loadFile(path.join(__dirname, "build", "index.html"));
  mainWindow.loadURL("http://localhost:3000");
}

app.on("ready", createWindow);
