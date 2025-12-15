import { ChevronLeft, Eye, Code, Save, Layers, Wand2, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { CustomTemplate, VisualElement } from '../types';
import { useRouter } from 'next/navigation';

interface TopToolbarProps {
  selectedTemplate: CustomTemplate;
  setSelectedTemplate: (template: CustomTemplate | ((prev: CustomTemplate) => CustomTemplate)) => void;
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
  showCodeView: boolean;
  setShowCodeView: (show: boolean) => void;
  setShowKeyboardShortcuts: (show: boolean) => void;
  setShowTemplateLibrary: (show: boolean) => void;
  visualElements: VisualElement[];
  parseHTMLToVisualElements: (template: CustomTemplate) => void;
  setTool: (tool: 'select' | 'text' | 'image' | 'rectangle' | 'circle') => void;
  toast: any;
}

export function TopToolbar({
  selectedTemplate,
  setSelectedTemplate,
  showPreview,
  setShowPreview,
  showCodeView,
  setShowCodeView,
  setShowKeyboardShortcuts,
  setShowTemplateLibrary,
  visualElements,
  parseHTMLToVisualElements,
  setTool,
  toast,
}: TopToolbarProps) {
  const router = useRouter();

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between relative z-30 pointer-events-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/custom-templates')}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex flex-col">
          <Input
            value={selectedTemplate.name}
            onChange={(e) => setSelectedTemplate(prev => ({ ...prev, name: e.target.value }))}
            className="font-semibold text-lg border-none shadow-none px-0 h-auto"
            placeholder="Nom du template"
          />
          <span className="text-xs text-gray-500">Éditeur Visuel</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Eye className="h-3 w-3 mr-1" />
          Visual Editor
        </Badge>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowTemplateLibrary(true)}
        >
          <Layers className="h-4 w-4 mr-2" />
          Ouvrir Template
        </Button>

        {selectedTemplate.htmlTemplate !== '<div class="visual-canvas"></div>' && visualElements.length === 0 && (
          <>
            <Button
              variant="default"
              size="sm"
              onClick={async () => {
                parseHTMLToVisualElements(selectedTemplate);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              Convertir en Éléments Éditables
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setTool('text');
                toast({
                  title: "Mode édition activé",
                  description: "Cliquez sur le canvas pour ajouter des éléments visuels."
                });
              }}
              className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
            >
              <PenTool className="h-4 w-4 mr-2" />
              Ajouter des Éléments
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
        >
          <Eye className="h-4 w-4 mr-2" />
          {showPreview ? 'Masquer Aperçu' : 'Aperçu HTML'}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCodeView(!showCodeView)}
        >
          <Code className="h-4 w-4 mr-2" />
          {showCodeView ? 'Masquer Code' : 'Voir Code'}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowKeyboardShortcuts(true)}
          title="Keyboard Shortcuts (?)"
        >
          <span className="text-lg font-bold">⌨️</span>
        </Button>

        <Button size="sm">
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder
        </Button>
      </div>
    </div>
  );
}
