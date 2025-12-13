'use client';

import { TimelinePage } from '@/components/custom/Timeline/TimelinePage';
import { useRouter } from 'next/navigation';

export default function Timeline() {
  const router = useRouter();

  const handleClose = () => {
    router.push('/dashboard');
  };

  return (
    <TimelinePage
      isOpen={true}
      onClose={handleClose}
    />
  );
}
