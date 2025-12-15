import React, { useEffect, useRef } from 'react';
import { Copy, Clipboard, Trash2, MoveUp, MoveDown, BringToFront, SendToBack } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onAction: (action: string) => void;
  hasSelection: boolean;
}

export function ContextMenu({ x, y, onClose, onAction, hasSelection }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!hasSelection) return null;

  return (
    <div 
      ref={menuRef}
      className="absolute z-[100] w-48 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-white/20 py-1 animate-in fade-in zoom-in-95 duration-100 origin-top-left"
      style={{ top: y, left: x }}
    >
      <button 
        onClick={() => onAction('copy')}
        className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2 transition-colors"
      >
        <Copy className="w-4 h-4" /> Copy
      </button>
      <button 
        onClick={() => onAction('paste')}
        className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2 transition-colors"
      >
        <Clipboard className="w-4 h-4" /> Paste
      </button>
      <div className="h-px bg-slate-100 my-1" />
      <button 
        onClick={() => onAction('bringForward')}
        className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2 transition-colors"
      >
        <MoveUp className="w-4 h-4" /> Bring Forward
      </button>
      <button 
        onClick={() => onAction('sendBackward')}
        className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2 transition-colors"
      >
        <MoveDown className="w-4 h-4" /> Send Backward
      </button>
      <div className="h-px bg-slate-100 my-1" />
      <button 
        onClick={() => onAction('delete')}
        className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
      >
        <Trash2 className="w-4 h-4" /> Delete
      </button>
    </div>
  );
}
