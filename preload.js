const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('liman', {
  load: () => ipcRenderer.sendSync('load'),
  save: list => ipcRenderer.send('save', list),
  open: p => ipcRenderer.invoke('open', p),
  check: p => ipcRenderer.invoke('check', p),
});
