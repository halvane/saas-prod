'use client';

import { EditorPage } from '@/components/custom/Editor/EditorPage';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Editor() {
  const router = useRouter();
  const [generatedContent, setGeneratedContent] = useState(null);

  const handleClose = () => {
    router.push('/dashboard');
  };

  const handleProceedToSchedule = (content: any) => {
    // Save content and redirect to timeline
    router.push('/timeline');
  };

  return (
    <EditorPage
      isOpen={true}
      generatedContent={generatedContent}
      onClose={handleClose}
      onProceedToSchedule={handleProceedToSchedule}
    />
  );
}
