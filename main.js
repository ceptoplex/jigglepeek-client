const {app, BrowserWindow, ipcMain} = require('electron');
const {autoUpdater} = require('electron-updater');
const path = require('path');

ipcMain.on('version', (event) => {
    event.sender.send('version', {version: app.getVersion()});
});
ipcMain.on('restart', () => {
    autoUpdater.quitAndInstall();
});

const createWindow = async () => {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    autoUpdater.on('update-downloaded', () => {
        autoUpdater.quitAndInstall();
    });

    window.on('ready-to-show', async () => {
        const result = await autoUpdater.checkForUpdatesAndNotify();
        if (result === null || result.updateInfo.version === app.getVersion()) {
            window.show();
        }
    });

    await window.loadFile('index.html');
};

app.on('ready', async () => {
    await createWindow();
});
app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        await createWindow();
    }
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
