'use client';

import { Save, Download, Undo2, Redo2, Copy, Clipboard, Settings, Grid3x3, Ruler, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TopActionBarProps {
  templateName: string;
  onTemplateNameChange: (name: string) => void;
  onSave: () => void;
  onExport: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  showRulers: boolean;
  onToggleRulers: () => void;
  isSaving?: boolean;
  lastSaved?: Date;
}

export function TopActionBar({
  templateName,
  onTemplateNameChange,
  onSave,
  onExport,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  zoom,
  onZoomChange,
  showGrid,
  onToggleGrid,
  showRulers,
  onToggleRulers,
  isSaving,
  lastSaved,
}: TopActionBarProps) {
  const zoomPresets = [25, 50, 75, 100, 125, 150, 200];

  return (
    <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 gap-4 shrink-0">
      {/* Left: File Actions */}
      <div className="flex items-center gap-3">
        <Input
          value={templateName}
          onChange={(e) => onTemplateNameChange(e.target.value)}
          className="w-48 h-8 text-sm font-medium"
          placeholder="Untitled Design"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          disabled={isSaving}
          className="h-8 gap-1.5"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
        {lastSaved && (
          <span className="text-xs text-slate-400">
            Saved {lastSaved.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Center: Edit Actions */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-lg border border-slate-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            className="h-7 w-7 p-0"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            className="h-7 w-7 p-0"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="h-5 w-px bg-slate-200" />

        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5"
          title="Copy (Ctrl+C)"
        >
          <Copy className="w-4 h-4" />
          Copy
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5"
          title="Paste (Ctrl+V)"
        >
          <Clipboard className="w-4 h-4" />
          Paste
        </Button>
      </div>

      {/* Right: View & Export */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1.5">
              <span className="text-sm font-medium">{zoom}%</span>
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {zoomPresets.map((preset) => (
              <DropdownMenuItem
                key={preset}
                onClick={() => onZoomChange(preset)}
              >
                {preset}%
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onZoomChange(100)}>
              Fit to Screen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-5 w-px bg-slate-200" />

        <Button
          variant={showGrid ? 'secondary' : 'ghost'}
          size="sm"
          onClick={onToggleGrid}
          className="h-8 w-8 p-0"
          title="Toggle Grid (Ctrl+G)"
        >
          <Grid3x3 className="w-4 h-4" />
        </Button>
        <Button
          variant={showRulers ? 'secondary' : 'ghost'}
          size="sm"
          onClick={onToggleRulers}
          className="h-8 w-8 p-0"
          title="Toggle Rulers (Ctrl+R)"
        >
          <Ruler className="w-4 h-4" />
        </Button>

        <div className="h-5 w-px bg-slate-200" />

        <Button
          onClick={onExport}
          size="sm"
          className="h-8 gap-1.5 bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>
    </div>
  );
}
