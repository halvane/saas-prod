import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/button';
import { Badge } from '../ui/Badge';
import { Input, Select } from '../ui/Input';
import { Search, Filter, Download, Trash2, Edit, Copy } from 'lucide-react';
import { BlogEditor } from '../Editor/BlogEditor';
import { PostEditor } from '../Editor/PostEditor';
import { EditorPage } from '../Editor/EditorPage';

const mockContent = [
  {
    id: '1',
    title: '10 Sustainable Fashion Tips',
    type: 'Blog',
    contentType: 'blog' as const,
    platform: 'blog' as const,
    status: 'Published',
    date: 'Dec 10, 2025',
    views: 1245,
    engagement: 156
  },
  {
    id: '2',
    title: 'Fashion Carousel',
    type: 'Visual',
    contentType: 'carousel' as const,
    platform: 'instagram' as const,
    status: 'Published',
    date: 'Dec 11, 2025',
    views: 2890,
    engagement: 342
  },
  {
    id: '3',
    title: 'Eco Thread',
    type: 'Thread',
    contentType: 'text' as const,
    platform: 'twitter' as const,
    status: 'Scheduled',
    date: 'Dec 13, 2025',
    views: 0,
    engagement: 0
  },
  {
    id: '4',
    title: 'LinkedIn Professional Post',
    type: 'Article',
    contentType: 'text' as const,
    platform: 'linkedin' as const,
    status: 'Draft',
    date: 'Dec 8, 2025',
    views: 0,
    engagement: 0
  }
];

export function ContentLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [editingContent, setEditingContent] = useState<typeof mockContent[0] | null>(null);
  const [editorType, setEditorType] = useState<'blog' | 'post' | 'carousel' | null>(null);

  const handleEdit = (content: typeof mockContent[0]) => {
    setEditingContent(content);
    
    if (content.contentType === 'blog') {
      setEditorType('blog');
    } else if (content.contentType === 'carousel') {
      setEditorType('carousel');
    } else {
      setEditorType('post');
    }
  };

  const handleCloseEditor = () => {
    setEditingContent(null);
    setEditorType(null);
  };

  return (
    <>
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="gradient-text mb-2">Content Library</h2>
            <p className="text-[#6B7280]">Manage all your created content in one place</p>
          </div>
          <Button variant="primary" size="medium">
            <Download className="w-4 h-4" />
            Export All
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search content..."
                icon={<Search className="w-5 h-5" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              options={[
                { value: 'all', label: 'All Types' },
                { value: 'blog', label: 'Blog Posts' },
                { value: 'social', label: 'Social Media' },
                { value: 'visual', label: 'Visual Content' }
              ]}
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            />
            <Select
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'published', label: 'Published' },
                { value: 'scheduled', label: 'Scheduled' },
                { value: 'draft', label: 'Drafts' }
              ]}
            />
          </div>
        </Card>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockContent.map((item) => (
            <Card key={item.id} hover={true} variant="platform" platformColor={
              item.platform === 'instagram' ? 'linear-gradient(45deg, #F58529, #DD2A7B)' :
              item.platform === 'linkedin' ? '#0077B5' :
              item.platform === 'twitter' ? '#1DA1F2' :
              '#8B5CF6'
            }>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <Badge variant="platform" platform={item.platform}>
                    {item.platform}
                  </Badge>
                  <Badge variant={
                    item.status === 'Published' ? 'success' :
                    item.status === 'Scheduled' ? 'warning' :
                    'info'
                  }>
                    {item.status}
                  </Badge>
                </div>

                <div>
                  <h4 className="mb-2 line-clamp-2">{item.title}</h4>
                  <p className="text-sm text-[#6B7280]">{item.type} • {item.date}</p>
                </div>

                {item.status === 'Published' && (
                  <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                    <span>{item.views.toLocaleString()} views</span>
                    <span>•</span>
                    <span>{item.engagement} engagements</span>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-4 border-t border-[#E5E7EB]">
                  <Button 
                    variant="ghost" 
                    size="small" 
                    className="flex-1"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="small" className="flex-1">
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </Button>
                  <Button variant="ghost" size="small">
                    <Trash2 className="w-4 h-4 text-[#EF4444]" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Editors */}
      {editorType === 'blog' && editingContent && (
        <BlogEditor
          isOpen={true}
          onClose={handleCloseEditor}
          title={editingContent.title}
          initialContent="<h1>10 Sustainable Fashion Tips</h1><p>Here's your blog content...</p>"
        />
      )}

      {editorType === 'post' && editingContent && (
        <PostEditor
          isOpen={true}
          onClose={handleCloseEditor}
          platform={editingContent.platform as any}
          initialContent={editingContent.title}
        />
      )}

      {editorType === 'carousel' && editingContent && (
        <EditorPage
          isOpen={true}
          onClose={handleCloseEditor}
          generatedContent={{
            variants: [
              {
                id: '1',
                platform: editingContent.platform,
                content: editingContent.title,
                selected: true
              }
            ]
          }}
          onProceedToSchedule={() => {}}
        />
      )}
    </>
  );
}