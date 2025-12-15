'use client';

import React from 'react';

export function VisualEditor({ template }: { template: any }) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Visual Editor</h1>
      <p>Editing template: {template.name}</p>
      <p className="text-yellow-600">This component is currently under construction.</p>
    </div>
  );
}
