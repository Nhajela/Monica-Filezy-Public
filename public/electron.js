const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { readMarkdownFile, getGPTInstructions, scanFolder } = require('./utils');
const log = require('electron-log');


async function createWindow() {
  const isDev = (await import('electron-is-dev')).default;

  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false, // Ensure this is set to false for security reasons
      contextIsolation: true,  // Enable contextIsolation
    },
  });

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, 'build/index.html')}`
  );

  if (isDev) {
    win.webContents.openDevTools();
  }

  win.on('closed', () => {
    win = null;
  });
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

ipcMain.handle('get-gpt-instructions', async (event, fileTree) => {
  const instructions = await getGPTInstructions(fileTree);
  return instructions;
});

ipcMain.handle('scan-folder', async (event, folderPath, depth) => {
  const fileTree = scanFolder(folderPath, depth);
  log.info('File tree sent to renderer:', JSON.stringify(fileTree, null, 2)); // Add logging here
  return fileTree;
});

