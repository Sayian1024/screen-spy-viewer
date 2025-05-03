
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

export interface CapturedScreen {
  id: string;
  timestamp: number;
  imageData: string;
  name: string;
}

interface ScreenCaptureContextType {
  captures: CapturedScreen[];
  captureScreen: () => Promise<CapturedScreen | null>;
  deleteCapture: (id: string) => void;
  selectedCapture: CapturedScreen | null;
  setSelectedCapture: (capture: CapturedScreen | null) => void;
}

const ScreenCaptureContext = createContext<ScreenCaptureContextType | undefined>(undefined);

export const useScreenCapture = () => {
  const context = useContext(ScreenCaptureContext);
  if (context === undefined) {
    throw new Error('useScreenCapture must be used within a ScreenCaptureProvider');
  }
  return context;
};

export const ScreenCaptureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [captures, setCaptures] = useState<CapturedScreen[]>([]);
  const [selectedCapture, setSelectedCapture] = useState<CapturedScreen | null>(null);
  const { isAuthenticated, user } = useAuth();
  
  // Load captures from local storage on mount
  useEffect(() => {
    if (isAuthenticated) {
      const storedCaptures = localStorage.getItem('screenspy_captures');
      if (storedCaptures) {
        try {
          setCaptures(JSON.parse(storedCaptures));
        } catch (e) {
          console.error("Failed to parse stored captures", e);
        }
      }
    } else {
      setCaptures([]);
      setSelectedCapture(null);
    }
  }, [isAuthenticated]);
  
  // Save captures to local storage when they change
  useEffect(() => {
    if (isAuthenticated && captures.length > 0) {
      localStorage.setItem('screenspy_captures', JSON.stringify(captures));
    }
  }, [captures, isAuthenticated]);

  const captureScreen = async (): Promise<CapturedScreen | null> => {
    try {
      // Use the screen capture API
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" },
        audio: false
      });
      
      // Create a video element to grab a frame
      const video = document.createElement('video');
      video.srcObject = stream;
      
      // Wait for video to be ready
      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve();
        };
      });
      
      // Create a canvas and draw the video frame
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Failed to create canvas context");
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to image data
      // Compress to JPEG with quality 0.85 for reasonable file size
      const imageData = canvas.toDataURL('image/jpeg', 0.85);
      
      // Stop all tracks
      stream.getTracks().forEach(track => track.stop());
      
      // Create capture object
      const newCapture: CapturedScreen = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        imageData,
        name: `Screenshot ${new Date().toLocaleString()}`
      };
      
      // Update state
      setCaptures(prev => [newCapture, ...prev]);
      toast.success('Screenshot captured!');
      
      return newCapture;
    } catch (error) {
      console.error("Error capturing screen:", error);
      toast.error('Screen capture failed');
      return null;
    }
  };
  
  const deleteCapture = (id: string) => {
    setCaptures(prev => prev.filter(cap => cap.id !== id));
    if (selectedCapture?.id === id) {
      setSelectedCapture(null);
    }
    toast.info('Screenshot deleted');
  };
  
  return (
    <ScreenCaptureContext.Provider value={{
      captures,
      captureScreen,
      deleteCapture,
      selectedCapture,
      setSelectedCapture
    }}>
      {children}
    </ScreenCaptureContext.Provider>
  );
};
