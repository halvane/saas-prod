'use client';

import { useState, useMemo, useRef, useCallback, useEffect, memo } from 'react';
import Editor from '@monaco-editor/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toggleTemplateStatus, deleteTemplate, seedTemplatesAction, importTemplatesJson, updateTemplate, getTemplates } from '@/app/(admin)/admin/templates/actions';
import { Loader2, Trash2, Plus, Search, LayoutGrid, List, ThumbsUp, ThumbsDown, Upload, Code, Save, ChevronLeft, ChevronRight, LayoutTemplate } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

// Global memory cache for templates (survives re-renders)
const TEMPLATE_CACHE = new Map<string, Template[]>();
const PREVIEW_CACHE = new Map<string, string>();
const CACHE_TIMESTAMP = new Map<string, number>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface Template {
  id: string;
  name: string;
  category: string | null;
  platform: any;
  isActive: boolean | null;
  usageCount: number | null;
  thumbsUpCount: number | null;
  thumbsDownCount: number | null;
  createdAt: Date;
  htmlTemplate: string;
  cssTemplate: string;
  width: number | null;
  height: number | null;
  llmSchema: any;
  variables: any;
}



const DEFAULT_CSS_VARS = `
  :root {
    --brand-primary: #6366f1;
    --brand-secondary: #4f46e5;
    --brand-accent: #8b5cf6;
    --brand-bg: #ffffff;
    --brand-text: #1f2937;
    --brand-text-secondary: #6b7280;
    --brand-font: system-ui, -apple-system, sans-serif;
  }
`;

function populateTemplate(html: string | null | undefined, variables: any): string {
  if (!html) return '';
  
  // Placeholder 1x1 transparent GIF to prevent 404s
  const PLACEHOLDER_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  
  return html.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
    const cleanKey = key.trim();
    
    // Try to find the key in variables
    if (variables && variables[cleanKey] !== undefined) {
      const val = variables[cleanKey];
      if (typeof val === 'object' && val !== null) {
        return String(val.default || PLACEHOLDER_IMAGE);
      }
      return String(val || PLACEHOLDER_IMAGE);
    }
    
    // Return placeholder for image variables to prevent 404
    if (cleanKey.toLowerCase().includes('image') || 
        cleanKey.toLowerCase().includes('photo') || 
        cleanKey.toLowerCase().includes('picture') ||
        cleanKey.toLowerCase().includes('icon')) {
      return PLACEHOLDER_IMAGE;
    }
    
    // Return empty string for text variables
    return '';
  });
}

