
// Preload script for Electron
window.electronAPI = {
  // We can expose specific functions here that will be available to the renderer process
  saveScreenshot: (imageData) => window.ipcRenderer.invoke('save-screenshot', imageData)
};
