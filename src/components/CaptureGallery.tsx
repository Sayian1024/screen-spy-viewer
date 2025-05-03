
import React from 'react';
import { useScreenCapture, CapturedScreen } from '@/contexts/ScreenCaptureContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';

const CaptureGallery: React.FC = () => {
  const { captures, setSelectedCapture, deleteCapture } = useScreenCapture();

  if (captures.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 rounded-md border border-dashed border-gray-300 bg-gray-50 p-4">
        <p className="text-muted-foreground text-center">No screenshots yet. Click the capture button to start.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Recent Screenshots</h2>
      <ScrollArea className="h-[300px] rounded-md border">
        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
          {captures.map((capture) => (
            <CaptureCard
              key={capture.id}
              capture={capture}
              onSelect={() => setSelectedCapture(capture)}
              onDelete={() => deleteCapture(capture.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

interface CaptureCardProps {
  capture: CapturedScreen;
  onSelect: () => void;
  onDelete: () => void;
}

const CaptureCard: React.FC<CaptureCardProps> = ({ capture, onSelect, onDelete }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="relative">
          <div className="aspect-video overflow-hidden">
            <img 
              src={capture.imageData} 
              alt={`Screenshot from ${new Date(capture.timestamp).toLocaleString()}`} 
              className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={onSelect}
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="truncate">
                {formatDistanceToNow(new Date(capture.timestamp), { addSuffix: true })}
              </span>
              <Button 
                variant="destructive" 
                size="sm"
                className="h-6 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CaptureGallery;
