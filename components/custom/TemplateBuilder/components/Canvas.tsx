import { useRef, useMemo, memo } from 'react';
import { ZoomIn, ZoomOut, Type, Square, Circle, Copy, Trash2, Wand2, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { VisualElement, CustomTemplate } from '../types';

// Helper to parse inline style string into React style object
function parseInlineStyle(styleString?: string): React.CSSProperties {
  if (!styleString) return {};
  
  const styles: Record<string, string> = {};
  const declarations = styleString.split(';').filter(Boolean);
  
  declarations.forEach(decl => {
    const [property, value] = decl.split(':').map(s => s.trim());
    if (property && value) {
      // Convert kebab-case to camelCase for React
      const camelProp = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      styles[camelProp] = value;
    }
  });
  
  return styles as React.CSSProperties;
}

interface CanvasProps {
  selectedTemplate: CustomTemplate;
  canvasTemplates?: CustomTemplate[];
  templatePreviewUrls?: Record<string, string>;
  visualElements: VisualElement[];
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  canvasBackground: string;
  tool: string;
  previewUrl: string;
  isDragging: boolean;
  dragStart: { x: number; y: number } | null;
  isEditingText: boolean;
  setIsEditingText: (editing: boolean) => void;
  isResizing: boolean;
  setIsResizing: (resizing: boolean) => void;
  resizeHandle: string | null;
  setResizeHandle: (handle: string | null) => void;
  elementDragStart: any;
  setElementDragStart: (data: any) => void;
  handleCanvasMouseDown: (e: React.MouseEvent) => void;
  handleCanvasMouseMove: (e: React.MouseEvent) => void;
  handleCanvasMouseUp: () => void;
  handleElementDoubleClick: (element: VisualElement) => void;
  updateElement: (id: string, updates: Partial<VisualElement>) => void;
  duplicateElement: (id: string) => void;
  deleteElement: (id: string) => void;
  saveToHistory: () => void;
  toast: any;
  textInputRef: React.RefObject<HTMLTextAreaElement | null>;
  isExtracting?: boolean;
}

export function Canvas({
  selectedTemplate,
  canvasTemplates,
  visualElements,
  selectedElementId,
  setSelectedElementId,
  zoom,
  setZoom,
  canvasBackground,
  tool,
  previewUrl,
  isDragging,
  dragStart,
  isEditingText,
  setIsEditingText,
  isResizing,
  setIsResizing,
  resizeHandle,
  setResizeHandle,
  elementDragStart,
  setElementDragStart,
  handleCanvasMouseDown,
  handleCanvasMouseMove,
  handleCanvasMouseUp,
  handleElementDoubleClick,
  updateElement,
  duplicateElement,
  deleteElement,
  saveToHistory,
  textInputRef,
  templatePreviewUrls = {},
  isExtracting = false,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedElement = visualElements.find((el) => el.id === selectedElementId);

  return (
    <div 
      className="relative bg-white rounded-2xl shadow-2xl overflow-hidden group/canvas"
      style={{
        width: (selectedTemplate.width || 1080) * (zoom / 100),
        height: (selectedTemplate.height || 1080) * (zoom / 100),
      }}
    >
      {/* Canvas Container */}
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden origin-top-left select-none"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
        style={{ 
          cursor: tool === 'select' ? 'default' : 'crosshair',
          width: selectedTemplate.width || 1080,
          height: selectedTemplate.height || 1080,
          transform: `scale(${zoom / 100})`,
          userSelect: 'none',
        }}
      >
        <div
          ref={canvasRef}
          className="relative w-full h-full bg-white"
          style={{
            width: `${selectedTemplate.width}px`,
            height: `${selectedTemplate.height}px`,
          }}
        >
              {/* Template background/preview */}
              {visualElements.length === 0 || isExtracting ? (
                // Preview mode - show iframe with optional loader
                <div className="relative w-full h-full">
                  {previewUrl ? (
                    <>
                      <iframe
                        title={`Template ${selectedTemplate.name}`}
                        src={previewUrl}
                        scrolling="no"
                        style={{
                          width: selectedTemplate.width,
                          height: selectedTemplate.height,
                          border: 'none',
                          pointerEvents: 'none',
                          backgroundColor: 'white',
                        }}
                      />
                      {isExtracting && (
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
                          <div className="bg-white rounded-xl shadow-2xl p-6 flex flex-col items-center gap-3">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <div className="text-sm font-medium text-gray-700">Preparing editor...</div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Loading preview...
                    </div>
                  )}
                </div>
              ) : (
                // Editor mode - show interactive elements
                <>
                  {/* Iframe removed to prevent double-rendering/ghosting */}
                  
                  {/* Render interactive visual elements */}
                  {visualElements
                    .filter((el) => el.visible !== false)
                    .sort((a, b) => a.zIndex - b.zIndex)
                    .map((el) => {
                      const isSelected = selectedElementId === el.id;

                      return (
                        <div
                          key={el.id}
                          data-element-id={el.id}
                          className={`absolute group ${
                            isSelected
                              ? 'z-50 ring-2 ring-blue-500 ring-offset-2 shadow-lg'
                              : 'hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 hover:shadow-lg hover:brightness-105'
                          } ${el.locked ? 'pointer-events-none opacity-50' : 'pointer-events-auto'}`}
                          style={{
                            width: el.width,
                            height: el.height,
                            zIndex: el.zIndex,
                            transform: `translate(${el.x}px, ${el.y}px) rotate(${el.rotation || 0}deg) ${el.flipX ? 'scaleX(-1)' : ''} ${el.flipY ? 'scaleY(-1)' : ''}`,
                            opacity: el.opacity ?? 1,
                            cursor: el.locked
                              ? 'not-allowed'
                              : tool === 'select'
                                ? (elementDragStart?.elementId === el.id ? 'grabbing' : 'grab')
                                : 'default',
                            willChange: elementDragStart?.elementId === el.id ? 'transform' : 'auto',
                            transition: elementDragStart?.elementId === el.id ? 'none' : 'box-shadow 0.15s ease, filter 0.15s ease',
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!el.locked && tool === 'select') {
                              setSelectedElementId(el.id);
                            }
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            if (!el.locked) {
                              handleElementDoubleClick(el);
                            }
                          }}
                          onDragOver={(e) => {
                            if (el.isFrame) {
                              e.preventDefault();
                              e.stopPropagation();
                              e.currentTarget.style.borderColor = '#3b82f6';
                              e.currentTarget.style.borderWidth = '4px';
                            }
                          }}
                          onDragLeave={(e) => {
                            if (el.isFrame) {
                              e.preventDefault();
                              e.stopPropagation();
                              e.currentTarget.style.borderColor = '';
                              e.currentTarget.style.borderWidth = '';
                            }
                          }}
                          onDrop={(e) => {
                            if (el.isFrame) {
                              e.preventDefault();
                              e.stopPropagation();
                              e.currentTarget.style.borderColor = '';
                              e.currentTarget.style.borderWidth = '';

                              const imageUrl = e.dataTransfer.getData('text/plain');
                              if (imageUrl) {
                                updateElement(el.id, { src: imageUrl });
                              }
                            }
                          }}
                        >
                          {/* Selection indicator */}
                          {isSelected && (
                            <>
                              <div
                                className="absolute inset-0 border-2 border-blue-500 pointer-events-none animate-in fade-in duration-150"
                                style={{
                                  borderRadius:
                                    el.type === 'circle' ? '50%' : '4px',
                                }}
                              />
                              <div className="absolute -top-7 left-0 bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 pointer-events-none shadow-lg animate-in slide-in-from-bottom-2 duration-150">
                                {el.type === 'text' && (
                                  <Type className="h-3 w-3" />
                                )}
                                {el.type === 'image' && (
                                  <ImageIcon className="h-3 w-3" />
                                )}
                                {el.type === 'rectangle' && (
                                  <Square className="h-3 w-3" />
                                )}
                                {el.type === 'circle' && (
                                  <Circle className="h-3 w-3" />
                                )}
                                <span className="capitalize">{el.type}</span>
                                <span className="text-blue-200 text-[10px]">{Math.round(el.width)}×{Math.round(el.height)}</span>
                                {el.locked && <span className="ml-1">🔒</span>}
                                {el.linkedVariable && (
                                  <span
                                    className="ml-1 bg-purple-600 px-1 rounded text-[10px]"
                                    title={`Linked to variable: ${el.linkedVariable}`}
                                  >
                                    <Wand2 className="h-2.5 w-2.5 inline" />
                                  </span>
                                )}
                              </div>
                            </>
                          )}

                          {/* Element content rendering */}
                          {el.type === 'text' && (
                            isEditingText && isSelected ? (
                              <textarea
                                ref={textInputRef}
                                className="w-full h-full resize-none border-none outline-none bg-transparent"
                                style={{
                                  ...parseInlineStyle(el.rawStyle),
                                  color: el.color || '#000000',
                                  fontSize: el.fontSize || 16,
                                  fontFamily:
                                    el.fontFamily || 'Arial, sans-serif',
                                  fontWeight: el.fontWeight || 'normal',
                                  fontStyle: el.fontStyle || 'normal',
                                  textDecoration:
                                    el.textDecoration || 'none',
                                  textAlign: (el.textAlign as any) || 'left',
                                  lineHeight: el.lineHeight || 1.4,
                                  letterSpacing: `${el.letterSpacing || 0}px`,
                                  textShadow: el.textShadow,
                                  WebkitTextStroke: el.WebkitTextStroke,
                                  textTransform: (el.textTransform as any) || 'none',
                                  padding: el.padding ? (typeof el.padding === 'number' ? `${el.padding}px` : String(el.padding)) : '8px',
                                  backgroundColor: el.backgroundColor,
                                  borderRadius: el.borderRadius ? `${el.borderRadius}px` : undefined,
                                  border: el.border,
                                  boxShadow: el.boxShadow ? String(el.boxShadow) : (el.shadow ? `${el.shadow.x}px ${el.shadow.y}px ${el.shadow.blur}px ${el.shadow.color}` : undefined),
                                  backgroundImage: el.backgroundImage,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                }}
                                value={el.content || ''}
                                onChange={(e) =>
                                  updateElement(el.id, {
                                    content: e.target.value,
                                  })
                                }
                                onBlur={() => {
                                  setIsEditingText(false);
                                  saveToHistory();
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Escape') {
                                    setIsEditingText(false);
                                  }
                                }}
                              />
                            ) : (
                              <div
                                className="w-full h-full flex items-center"
                                style={{
                                  ...parseInlineStyle(el.rawStyle),
                                  color: el.color || '#000000',
                                  fontSize: el.fontSize || 16,
                                  fontFamily:
                                    el.fontFamily || 'Arial, sans-serif',
                                  fontWeight: el.fontWeight || 'normal',
                                  fontStyle: el.fontStyle || 'normal',
                                  textDecoration:
                                    el.textDecoration || 'none',
                                  textAlign: (el.textAlign as any) || 'left',
                                  lineHeight: el.lineHeight || 1.4,
                                  letterSpacing: `${el.letterSpacing || 0}px`,
                                  textShadow: el.textShadow,
                                  WebkitTextStroke: el.WebkitTextStroke,
                                  textTransform: (el.textTransform as any) || 'none',
                                  padding: el.padding ? (typeof el.padding === 'number' ? `${el.padding}px` : el.padding) : '8px',
                                  cursor: el.locked ? 'not-allowed' : 'text',
                                  whiteSpace: 'pre-wrap',
                                  wordBreak: 'break-word',
                                  backgroundColor: el.backgroundColor,
                                  borderRadius: el.borderRadius ? `${el.borderRadius}px` : undefined,
                                  border: el.border,
                                  boxShadow: typeof el.boxShadow === 'string' ? el.boxShadow : (el.shadow ? `${el.shadow.x}px ${el.shadow.y}px ${el.shadow.blur}px ${el.shadow.color}` : undefined),
                                  backgroundImage: el.backgroundImage,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                }}
                              >
                                {el.content || 'Double-click to edit'}
                              </div>
                            )
                          )}

                          {el.type === 'image' && (
                            el.src ? (
                              <div
                                className="relative w-full h-full group"
                                style={{
                                  ...parseInlineStyle(el.rawStyle),
                                  borderRadius: el.borderRadius || 0,
                                  overflow: 'hidden',
                                }}
                              >
                                {el.src.includes('{{') ? (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                                    <div className="text-center p-2">
                                      <ImageIcon className="mx-auto mb-2 w-8 h-8 opacity-50" />
                                      <div className="text-xs font-medium break-all">{el.src}</div>
                                      <div className="text-[10px] opacity-70 mt-1">Variable Image</div>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <img
                                      src={el.src}
                                      alt="Element"
                                      className="w-full h-full"
                                      style={{
                                        ...parseInlineStyle(el.rawStyle),
                                        objectFit: el.objectFit || 'cover',
                                        borderRadius: el.borderRadius ? `${el.borderRadius}px` : undefined,
                                        userSelect: 'none',
                                        pointerEvents: 'auto',
                                      }}
                                      draggable={false}
                                      onError={(e) => {
                                        // Fallback if image fails to load
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement?.classList.add('image-error');
                                      }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 hidden group-[.image-error]:flex">
                                      <div className="text-center text-xs">
                                        <ImageIcon className="mx-auto mb-1 w-6 h-6" />
                                        <div>Image Error</div>
                                      </div>
                                    </div>
                                  </>
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                  <div className="text-white text-xs text-center">
                                    <ImageIcon
                                      className="mx-auto mb-1"
                                      style={{ width: 16, height: 16 }}
                                    />
                                    <div>Double-click to change</div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 border-2 border-dashed border-gray-300">
                                <div
                                  className="text-center"
                                  style={{ fontSize: 12 }}
                                >
                                  <ImageIcon
                                    className="mx-auto mb-1"
                                    style={{ width: 24, height: 24 }}
                                  />
                                  <div>Double-click to add image</div>
                                </div>
                              </div>
                            )
                          )}

                          {(el.type === 'rectangle' ||
                            el.type === 'circle') && (
                            <div
                              className="w-full h-full relative"
                              style={{
                                ...parseInlineStyle(el.rawStyle),
                                backgroundColor:
                                  el.backgroundColor || '#cccccc',
                                backgroundImage: el.backgroundImage && !el.backgroundImage.includes('{{') ? el.backgroundImage : undefined,
                                backgroundSize: el.backgroundSize || 'cover',
                                backgroundPosition: el.backgroundPosition || 'center',
                                borderRadius:
                                  el.type === 'circle'
                                    ? '50%'
                                    : `${el.borderRadius || 0}px`,
                                border:
                                  el.borderWidth && el.borderColor
                                    ? `${el.borderWidth}px ${el.borderStyle || 'solid'} ${el.borderColor}`
                                    : el.border || 'none',
                                boxShadow: el.boxShadow 
                                  ? String(el.boxShadow)
                                  : (el.shadow
                                    ? `${el.shadow.x}px ${el.shadow.y}px ${el.shadow.blur}px ${el.shadow.color}`
                                    : 'none'),
                                backdropFilter: el.backdropFilter || undefined,
                                WebkitBackdropFilter: el.backdropFilter || undefined, // Safari support
                              }}
                            >
                              {el.backgroundImage && el.backgroundImage.includes('{{') && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 text-gray-500 pointer-events-none">
                                  <div className="text-center p-1">
                                    <ImageIcon className="mx-auto mb-1 w-4 h-4 opacity-50" />
                                    <div className="text-[10px] font-medium break-all opacity-70">
                                      {el.backgroundImage.replace(/^url\(['"]?|['"]?\)$/g, '')}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Resize handles */}
                          {isSelected &&
                            !el.locked &&
                            tool === 'select' && (
                              <>
                                {['tl', 'tr', 'bl', 'br'].map(
                                  (position) => (
                                    <div
                                      key={position}
                                      className="absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-sm hover:bg-blue-500 transition-colors"
                                      style={{
                                        top: position.includes('t')
                                          ? -6
                                          : 'auto',
                                        bottom: position.includes('b')
                                          ? -6
                                          : 'auto',
                                        left: position.includes('l')
                                          ? -6
                                          : 'auto',
                                        right: position.includes('r')
                                          ? -6
                                          : 'auto',
                                        cursor:
                                          position === 'tl' ||
                                          position === 'br'
                                            ? 'nwse-resize'
                                            : 'nesw-resize',
                                      }}
                                      onMouseDown={(e) => {
                                        e.stopPropagation();
                                        setIsResizing(true);
                                        setResizeHandle(position);
                                        const rect =
                                          containerRef.current?.getBoundingClientRect();
                                        if (rect) {
                                          const clickX =
                                            (e.clientX - rect.left) /
                                            (zoom / 100);
                                          const clickY =
                                            (e.clientY - rect.top) /
                                            (zoom / 100);
                                          setElementDragStart({
                                            elementId: el.id,
                                            elementType: el.type,
                                            fontSize: el.fontSize,
                                            x: clickX,
                                            y: clickY,
                                            elementX: el.x,
                                            elementY: el.y,
                                            elementW: el.width,
                                            elementH: el.height,
                                          });
                                        }
                                      }}
                                    />
                                  )
                                )}

                                <div className="absolute -bottom-8 left-0 bg-blue-500 text-white px-2 py-1 rounded text-xs font-mono flex items-center gap-2 pointer-events-none shadow-lg">
                                  <span>
                                    {Math.round(el.x)}x, {Math.round(el.y)}
                                    y
                                  </span>
                                  <span className="text-blue-200">|</span>
                                  <span>
                                    {Math.round(el.width)}w ×{' '}
                                    {Math.round(el.height)}h
                                  </span>
                                </div>
                              </>
                            )}

                          {/* Hover toolbar */}
                          {!isSelected &&
                            !el.locked &&
                            tool === 'select' && (
                              <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white text-gray-900 shadow-xl rounded-xl px-2 py-1.5 flex gap-1 pointer-events-auto z-50 border border-gray-200">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-9 w-9 p-0 hover:bg-gray-100 text-gray-700"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedElementId(el.id);
                                  }}
                                >
                                  <Square className="h-5 w-5" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-9 w-9 p-0 hover:bg-gray-100 text-gray-700"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    duplicateElement(el.id);
                                  }}
                                >
                                  <Copy className="h-5 w-5" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-9 w-9 p-0 hover:bg-red-50 text-red-500 hover:text-red-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteElement(el.id);
                                  }}
                                >
                                  <Trash2 className="h-5 w-5" />
                                </Button>
                              </div>
                            )}
                        </div>
                      );
                    })}
                </>
              )}
            </div>
          ) : (
            <div className="text-gray-400 text-center py-12">
              <p className="text-lg font-medium">No template loaded</p>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-lg border border-gray-200 z-50 opacity-0 group-hover/canvas:opacity-100 transition-opacity duration-200">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-gray-100"
          onClick={() => setZoom(Math.max(10, zoom - 10))}
        >
          <ZoomOut className="h-4 w-4 text-gray-600" />
        </Button>
        <span className="text-xs font-medium w-12 text-center text-gray-600 select-none">
          {Math.round(zoom)}%
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-gray-100"
          onClick={() => setZoom(Math.min(200, zoom + 10))}
        >
          <ZoomIn className="h-4 w-4 text-gray-600" />
        </Button>
      </div>
    </div>
  );
}
