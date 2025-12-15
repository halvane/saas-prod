import { useEffect } from 'react';
import type { VisualElement } from '../types';

interface UseKeyboardShortcutsProps {
  selectedElementId: string | null;
  visualElements: VisualElement[];
  addElement: (type: VisualElement['type']) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  moveElementZIndex: (id: string, direction: 'up' | 'down' | 'top' | 'bottom') => void;
  undo: () => void;
  redo: () => void;
  setTool: (tool: 'select' | 'text' | 'image' | 'rectangle' | 'circle') => void;
  setSelectedElementId: (id: string | null) => void;
  setShowKeyboardShortcuts: (show: boolean) => void;
  updateElement: (id: string, updates: Partial<VisualElement>) => void;
  saveToHistory: () => void;
  toast: any;
}

export function useKeyboardShortcuts({
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
  toast,
}: UseKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isEditingText = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if (isEditingText && e.key !== 'Escape') return;

      // Tool shortcuts
      if (!e.ctrlKey && !e.metaKey && !e.altKey && !isEditingText) {
        if (e.key === 't' || e.key === 'T') {
          e.preventDefault();
          addElement('text');
          setTool('select');
          toast({ title: '📝 Text added' });
        } else if (e.key === 'r' || e.key === 'R') {
          e.preventDefault();
          addElement('rectangle');
          setTool('select');
          toast({ title: '⬛ Rectangle added' });
        } else if (e.key === 'c' || e.key === 'C') {
          e.preventDefault();
          addElement('circle');
          setTool('select');
          toast({ title: '⭕ Circle added' });
        } else if (e.key === 'i' || e.key === 'I') {
          e.preventDefault();
          addElement('image');
          setTool('select');
          toast({ title: '🖼️ Image added' });
        } else if (e.key === 'v' || e.key === 'V') {
          e.preventDefault();
          setTool('select');
          toast({ title: '👆 Select tool active' });
        }
      }

      // Undo/Redo
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undo();
        } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
          e.preventDefault();
          redo();
        }
      }

      // Delete
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId && !isEditingText) {
        e.preventDefault();
        deleteElement(selectedElementId);
      }

      // Duplicate
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedElementId && !isEditingText) {
        e.preventDefault();
        duplicateElement(selectedElementId);
      }

      // Arrow keys
      if (selectedElementId && !isEditingText) {
        const step = e.shiftKey ? 10 : 1;
        const element = visualElements.find(el => el.id === selectedElementId);
        if (!element || element.locked) return;

        let moved = false;
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          updateElement(selectedElementId, { x: Math.max(0, element.x - step) });
          moved = true;
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          updateElement(selectedElementId, { x: element.x + step });
          moved = true;
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          updateElement(selectedElementId, { y: Math.max(0, element.y - step) });
          moved = true;
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          updateElement(selectedElementId, { y: element.y + step });
          moved = true;
        }
        if (moved) saveToHistory();
      }

      // Layer management
      if (selectedElementId && !isEditingText) {
        if ((e.ctrlKey || e.metaKey) && e.key === ']' && !e.shiftKey) {
          e.preventDefault();
          moveElementZIndex(selectedElementId, 'up');
        } else if ((e.ctrlKey || e.metaKey) && e.key === '[' && !e.shiftKey) {
          e.preventDefault();
          moveElementZIndex(selectedElementId, 'down');
        } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === ']') {
          e.preventDefault();
          moveElementZIndex(selectedElementId, 'top');
        } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === '[') {
          e.preventDefault();
          moveElementZIndex(selectedElementId, 'bottom');
        }
      }

      // Escape
      if (e.key === 'Escape') {
        setSelectedElementId(null);
        setTool('select');
      }

      // Show shortcuts
      if (e.key === '?' && !isEditingText) {
        e.preventDefault();
        setShowKeyboardShortcuts(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
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
    toast,
  ]);
}
