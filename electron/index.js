const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,  // Disable node integration for security
            contextIsolation: true,  // Enable context isolation for security
            sandbox: false,
        },
    });
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();

}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});