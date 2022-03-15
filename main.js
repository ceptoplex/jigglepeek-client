const {app, BrowserWindow, ipcMain} = require('electron');
const {autoUpdater} = require('electron-updater');

if (require('electron-squirrel-startup')) {
    return app.quit();
}

const createWindow = () => {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    window.once('ready-to-show', () => {
        autoUpdater.checkForUpdatesAndNotify();
    });
    autoUpdater.on('update-available', () => {
        window.webContents.send('update_available');
    });
    autoUpdater.on('update-downloaded', () => {
        window.webContents.send('update_downloaded');
    });
    ipcMain.on('restart_app', () => {
        autoUpdater.quitAndInstall();
    });

    window.loadFile('index.html');
};

app.on('ready', () => {
    createWindow();
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', {version: app.getVersion()});
});