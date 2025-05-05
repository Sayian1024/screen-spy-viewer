
interface ElectronAPI {
  saveScreenshot: (imageData: string) => Promise<{
    success: boolean;
    filePath?: string;
    message?: string;
    error?: string;
  }>;
}

interface Window {
  electronAPI?: ElectronAPI;
  ipcRenderer?: {
    invoke: (channel: string, ...args: any[]) => Promise<any>;
  };
}
