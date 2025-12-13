import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './button';

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

export function BackButton({ onClick, label = 'Back' }: BackButtonProps) {
  return (
    <Button
      variant="ghost"
      size="small"
      onClick={onClick}
      className="mb-6"
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </Button>
  );
}



