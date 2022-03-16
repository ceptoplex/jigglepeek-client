const {contextBridge, ipcRenderer} = require('electron');
const util = require('util');

contextBridge.exposeInMainWorld('electron', {
    getVersion: util.promisify(
        callback => {
            ipcRenderer.once('version', (_, args) => {
                callback(null, args.version);
            });
            ipcRenderer.send('version');
        }),
    awaitUpdateAvailable: util.promisify(
        callback => {
            ipcRenderer.once('update-available', () => {
                callback();
            });
        }),
    awaitUpdateDownloaded: util.promisify(
        callback => {
            ipcRenderer.once('update-downloaded', () => {
                callback();
            });
        }),
    restart: () => {
        ipcRenderer.send('restart');
    }
});
