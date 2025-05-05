
import React from 'react';
import { useScreenCapture } from '@/contexts/ScreenCaptureContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Save, Download } from 'lucide-react';
import { toast } from 'sonner';

// Check if we're running in Electron
const isElectron = window.navigator.userAgent.toLowerCase().indexOf('electron') > -1;

const CaptureViewer: React.FC = () => {
  const { selectedCapture, setSelectedCapture } = useScreenCapture();
  
  if (!selectedCapture) {
    return null;
  }
  
  const handleDownload = () => {
    if (isElectron && window.electronAPI) {
      // Use Electron's native save dialog
      window.electronAPI.saveScreenshot(selectedCapture.imageData)
        .then((result: {success: boolean, filePath?: string, message?: string}) => {
          if (result.success) {
            toast.success(`Screenshot saved to ${result.filePath}`);
          } else {
            toast.info(result.message || 'Save cancelled');
          }
        })
        .catch((error: any) => {
          toast.error(`Error saving screenshot: ${error}`);
        });
    } else {
      // Web fallback - use browser download
      const link = document.createElement('a');
      link.href = selectedCapture.imageData;
      link.download = `screenshot-${format(new Date(selectedCapture.timestamp), 'yyyy-MM-dd-HH-mm-ss')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Screenshot Preview</CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setSelectedCapture(null)}
          >
            Close
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-0">
          <div className="relative bg-slate-100">
            <img 
              src={selectedCapture.imageData} 
              alt={`Screenshot taken ${format(new Date(selectedCapture.timestamp), 'PPpp')}`}
              className="w-full h-auto"
            />
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between p-4 border-t">
          <div>
            <p className="text-sm text-muted-foreground">
              Captured: {format(new Date(selectedCapture.timestamp), 'PPpp')}
            </p>
          </div>
          <Button onClick={handleDownload} className="gap-2 bg-brand-500 hover:bg-brand-600">
            {isElectron ? <Save className="h-4 w-4" /> : <Download className="h-4 w-4" />}
            {isElectron ? 'Save As' : 'Download'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CaptureViewer;
