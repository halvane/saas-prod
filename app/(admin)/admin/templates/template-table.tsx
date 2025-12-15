'use client';

import { useState } from 'react';
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
import { toggleTemplateStatus, deleteTemplate } from './actions';
import { Loader2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Template {
  id: string;
  name: string;
  category: string | null;
  platform: any;
  isActive: boolean | null;
  usageCount: number | null;
  createdAt: Date;
}

export function TemplateTable({ templates }: { templates: Template[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setLoadingId(id);
    try {
      await toggleTemplateStatus(id, !currentStatus);
    } catch (error) {
      console.error('Failed to toggle status:', error);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    setLoadingId(id);
    try {
      await deleteTemplate(id);
    } catch (error) {
      console.error('Failed to delete template:', error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Platforms</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => (
            <TableRow key={template.id}>
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
              <TableCell colSpan={6} className="h-24 text-center">
                No templates found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
