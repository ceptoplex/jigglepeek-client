const {contextBridge, ipcRenderer} = require('electron');
const util = require('util');

contextBridge.exposeInMainWorld('electron', {
    getVersion: util.promisify(
        callback => {
            ipcRenderer.once('version', (_, args) => {
                callback(null, args.version);
            });
            ipcRenderer.send('version');
        })
});
