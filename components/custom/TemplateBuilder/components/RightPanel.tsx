import { useState, useRef, useEffect } from 'react';
import { 
  ChevronUp, ChevronDown, Palette, Wand2, Settings as SettingsIcon, 
  Type, ImageIcon, Square, Circle, Copy, Trash2, Sparkles, 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Move, RotateCw, Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HexColorPicker } from 'react-colorful';
import type { VisualElement, CustomTemplate } from '../types';

interface RightPanelProps {
  rightPanelCollapsed: boolean;
  setRightPanelCollapsed: (collapsed: boolean) => void;
  activeRightSection: 'properties' | 'variables' | 'settings';
  setActiveRightSection: (section: 'properties' | 'variables' | 'settings') => void;
  visualElements: VisualElement[];
  selectedElementId: string | null;
  selectedTemplate: CustomTemplate;
  setSelectedTemplate: (template: CustomTemplate | ((prev: CustomTemplate) => CustomTemplate)) => void;
  variableValues: Record<string, any>;
  setVariableValues: (values: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>)) => void;
  updateElement: (id: string, updates: Partial<VisualElement>) => void;
  duplicateElement: (id: string) => void;
  deleteElement: (id: string) => void;
  moveElementZIndex: (id: string, direction: 'up' | 'down') => void;
  setActiveImageVariable: (key: string) => void;
  setShowImageSelector: (show: boolean) => void;
  setSelectedElementId: (id: string | null) => void;
}

// Visual drag-only control (no manual input)
const DragNumber = ({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 1000, 
  step = 1,
  unit = ''
}: { 
  label: string; 
  value: number; 
  onChange: (val: number) => void; 
  min?: number; 
  max?: number; 
  step?: number;
  unit?: string;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const startValue = useRef(0);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = startY.current - e.clientY;
      const newValue = Math.max(min, Math.min(max, startValue.current + delta * step));
      onChange(Math.round(newValue));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, min, max, step, onChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startY.current = e.clientY;
    startValue.current = value;
    document.body.style.cursor = 'ns-resize';
    e.preventDefault();
  };

  return (
    <div 
      className={`flex items-center justify-between gap-3 p-3 rounded-lg border-2 transition-all cursor-ns-resize select-none ${
        isDragging 
          ? 'bg-blue-50 border-blue-400 shadow-md scale-[1.02]' 
          : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
      }`}
      onMouseDown={handleMouseDown}
      title="Drag up/down to adjust"
      role="slider"
      aria-label={`${label}: ${value}${unit}. Drag to adjust`}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      tabIndex={0}
    >
      <div className="flex items-center gap-2">
        <div className={`flex flex-col gap-0.5 transition-colors ${isDragging ? 'text-blue-600' : 'text-gray-400'}`}>
          <ChevronUp className="h-3 w-3" />
          <ChevronDown className="h-3 w-3" />
        </div>
        <Label className={`text-sm font-semibold pointer-events-none transition-colors ${
          isDragging ? 'text-blue-600' : 'text-gray-950'
        }`}>
          {label}
        </Label>
      </div>
      <div className={`px-3 py-1.5 rounded-md font-mono text-sm font-medium transition-all ${
        isDragging 
          ? 'bg-blue-100 text-blue-700' 
          : 'bg-gray-100 text-gray-950'
      }`}>
        {value}{unit}
      </div>
    </div>
  );
};

// Modern color picker with HexColorPicker (matches Brand DNA page)
const ColorPicker = ({ 
  value, 
  onChange, 
  label 
}: { 
  value: string; 
  onChange: (val: string) => void; 
  label?: string;
}) => {
  return (
    <div className="space-y-3">
      {label && <Label className="text-sm text-gray-950 font-medium">{label}</Label>}
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 bg-white cursor-pointer transition-all">
            <div 
              className="w-10 h-10 rounded-lg border border-gray-200 shadow-sm flex-shrink-0"
              style={{ backgroundColor: value }}
            />
            <div className="flex-1">
              <div className="text-xs text-gray-600 mb-1">Color</div>
              <div className="text-sm text-gray-950 font-mono">{value.toUpperCase()}</div>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="start">
          <HexColorPicker color={value} onChange={onChange} />
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-gray-600">Hex:</span>
            <Input 
              value={value} 
              onChange={(e) => {
                const val = e.target.value;
                if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                  onChange(val);
                }
              }}
              className="h-9 text-sm font-mono"
              placeholder="#000000"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

// Visual slider with live value display
const VisualSlider = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  icon
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  icon?: React.ReactNode;
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm text-gray-950 font-medium flex items-center gap-2">
          {icon}
          {label}
        </Label>
        <span className="text-sm text-gray-700 font-mono min-w-[3rem] text-right">{value}{unit}</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([val]) => onChange(val)}
        min={min}
        max={max}
        step={step}
        className="cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-label={`${label}: ${value}${unit}`}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      />
    </div>
  );
};

