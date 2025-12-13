'use client';

import { MixerPage } from '@/components/custom/Mixer/MixerPage';
import { useRouter } from 'next/navigation';

export default function Mixer() {
  const router = useRouter();

  const handleClose = () => {
    router.push('/dashboard');
  };

  const handleProceedToEditor = (content: any) => {
    // Save mixed content and redirect to editor
    router.push('/editor');
  };

  return (
    <MixerPage
      isOpen={true}
      onClose={handleClose}
      onProceedToEditor={handleProceedToEditor}
    />
  );
}
