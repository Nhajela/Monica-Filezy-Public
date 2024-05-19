const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  if (isDev) {
    win.webContents.openDevTools();
  }
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers for config and file selector
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
  return result.filePaths[0];
});

ipcMain.handle('read-config', async () => {
  const configPath = path.join(app.getPath('userData'), 'config.json');
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({ presets: [], default_preset: '', apiKey: '', default_backup: false }, null, 2));
  }
  const data = fs.readFileSync(configPath, 'utf-8');
  return JSON.parse(data);
});

ipcMain.handle('write-config', async (event, config) => {
  const configPath = path.join(app.getPath('userData'), 'config.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
});
