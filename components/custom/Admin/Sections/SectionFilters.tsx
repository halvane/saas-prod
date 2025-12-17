'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter, useSearchParams } from 'next/navigation';

const CATEGORIES = ['all', 'header', 'hero', 'features', 'testimonials', 'cta', 'footer', 'pricing', 'gallery', 'text', 'overlay', 'product', 'effect'];

export function SectionFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') {
      params.delete('category');
    } else {
      params.set('category', value);
    }
    router.push(`/admin/sections?${params.toString()}`);
  };

  return (
    <Select value={currentCategory} onValueChange={handleCategoryChange}>
      <SelectTrigger className="w-[180px] bg-white">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        {CATEGORIES.map(c => (
          <SelectItem key={c} value={c}>
            {c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
