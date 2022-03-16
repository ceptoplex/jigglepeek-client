const {app, BrowserWindow, ipcMain} = require('electron');
const {autoUpdater} = require('electron-updater');

const createWindow = () => {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    window.once('ready-to-show', () => {
        window.show();

        autoUpdater.on('update-available', () => {
            window.webContents.send('update-available');
        });
        autoUpdater.on('update-downloaded', () => {
            ipcMain.on('restart-app', () => {
                autoUpdater.quitAndInstall();
            });

            window.webContents.send('update-downloaded');
        });
        autoUpdater.checkForUpdatesAndNotify();
    });

    ipcMain.on('app-version', (event) => {
        event.sender.send('app-version', {version: app.getVersion()});
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
