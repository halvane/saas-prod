'use client';

import { RadarPage } from '@/components/custom/Radar/RadarPage';
import { useRouter } from 'next/navigation';

export default function Radar() {
  const router = useRouter();

  const handleClose = () => {
    router.push('/dashboard');
  };

  const handleProceed = (mode: string, data: any) => {
    // Process radar data and move to editor
    router.push('/editor');
  };

  return (
    <RadarPage
      isOpen={true}
      onClose={handleClose}
      onProceed={handleProceed}
    />
  );
}
