'use client';

import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface ZoomControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onFitToScreen: () => void;
}

export function ZoomControls({ zoom, onZoomChange, onFitToScreen }: ZoomControlsProps) {
  const handleZoomIn = () => {
    const newZoom = Math.min(200, Math.round(zoom / 25) * 25 + 25);
    onZoomChange(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(25, Math.round(zoom / 25) * 25 - 25);
    onZoomChange(newZoom);
  };

  return (
    <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-3 flex items-center gap-3 z-30">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleZoomOut}
        disabled={zoom <= 25}
        className="h-8 w-8 p-0"
        title="Zoom Out"
      >
        <ZoomOut className="w-4 h-4" />
      </Button>

      <div className="flex items-center gap-2">
        <Slider
          value={[zoom]}
          onValueChange={([value]) => onZoomChange(value)}
          min={25}
          max={200}
          step={5}
          className="w-24"
        />
        <span className="text-sm font-medium text-slate-700 w-12 text-center">
          {zoom}%
        </span>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleZoomIn}
        disabled={zoom >= 200}
        className="h-8 w-8 p-0"
        title="Zoom In"
      >
        <ZoomIn className="w-4 h-4" />
      </Button>

      <div className="h-6 w-px bg-slate-200" />

      <Button
        variant="ghost"
        size="sm"
        onClick={onFitToScreen}
        className="h-8 w-8 p-0"
        title="Fit to Screen"
      >
        <Maximize2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
