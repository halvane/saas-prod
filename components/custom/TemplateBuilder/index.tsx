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
import { TextPanel, MediaPanel, ElementsPanel, LayersPanel, DEFAULT_VARIABLES } from './components/ToolPanels';
import { ContextMenu } from './components/ContextMenu';

import { useTemplateState } from './hooks/useTemplateState';
import { useVisualElements } from './hooks/useVisualElements';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useTemplateLoader } from './hooks/useTemplateLoader';
import { extractElementsFromHTMLAsync } from './utils/extractElements';
import { getBrandSettings } from '@/app/(dashboard)/settings/actions';

import type { CustomTemplate, VisualElement } from './types';
import './styles.css';

export default function CustomTemplateBuilderVisual() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  // Brand Settings State
  const [brandSettings, setBrandSettingsState] = useState<any>(null);
  const [brandAssets, setBrandAssets] = useState<{ images: any[]; products: any[] } | null>(null);

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
  
  // Extraction loading state
  const [isExtracting, setIsExtracting] = useState(false);

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
    customToast,
    brandSettings,
    setIsExtracting // Pass extraction state setter
  );

  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        const settings = await getBrandSettings();
        if (settings) {
          // Store the complete brand settings for CSS variable injection
          setBrandSettingsState(settings);
          
          setBrandAssets({
            images: settings.brandImages || [],
            products: settings.products || []
          });

          // Construct brand variables for substitution
          const brandVars: Record<string, any> = { ...DEFAULT_VARIABLES };
          
          if (settings.brandName) {
            brandVars.brand_name = settings.brandName;
            brandVars.brandName = settings.brandName;
            brandVars.BRAND_NAME = settings.brandName;
          }
          
          if (settings.brandTagline) {
            brandVars.tagline = settings.brandTagline;
            brandVars.TAGLINE = settings.brandTagline;
          }

          // Products - Map multiple products to variables
          if (settings.products && settings.products.length > 0) {
            // First product
            const p = settings.products[0];
            brandVars.product_name = p.name;
            brandVars.productName = p.name;
            brandVars.PRODUCT_NAME = p.name;
            
            if (p.price) {
              brandVars.price = p.price;
              brandVars.PRICE = p.price;
            }
            
            if (p.imageUrl) {
              const url = typeof p.imageUrl === 'string' ? p.imageUrl : (p.imageUrl as any).url;
              if (url) {
                brandVars.product_image = url;
                brandVars.productImage = url;
                brandVars.PRODUCT_IMAGE = url;
              }
            }
            
            // Additional products
            for (let i = 1; i < Math.min(settings.products.length, 5); i++) {
              const prod = settings.products[i];
              brandVars[`product_${i + 1}_name`] = prod.name;
              brandVars[`product_${i + 1}_price`] = prod.price || '';
              
              if (prod.imageUrl) {
                const url = typeof prod.imageUrl === 'string' ? prod.imageUrl : (prod.imageUrl as any).url;
                if (url) {
                  brandVars[`product_${i + 1}_image`] = url;
                }
              }
            }
          }

          // Brand Images - Map multiple images to variables
          if (settings.brandImages && settings.brandImages.length > 0) {
            // First image
            const img = settings.brandImages[0];
            const url = typeof img === 'string' ? img : (img as any).url;
            if (url) {
              brandVars.hero_image = url;
              brandVars.heroImage = url;
              brandVars.HERO_IMAGE = url;
              brandVars.background_image = url;
              brandVars.backgroundImage = url;
            }
            
            // Additional images
            for (let i = 1; i < Math.min(settings.brandImages.length, 5); i++) {
              const img = settings.brandImages[i];
              const url = typeof img === 'string' ? img : (img as any).url;
              if (url) {
                brandVars[`image_${i + 1}`] = url;
                brandVars[`hero_image_${i + 1}`] = url;
              }
            }
          }

          // Update variable values
          setVariableValues(prev => ({ ...prev, ...brandVars }));
        }
      } catch (err) {
        console.error("Failed to fetch brand settings:", err instanceof Error ? err.message : err);
      }
    };
    fetchBrandData();
  }, []);

  // Effect to update visual elements when variables change (live substitution)
  useEffect(() => {
    if (visualElements.length === 0 || Object.keys(variableValues).length === 0) return;

    let hasChanges = false;
    const newElements = visualElements.map(el => {
      let updated = false;
      let newEl = { ...el };

      // Replace text content
      if (el.type === 'text' && el.content && el.content.includes('{{')) {
        Object.entries(variableValues).forEach(([key, value]) => {
          const pattern = new RegExp(`\\{\\{${key}\\}\\}`, 'gi'); // Case insensitive
          if (pattern.test(newEl.content!)) {
            newEl.content = newEl.content!.replace(pattern, String(value));
            updated = true;
          }
        });
      }

      // Replace image src
      if (el.type === 'image' && el.src && el.src.includes('{{')) {
        Object.entries(variableValues).forEach(([key, value]) => {
          const pattern = new RegExp(`\\{\\{${key}\\}\\}`, 'gi');
          if (pattern.test(newEl.src!)) {
            let strValue = String(value);
            // Handle object values for images
            if (typeof value === 'object' && value !== null) {
               if ('src' in value) strValue = (value as any).src;
               else if ('url' in value) strValue = (value as any).url;
            }
            newEl.src = newEl.src!.replace(pattern, strValue);
            updated = true;
          }
        });
      }

      // Replace background image
      if ((el.type === 'rectangle' || el.type === 'circle') && el.backgroundImage && el.backgroundImage.includes('{{')) {
        Object.entries(variableValues).forEach(([key, value]) => {
          const pattern = new RegExp(`\\{\\{${key}\\}\\}`, 'gi');
          if (pattern.test(newEl.backgroundImage!)) {
             let strValue = String(value);
             if (typeof value === 'object' && value !== null) {
               if ('src' in value) strValue = (value as any).src;
               else if ('url' in value) strValue = (value as any).url;
             }
             newEl.backgroundImage = newEl.backgroundImage!.replace(pattern, strValue);
             updated = true;
          }
        });
      }

      if (updated) hasChanges = true;
      return newEl;
    });

    if (hasChanges) {
      setVisualElements(newElements);
    }
  }, [variableValues, visualElements.length]); // Only run when variables change or elements count changes (initial load)

  // Handle adding HTML snippets (Sections/Blocks)
  const handleAddHtml = async (html: string) => {
    const newElements = await extractElementsFromHTMLAsync(
      html, 
      '', 
      selectedTemplate.width || 1080, 
      selectedTemplate.height || 1080
    );
    
    // Ensure unique IDs
    const uniqueElements = newElements.map(el => ({
      ...el,
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }));
    setVisualElements(prev => [...prev, ...uniqueElements]);
    saveToHistory();
    customToast({ title: 'Section added', description: 'New elements added to canvas' });
  };

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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [selectedElementData, setSelectedElementData] = useState<VisualElement | null>(null);

  const handleElementSelected = (data: any) => {
    setSelectedElementId(data.id);
    
    // Map bridge data to VisualElement structure for RightPanel
    const el: VisualElement = {
      id: data.id,
      type: data.tagName.toLowerCase() === 'img' ? 'image' : 'text', // Basic inference
      content: data.content,
      x: data.rect.left,
      y: data.rect.top,
      width: data.rect.width,
      height: data.rect.height,
      zIndex: 1,
      rotation: 0,
      visible: true,
      locked: false,
      
      // Styles
      fontSize: parseFloat(data.computedStyle.fontSize) || 16,
      color: data.computedStyle.color,
      backgroundColor: data.computedStyle.backgroundColor,
      fontFamily: data.computedStyle.fontFamily,
      fontWeight: data.computedStyle.fontWeight,
      textAlign: data.computedStyle.textAlign,
      lineHeight: parseFloat(data.computedStyle.lineHeight) / parseFloat(data.computedStyle.fontSize) || 1.4,
      letterSpacing: parseFloat(data.computedStyle.letterSpacing) || 0,
    };
    
    setSelectedElementData(el);
  };

  const handleSelectionCleared = () => {
    setSelectedElementId(null);
    setSelectedElementData(null);
  };

  const handleUpdateElement = (id: string, updates: Partial<VisualElement>) => {
    // Update local state for immediate feedback in RightPanel
    if (selectedElementData && selectedElementData.id === id) {
      setSelectedElementData({ ...selectedElementData, ...updates });
    }

    // Send to iframe
    if (iframeRef.current?.contentWindow) {
      if (updates.content !== undefined) {
        iframeRef.current.contentWindow.postMessage({
          type: 'UPDATE_CONTENT',
          payload: { id, content: updates.content }
        }, '*');
      }

      const styleUpdates: Record<string, string> = {};
      if (updates.color) styleUpdates.color = updates.color;
      if (updates.backgroundColor) styleUpdates.backgroundColor = updates.backgroundColor;
      if (updates.fontSize) styleUpdates.fontSize = `${updates.fontSize}px`;
      if (updates.fontWeight) styleUpdates.fontWeight = String(updates.fontWeight);
      if (updates.textAlign) styleUpdates.textAlign = String(updates.textAlign);
      if (updates.fontFamily) styleUpdates.fontFamily = updates.fontFamily;
      
      if (Object.keys(styleUpdates).length > 0) {
        iframeRef.current.contentWindow.postMessage({
          type: 'UPDATE_STYLE',
          payload: { id, styles: styleUpdates }
        }, '*');
      }
    }
  };

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
    setTool: setTool as (tool: string) => void,
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
      
      const updates: Partial<VisualElement> = {};
      
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
      if (Object.keys(updates).length > 0) {
        pendingUpdate.current = { x: updates.x ?? 0, y: updates.y ?? 0 };
      }
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
    try {
      // Get HTML directly from iframe
      const getHtml = (): Promise<string> => {
        return new Promise((resolve) => {
          if (!iframeRef.current?.contentWindow) {
            resolve(selectedTemplate.htmlTemplate || '');
            return;
          }
          const handler = (event: MessageEvent) => {
            if (event.data.type === 'HTML_RESPONSE') {
              window.removeEventListener('message', handler);
              resolve(event.data.payload.html);
            }
          };
          window.addEventListener('message', handler);
          iframeRef.current.contentWindow.postMessage({ type: 'GET_HTML' }, '*');
          setTimeout(() => {
            window.removeEventListener('message', handler);
            resolve(selectedTemplate.htmlTemplate || '');
          }, 1000);
        });
      };

      const html = await getHtml();

      const templateData = {
        ...selectedTemplate,
        name: templateName,
        htmlTemplate: html,       
        cssTemplate: selectedTemplate.cssTemplate,
        variables: variableValues,
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch(`/api/admin/custom-templates/${selectedTemplate.id || 'new'}`, {
        method: selectedTemplate.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) throw new Error('Failed to save template');

      const savedTemplate = await response.json();
      setSelectedTemplate(savedTemplate);
      setLastSaved(new Date());
      customToast({ title: 'Saved successfully', description: 'Template saved to database' });
    } catch (error) {
      console.error('Save error:', error);
      customToast({ title: 'Error saving', description: 'Could not save template' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    toast('Export functionality coming soon');
  };

  const handleFitToScreen = () => {
    setZoom(100);
  };

  const handleSizeChange = (newWidth: number, newHeight: number) => {
    // Save current state to history before modifying
    saveToHistory();

    const oldWidth = selectedTemplate.width || 1080;
    const oldHeight = selectedTemplate.height || 1080;

    // Update template dimensions
    setSelectedTemplate({
      ...selectedTemplate,
      width: newWidth,
      height: newHeight
    });

    // 1. Identify Background Elements
    // Criteria: Covers > 85% of old canvas OR id includes 'background'
    const isBackground = (el: VisualElement) => {
      const area = el.width * el.height;
      const canvasArea = oldWidth * oldHeight;
      return (area / canvasArea > 0.85) || el.id.toLowerCase().includes('background');
    };

    // 2. Calculate Bounding Box of Content (Non-Background Elements)
    const contentElements = visualElements.filter(el => !isBackground(el));
    
    let contentCenterY = oldHeight / 2;
    let contentCenterX = oldWidth / 2;

    if (contentElements.length > 0) {
      const minX = Math.min(...contentElements.map(el => el.x));
      const maxX = Math.max(...contentElements.map(el => el.x + el.width));
      const minY = Math.min(...contentElements.map(el => el.y));
      const maxY = Math.max(...contentElements.map(el => el.y + el.height));
      
      contentCenterX = (minX + maxX) / 2;
      contentCenterY = (minY + maxY) / 2;
    }

    // 3. Calculate Offset to Center in New Canvas
    const newCanvasCenterX = newWidth / 2;
    const newCanvasCenterY = newHeight / 2;

    const offsetX = newCanvasCenterX - contentCenterX;
    const offsetY = newCanvasCenterY - contentCenterY;

    // 4. Update Elements
    const newElements = visualElements.map(el => {
      if (isBackground(el)) {
        // Resize background to fill new canvas completely
        return {
          ...el,
          width: newWidth,
          height: newHeight,
          x: 0,
          y: 0
        };
      } else {
        // Move content to center
        return {
          ...el,
          x: el.x + offsetX,
          y: el.y + offsetY
        };
      }
    });

    setVisualElements(newElements);
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
        width={selectedTemplate.width || 1080}
        height={selectedTemplate.height || 1080}
        onSizeChange={handleSizeChange}
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
          <div className="flex-1 flex flex-col items-center justify-center p-12 overflow-hidden relative">
            {/* Tool Panels - Rendered absolutely within the editor area */}
            {tool === 'text' && <TextPanel onClose={() => setTool('select')} addElement={addElement} />}
            {tool === 'image' && <MediaPanel onClose={() => setTool('select')} addElement={addElement} brandAssets={brandAssets || undefined} />}
            {tool === 'elements' && <ElementsPanel onClose={() => setTool('select')} addElement={addElement} onAddHtml={handleAddHtml} brandAssets={brandAssets || undefined} />}
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
                variableValues={variableValues}
                zoom={zoom}
                iframeRef={iframeRef}
                onElementSelected={handleElementSelected}
                onSelectionCleared={handleSelectionCleared}
                selectedElementId={selectedElementId}
                brandSettings={brandSettings}
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
            visualElements={selectedElementData ? [selectedElementData] : []}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            variableValues={variableValues}
            setVariableValues={setVariableValues}
            updateElement={handleUpdateElement}
            deleteElement={deleteElement}
            duplicateElement={duplicateElement}
            moveElementZIndex={moveElementZIndex}
            setShowImageSelector={setShowImageSelector}
            setActiveImageVariable={setActiveImageVariable}
            setSelectedElementId={setSelectedElementId}
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
        brandAssets={brandAssets || undefined}
      />
    </div>
  );
}