// Visual Joystick for X/Y position control
const PositionJoystick = ({
  x,
  y,
  onXChange,
  onYChange,
  maxX = 2000,
  maxY = 2000
}: {
  x: number;
  y: number;
  onXChange: (val: number) => void;
  onYChange: (val: number) => void;
  maxX?: number;
  maxY?: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const containerSize = 200;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updatePosition(e);
  };

  const updatePosition = (e: MouseEvent | React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const newX = Math.max(0, Math.min(maxX, Math.round((offsetX / containerSize) * maxX)));
    const newY = Math.max(0, Math.min(maxY, Math.round((offsetY / containerSize) * maxY)));

    onXChange(newX);
    onYChange(newY);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => updatePosition(e);
    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, maxX, maxY]);

  const knobX = (x / maxX) * containerSize;
  const knobY = (y / maxY) * containerSize;
  const centerX = (maxX / 2 / maxX) * containerSize;
  const centerY = (maxY / 2 / maxY) * containerSize;

  return (
    <div className="space-y-3 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-gray-950 flex items-center gap-2">
          <Move className="h-4 w-4 text-blue-600" />
          Position Joystick
        </Label>
        <span className="text-xs text-gray-600 font-mono">X: {Math.round(x)} Y: {Math.round(y)}</span>
      </div>

      {/* Joystick Container */}
      <div
        ref={containerRef}
        className={`relative w-full rounded-lg border-2 transition-all cursor-crosshair ${
          isDragging
            ? 'border-blue-500 bg-white shadow-lg'
            : 'border-blue-300 bg-white shadow-md hover:border-blue-400'
        }`}
        style={{ aspectRatio: '1', maxWidth: `${containerSize}px` }}
        onMouseDown={handleMouseDown}
        role="slider"
        aria-label="Position joystick"
        tabIndex={0}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 rounded-lg opacity-10 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Center Crosshair */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute w-1 h-8 bg-blue-300 opacity-50" />
          <div className="absolute h-1 w-8 bg-blue-300 opacity-50" />
          <div className="w-2 h-2 bg-blue-400 rounded-full" />
        </div>

        {/* Center Ring Indicator */}
        <div
          className="absolute w-12 h-12 border-3 border-purple-400 rounded-full pointer-events-none opacity-100 transition-all"
          style={{
            left: `calc(50% - 24px)`,
            top: `calc(50% - 24px)`,
            boxShadow: '0 0 12px rgba(168, 85, 247, 0.4)'
          }}
        />
        
        {/* Center Dot */}
        <div
          className="absolute w-3 h-3 bg-purple-500 rounded-full pointer-events-none opacity-100"
          style={{
            left: `calc(50% - 6px)`,
            top: `calc(50% - 6px)`,
            boxShadow: '0 0 8px rgba(168, 85, 247, 0.8)'
          }}
        />

        {/* Joystick Knob */}
        <div
          className={`absolute w-6 h-6 rounded-full border-2 shadow-lg transition-all pointer-events-none ${
            isDragging
              ? 'border-blue-600 bg-blue-100 scale-110'
              : 'border-blue-500 bg-blue-50 hover:scale-105'
          }`}
          style={{
            left: `calc(${(knobX / containerSize) * 100}% - 12px)`,
            top: `calc(${(knobY / containerSize) * 100}% - 12px)`,
          }}
        >
          <div className="absolute inset-1 bg-blue-500 rounded-full opacity-70" />
        </div>

        {/* Corner Labels */}
        <div className="absolute top-1 left-1 text-xs font-semibold text-gray-400 pointer-events-none">0</div>
        <div className="absolute top-1 right-1 text-xs font-semibold text-gray-400 pointer-events-none">{maxX}</div>
        <div className="absolute bottom-1 left-1 text-xs font-semibold text-gray-400 pointer-events-none">{maxY}</div>
        <div className="absolute bottom-1 right-1 text-xs font-semibold text-gray-400 pointer-events-none">max</div>
      </div>

      {/* Info Text */}
      <p className="text-xs text-gray-600 text-center">Click or drag to adjust position</p>
    </div>
  );
};

