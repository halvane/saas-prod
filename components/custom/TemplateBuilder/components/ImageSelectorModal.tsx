import { useState } from 'react';
import { Search, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { VisualElement } from '../types';

interface ImageSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeImageVariable: string | null;
  variableValues: Record<string, any>;
  setVariableValues: (values: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>)) => void;
  updateElement: (id: string, updates: Partial<VisualElement>) => void;
  saveToHistory: () => void;
  toast: any;
  brandAssets?: { images: any[]; products: any[] } | null;
}

export function ImageSelectorModal({
  open,
  onOpenChange,
  activeImageVariable,
  variableValues,
  setVariableValues,
  updateElement,
  saveToHistory,
  toast,
  brandAssets,
}: ImageSelectorModalProps) {
  const [stockQuery, setStockQuery] = useState('');
  const [stockImages, setStockImages] = useState<any[]>([]);
  const [isLoadingStock, setIsLoadingStock] = useState(false);
  const [stockType, setStockType] = useState<'photo' | 'illustration' | 'vector'>('photo');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const searchStockPhotos = async () => {
    if (!stockQuery) return;
    setIsLoadingStock(true);
    try {
      const res = await fetch(`/api/stock?q=${encodeURIComponent(stockQuery)}&type=${stockType}`);
      const data = await res.json();
      if (data.results) {
        setStockImages(data.results);
      } else {
        setStockImages([]);
      }
    } catch (e) {
      toast({ title: 'Erreur', description: 'Impossible de charger les images', variant: 'destructive' });
    } finally {
      setIsLoadingStock(false);
    }
  };

  const selectImage = (url: string) => {
    if (activeImageVariable) {
      setVariableValues(prev => ({ ...prev, [activeImageVariable]: url }));

      const tempElementId = (window as any).__tempImageElementId;
      if (tempElementId) {
        updateElement(tempElementId, { src: url });
        saveToHistory();
        (window as any).__tempImageElementId = null;
      }

      onOpenChange(false);
      toast({ title: 'Image appliquée' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Sélectionner une image</DialogTitle>
          <DialogDescription>
            Choisissez une image depuis Pixabay/Pexels ou générez-en une avec l'IA.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="brand" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="brand">Mes Images</TabsTrigger>
            <TabsTrigger value="stock">Banque d'images</TabsTrigger>
            <TabsTrigger value="ai">Génération IA</TabsTrigger>
          </TabsList>

          <TabsContent value="brand" className="flex-1 flex flex-col overflow-hidden mt-4">
            <div className="flex-1 overflow-y-auto pr-2">
              {(!brandAssets || (brandAssets.images.length === 0 && brandAssets.products.length === 0)) ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <ImageIcon className="h-12 w-12 mb-2 opacity-20" />
                  <p>Aucune image de marque disponible</p>
                  <p className="text-sm mt-1">Ajoutez des images dans les paramètres</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {brandAssets.images.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-3 text-gray-700">Images de marque</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {brandAssets.images.map((img: any, idx: number) => {
                          const imgUrl = typeof img === 'string' ? img : img?.url || img?.src;
                          return (
                            <div
                              key={idx}
                              className="group relative aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                              onClick={() => selectImage(imgUrl)}
                            >
                              <img
                                src={imgUrl}
                                alt={`Brand image ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <Button size="sm" variant="secondary">
                                  Utiliser
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {brandAssets.products.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-3 text-gray-700">Images de produits</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {brandAssets.products.map((product: any, idx: number) => {
                          const imgUrl = typeof product.imageUrl === 'string' ? product.imageUrl : product.imageUrl?.url || product.imageUrl?.src;
                          if (!imgUrl) return null;
                          return (
                            <div
                              key={idx}
                              className="group relative aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                              onClick={() => selectImage(imgUrl)}
                            >
                              <img
                                src={imgUrl}
                                alt={product.name || `Product ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <Button size="sm" variant="secondary">
                                  Utiliser
                                </Button>
                              </div>
                              {product.name && (
                                <div className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded">
                                  {product.name}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="stock" className="flex-1 flex flex-col overflow-hidden mt-4">
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Rechercher (ex: nature, business, tech)..."
                  value={stockQuery}
                  onChange={(e) => setStockQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchStockPhotos()}
                />
                <Button onClick={searchStockPhotos} disabled={isLoadingStock}>
                  {isLoadingStock ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={stockType === 'photo' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setStockType('photo')}
                >
                  Photos
                </Button>
                <Button 
                  variant={stockType === 'illustration' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setStockType('illustration')}
                >
                  Illustrations
                </Button>
                <Button 
                  variant={stockType === 'vector' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setStockType('vector')}
                >
                  Vectors
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
              {stockImages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <ImageIcon className="h-12 w-12 mb-2 opacity-20" />
                  <p>Recherchez des images pour commencer</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {stockImages.map((img) => (
                    <div
                      key={img.id}
                      className="group relative aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                      onClick={() => selectImage(img.src.medium)}
                    >
                      <img
                        src={img.src.medium}
                        alt={img.alt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button size="sm" variant="secondary">
                          Utiliser
                        </Button>
                      </div>
                      <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1 rounded opacity-70">
                        {img.provider}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="ai" className="flex-1 flex flex-col overflow-hidden mt-4">
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Décrivez l'image à générer..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              />
              <Button disabled={isGeneratingAi}>
                {isGeneratingAi ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Générer
                  </>
                )}
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
              {generatedImages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <Sparkles className="h-12 w-12 mb-2 opacity-20" />
                  <p>Décrivez une image pour la générer avec l'IA</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {generatedImages.map((url, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                      onClick={() => selectImage(url)}
                    >
                      <img
                        src={url}
                        alt={`Generated ${idx}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button size="sm" variant="secondary">
                          Utiliser
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
