
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ScreenCaptureButton from '@/components/ScreenCaptureButton';
import CaptureGallery from '@/components/CaptureGallery';
import CaptureViewer from '@/components/CaptureViewer';
import CaptureTimer from '@/components/CaptureTimer';

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Capture, view, and manage your screenshots</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Manual Capture</CardTitle>
            <CardDescription>
              Capture your entire screen, window, or tab to save as a screenshot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <ScreenCaptureButton />
            </div>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            <p>Your browser will ask for permission before capturing your screen.</p>
          </CardFooter>
        </Card>
        
        <CaptureTimer />
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <CaptureGallery />
        <CaptureViewer />
      </div>
    </div>
  );
};

export default Dashboard;
