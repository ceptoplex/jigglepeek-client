const {app, BrowserWindow, ipcMain} = require('electron');
const {autoUpdater} = require('electron-updater');
const path = require('path');

ipcMain.on('version', (event) => {
    event.sender.send('version', {version: app.getVersion()});
});
ipcMain.on('restart', () => {
    autoUpdater.quitAndInstall();
});

const createWindow = () => {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    window.on('ready-to-show', () => {
        window.show();

        autoUpdater.on('update-available', () => {
            window.webContents.send('update-available');
        });
        autoUpdater.on('update-downloaded', () => {
            window.webContents.send('update-downloaded');
        });
        autoUpdater.checkForUpdatesAndNotify();
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
