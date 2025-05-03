
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useScreenCapture } from '@/contexts/ScreenCaptureContext';
import { Camera } from 'lucide-react';

const ScreenCaptureButton: React.FC = () => {
  const { captureScreen } = useScreenCapture();
  const [isCapturing, setIsCapturing] = useState(false);
  
  const handleCapture = async () => {
    try {
      setIsCapturing(true);
      await captureScreen();
    } finally {
      setIsCapturing(false);
    }
  };
  
  return (
    <Button 
      onClick={handleCapture} 
      className={`gap-2 ${isCapturing ? 'animate-pulse bg-red-500 hover:bg-red-600' : 'bg-brand-500 hover:bg-brand-600'}`}
      disabled={isCapturing}
    >
      <Camera className="h-4 w-4" />
      {isCapturing ? 'Capturing...' : 'Capture Screen'}
    </Button>
  );
};

export default ScreenCaptureButton;
