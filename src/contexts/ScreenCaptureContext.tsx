
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  startTimer: (seconds: number) => void;
  stopTimer: () => void;
  isTimerRunning: boolean;
  remainingTime: number;
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
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const timerRef = useRef<number | null>(null);
  const { isAuthenticated } = useAuth();
  
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

  // Handle timer countdown
  useEffect(() => {
    if (isTimerRunning && remainingTime > 0) {
      const intervalId = setInterval(() => {
        setRemainingTime(prev => prev - 1);
      }, 1000);
      
      return () => clearInterval(intervalId);
    } else if (isTimerRunning && remainingTime === 0) {
      // Capture screenshot when timer reaches zero
      captureScreen();
      setIsTimerRunning(false);
    }
  }, [isTimerRunning, remainingTime]);

  const captureScreen = async (): Promise<CapturedScreen | null> => {
    try {
      // Use the screen capture API
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true, // Simplified the constraints to fix TypeScript error
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

  const startTimer = (seconds: number) => {
    stopTimer(); // Stop any existing timer
    setRemainingTime(seconds);
    setIsTimerRunning(true);
    toast.info(`Timer set for ${formatTime(seconds)}`);
  };

  const stopTimer = () => {
    if (isTimerRunning) {
      setIsTimerRunning(false);
      setRemainingTime(0);
      toast.info('Timer cancelled');
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <ScreenCaptureContext.Provider value={{
      captures,
      captureScreen,
      deleteCapture,
      selectedCapture,
      setSelectedCapture,
      startTimer,
      stopTimer,
      isTimerRunning,
      remainingTime
    }}>
      {children}
    </ScreenCaptureContext.Provider>
  );
};
