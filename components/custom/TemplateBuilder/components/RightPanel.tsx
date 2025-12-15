import { ChevronLeft, ChevronRight, Palette, Wand2, Settings as SettingsIcon, Type, ImageIcon, Square, Circle, Copy, Trash2, Layers, Sparkles, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
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
}

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
}: RightPanelProps) {
  const selectedElement = visualElements.find((el) => el.id === selectedElementId);

  const isImageVariable = (key: string, def: any) => {
    return key.toLowerCase().includes('image') || 
           key.toLowerCase().includes('photo') || 
           key.toLowerCase().includes('picture') ||
           def.type === 'image';
  };

  return (
    <div className="w-80 bg-white/95 backdrop-blur-sm border-l border-purple-300/50 flex flex-col shadow-lg h-full">
      <div className="p-4 border-b border-purple-200/50 bg-white/60">
        <h2 className="font-semibold text-sm text-purple-900">Customization Panel</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        
        {/* Layers / Properties Section */}
        <div className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden">
          <button
            onClick={() => setActiveRightSection(activeRightSection === 'properties' ? 'variables' : 'properties')}
            className="w-full p-3 flex items-center justify-between text-left hover:bg-purple-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-purple-600" />
              <span className="font-medium text-sm text-gray-700">Layers & Properties</span>
            </div>
            <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${activeRightSection === 'properties' ? 'rotate-90' : ''}`} />
          </button>
          
          {activeRightSection === 'properties' && (
            <div className="p-4 border-t border-purple-100 bg-purple-50/30">
              {selectedElement ? (
                <div className="space-y-4">
                  {/* Header with Type and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-purple-900">
                      {selectedElement.type === 'text' && <Type className="h-4 w-4" />}
                      {selectedElement.type === 'image' && <ImageIcon className="h-4 w-4" />}
                      {selectedElement.type === 'rectangle' && <Square className="h-4 w-4" />}
                      {selectedElement.type === 'circle' && <Circle className="h-4 w-4" />}
                      <span className="capitalize">{selectedElement.type}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-purple-100 text-purple-700"
                        onClick={() => duplicateElement(selectedElement.id)}
                        title="Duplicate"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-red-100 text-red-500"
                        onClick={() => deleteElement(selectedElement.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Separator className="bg-purple-200" />

                  {/* Position & Size */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Position & Size</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-gray-600 mb-1">X</Label>
                        <Input
                          type="number"
                          value={Math.round(selectedElement.x)}
                          onChange={(e) => updateElement(selectedElement.id, { x: parseInt(e.target.value) || 0 })}
                          className="h-8 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600 mb-1">Y</Label>
                        <Input
                          type="number"
                          value={Math.round(selectedElement.y)}
                          onChange={(e) => updateElement(selectedElement.id, { y: parseInt(e.target.value) || 0 })}
                          className="h-8 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600 mb-1">Width</Label>
                        <Input
                          type="number"
                          value={Math.round(selectedElement.width)}
                          onChange={(e) => updateElement(selectedElement.id, { width: parseInt(e.target.value) || 1 })}
                          className="h-8 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600 mb-1">Height</Label>
                        <Input
                          type="number"
                          value={Math.round(selectedElement.height)}
                          onChange={(e) => updateElement(selectedElement.id, { height: parseInt(e.target.value) || 1 })}
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-purple-200" />

                  {/* Text Properties */}
                  {selectedElement.type === 'text' && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Text</h4>
                      <div>
                        <Label className="text-xs text-gray-600 mb-1">Content</Label>
                        <Textarea
                          value={selectedElement.content || ''}
                          onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                          className="min-h-[60px] text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600 mb-1">Font Size</Label>
                        <div className="flex items-center gap-2">
                            <Slider
                            value={[selectedElement.fontSize || 16]}
                            onValueChange={([val]) => updateElement(selectedElement.id, { fontSize: val })}
                            min={8}
                            max={200}
                            step={1}
                            className="flex-1"
                            />
                            <Input
                            type="number"
                            value={selectedElement.fontSize || 16}
                            onChange={(e) => updateElement(selectedElement.id, { fontSize: parseInt(e.target.value) || 16 })}
                            className="w-16 h-8 text-xs"
                            />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600 mb-1">Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={selectedElement.color || '#000000'}
                            onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                            className="w-10 h-8 p-1 cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={selectedElement.color || '#000000'}
                            onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                            className="flex-1 h-8 text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600 mb-1">Font Family</Label>
                        <Select
                          value={selectedElement.fontFamily || 'Arial, sans-serif'}
                          onValueChange={(value) => updateElement(selectedElement.id, { fontFamily: value })}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                            <SelectItem value="'Times New Roman', serif">Times New Roman</SelectItem>
                            <SelectItem value="'Courier New', monospace">Courier New</SelectItem>
                            <SelectItem value="Georgia, serif">Georgia</SelectItem>
                            <SelectItem value="Verdana, sans-serif">Verdana</SelectItem>
                            <SelectItem value="'Helvetica Neue', sans-serif">Helvetica</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={selectedElement.fontWeight === 'bold' ? 'default' : 'outline'}
                          size="icon"
                          onClick={() => updateElement(selectedElement.id, {
                            fontWeight: selectedElement.fontWeight === 'bold' ? 'normal' : 'bold'
                          })}
                          className="h-8 w-8"
                        >
                          <Bold className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={selectedElement.fontStyle === 'italic' ? 'default' : 'outline'}
                          size="icon"
                          onClick={() => updateElement(selectedElement.id, {
                            fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic'
                          })}
                          className="h-8 w-8"
                        >
                          <Italic className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={selectedElement.textDecoration === 'underline' ? 'default' : 'outline'}
                          size="icon"
                          onClick={() => updateElement(selectedElement.id, {
                            textDecoration: selectedElement.textDecoration === 'underline' ? 'none' : 'underline'
                          })}
                          className="h-8 w-8"
                        >
                          <Underline className="h-4 w-4" />
                        </Button>
                        <Button
                              variant={selectedElement.textAlign === 'left' ? 'default' : 'outline'}
                              size="icon"
                              onClick={() => updateElement(selectedElement.id, { textAlign: 'left' })}
                              className="h-8 w-8"
                            >
                              <AlignLeft className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={selectedElement.textAlign === 'center' ? 'default' : 'outline'}
                              size="icon"
                              onClick={() => updateElement(selectedElement.id, { textAlign: 'center' })}
                              className="h-8 w-8"
                            >
                              <AlignCenter className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={selectedElement.textAlign === 'right' ? 'default' : 'outline'}
                              size="icon"
                              onClick={() => updateElement(selectedElement.id, { textAlign: 'right' })}
                              className="h-8 w-8"
                            >
                              <AlignRight className="h-4 w-4" />
                            </Button>
                      </div>
                    </div>
                  )}

                  {/* Image Properties */}
                  {selectedElement.type === 'image' && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</h4>
                      <div>
                        <Label className="text-xs text-gray-600 mb-1">URL</Label>
                        <Input
                          type="text"
                          value={selectedElement.src || ''}
                          onChange={(e) => updateElement(selectedElement.id, { src: e.target.value })}
                          placeholder="https://..."
                          className="h-8 text-xs"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => {
                          const imageVariable = selectedElement.linkedVariable || `image_${selectedElement.id}`;
                          setActiveImageVariable(imageVariable);
                          setShowImageSelector(true);
                          if (!selectedElement.linkedVariable) {
                            (window as any).__tempImageElementId = selectedElement.id;
                          }
                        }}
                      >
                        <Sparkles className="h-3 w-3 mr-2 text-purple-500" />
                        Choose Stock / AI Image
                      </Button>
                      {selectedElement.src && (
                        <div
                          className="mt-2 relative group cursor-pointer rounded-lg overflow-hidden border border-gray-200"
                          onClick={() => {
                            const imageVariable = selectedElement.linkedVariable || `image_${selectedElement.id}`;
                            setActiveImageVariable(imageVariable);
                            setShowImageSelector(true);
                            if (!selectedElement.linkedVariable) {
                              (window as any).__tempImageElementId = selectedElement.id;
                            }
                          }}
                        >
                          <img src={selectedElement.src} alt="Preview" className="w-full h-32 object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="text-white text-xs text-center">
                              <ImageIcon className="mx-auto mb-1 h-5 w-5" />
                              <div>Click to change</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Shape Properties */}
                  {(selectedElement.type === 'rectangle' || selectedElement.type === 'circle') && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Style</h4>
                      <div>
                        <Label className="text-xs text-gray-600 mb-1">Background Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={selectedElement.backgroundColor || '#cccccc'}
                            onChange={(e) => updateElement(selectedElement.id, { backgroundColor: e.target.value })}
                            className="w-10 h-8 p-1 cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={selectedElement.backgroundColor || '#cccccc'}
                            onChange={(e) => updateElement(selectedElement.id, { backgroundColor: e.target.value })}
                            className="flex-1 h-8 text-xs"
                          />
                        </div>
                      </div>
                      {selectedElement.type === 'rectangle' && (
                        <div>
                          <Label className="text-xs text-gray-600 mb-1">Border Radius</Label>
                          <Input
                            type="number"
                            value={selectedElement.borderRadius || 0}
                            onChange={(e) => updateElement(selectedElement.id, { borderRadius: parseInt(e.target.value) || 0 })}
                            className="h-8 text-xs"
                          />
                        </div>
                      )}
                      <div>
                        <Label className="text-xs text-gray-600 mb-1">Border</Label>
                        <Input
                          type="text"
                          value={selectedElement.border || ''}
                          onChange={(e) => updateElement(selectedElement.id, { border: e.target.value })}
                          placeholder="2px solid #000000"
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                  )}

                  <Separator className="bg-purple-200" />

                  {/* Transform */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Transform</h4>
                    <div>
                      <Label className="text-xs text-gray-600 mb-1">Rotation (°)</Label>
                      <div className="flex gap-2 items-center">
                        <Slider
                          value={[selectedElement.rotation || 0]}
                          onValueChange={([value]) => updateElement(selectedElement.id, { rotation: value })}
                          min={0}
                          max={360}
                          step={1}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={selectedElement.rotation || 0}
                          onChange={(e) => updateElement(selectedElement.id, { rotation: parseInt(e.target.value) || 0 })}
                          className="w-16 h-8 text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 mb-1">Opacity (%)</Label>
                      <div className="flex gap-2 items-center">
                        <Slider
                          value={[selectedElement.opacity !== undefined ? selectedElement.opacity * 100 : 100]}
                          onValueChange={([value]) => updateElement(selectedElement.id, { opacity: value / 100 })}
                          min={0}
                          max={100}
                          step={1}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={selectedElement.opacity !== undefined ? Math.round(selectedElement.opacity * 100) : 100}
                          onChange={(e) => updateElement(selectedElement.id, { opacity: (parseInt(e.target.value) || 100) / 100 })}
                          className="w-16 h-8 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-purple-200" />

                  {/* Layer Order */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Layer Order</h4>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveElementZIndex(selectedElement.id, 'up')}
                        disabled={selectedElement.zIndex >= visualElements.length - 1}
                        className="flex-1 text-xs"
                      >
                        <Layers className="h-3 w-3 mr-2" />
                        Bring Forward
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveElementZIndex(selectedElement.id, 'down')}
                        disabled={selectedElement.zIndex <= 0}
                        className="flex-1 text-xs"
                      >
                        <Layers className="h-3 w-3 mr-2" />
                        Send Backward
                      </Button>
                    </div>
                    <div className="text-xs text-gray-400 text-center">
                      Layer {selectedElement.zIndex + 1} of {visualElements.length}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Layers className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm font-medium">No element selected</p>
                  <p className="text-xs mt-2 text-gray-400">Select an element on the canvas to edit its properties</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Variables Section */}
        <div className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden">
          <button
            onClick={() => setActiveRightSection(activeRightSection === 'variables' ? 'properties' : 'variables')}
            className="w-full p-3 flex items-center justify-between text-left hover:bg-purple-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-purple-600" />
              <span className="font-medium text-sm text-gray-700">Variables</span>
            </div>
            <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${activeRightSection === 'variables' ? 'rotate-90' : ''}`} />
          </button>
          
          {activeRightSection === 'variables' && (
            <div className="p-4 border-t border-purple-100 bg-purple-50/30">
              {selectedTemplate.variables && Object.keys(selectedTemplate.variables).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(selectedTemplate.variables).map(([key, def]: [string, any]) => (
                    <div key={key} className="space-y-1.5">
                      <Label className="text-xs font-medium text-gray-600">
                        {def.label || key}
                      </Label>

                      {def.type === 'color' ? (
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={variableValues[key] || '#000000'}
                            onChange={(e) => setVariableValues(prev => ({ ...prev, [key]: e.target.value }))}
                            className="w-10 h-8 p-1 cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={variableValues[key] || ''}
                            onChange={(e) => setVariableValues(prev => ({ ...prev, [key]: e.target.value }))}
                            className="flex-1 h-8 text-xs"
                            placeholder="#000000"
                          />
                        </div>
                      ) : isImageVariable(key, def) ? (
                        <div className="space-y-2">
                          <Input
                            type="text"
                            value={variableValues[key] || ''}
                            onChange={(e) => setVariableValues(prev => ({ ...prev, [key]: e.target.value }))}
                            className="h-8 text-xs"
                            placeholder="https://..."
                          />
                          {variableValues[key] && (
                            <div className="relative aspect-video rounded-md overflow-hidden border border-gray-200 bg-gray-50 group">
                              <img
                                src={variableValues[key]}
                                alt={def.label || key}
                                className="w-full h-full object-cover"
                                onError={(e) => (e.currentTarget.style.display = 'none')}
                              />
                              <div
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                                onClick={() => {
                                  setActiveImageVariable(key);
                                  setShowImageSelector(true);
                                }}
                              >
                                <Button variant="secondary" size="sm" className="pointer-events-none">
                                  <Sparkles className="h-3 w-3 mr-2" />
                                  Change Image
                                </Button>
                              </div>
                            </div>
                          )}
                          {!variableValues[key] && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-xs"
                              onClick={() => {
                                setActiveImageVariable(key);
                                setShowImageSelector(true);
                              }}
                            >
                              <ImageIcon className="h-3 w-3 mr-2" />
                              Select Image
                            </Button>
                          )}
                        </div>
                      ) : (
                        <Input
                          type={def.type === 'number' ? 'number' : 'text'}
                          value={variableValues[key] || ''}
                          onChange={(e) => setVariableValues(prev => ({ ...prev, [key]: e.target.value }))}
                          className="h-8 text-xs"
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Wand2 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No variables defined</p>
                  <p className="text-xs mt-2 text-gray-400">Variables will appear here once defined in the template</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Settings Section */}
        <div className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden">
          <button
            onClick={() => setActiveRightSection(activeRightSection === 'settings' ? 'variables' : 'settings')}
            className="w-full p-3 flex items-center justify-between text-left hover:bg-purple-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4 text-purple-600" />
              <span className="font-medium text-sm text-gray-700">Settings</span>
            </div>
            <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${activeRightSection === 'settings' ? 'rotate-90' : ''}`} />
          </button>
          
          {activeRightSection === 'settings' && (
            <div className="p-4 border-t border-purple-100 bg-purple-50/30 space-y-3">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Template Configuration</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-gray-600 mb-1">Width</Label>
                  <Input
                    type="number"
                    value={selectedTemplate.width}
                    onChange={(e) => setSelectedTemplate(prev => ({ ...prev, width: parseInt(e.target.value) || 1000 }))}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600 mb-1">Height</Label>
                  <Input
                    type="number"
                    value={selectedTemplate.height}
                    onChange={(e) => setSelectedTemplate(prev => ({ ...prev, height: parseInt(e.target.value) || 1500 }))}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs text-gray-600 mb-1">Category</Label>
                <Input
                  type="text"
                  value={selectedTemplate.category}
                  onChange={(e) => setSelectedTemplate(prev => ({ ...prev, category: e.target.value }))}
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600 mb-1">Description</Label>
                <Textarea
                  value={selectedTemplate.description || ''}
                  onChange={(e) => setSelectedTemplate(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-[60px] text-sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Export Button */}
      <div className="p-4 border-t border-purple-200 bg-white/60">
        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md">
          Export Template
        </Button>
      </div>
    </div>
  );
}