export function TemplateManagement({ initialTemplates }: { initialTemplates: Template[] }) {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [visibleTemplates, setVisibleTemplates] = useState<Set<string>>(new Set());
  const observer = useRef<IntersectionObserver | null>(null);
  const templateObserver = useRef<IntersectionObserver | null>(null);
  
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [importOpen, setImportOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [importing, setImporting] = useState(false);
  
  // Editor State
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [editorData, setEditorData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const lastTemplateElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        loadMoreTemplates();
      }
    }, {
      rootMargin: '200px', // Load before user reaches the end
      threshold: 0.1,
    });
    if (node) observer.current.observe(node);
  }, [loadingMore, hasMore]);

  const loadMoreTemplates = async () => {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const cacheKey = `${nextPage}-${searchQuery}-${categoryFilter}-${platformFilter}-${statusFilter}`;
      
      // Check cache first
      const cached = TEMPLATE_CACHE.get(cacheKey);
      const cacheTime = CACHE_TIMESTAMP.get(cacheKey);
      
      if (cached && cacheTime && Date.now() - cacheTime < CACHE_DURATION) {
        // Use cached data instantly
        setTemplates(prev => [...prev, ...cached]);
        setPage(nextPage);
        if (cached.length < 20) setHasMore(false);
        setLoadingMore(false);
        return;
      }
      
      const newTemplates = await getTemplates(nextPage, 20, searchQuery, categoryFilter, platformFilter, statusFilter);
      
      // Sanitize templates to ensure non-null strings
      const sanitizedTemplates = newTemplates.map(t => ({
        ...t,
        htmlTemplate: t.htmlTemplate || '',
        cssTemplate: t.cssTemplate || '',
      }));
      
      // Cache the results
      TEMPLATE_CACHE.set(cacheKey, sanitizedTemplates);
      CACHE_TIMESTAMP.set(cacheKey, Date.now());
      
      if (sanitizedTemplates.length < 20) {
        setHasMore(false);
      }
      
      setTemplates(prev => [...prev, ...sanitizedTemplates]);
      setPage(nextPage);
    } catch (error) {
      console.error('Error loading more templates:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const isFirstMount = useRef(true);

  // Lazy load template previews
  useEffect(() => {
    templateObserver.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const templateId = entry.target.getAttribute('data-template-id');
            if (templateId) {
              setVisibleTemplates(prev => new Set([...prev, templateId]));
            }
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.01,
      }
    );

    return () => {
      if (templateObserver.current) {
        templateObserver.current.disconnect();
      }
    };
  }, []);

  const templateCardRef = useCallback((node: HTMLDivElement | null, templateId: string) => {
    if (node && templateObserver.current) {
      node.setAttribute('data-template-id', templateId);
      templateObserver.current.observe(node);
    }
  }, []);

  // Reload when filters change
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      if (searchQuery === '' && categoryFilter === 'all' && platformFilter === 'all' && statusFilter === 'all') {
        return;
      }
    }

    setPage(1);
    setHasMore(true);
    
    // Debounce search for faster response
    const timeoutId = setTimeout(async () => {
      const cacheKey = `1-${searchQuery}-${categoryFilter}-${platformFilter}-${statusFilter}`;
      
      // Check cache first for instant load
      const cached = TEMPLATE_CACHE.get(cacheKey);
      const cacheTime = CACHE_TIMESTAMP.get(cacheKey);
      
      if (cached && cacheTime && Date.now() - cacheTime < CACHE_DURATION) {
        // Instant load from cache
        setTemplates(cached);
        setHasMore(cached.length === 20);
        return;
      }
      
      setInitialLoading(true);
      try {
        const data = await getTemplates(1, 20, searchQuery, categoryFilter, platformFilter, statusFilter);
        
        // Sanitize
        const sanitizedData = data.map(t => ({
          ...t,
          htmlTemplate: t.htmlTemplate || '',
          cssTemplate: t.cssTemplate || '',
        }));
        
        // Cache the results
        TEMPLATE_CACHE.set(cacheKey, sanitizedData);
        CACHE_TIMESTAMP.set(cacheKey, Date.now());
        
        setTemplates(sanitizedData);
        setHasMore(sanitizedData.length === 20);
      } catch (e) {
        console.error(e);
      } finally {
        setInitialLoading(false);
      }
    }, 150); // Reduced from 300ms to 150ms for faster response

    return () => clearTimeout(timeoutId);
  }, [searchQuery, categoryFilter, platformFilter, statusFilter]);



  const openEditor = (template: Template) => {
    setEditingTemplate(template);
    setEditorData({
      name: template.name,
      category: template.category || '',
      platform: Array.isArray(template.platform) ? template.platform.join(', ') : '',
      htmlTemplate: template.htmlTemplate,
      cssTemplate: template.cssTemplate,
      width: template.width || 1080,
      height: template.height || 1080,
      llmSchema: JSON.stringify(template.llmSchema || {}, null, 2),
      variables: JSON.stringify(template.variables || {}, null, 2),
    });
    setEditorOpen(true);
  };

  const handleSaveTemplate = async () => {
    if (!editingTemplate) return;
    setSaving(true);
    try {
      let parsedSchema = {};
      let parsedVariables = {};
      try {
        parsedSchema = JSON.parse(editorData.llmSchema);
      } catch (e) {
        alert('Invalid JSON in Schema');
        setSaving(false);
        return;
      }
      try {
        parsedVariables = JSON.parse(editorData.variables);
      } catch (e) {
        alert('Invalid JSON in Variables');
        setSaving(false);
        return;
      }

      const payload = {
        ...editorData,
        platform: editorData.platform.split(',').map((p: string) => p.trim()).filter(Boolean),
        width: Number(editorData.width),
        height: Number(editorData.height),
        llmSchema: parsedSchema,
        variables: parsedVariables,
      };

      const result = await updateTemplate(editingTemplate.id, payload);
      if (result.success) {
        // Optimistic update
        setTemplates(templates.map(t => 
          t.id === editingTemplate.id ? { ...t, ...payload } : t
        ));
        
        // Clear caches
        TEMPLATE_CACHE.clear();
        CACHE_TIMESTAMP.clear();
        PREVIEW_CACHE.delete(editingTemplate.id);
        
        setEditorOpen(false);
      } else {
        alert('Update failed: ' + result.error);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleImport = async () => {
    if (!jsonInput.trim()) return;
    setImporting(true);
    try {
      const result = await importTemplatesJson(jsonInput);
      if (result.success) {
        setImportOpen(false);
        setJsonInput('');
        router.refresh();
        alert(`Successfully imported ${result.count} templates. ${(result.failed || 0) > 0 ? `Failed: ${result.failed}` : ''}`);
      } else {
        alert('Import failed: ' + result.error);
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('Import failed');
    } finally {
      setImporting(false);
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setLoadingId(id);
    try {
      // Optimistic update - instant UI feedback
      setTemplates(templates.map(t => 
        t.id === id ? { ...t, isActive: !currentStatus } : t
      ));
      
      await toggleTemplateStatus(id, !currentStatus);
      
      // Clear all caches to force refresh on next load
      TEMPLATE_CACHE.clear();
      CACHE_TIMESTAMP.clear();
    } catch (error) {
      console.error('Failed to toggle status:', error);
      // Revert on error
      setTemplates(templates.map(t => 
        t.id === id ? { ...t, isActive: currentStatus } : t
      ));
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    setLoadingId(id);
    try {
      // Optimistic update - instant UI feedback
      setTemplates(templates.filter(t => t.id !== id));
      
      await deleteTemplate(id);
      
      // Clear all caches
      TEMPLATE_CACHE.clear();
      CACHE_TIMESTAMP.clear();
      PREVIEW_CACHE.delete(id);
    } catch (error) {
      console.error('Failed to delete template:', error);
      // Revert on error - would need to restore from backup
      router.refresh();
    } finally {
      setLoadingId(null);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedTemplatesAction();
      router.refresh();
    } catch (error) {
      console.error('Failed to seed:', error);
    } finally {
      setSeeding(false);
    }
  };



  const categories = useMemo(() => {
    const cats = new Set(templates.map(t => t.category).filter(Boolean));
    return Array.from(cats) as string[];
  }, [templates]);

  const platforms = useMemo(() => {
    const plats = new Set(templates.flatMap(t => Array.isArray(t.platform) ? t.platform : []));
    return Array.from(plats) as string[];
  }, [templates]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Templates</h2>
          <p className="text-muted-foreground">Manage and organize your AI templates.</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={importOpen} onOpenChange={setImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import JSON
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Import Templates</DialogTitle>
                <DialogDescription>
                  Paste a JSON array of templates to import.
                  <br />
                  <span className="text-xs text-muted-foreground font-mono mt-2 block bg-slate-100 p-2 rounded overflow-x-auto">
                    [{`{ "name": "...", "htmlTemplate": "...", "cssTemplate": "...", "category": "...", "platform": ["..."] }`}]
                  </span>
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Textarea
                  placeholder="Paste JSON here..."
                  className="h-[300px] font-mono text-xs"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setImportOpen(false)}>Cancel</Button>
                <Button onClick={handleImport} disabled={importing || !jsonInput.trim()}>
                  {importing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Import Templates
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button onClick={handleSeed} disabled={seeding}>
            {seeding ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Populate Mock Templates
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-9 w-[130px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="h-9 w-[130px]">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              {platforms.map(p => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center border rounded-md ml-2">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-9 px-3 rounded-none rounded-l-md"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-9 px-3 rounded-none rounded-r-md"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && !initialLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((template, index) => {
            const isVisible = visibleTemplates.has(template.id);
            return (
            <Card 
              key={template.id} 
              ref={(node) => {
                if (index === templates.length - 1) lastTemplateElementRef(node);
                if (node) templateCardRef(node, template.id);
              }}
              className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow group"
            >
              <div className="relative aspect-[4/3] bg-gray-100 border-b">
                <div className="absolute inset-0 overflow-hidden">
                  {isVisible ? (
                    <iframe
                      srcDoc={`
                        <!DOCTYPE html>
                        <html>
                          <head>
                            <style>
                              ${DEFAULT_CSS_VARS}
                              body { margin: 0; padding: 0; overflow: hidden; display: flex; align-items: center; justify-content: center; height: 100vh; background: #f3f4f6; }
                              .preview-container { transform-origin: center; transform: scale(0.65); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
                              img { max-width: 100%; height: auto; }
                              ${template.cssTemplate}
                            </style>
                          </head>
                          <body>
                            <div class="preview-container">
                              ${populateTemplate(template.htmlTemplate, template.variables)}
                            </div>
                          </body>
                        </html>
                      `}
                      className="w-full h-full border-0 pointer-events-none"
                      title={template.name}
                      sandbox=""
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Badge variant={template.isActive ? "default" : "secondary"} className="shadow-sm">
                    {template.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg line-clamp-1" title={template.name}>
                      {template.name}
                    </CardTitle>
                    <CardDescription className="capitalize">
                      {template.category || 'Uncategorized'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 pb-2">
                <div className="flex flex-wrap gap-1 mb-3">
                  {Array.isArray(template.platform) && template.platform.map((p: string) => (
                    <Badge key={p} variant="outline" className="text-xs capitalize">
                      {p}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                  <span>Used {template.usageCount || 0} times</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      <span>{template.thumbsUpCount || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsDown className="h-3 w-3" />
                      <span>{template.thumbsDownCount || 0}</span>
                    </div>
                  </div>
                </div>
              </CardContent>

              <div className="p-4 pt-0 mt-auto flex items-center justify-between border-t bg-gray-50/50 pt-3">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={!!template.isActive}
                    onCheckedChange={() => handleToggle(template.id, !!template.isActive)}
                    disabled={loadingId === template.id}
                  />
                  <span className="text-xs text-muted-foreground">
                    {template.isActive ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/template-builder/${template.id}`)}
                    title="Visual Editor"
                  >
                    <LayoutTemplate className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditor(template)}
                  >
                    <Code className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(template.id)}
                    disabled={loadingId === template.id}
                  >
                    {loadingId === template.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          );})}
        </div>
      ) : null}

      {/* List View */}
      {viewMode === 'list' && !initialLoading ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Platforms</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Feedback</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template, index) => (
                  <TableRow 
                    key={template.id}
                    ref={index === templates.length - 1 ? lastTemplateElementRef : null}
                  >
                    <TableCell className="font-medium">{template.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{template.category || 'Uncategorized'}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {Array.isArray(template.platform) ? (
                          template.platform.map((p: string) => (
                            <Badge key={p} variant="secondary" className="text-xs">
                              {p}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{template.usageCount}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          <span>{template.thumbsUpCount || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsDown className="h-3 w-3" />
                          <span>{template.thumbsDownCount || 0}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={template.isActive || false}
                          onCheckedChange={() => handleToggle(template.id, template.isActive || false)}
                          disabled={loadingId === template.id}
                        />
                        <span className="text-sm text-muted-foreground">
                          {template.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/admin/custom-template/${template.id}`)}
                        title="View Template"
                      >
                        <LayoutTemplate className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditor(template)}
                      >
                        <Code className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(template.id)}
                        disabled={loadingId === template.id}
                      >
                        {loadingId === template.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-destructive" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {templates.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No templates found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}

      {templates.length === 0 && viewMode === 'grid' && !initialLoading && (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg bg-gray-50">
          <p className="text-muted-foreground mb-4">No templates found matching your filters.</p>
          <Button onClick={() => {
            setSearchQuery('');
            setCategoryFilter('all');
            setPlatformFilter('all');
            setStatusFilter('all');
          }} variant="outline">
            Clear Filters
          </Button>
        </div>
      )}

      {/* Initial Loading State - Full Page Loader */}
      {initialLoading && (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
          <p className="text-lg font-medium text-gray-700">Loading templates...</p>
          <p className="text-sm text-muted-foreground">Fetching first 20 templates</p>
        </div>
      )}

      {/* Infinite Scroll Loader - Bottom */}
      {loadingMore && !initialLoading && (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-sm font-medium text-gray-600">Loading more templates...</p>
        </div>
      )}

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="!max-w-[95vw] !w-[95vw] h-[95vh] flex flex-col p-0 gap-0 sm:!max-w-[95vw]">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <DialogTitle>Template Code Editor</DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setEditorOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveTemplate} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Changes
              </Button>
            </div>
          </div>
          
          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel: Editor */}
            <div className="w-1/2 border-r flex flex-col bg-slate-50">
              <Tabs defaultValue="html" className="flex-1 flex flex-col">
                <div className="px-4 pt-4 border-b bg-white">
                  <TabsList className="w-full justify-start">
                    <TabsTrigger value="html">HTML Structure</TabsTrigger>
                    <TabsTrigger value="css">CSS Styles</TabsTrigger>
                    <TabsTrigger value="variables">Variables (Values)</TabsTrigger>
                    <TabsTrigger value="schema">Schema (LLM)</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="html" className="flex-1 p-0 m-0 relative h-full">
                  <Editor
                    height="100%"
                    defaultLanguage="html"
                    theme="vs-dark"
                    value={editorData.htmlTemplate}
                    onChange={(value) => setEditorData({ ...editorData, htmlTemplate: value || '' })}
                    options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16 } }}
                  />
                </TabsContent>

                <TabsContent value="css" className="flex-1 p-0 m-0 relative h-full">
                  <Editor
                    height="100%"
                    defaultLanguage="css"
                    theme="vs-dark"
                    value={editorData.cssTemplate}
                    onChange={(value) => setEditorData({ ...editorData, cssTemplate: value || '' })}
                    options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16 } }}
                  />
                </TabsContent>

                <TabsContent value="variables" className="flex-1 p-0 m-0 relative h-full">
                  <Editor
                    height="100%"
                    defaultLanguage="json"
                    theme="vs-dark"
                    value={editorData.variables}
                    onChange={(value) => setEditorData({ ...editorData, variables: value || '' })}
                    options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16 } }}
                  />
                </TabsContent>

                <TabsContent value="schema" className="flex-1 p-0 m-0 relative h-full">
                  <Editor
                    height="100%"
                    defaultLanguage="json"
                    theme="vs-dark"
                    value={editorData.llmSchema}
                    onChange={(value) => setEditorData({ ...editorData, llmSchema: value || '' })}
                    options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16 } }}
                  />
                </TabsContent>

                <TabsContent value="settings" className="flex-1 p-6 overflow-y-auto">
                  <div className="grid gap-6 max-w-xl">
                    <div className="grid gap-2">
                      <Label>Template Name</Label>
                      <Input
                        value={editorData.name}
                        onChange={(e) => setEditorData({ ...editorData, name: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Width (px)</Label>
                        <Input
                          type="number"
                          value={editorData.width}
                          onChange={(e) => setEditorData({ ...editorData, width: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Height (px)</Label>
                        <Input
                          type="number"
                          value={editorData.height}
                          onChange={(e) => setEditorData({ ...editorData, height: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Category</Label>
                      <Input
                        value={editorData.category}
                        onChange={(e) => setEditorData({ ...editorData, category: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Platforms (comma separated)</Label>
                      <Input
                        value={editorData.platform}
                        onChange={(e) => setEditorData({ ...editorData, platform: e.target.value })}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Panel: Live Preview */}
            <div className="w-1/2 bg-gray-100 flex flex-col">
              <div className="p-2 border-b bg-white text-xs text-muted-foreground flex justify-between items-center">
                <span>Live Preview ({editorData.width}x{editorData.height})</span>
                <Button variant="ghost" size="sm" onClick={() => router.refresh()}>
                  <LayoutGrid className="h-3 w-3 mr-1" /> Refresh
                </Button>
              </div>
              <div className="flex-1 flex items-center justify-center overflow-hidden p-8">
                <div 
                  className="bg-white shadow-2xl transition-all duration-300"
                  style={{
                    width: `${editorData.width}px`,
                    height: `${editorData.height}px`,
                    transform: 'scale(0.6)',
                    transformOrigin: 'center',
                  }}
                >
                  <iframe
                    srcDoc={`
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <style>
                            ${DEFAULT_CSS_VARS}
                            body { margin: 0; padding: 0; overflow: hidden; }
                            ${editorData.cssTemplate}
                          </style>
                        </head>
                        <body>
                          ${populateTemplate(editorData.htmlTemplate, (() => {
                            try { return JSON.parse(editorData.variables || '{}'); }
                            catch { return {}; }
                          })())}
                        </body>
                      </html>
                    `}
                    className="w-full h-full border-0 pointer-events-none"
                    title="Preview"
                    sandbox="allow-scripts"
                  />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}