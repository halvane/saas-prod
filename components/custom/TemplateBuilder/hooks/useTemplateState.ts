import { useState, useEffect } from 'react';
import { DEFAULT_TEMPLATE, type CustomTemplate } from '../types';

export function useTemplateState() {
  const [selectedTemplate, setSelectedTemplate] = useState<CustomTemplate>(DEFAULT_TEMPLATE);
  const [variableValues, setVariableValues] = useState<Record<string, any>>({});
  const [rawHtmlTemplate, setRawHtmlTemplate] = useState<string>('');
  const [rawCssTemplate, setRawCssTemplate] = useState<string>('');
  const [canvasBackground, setCanvasBackground] = useState('#ffffff');
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Generate Blob URL for preview
  useEffect(() => {
    const content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=${selectedTemplate.width}, height=${selectedTemplate.height}, initial-scale=1.0">
  <style>
    * { 
      box-sizing: border-box; 
      margin: 0;
      padding: 0;
    }
    html { 
      width: ${selectedTemplate.width}px; 
      height: ${selectedTemplate.height}px; 
      margin: 0;
      padding: 0;
    }
    body { 
      margin: 0; 
      padding: 0; 
      width: ${selectedTemplate.width}px; 
      height: ${selectedTemplate.height}px; 
      background-color: white;
      position: relative;
      transform-origin: top left;
    }
    img {
      display: block;
    }
    ${selectedTemplate.cssTemplate || ''}
  </style>
</head>
<body>
  ${selectedTemplate.htmlTemplate || ''}
</body>
</html>`;

    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedTemplate.htmlTemplate, selectedTemplate.cssTemplate, selectedTemplate.width, selectedTemplate.height]);

  return {
    selectedTemplate,
    setSelectedTemplate,
    variableValues,
    setVariableValues,
    rawHtmlTemplate,
    rawCssTemplate,
    setRawHtmlTemplate,
    setRawCssTemplate,
    previewUrl,
    canvasBackground,
    setCanvasBackground,
  };
}
