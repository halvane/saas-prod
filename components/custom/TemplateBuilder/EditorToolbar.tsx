'use client';

import { Type, Image, Square, Pen, Sparkles, Play, MousePointer2, Layers2, Library } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export type EditorTool = 'select' | 'text' | 'image' | 'elements' | 'draw' | 'effects' | 'animate' | 'layers' | 'library';

interface EditorToolbarProps {
  tool: EditorTool;
  setTool: (tool: EditorTool) => void;
  addElement: (type: any) => void;
}

export function EditorToolbar({ tool, setTool, addElement }: EditorToolbarProps) {
  const toolGroups = [
    {
      label: 'Selection',
      tools: [
        { id: 'select', icon: MousePointer2, label: 'Select', tooltip: 'Select and move (V)' },
      ]
    },
    {
      label: 'Content',
      tools: [
        { id: 'text', icon: Type, label: 'Text', tooltip: 'Add text (T)' },
        { id: 'image', icon: Image, label: 'Image', tooltip: 'Add image (I)' },
        { id: 'elements', icon: Square, label: 'Elements', tooltip: 'Add shapes & elements (E)' },
        { id: 'library', icon: Library, label: 'Library', tooltip: 'Asset library (L)' },
      ]
    },
    {
      label: 'Create',
      tools: [
        { id: 'draw', icon: Pen, label: 'Draw', tooltip: 'Draw freehand (D)' },
      ]
    },
    {
      label: 'Modify',
      tools: [
        { id: 'effects', icon: Sparkles, label: 'Effects', tooltip: 'Add effects (E)' },
        { id: 'animate', icon: Play, label: 'Animate', tooltip: 'Add animation (A)' },
      ]
    },
    {
      label: 'View',
      tools: [
        { id: 'layers', icon: Layers2, label: 'Layers', tooltip: 'Show layers panel' },
      ]
    }
  ];

  return (
    <div className="h-full bg-white/95 backdrop-blur-sm border-r border-slate-200 flex flex-col items-center overflow-y-auto w-20 shrink-0">
      <div className="w-full pt-3 pb-2 px-2">
        <div className="text-center text-[10px] font-semibold text-purple-600 tracking-wider">
          TOOLS
        </div>
      </div>

      {toolGroups.map((group, groupIndex) => (
        <div key={group.label} className="w-full">
          {groupIndex > 0 && (
            <div className="px-3 py-2">
              <Separator className="bg-slate-100" />
            </div>
          )}
          <div className="px-2 pb-2 space-y-1">
            {group.tools.map((t) => (
              <button
                key={t.id}
                onClick={() => setTool(t.id as EditorTool)}
                className={`w-full p-2.5 rounded-lg transition-all flex flex-col items-center gap-1 group relative ${
                  tool === t.id
                    ? 'bg-purple-100 text-purple-700 shadow-sm'
                    : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                }`}
                title={t.tooltip}
              >
                <t.icon className={`w-5 h-5 ${tool === t.id ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className="text-[9px] font-medium leading-tight text-center">
                  {t.label}
                </span>
                
                {/* Tooltip on hover */}
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                  {t.tooltip}
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
