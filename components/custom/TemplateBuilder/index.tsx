import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { RightPanel } from './components/RightPanel';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { TemplateLibraryModal } from './components/TemplateLibraryModal';
import { ImageSelectorModal } from './components/ImageSelectorModal';
import { TopActionBar } from './components/TopActionBar';
import { ZoomControls } from './components/ZoomControls';
import { EditorToolbar, type EditorTool } from './EditorToolbar';
import { TextPanel, MediaPanel, ElementsPanel, LayersPanel } from './components/ToolPanels';
import { ContextMenu } from './components/ContextMenu';

import { useTemplateState } from './hooks/useTemplateState';
import { useVisualElements } from './hooks/useVisualElements';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useTemplateLoader } from './hooks/useTemplateLoader';

import type { CustomTemplate } from './types';
import './styles.css';

export default function CustomTemplateBuilderVisual() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  // Toast wrapper for compatibility
  const customToast = (props: { title: string; description?: string }) => {
    toast(props.title, { description: props.description });
  };

  // Template state
  const {
    selectedTemplate,
    setSelectedTemplate,
    variableValues,
    setVariableValues,
    rawHtmlTemplate,
    rawCssTemplate,
    setRawHtmlTemplate,
    setRawCssTemplate,
    previewUrl,
    canvasBackground,
    setCanvasBackground,
  } = useTemplateState();

  // Visual elements state
  const {
    visualElements,
    setVisualElements,
    selectedElementId,
    setSelectedElementId,
    addElement,
    updateElement,
    deleteElement,
    duplicateElement,
    moveElementZIndex,
    convertVisualToCode,
    history,
    historyIndex,
    undo,
    redo,
    saveToHistory,
  } = useVisualElements(selectedTemplate, canvasBackground);

  // Template loader
  const {
    templates,
    isLoadingTemplates,
    loadTemplate,
    parseHTMLToVisualElements,
  } = useTemplateLoader(
    setVisualElements,
    setRawHtmlTemplate,
    setRawCssTemplate,
    setVariableValues,
    setSelectedTemplate,
    customToast
  );

  // UI state
  const [activeSidebarTab, setActiveSidebarTab] = useState<'templates' | 'text' | 'elements' | 'photos' | 'uploads' | 'ai' | 'versions'>('text');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(true);
  const [activeRightSection, setActiveRightSection] = useState<'properties' | 'variables' | 'settings'>('properties');
  const [showCodeView, setShowCodeView] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [zoom, setZoom] = useState(53);
  const [tool, setTool] = useState<EditorTool>('select');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });
  const [templateName, setTemplateName] = useState('Untitled Design');
  const [showGrid, setShowGrid] = useState(false);
  const [showRulers, setShowRulers] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | undefined>(undefined);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [activeImageVariable, setActiveImageVariable] = useState<string | null>(null);
  const [canvasTemplates, setCanvasTemplates] = useState<CustomTemplate[]>([]);
  const [templatePreviewUrls, setTemplatePreviewUrls] = useState<Record<string, string>>({});
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // Editing state for canvas interactions
  const [isEditingText, setIsEditingText] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [elementDragStart, setElementDragStart] = useState<any>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  // Context Menu Handler
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const container = e.currentTarget.closest('.relative');
    if (container) {
      const rect = container.getBoundingClientRect();
      setContextMenu({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        visible: true
      });
    }
  };

  const handleContextMenuAction = (action: string) => {
    if (!selectedElementId) return;
    switch (action) {
      case 'copy':
        duplicateElement(selectedElementId);
        break;
      case 'paste':
        duplicateElement(selectedElementId);
        break;
      case 'delete':
        deleteElement(selectedElementId);
        break;
      case 'bringForward':
        moveElementZIndex(selectedElementId, 'up');
        break;
      case 'sendBackward':
        moveElementZIndex(selectedElementId, 'down');
        break;
    }
    setContextMenu({ ...contextMenu, visible: false });
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    selectedElementId,
    visualElements,
    addElement,
    deleteElement,
    duplicateElement,
    moveElementZIndex,
    undo,
    redo,
    setTool,
    setSelectedElementId,
    setShowKeyboardShortcuts,
    updateElement,
    saveToHistory,
    toast: customToast,
  });

  // Update template when variables change
  useEffect(() => {
    if (!rawHtmlTemplate && !rawCssTemplate) return;

    let processedHTML = rawHtmlTemplate;
    let processedCSS = rawCssTemplate;

    Object.entries(variableValues).forEach(([key, value]) => {
      const varPattern = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      processedHTML = processedHTML.replace(varPattern, String(value || ''));
      processedCSS = processedCSS.replace(varPattern, String(value || ''));
    });

    setSelectedTemplate(prev => ({
      ...prev,
      htmlTemplate: processedHTML,
      cssTemplate: processedCSS
    }));
  }, [variableValues, rawHtmlTemplate, rawCssTemplate]);

  // Update code when elements change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      convertVisualToCode();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [convertVisualToCode]);

  // Load template if editing existing
  useEffect(() => {
    if (id && id !== 'new') {
      loadTemplate(id);
    }
  }, [id]);

  // Generate preview URL for a template
  const generateTemplatePreviewUrl = (template: CustomTemplate): string => {
    const content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=${template.width}, height=${template.height}, initial-scale=1.0">
  <style>
    * { 
      box-sizing: border-box; 
      margin: 0;
      padding: 0;
    }
    html { 
      width: ${template.width}px; 
      height: ${template.height}px; 
      margin: 0;
      padding: 0;
    }
    body { 
      margin: 0; 
      padding: 0; 
      width: ${template.width}px; 
      height: ${template.height}px; 
      background-color: white;
      position: relative;
      transform-origin: top left;
    }
    img {
      display: block;
    }
    ${template.cssTemplate || ''}
  </style>
</head>
<body>
  ${template.htmlTemplate || ''}
</body>
</html>`;

    const blob = new Blob([content], { type: 'text/html' });
    return URL.createObjectURL(blob);
  };

  // Canvas mouse event handlers with requestAnimationFrame for 60 FPS
  const rafRef = useRef<number | null>(null);
  const pendingUpdate = useRef<{ x: number; y: number } | null>(null);

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (tool !== 'select') return;
    
    const target = e.target as HTMLElement;
    const elementDiv = target.closest('[data-element-id]') as HTMLElement;
    
    if (elementDiv && selectedElementId) {
      const element = visualElements.find(el => el.id === selectedElementId);
      if (element && !element.locked) {
        const rect = elementDiv.getBoundingClientRect();
        const canvasRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        
        setElementDragStart({
          elementId: selectedElementId,
          startX: (e.clientX - canvasRect.left) / (zoom / 100),
          startY: (e.clientY - canvasRect.top) / (zoom / 100),
          elementX: element.x,
          elementY: element.y,
        });
      }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!elementDragStart || tool !== 'select') return;
    
    const canvasRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const currentX = (e.clientX - canvasRect.left) / (zoom / 100);
    const currentY = (e.clientY - canvasRect.top) / (zoom / 100);
    
    // Handle resizing
    if (isResizing && resizeHandle) {
      const deltaX = currentX - elementDragStart.x;
      const deltaY = currentY - elementDragStart.y;
      
      let updates: Partial<VisualElement> = {};
      
      // Special handling for Text scaling (Corner handles only)
      const isTextCorner = elementDragStart.elementType === 'text' && ['tl', 'tr', 'bl', 'br'].includes(resizeHandle);
      
      if (isTextCorner) {
        // Scaling logic driven by WIDTH to maintain aspect ratio
        let newWidth = elementDragStart.elementW;
        
        if (resizeHandle.includes('r')) {
           newWidth = Math.max(20, elementDragStart.elementW + deltaX);
        } else { // 'l'
           newWidth = Math.max(20, elementDragStart.elementW - deltaX);
        }
        
        const scale = newWidth / elementDragStart.elementW;
        const newHeight = elementDragStart.elementH * scale;
        
        updates.width = newWidth;
        updates.height = newHeight;
        updates.fontSize = (elementDragStart.fontSize || 16) * scale;
        
        if (resizeHandle.includes('l')) {
           updates.x = elementDragStart.elementX + (elementDragStart.elementW - newWidth);
        }
        if (resizeHandle.includes('t')) {
           updates.y = elementDragStart.elementY + (elementDragStart.elementH - newHeight);
        }
      } else {
        // Standard independent resizing for shapes/images or text side-handles
        if (resizeHandle.includes('r')) {
          updates.width = Math.max(20, elementDragStart.elementW + deltaX);
        }
        if (resizeHandle.includes('l')) {
          const newWidth = Math.max(20, elementDragStart.elementW - deltaX);
          updates.width = newWidth;
          updates.x = elementDragStart.elementX + (elementDragStart.elementW - newWidth);
        }
        if (resizeHandle.includes('b')) {
          updates.height = Math.max(20, elementDragStart.elementH + deltaY);
        }
        if (resizeHandle.includes('t')) {
          const newHeight = Math.max(20, elementDragStart.elementH - deltaY);
          updates.height = newHeight;
          updates.y = elementDragStart.elementY + (elementDragStart.elementH - newHeight);
        }
      }
      
      // Store pending resize update
      pendingUpdate.current = updates;
    } else {
      // Handle dragging
      const deltaX = currentX - elementDragStart.startX;
      const deltaY = currentY - elementDragStart.startY;
      
      const newX = Math.max(0, Math.min(elementDragStart.elementX + deltaX, (selectedTemplate.width || 1080) - 50));
      const newY = Math.max(0, Math.min(elementDragStart.elementY + deltaY, (selectedTemplate.height || 1080) - 50));
      
      // Store pending drag update
      pendingUpdate.current = { x: newX, y: newY };
    }
    
    // Use requestAnimationFrame for smooth 60 FPS updates
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        if (pendingUpdate.current) {
          // Ensure we have a valid ID for update
          const targetId = elementDragStart.elementId || selectedElementId;
          if (targetId) {
            updateElement(targetId, pendingUpdate.current);
          }
          pendingUpdate.current = null;
        }
        rafRef.current = null;
      });
    }
  };

  const handleCanvasMouseUp = () => {
    if (elementDragStart) {
      // Cancel any pending RAF
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      // Apply final update if there's one pending
      if (pendingUpdate.current) {
        const targetId = elementDragStart.elementId || selectedElementId;
        if (targetId) {
          updateElement(targetId, pendingUpdate.current);
        }
        pendingUpdate.current = null;
      }
      saveToHistory();
    }
    setIsResizing(false);
    setResizeHandle(null);
    setElementDragStart(null);
  };

  const handleElementDoubleClick = (element: any) => {
    if (element.type === 'text') {
      setIsEditingText(true);
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 0);
    } else if (element.type === 'image') {
      setActiveImageVariable(element.linkedVariable || null);
      setShowImageSelector(true);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Implement actual save logic here
    await new Promise(resolve => setTimeout(resolve, 500));
    setLastSaved(new Date());
    setIsSaving(false);
    toast('Design saved successfully');
  };

  const handleExport = () => {
    toast('Export functionality coming soon');
  };

  const handleFitToScreen = () => {
    setZoom(100);
  };

  return (
    <div className="h-full overflow-hidden flex flex-col bg-slate-50">
      {/* Top Action Bar */}
      <TopActionBar
        templateName={templateName}
        onTemplateNameChange={setTemplateName}
        onSave={handleSave}
        onExport={handleExport}
        onUndo={undo}
        onRedo={redo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        zoom={zoom}
        onZoomChange={setZoom}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
        showRulers={showRulers}
        onToggleRulers={() => setShowRulers(!showRulers)}
        isSaving={isSaving}
        lastSaved={lastSaved}
      />

      {/* Main Editor Area */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
        {/* Purple Panel Container - 98% size */}
        <div className="w-[98%] h-full flex flex-row bg-gradient-to-b from-purple-500 to-purple-600 rounded-[24px] shadow-2xl border-4 border-purple-400/30 overflow-hidden">
          {/* Toolbar - Fixed at left */}
          <EditorToolbar 
            tool={tool} 
            setTool={setTool} 
            addElement={addElement}
          />

        {/* Main Content Area - Canvas + Right Panel */}
        <div className="flex-1 flex overflow-hidden relative bg-gray-50">
          {/* Center Canvas Area */}
          <div className="flex-1 flex flex-col items-center justify-center p-12 overflow-auto relative">
            {/* Tool Panels - Rendered absolutely within the editor area */}
            {tool === 'text' && <TextPanel onClose={() => setTool('select')} addElement={addElement} />}
            {tool === 'image' && <MediaPanel onClose={() => setTool('select')} addElement={addElement} />}
            {tool === 'elements' && <ElementsPanel onClose={() => setTool('select')} addElement={addElement} />}
            {tool === 'layers' && (
              <LayersPanel 
                elements={visualElements} 
                selectedId={selectedElementId} 
                onSelect={setSelectedElementId} 
                onReorder={moveElementZIndex} 
                onDelete={deleteElement} 
                onClose={() => setTool('select')} 
              />
            )}

            <div className="relative" onContextMenu={handleContextMenu}>
              <Canvas
                selectedTemplate={selectedTemplate}
                canvasTemplates={canvasTemplates}
                templatePreviewUrls={templatePreviewUrls}
                visualElements={visualElements}
                selectedElementId={selectedElementId}
                setSelectedElementId={setSelectedElementId}
                zoom={zoom}
                setZoom={setZoom}
                canvasBackground="#ffffff"
                tool={tool === 'pen' || tool === 'eraser' ? tool : 'select'}
                previewUrl={previewUrl}
                isDragging={false}
                dragStart={null}
                isEditingText={isEditingText}
                setIsEditingText={setIsEditingText}
                isResizing={isResizing}
                setIsResizing={setIsResizing}
                resizeHandle={resizeHandle}
                setResizeHandle={setResizeHandle}
                elementDragStart={elementDragStart}
                setElementDragStart={setElementDragStart}
                handleCanvasMouseDown={handleCanvasMouseDown}
                handleCanvasMouseMove={handleCanvasMouseMove}
                handleCanvasMouseUp={handleCanvasMouseUp}
                handleElementDoubleClick={handleElementDoubleClick}
                updateElement={updateElement}
                duplicateElement={duplicateElement}
                deleteElement={deleteElement}
                saveToHistory={saveToHistory}
                toast={customToast}
                textInputRef={textInputRef}
              />
              
              {/* Context Menu */}
              {contextMenu.visible && (
                <ContextMenu 
                  x={contextMenu.x} 
                  y={contextMenu.y} 
                  onClose={() => setContextMenu({ ...contextMenu, visible: false })} 
                  onAction={handleContextMenuAction}
                  hasSelection={!!selectedElementId}
                />
              )}
            </div>

            {/* Canvas size label */}
            <div className="text-center mt-3 text-xs text-gray-600 font-medium bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
              {selectedTemplate.width || 1080} × {selectedTemplate.height || 1080}px
            </div>

            {/* Zoom Controls */}
            <ZoomControls
              zoom={zoom}
              onZoomChange={setZoom}
              onFitToScreen={handleFitToScreen}
            />
          </div>

          {/* Right Panel - Always visible sidebar */}
          <RightPanel
            rightPanelCollapsed={rightPanelCollapsed}
            setRightPanelCollapsed={setRightPanelCollapsed}
            activeRightSection={activeRightSection}
            setActiveRightSection={setActiveRightSection}
            selectedElementId={selectedElementId}
            visualElements={visualElements}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            variableValues={variableValues}
            setVariableValues={setVariableValues}
            updateElement={updateElement}
            deleteElement={deleteElement}
            duplicateElement={duplicateElement}
            moveElementZIndex={moveElementZIndex}
            setShowImageSelector={setShowImageSelector}
            setActiveImageVariable={setActiveImageVariable}
          />
        </div>
      </div>
      </div>

      <KeyboardShortcutsModal
        open={showKeyboardShortcuts}
        onOpenChange={setShowKeyboardShortcuts}
      />

      <TemplateLibraryModal
        open={showTemplateLibrary}
        onOpenChange={setShowTemplateLibrary}
        templates={templates}
        isLoadingTemplates={isLoadingTemplates}
        openTemplateFromLibrary={(template) => {
          // Load ONLY ONE template at a time (replace previous)
          setSelectedTemplate(template);
          setCanvasTemplates([template]);
          
          // Clear template preview URLs and add only this one
          const previewUrl = generateTemplatePreviewUrl(template);
          setTemplatePreviewUrls({
            [template.id || `template-${Date.now()}`]: previewUrl
          });
          
          // Parse the template to apply variables and extract visual elements
          console.log('📥 Single template selected from library, parsing:', template.name);
          parseHTMLToVisualElements(template);
        }}
      />

      <ImageSelectorModal
        open={showImageSelector}
        onOpenChange={setShowImageSelector}
        activeImageVariable={activeImageVariable}
        variableValues={variableValues}
        setVariableValues={setVariableValues}
        updateElement={updateElement}
        saveToHistory={saveToHistory}
        toast={customToast}
      />
    </div>
  );
}
