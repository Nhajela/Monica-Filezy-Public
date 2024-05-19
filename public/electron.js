const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const log = require('electron-log');
// const isDev = require('electron-is-dev');
const { readMarkdownFile, getGPTInstructions, scanFolder, executeInstructions } = require('./utils');

let mainWindow;

async function createWindow() {
  const isDev = (await import('electron-is-dev')).default;
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL(
    isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, 'build/index.html')}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
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

async function handleSelectFolder() {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  return result.filePaths[0];
}

async function handleReadConfig() {
  const configPath = path.join(app.getPath('userData'), 'config.json');
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({ presets: [], default_preset: '', apiKey: '', default_backup: false }, null, 2));
  }
  return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}

async function handleWriteConfig(event, config) {
  const configPath = path.join(app.getPath('userData'), 'config.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

async function handleGetGPTInstructions(event, fileTree) {
  try {
    return await getGPTInstructions(fileTree);
  } catch (error) {
    log.error('Error getting GPT instructions:', error);
    throw error;
  }
}

async function handleScanFolder(event, folderPath, depth) {
  return scanFolder(folderPath, depth);
}

async function handleExecuteInstructions(event, { instructions, basePath }) {
  try {
    executeInstructions(instructions, basePath);
  } catch (error) {
    log.error('Error executing instructions:', error);
    throw error;
  }
}

ipcMain.handle('select-folder', handleSelectFolder);
ipcMain.handle('read-config', handleReadConfig);
ipcMain.handle('write-config', handleWriteConfig);
ipcMain.handle('get-gpt-instructions', handleGetGPTInstructions);
ipcMain.handle('scan-folder', handleScanFolder);
ipcMain.handle('execute-instructions', handleExecuteInstructions);
