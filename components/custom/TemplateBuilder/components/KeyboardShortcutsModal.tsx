import { MousePointer, PenTool, Type, Layers } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

interface KeyboardShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KeyboardShortcutsModal({ open, onOpenChange }: KeyboardShortcutsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
          <span className="text-3xl">⌨️</span>
          Keyboard Shortcuts
        </DialogTitle>
        <div className="space-y-6 mt-4">
          {/* Tools */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-blue-600 flex items-center gap-2">
              <MousePointer className="h-5 w-5" /> Tools
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <ShortcutRow label="Select Tool" keys="V" />
              <ShortcutRow label="Add Text" keys="T" />
              <ShortcutRow label="Add Rectangle" keys="R" />
              <ShortcutRow label="Add Circle" keys="C" />
              <ShortcutRow label="Add Image" keys="I" />
            </div>
          </div>

          {/* Edit */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-purple-600 flex items-center gap-2">
              <PenTool className="h-5 w-5" /> Edit
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <ShortcutRow label="Undo" keys="Ctrl+Z" />
              <ShortcutRow label="Redo" keys="Ctrl+Y" />
              <ShortcutRow label="Duplicate" keys="Ctrl+D" />
              <ShortcutRow label="Copy" keys="Ctrl+C" />
              <ShortcutRow label="Delete" keys="Del" />
              <ShortcutRow label="Deselect" keys="Esc" />
            </div>
          </div>

          {/* Move */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-green-600 flex items-center gap-2">
              <span className="text-xl">↕️</span> Move
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <ShortcutRow label="Move 1px" keys="Arrow Keys" />
              <ShortcutRow label="Move 10px" keys="Shift + Arrows" />
            </div>
          </div>

          {/* Layers */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-orange-600 flex items-center gap-2">
              <Layers className="h-5 w-5" /> Layers
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <ShortcutRow label="Bring Forward" keys="Ctrl+]" />
              <ShortcutRow label="Send Backward" keys="Ctrl+[" />
              <ShortcutRow label="Bring to Front" keys="Ctrl+Shift+]" />
              <ShortcutRow label="Send to Back" keys="Ctrl+Shift+[" />
            </div>
          </div>

          {/* Text Editing */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-pink-600 flex items-center gap-2">
              <Type className="h-5 w-5" /> Text Editing
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <ShortcutRow label="Edit Text" keys="Double Click" />
              <ShortcutRow label="Exit Edit Mode" keys="Esc" />
            </div>
          </div>
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>💡 Pro Tip:</strong> Press <kbd className="px-2 py-0.5 bg-blue-200 rounded text-xs mx-1">?</kbd> anytime to see this shortcuts panel!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ShortcutRow({ label, keys }: { label: string; keys: string }) {
  return (
    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
      <span>{label}</span>
      <kbd className="px-3 py-1 bg-gray-800 text-white rounded font-mono text-sm">{keys}</kbd>
    </div>
  );
}
