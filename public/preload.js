const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  readConfig: () => ipcRenderer.invoke('read-config'),
  writeConfig: (config) => ipcRenderer.invoke('write-config', config),
});
