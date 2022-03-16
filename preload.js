const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    awaitVersion: callback => {
        ipcRenderer.once('version', (_, args) => {
            callback(args.version);
        });
        ipcRenderer.send('version');
    },
    awaitUpdateAvailable: callback => {
        ipcRenderer.once('update-available', () => {
            callback();
        });
    },
    awaitUpdateDownloaded: callback => {
        ipcRenderer.once('update-downloaded', () => {
            callback();
        });
    },
    restart: () => {
        ipcRenderer.send('restart');
    }
});
