
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const url = require('url');

// Keep a global reference of the window object to avoid garbage collection
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Determine if we're in development or production
  const isDev = process.env.NODE_ENV === 'development';

  // Load the app
  if (isDev) {
    // In development, load from the dev server
    mainWindow.loadURL('http://localhost:8080');
    // Open DevTools for debugging
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built files
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, '../dist/index.html'),
        protocol: 'file:',
        slashes: true
      })
    );
  }

  // When the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create window when Electron is ready
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS re-create a window when the dock icon is clicked and no windows are open
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle screenshot saving to file system
ipcMain.handle('save-screenshot', async (event, imageData) => {
  try {
    const { filePath } = await dialog.showSaveDialog({
      title: 'Save Screenshot',
      defaultPath: `screenshot-${Date.now()}.jpg`,
      filters: [
        { name: 'Images', extensions: ['jpg', 'png'] }
      ]
    });
    
    if (!filePath) return { success: false, message: 'Save cancelled' };
    
    // Remove the data URL prefix to get the base64 data
    const base64Data = imageData.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
    
    // Write the file
    fs.writeFileSync(filePath, base64Data, 'base64');
    
    return { success: true, filePath };
  } catch (error) {
    console.error('Error saving file:', error);
    return { success: false, error: error.message };
  }
});
