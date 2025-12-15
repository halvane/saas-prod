import { useState, useCallback } from 'react';
import type { VisualElement, HistoryState, CustomTemplate } from '../types';

export function useVisualElements(selectedTemplate: CustomTemplate, canvasBackground: string) {
  const [visualElements, setVisualElements] = useState<VisualElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const snapToGrid = true;
  const gridSize = 10;

  const snapValue = useCallback((value: number) => {
    if (!snapToGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  }, [snapToGrid, gridSize]);

  const saveToHistory = useCallback(() => {
    const newState: HistoryState = {
      elements: JSON.parse(JSON.stringify(visualElements)),
      timestamp: Date.now(),
    };
    
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newState);
      return newHistory.slice(-50);
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [visualElements, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setVisualElements(history[historyIndex - 1].elements);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setVisualElements(history[historyIndex + 1].elements);
    }
  }, [history, historyIndex]);

  const addElement = useCallback((type: VisualElement['type'], props?: Partial<VisualElement>) => {
    const newElement: VisualElement = {
      id: `element-${Date.now()}`,
      type,
      x: snapValue(100 + visualElements.length * 20),
      y: snapValue(100 + visualElements.length * 20),
      width: type === 'text' ? 300 : 150,
      height: type === 'text' ? 80 : 150,
      zIndex: visualElements.length,
      opacity: 1,
      rotation: 0,
      visible: true,
      locked: false,
      ...(type === 'text' && { 
        content: 'Double-click to edit', 
        fontSize: 24, 
        color: '#000000', 
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        textAlign: 'left',
        lineHeight: 1.4,
        letterSpacing: 0,
      }),
      ...(type === 'image' && { 
        src: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400',
        objectFit: 'cover',
      }),
      ...((type === 'rectangle' || type === 'circle') && { 
        backgroundColor: '#667eea', 
        borderRadius: type === 'rectangle' ? 8 : 999,
        border: '',
        borderWidth: 0,
        borderColor: '#000000',
        borderStyle: 'solid',
      }),
      ...props
    };

    setVisualElements(prev => [...prev, newElement]);
    setSelectedElementId(newElement.id);
    saveToHistory();
  }, [visualElements, snapValue, saveToHistory]);

  const updateElement = useCallback((id: string, updates: Partial<VisualElement>) => {
    setVisualElements(prev =>
      prev.map(el => (el.id === id ? { ...el, ...updates } : el))
    );
  }, []);

  const deleteElement = useCallback((id: string) => {
    setVisualElements(prev => prev.filter(el => el.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
    saveToHistory();
  }, [selectedElementId, saveToHistory]);

  const duplicateElement = useCallback((id: string) => {
    const element = visualElements.find(el => el.id === id);
    if (!element) return;

    const newElement: VisualElement = {
      ...element,
      id: `element-${Date.now()}`,
      x: snapValue(element.x + 20),
      y: snapValue(element.y + 20),
      zIndex: visualElements.length
    };

    setVisualElements(prev => [...prev, newElement]);
    setSelectedElementId(newElement.id);
    saveToHistory();
  }, [visualElements, snapValue, saveToHistory]);

  const moveElementZIndex = useCallback((id: string, direction: 'up' | 'down' | 'top' | 'bottom') => {
    const element = visualElements.find(el => el.id === id);
    if (!element) return;

    let newZIndex: number;
    
    switch (direction) {
      case 'top':
        newZIndex = visualElements.length - 1;
        break;
      case 'bottom':
        newZIndex = 0;
        break;
      case 'up':
        newZIndex = Math.min(element.zIndex + 1, visualElements.length - 1);
        break;
      case 'down':
        newZIndex = Math.max(element.zIndex - 1, 0);
        break;
    }

    const reordered = visualElements.map(el => {
      if (el.id === id) {
        return { ...el, zIndex: newZIndex };
      }
      if (direction === 'up' && el.zIndex === newZIndex) {
        return { ...el, zIndex: element.zIndex };
      }
      if (direction === 'down' && el.zIndex === newZIndex) {
        return { ...el, zIndex: element.zIndex };
      }
      return el;
    });

    setVisualElements(reordered);
    saveToHistory();
  }, [visualElements, saveToHistory]);

  const convertVisualToCode = useCallback(() => {
    if (visualElements.length === 0) {
      return;
    }

    const htmlParts = visualElements
      .sort((a, b) => a.zIndex - b.zIndex)
      .filter(el => el.visible !== false)
      .map(el => {
        switch (el.type) {
          case 'text':
            return `  <div id="${el.id}" class="element element-text">${el.content || 'Text'}</div>`;
          case 'image':
            return `  <img id="${el.id}" class="element element-image" src="${el.src || 'https://via.placeholder.com/400'}" alt="Image" />`;
          case 'rectangle':
            return `  <div id="${el.id}" class="element element-rectangle"></div>`;
          case 'circle':
            return `  <div id="${el.id}" class="element element-circle"></div>`;
          default:
            return '';
        }
      });

    const html = `<div class="visual-canvas">\n${htmlParts.join('\n')}\n</div>`;

    const cssParts = visualElements
      .filter(el => el.visible !== false)
      .map(el => {
        let css = `#${el.id} {\n`;
        css += `  position: absolute;\n`;
        css += `  left: ${el.x}px;\n`;
        css += `  top: ${el.y}px;\n`;
        css += `  width: ${el.width}px;\n`;
        css += `  height: ${el.height}px;\n`;
        css += `  z-index: ${el.zIndex};\n`;
        
        if (el.rotation) {
          let transform = `rotate(${el.rotation}deg)`;
          if (el.flipX) transform += ' scaleX(-1)';
          if (el.flipY) transform += ' scaleY(-1)';
          css += `  transform: ${transform};\n`;
        }
        
        if (el.opacity !== undefined) {
          css += `  opacity: ${el.opacity};\n`;
        }
        
        if (el.type === 'text') {
          css += `  color: ${el.color || '#000000'};\n`;
          css += `  font-size: ${el.fontSize || 16}px;\n`;
          css += `  font-family: ${el.fontFamily || 'Arial, sans-serif'};\n`;
          css += `  display: flex;\n`;
          css += `  align-items: center;\n`;
        }
        
        if (el.type === 'image' && el.objectFit) {
          css += `  object-fit: ${el.objectFit};\n`;
        }
        
        if (el.type === 'rectangle' || el.type === 'circle') {
          css += `  background: ${el.backgroundColor || '#cccccc'};\n`;
          css += `  border-radius: ${el.borderRadius || 0}px;\n`;
        }
        
        css += `}\n`;
        return css;
      });

    const css = `.visual-canvas {\n  position: relative;\n  width: ${selectedTemplate.width}px;\n  height: ${selectedTemplate.height}px;\n  background: ${canvasBackground};\n}\n\n${cssParts.join('\n')}`;

    return { html, css };
  }, [visualElements, selectedTemplate.width, selectedTemplate.height, canvasBackground]);

  return {
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
  };
}
