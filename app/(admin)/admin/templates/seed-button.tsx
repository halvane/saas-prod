'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { seedTemplatesAction } from './actions';
import { Loader2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function SeedButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSeed = async () => {
    setLoading(true);
    try {
      await seedTemplatesAction();
      router.refresh();
    } catch (error) {
      console.error('Failed to seed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleSeed} disabled={loading}>
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Plus className="mr-2 h-4 w-4" />
      )}
      Populate Mock Templates
    </Button>
  );
}
