
import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Clock, Timer } from 'lucide-react';
import { useScreenCapture } from '@/contexts/ScreenCaptureContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const CaptureTimer: React.FC = () => {
  const { startTimer, stopTimer, isTimerRunning, remainingTime } = useScreenCapture();
  const [selectedTime, setSelectedTime] = useState(30); // Default to 30 seconds
  
  // Time presets in seconds
  const timePresets = [
    { label: '30s', value: 30 },
    { label: '1m', value: 60 },
    { label: '5m', value: 300 },
    { label: '15m', value: 900 },
    { label: '30m', value: 1800 }
  ];
  
  const handleStartTimer = () => {
    startTimer(selectedTime);
  };
  
  const handleSliderChange = (value: number[]) => {
    setSelectedTime(value[0]);
  };
  
  const formatTimeDisplay = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          Capture Timer
        </CardTitle>
        <CardDescription>
          Set a timer to automatically capture your screen
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="mb-6 space-y-5">
          {!isTimerRunning ? (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Timer Duration</span>
                  <span className="font-medium">{formatTimeDisplay(selectedTime)}</span>
                </div>
                <Slider
                  value={[selectedTime]}
                  min={5}
                  max={1800}
                  step={5}
                  onValueChange={handleSliderChange}
                  aria-label="Select timer duration"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {timePresets.map((preset) => (
                  <Button 
                    key={preset.value}
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTime(preset.value)}
                    className={selectedTime === preset.value ? "border-primary" : ""}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
                <Clock className="h-6 w-6" />
                {formatTimeDisplay(remainingTime)}
              </div>
              <p className="text-sm text-muted-foreground">
                Screenshot will be captured automatically when timer ends
              </p>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        {!isTimerRunning ? (
          <Button 
            onClick={handleStartTimer} 
            className="w-full gap-2"
            disabled={selectedTime <= 0}
          >
            <Timer className="h-4 w-4" />
            Start Timer
          </Button>
        ) : (
          <Button 
            onClick={stopTimer} 
            variant="destructive"
            className="w-full"
          >
            Cancel Timer
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CaptureTimer;