export function RightPanel({
  rightPanelCollapsed,
  setRightPanelCollapsed,
  activeRightSection,
  setActiveRightSection,
  visualElements,
  selectedElementId,
  selectedTemplate,
  setSelectedTemplate,
  variableValues,
  setVariableValues,
  updateElement,
  duplicateElement,
  deleteElement,
  moveElementZIndex,
  setActiveImageVariable,
  setShowImageSelector,
  setSelectedElementId,
}: RightPanelProps) {
  const selectedElement = visualElements.find((el) => el.id === selectedElementId);

  const currentTab = 
    activeRightSection === 'properties' ? 'design' : 
    activeRightSection === 'variables' ? 'config' : 
    'layers';

  const handleTabChange = (value: string) => {
    if (value === 'design') setActiveRightSection('properties');
    else if (value === 'config') setActiveRightSection('variables');
    else if (value === 'layers') setActiveRightSection('settings');
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header with Tabs */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-200 bg-white">
        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-gray-100 p-1 h-11">
            <TabsTrigger value="design" className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Design
            </TabsTrigger>
            <TabsTrigger value="layers" className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Layers
            </TabsTrigger>
            <TabsTrigger value="config" className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Config
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="flex-1 h-full">
        <div className="p-4 pb-24">
          {currentTab === 'design' && (
            <div className="space-y-6">
              {selectedElement ? (
                <>
                  {/* Quick Actions Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                        {selectedElement.type === 'text' && <Type className="h-5 w-5" />}
                        {selectedElement.type === 'image' && <ImageIcon className="h-5 w-5" />}
                        {selectedElement.type === 'rectangle' && <Square className="h-5 w-5" />}
                        {selectedElement.type === 'circle' && <Circle className="h-5 w-5" />}
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-950 capitalize">{selectedElement.type}</h3>
                        <p className="text-xs text-gray-600">Layer</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500" 
                        onClick={() => duplicateElement(selectedElement.id)}
                        aria-label="Duplicate element"
                      >
                        <Copy className="h-5 w-5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 text-gray-700 hover:text-red-600 hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500" 
                        onClick={() => deleteElement(selectedElement.id)}
                        aria-label="Delete element"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  {/* PRIMARY ZONE - Always Visible Transform Controls */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-gray-950 flex items-center gap-2">
                        <Move className="h-4 w-4" />
                        Transform
                      </h4>
                      
                      {/* Visual Joystick for Position */}
                      <PositionJoystick
                        x={Math.round(selectedElement.x || 1000)}
                        y={Math.round(selectedElement.y || 1000)}
                        onXChange={(val) => updateElement(selectedElement.id, { x: val })}
                        onYChange={(val) => updateElement(selectedElement.id, { y: val })}
                        maxX={2000}
                        maxY={2000}
                      />

                      {/* Individual Drag Controls */}
                      <div className="space-y-2 pt-2">
                        <div className="text-xs text-gray-600 font-medium">Fine Adjustments:</div>
                        <DragNumber label="X" value={Math.round(selectedElement.x)} onChange={(val) => updateElement(selectedElement.id, { x: val })} max={2000} unit="px" />
                        <DragNumber label="Y" value={Math.round(selectedElement.y)} onChange={(val) => updateElement(selectedElement.id, { y: val })} max={2000} unit="px" />
                      </div>

                      {/* Size Controls */}
                      <div className="space-y-2 pt-2">
                        <div className="text-xs text-gray-600 font-medium">Size:</div>
                        <DragNumber label="W" value={Math.round(selectedElement.width)} onChange={(val) => updateElement(selectedElement.id, { width: val })} min={1} max={2000} unit="px" />
                        <DragNumber label="H" value={Math.round(selectedElement.height)} onChange={(val) => updateElement(selectedElement.id, { height: val })} min={1} max={2000} unit="px" />
                      </div>

                      <VisualSlider
                        label="Rotation"
                        value={selectedElement.rotation || 0}
                        onChange={(val) => updateElement(selectedElement.id, { rotation: val })}
                        max={360}
                        unit="°"
                        icon={<RotateCw className="h-4 w-4" />}
                      />
                    </div>

                    <Separator />

                    {/* Typography Section - For Text Elements */}
                    {selectedElement.type === 'text' && (
                      <>
                        <div className="space-y-4">
                          <h4 className="text-sm font-semibold text-gray-950 flex items-center gap-2">
                            <Type className="h-4 w-4" />
                            Typography
                          </h4>

                          <div className="space-y-3">
                            <Label htmlFor="text-content" className="text-sm text-gray-950 font-medium">Content</Label>
                            <Textarea 
                              id="text-content"
                              value={selectedElement.content} 
                              onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                              className="min-h-[80px] text-sm bg-white border-gray-200 focus-visible:ring-2 focus-visible:ring-blue-500 resize-none"
                              placeholder="Enter text..."
                              aria-label="Text content"
                            />
                          </div>
                          
                          <div className="space-y-3">
                            <Label htmlFor="font-family" className="text-sm text-gray-950 font-medium">Font</Label>
                            <Select
                              value={selectedElement.fontFamily || 'Arial, sans-serif'}
                              onValueChange={(value) => updateElement(selectedElement.id, { fontFamily: value })}
                            >
                              <SelectTrigger id="font-family" className="h-10 text-sm bg-white border-gray-200 hover:border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                                <SelectItem value="'Times New Roman', serif">Times New Roman</SelectItem>
                                <SelectItem value="'Courier New', monospace">Courier New</SelectItem>
                                <SelectItem value="Georgia, serif">Georgia</SelectItem>
                                <SelectItem value="Verdana, sans-serif">Verdana</SelectItem>
                                <SelectItem value="'Helvetica Neue', sans-serif">Helvetica</SelectItem>
                                <SelectItem value="Impact, sans-serif">Impact</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <VisualSlider
                            label="Size"
                            value={selectedElement.fontSize || 16}
                            onChange={(val) => updateElement(selectedElement.id, { fontSize: val })}
                            min={8}
                            max={200}
                            unit="px"
                          />

                          <ColorPicker 
                            label="Color"
                            value={selectedElement.color || '#000000'} 
                            onChange={(val) => updateElement(selectedElement.id, { color: val })} 
                          />

                          <div className="space-y-3">
                            <Label className="text-sm text-gray-950 font-medium">Style</Label>
                            <div className="flex gap-2">
                              <ToggleGroup type="multiple" className="justify-start bg-gray-100 p-1 rounded-lg">
                                <ToggleGroupItem 
                                  value="bold" 
                                  size="lg"
                                  className="h-10 w-10 data-[state=on]:bg-white data-[state=on]:shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500"
                                  onClick={() => updateElement(selectedElement.id, { fontWeight: selectedElement.fontWeight === 'bold' ? 'normal' : 'bold' })}
                                  aria-label="Bold"
                                >
                                  <Bold className="h-4 w-4" />
                                </ToggleGroupItem>
                                <ToggleGroupItem 
                                  value="italic" 
                                  size="lg"
                                  className="h-10 w-10 data-[state=on]:bg-white data-[state=on]:shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500"
                                onClick={() => updateElement(selectedElement.id, { fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic' })}
                                  aria-label="Italic"
                                >
                                  <Italic className="h-4 w-4" />
                                </ToggleGroupItem>
                                <ToggleGroupItem 
                                  value="underline" 
                                  size="lg"
                                  className="h-10 w-10 data-[state=on]:bg-white data-[state=on]:shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500"
                                  onClick={() => updateElement(selectedElement.id, { textDecoration: selectedElement.textDecoration === 'underline' ? 'none' : 'underline' })}
                                  aria-label="Underline"
                                >
                                  <Underline className="h-4 w-4" />
                                </ToggleGroupItem>
                              </ToggleGroup>

                              <Separator orientation="vertical" className="h-10" />

                              <ToggleGroup type="single" value={selectedElement.textAlign as string} className="justify-start bg-gray-100 p-1 rounded-lg">
                                <ToggleGroupItem 
                                  value="left" 
                                  size="lg"
                                  className="h-10 w-10 data-[state=on]:bg-white data-[state=on]:shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500"
                                  onClick={() => updateElement(selectedElement.id, { textAlign: 'left' })}
                                  aria-label="Align left"
                                >
                                  <AlignLeft className="h-4 w-4" />
                                </ToggleGroupItem>
                                <ToggleGroupItem 
                                  value="center" 
                                  size="lg"
                                  className="h-10 w-10 data-[state=on]:bg-white data-[state=on]:shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500"
                                  onClick={() => updateElement(selectedElement.id, { textAlign: 'center' })}
                                  aria-label="Align center"
                                >
                                  <AlignCenter className="h-4 w-4" />
                                </ToggleGroupItem>
                                <ToggleGroupItem 
                                  value="right" 
                                  size="lg"
                                  className="h-10 w-10 data-[state=on]:bg-white data-[state=on]:shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500"
                                  onClick={() => updateElement(selectedElement.id, { textAlign: 'right' })}
                                  aria-label="Align right"
                                >
                                  <AlignRight className="h-4 w-4" />
                                </ToggleGroupItem>
                              </ToggleGroup>
                            </div>
                          </div>

                          {/* Line Height */}
                          <VisualSlider
                            label="Line Height"
                            value={selectedElement.lineHeight || 1.4}
                            onChange={(val) => updateElement(selectedElement.id, { lineHeight: val })}
                            min={0.8}
                            max={3}
                            step={0.1}
                            unit=""
                          />

                          {/* Letter Spacing */}
                          <VisualSlider
                            label="Letter Spacing"
                            value={selectedElement.letterSpacing || 0}
                            onChange={(val) => updateElement(selectedElement.id, { letterSpacing: val })}
                            min={-5}
                            max={20}
                            step={0.5}
                            unit="px"
                          />

                          {/* Font Weight */}
                          <div className="space-y-3">
                            <Label htmlFor="font-weight" className="text-sm text-gray-950 font-medium">Weight</Label>
                            <Select
                              value={selectedElement.fontWeight || 'normal'}
                              onValueChange={(value) => updateElement(selectedElement.id, { fontWeight: value })}
                            >
                              <SelectTrigger id="font-weight" className="h-10 text-sm bg-white border-gray-200 hover:border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="300">Light</SelectItem>
                                <SelectItem value="normal">Regular</SelectItem>
                                <SelectItem value="600">Semibold</SelectItem>
                                <SelectItem value="bold">Bold</SelectItem>
                                <SelectItem value="900">Black</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Text Transform */}
                          <div className="space-y-3">
                            <Label htmlFor="text-transform" className="text-sm text-gray-950 font-medium">Transform</Label>
                            <Select
                              value={selectedElement.textTransform || 'none'}
                              onValueChange={(value) => updateElement(selectedElement.id, { textTransform: value as 'none' | 'uppercase' | 'lowercase' | 'capitalize' })}
                            >
                              <SelectTrigger id="text-transform" className="h-10 text-sm bg-white border-gray-200 hover:border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="uppercase">UPPERCASE</SelectItem>
                                <SelectItem value="lowercase">lowercase</SelectItem>
                                <SelectItem value="capitalize">Capitalize</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <Separator />
                      </>
                    )}

                    {/* Appearance Section */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-gray-950 flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Appearance
                      </h4>

                      <VisualSlider
                        label="Opacity"
                        value={Math.round((selectedElement.opacity || 1) * 100)}
                        onChange={(val) => updateElement(selectedElement.id, { opacity: val / 100 })}
                        max={100}
                        unit="%"
                      />

                      {(selectedElement.type === 'rectangle' || selectedElement.type === 'circle') && (
                        <>
                          <ColorPicker 
                            label="Fill"
                            value={selectedElement.backgroundColor || '#cccccc'} 
                            onChange={(val) => updateElement(selectedElement.id, { backgroundColor: val })} 
                          />

                          {selectedElement.type === 'rectangle' && (
                            <VisualSlider
                              label="Corner Radius"
                              value={selectedElement.borderRadius || 0}
                              onChange={(val) => updateElement(selectedElement.id, { borderRadius: val })}
                              max={100}
                              unit="px"
                            />
                          )}
                        </>
                      )}
                    </div>

                    {/* Image Controls */}
                    {selectedElement.type === 'image' && (
                      <>
                        <Separator />
                        <div className="space-y-4">
                          <h4 className="text-sm font-semibold text-gray-950 flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" />
                            Image
                          </h4>

                          <Button
                            variant="outline"
                            className="w-full h-11 justify-start text-sm bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:border-blue-300 focus-visible:ring-2 focus-visible:ring-blue-500"
                            onClick={() => {
                              const imageVariable = selectedElement.linkedVariable || `image_${selectedElement.id}`;
                              setActiveImageVariable(imageVariable);
                              setShowImageSelector(true);
                              if (!selectedElement.linkedVariable) {
                                (window as any).__tempImageElementId = selectedElement.id;
                              }
                            }}
                          >
                            <Sparkles className="h-4 w-4 mr-2" />
                            Replace Image
                          </Button>
                          
                          {selectedElement.src && selectedElement.src !== "" && (
                            <div className="rounded-lg overflow-hidden border-2 border-gray-200 aspect-video relative group">
                              <img src={selectedElement.src} alt="Element preview" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Move className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-950">No Selection</h3>
                  <p className="text-sm text-gray-600 mt-2">Click on an element in the canvas to edit its properties.</p>
                </div>
              )}
            </div>
          )}

          {currentTab === 'layers' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-semibold text-gray-950">Layers</h4>
                <span className="text-sm text-gray-600">{visualElements.length}</span>
              </div>
              <div className="space-y-2">
                {[...visualElements].reverse().map((el) => (
                  <div 
                    key={el.id}
                    className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border-2 min-h-[52px] ${
                      selectedElementId === el.id 
                        ? 'bg-blue-50 border-blue-500 shadow-sm' 
                        : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedElementId(el.id)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${el.type} layer`}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedElementId(el.id)}
                  >
                    <div className={selectedElementId === el.id ? 'text-blue-600' : 'text-gray-500'}>
                      {el.type === 'text' && <Type className="h-5 w-5" />}
                      {el.type === 'image' && <ImageIcon className="h-5 w-5" />}
                      {el.type === 'rectangle' && <Square className="h-5 w-5" />}
                      {el.type === 'circle' && <Circle className="h-5 w-5" />}
                    </div>
                    <span className="text-sm font-medium text-gray-950 truncate flex-1">
                      {el.type === 'text' ? (el.content?.slice(0, 20) || 'Text') : el.type}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 hover:bg-blue-100 focus-visible:ring-2 focus-visible:ring-blue-500" 
                        onClick={(e) => { e.stopPropagation(); moveElementZIndex(el.id, 'up'); }}
                        aria-label="Move layer up"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 hover:bg-blue-100 focus-visible:ring-2 focus-visible:ring-blue-500" 
                        onClick={(e) => { e.stopPropagation(); moveElementZIndex(el.id, 'down'); }}
                        aria-label="Move layer down"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentTab === 'config' && (
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-gray-950">Template Variables</h4>
              
              {selectedTemplate.variables && Object.keys(selectedTemplate.variables).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(selectedTemplate.variables).map(([key, def]: [string, any]) => (
                    <div key={key} className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <Label className="text-sm font-semibold text-gray-950 flex items-center gap-2">
                        <Wand2 className="h-4 w-4 text-purple-600" />
                        {def.label || key}
                      </Label>

                      {def.type === 'color' ? (
                        <ColorPicker 
                          value={variableValues[key] || '#000000'} 
                          onChange={(val) => setVariableValues((prev) => ({ ...prev, [key]: val }))}
                        />
                      ) : def.type === 'image' ? (
                        <Button
                          variant="outline"
                          className="w-full h-11 text-sm justify-start focus-visible:ring-2 focus-visible:ring-blue-500"
                          onClick={() => {
                            setActiveImageVariable(key);
                            setShowImageSelector(true);
                          }}
                        >
                          <ImageIcon className="h-4 w-4 mr-2" />
                          {variableValues[key] ? 'Change Image' : 'Select Image'}
                        </Button>
                      ) : (
                        <Input
                          value={variableValues[key] || ''}
                          onChange={(e) => setVariableValues((prev) => ({ ...prev, [key]: e.target.value }))}
                          className="h-10 text-sm bg-white border-gray-200 focus-visible:ring-2 focus-visible:ring-blue-500"
                          placeholder={`Enter ${def.label || key}`}
                          aria-label={def.label || key}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <SettingsIcon className="h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-sm text-gray-600">No variables defined for this template.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
