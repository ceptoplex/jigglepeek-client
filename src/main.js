const {app, BrowserWindow, ipcMain, Menu, Tray} = require('electron');
const {autoUpdater} = require('electron-updater');
const path = require('path');

ipcMain.on('version', (event) => {
    event.sender.send('version', {version: app.getVersion()});
});

let aboutWindow = null;

const showAboutWindow = async () => {
    if (aboutWindow !== null) {
        aboutWindow.focus();
        return;
    }

    aboutWindow = new BrowserWindow({
        width: 400,
        height: 200,
        icon: path.join(__dirname, '..', 'assets', 'icon.ico'),
        show: false,
        autoHideMenuBar: true,
        maximizable: false,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
    });
    aboutWindow.on('ready-to-show', () => {
        aboutWindow.show();
    });
    aboutWindow.on('closed', () => {
        aboutWindow = null;
    });
    await aboutWindow.loadFile(path.join(__dirname, 'about', 'index.html'));
};

const createTray = () => {
    const tray = new Tray(path.join(__dirname, '..', 'assets', 'icon.ico'));
    const contextMenu = Menu.buildFromTemplate([
        {label: 'About', type: 'normal', click: () => showAboutWindow()},
        {type: 'separator'},
        {label: 'Exit', type: 'normal', click: () => app.quit()}
    ])
    tray.setToolTip('JigglePeek Client');
    tray.setContextMenu(contextMenu);
};

autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall();
});

app.on('ready', async () => {
    const result = await autoUpdater.checkForUpdatesAndNotify({
        title: 'JigglePeek Client Update',
        body: 'Client has successfully been updated to the latest about.'
    });
    if (result === null || result.updateInfo.version === app.getVersion()) {
        createTray();
    }
});

app.on('window-all-closed', e => {
    e.preventDefault();
});
