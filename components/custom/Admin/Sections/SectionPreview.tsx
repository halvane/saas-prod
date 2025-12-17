'use client';

import { useEffect, useRef } from 'react';

interface SectionPreviewProps {
  html: string;
  css: string;
  scale?: number;
  className?: string;
}

export function SectionPreview({ html, css, scale = 1, className = '' }: SectionPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        // Replace variables {{name}} with placeholder text
        const processedHtml = html.replace(/\{\{([^}]+)\}\}/g, (match, p1) => {
          // Try to make it look like real data based on variable name
          const key = p1.trim().toLowerCase();
          if (key.includes('image') || key.includes('src') || key.includes('url')) return 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80';
          if (key.includes('title') || key.includes('headline')) return 'Lorem Ipsum Headline';
          if (key.includes('text') || key.includes('desc')) return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
          if (key.includes('price')) return '$99.00';
          if (key.includes('date')) return 'Oct 24, 2025';
          return `[${p1.trim()}]`;
        });

        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://cdn.tailwindcss.com"></script>
              <script>
                tailwind.config = {
                  theme: {
                    extend: {
                      colors: {
                        border: "hsl(var(--border))",
                        input: "hsl(var(--input))",
                        ring: "hsl(var(--ring))",
                        background: "hsl(var(--background))",
                        foreground: "hsl(var(--foreground))",
                        primary: {
                          DEFAULT: "hsl(var(--primary))",
                          foreground: "hsl(var(--primary-foreground))",
                        },
                        secondary: {
                          DEFAULT: "hsl(var(--secondary))",
                          foreground: "hsl(var(--secondary-foreground))",
                        },
                        destructive: {
                          DEFAULT: "hsl(var(--destructive))",
                          foreground: "hsl(var(--destructive-foreground))",
                        },
                        muted: {
                          DEFAULT: "hsl(var(--muted))",
                          foreground: "hsl(var(--muted-foreground))",
                        },
                        accent: {
                          DEFAULT: "hsl(var(--accent))",
                          foreground: "hsl(var(--accent-foreground))",
                        },
                        popover: {
                          DEFAULT: "hsl(var(--popover))",
                          foreground: "hsl(var(--popover-foreground))",
                        },
                        card: {
                          DEFAULT: "hsl(var(--card))",
                          foreground: "hsl(var(--card-foreground))",
                        },
                      },
                    }
                  }
                }
              </script>
              <style>
                /* Base Variables */
                :root {
                  --brand-primary: #000000;
                  --brand-secondary: #ffffff;
                  --brand-accent: #3b82f6;
                  --brand-primary-light: #4b5563;
                  --font-heading: system-ui, sans-serif;
                  --font-body: system-ui, sans-serif;
                }
                
                body { 
                  margin: 0; 
                  padding: 0; 
                  overflow-x: hidden;
                  font-family: var(--font-body);
                }
                
                /* Custom CSS */
                ${css}
              </style>
            </head>
            <body>
              ${processedHtml}
            </body>
          </html>
        `);
        doc.close();
      }
    }
  }, [html, css]);

  return (
    <div className={`relative overflow-hidden bg-white ${className}`}>
      <iframe
        ref={iframeRef}
        className="w-full h-full border-none pointer-events-none"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${100 / scale}%`,
          height: `${100 / scale}%`,
        }}
        tabIndex={-1}
        title="Section Preview"
      />
    </div>
  );
}
