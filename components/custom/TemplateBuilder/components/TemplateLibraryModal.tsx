import { Eye, Palette, Loader2, Lightbulb } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CustomTemplate } from '../types';

interface TemplateLibraryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: CustomTemplate[];
  isLoadingTemplates: boolean;
  openTemplateFromLibrary: (template: CustomTemplate) => void;
}

export function TemplateLibraryModal({
  open,
  onOpenChange,
  templates,
  isLoadingTemplates,
  openTemplateFromLibrary,
}: TemplateLibraryModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Bibliothèque de Templates</DialogTitle>
          <DialogDescription>
            Sélectionnez un template existant à charger dans l'éditeur visuel.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {isLoadingTemplates ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-12">
              <Palette className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">Aucun template disponible</p>
            </div>
          ) : (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mx-4 mb-4">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <strong>Mode démo activé</strong> - Les templates s'affichent avec leurs variables appliquées.
                    Cliquez sur un template pour le charger.
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-blue-500"
                    onClick={() => {
                      openTemplateFromLibrary(template);
                      onOpenChange(false);
                    }}
                  >
                    <CardHeader className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <CardTitle className="text-sm font-semibold line-clamp-1">
                            {template.name}
                          </CardTitle>
                          {template.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {template.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {template.width}x{template.height}
                        </Badge>
                        {template.id?.startsWith('demo-') && (
                          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                            ✨ Démo
                          </Badge>
                        )}
                      </div>

                      <div className="mt-3 aspect-video bg-gradient-to-br from-blue-50 to-purple-50 rounded flex items-center justify-center">
                        <Palette className="h-8 w-8 text-gray-300" />
                      </div>
                    </CardHeader>

                    <CardContent className="p-4 pt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          openTemplateFromLibrary(template);
                          onOpenChange(false);
                        }}
                      >
                        <Eye className="h-3 w-3 mr-2" />
                        Ouvrir dans l'éditeur
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
