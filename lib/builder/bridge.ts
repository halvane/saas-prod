export const BRIDGE_SCRIPT = `
(function() {
  // Wait for DOM to be ready
  function initBridge() {
    if (!document.head || !document.body) {
      setTimeout(initBridge, 50);
      return;
    }

    // Add styles for selection and hover
    const style = document.createElement('style');
    style.textContent = \`
      [data-editor-hover] { outline: 2px solid #3b82f6 !important; cursor: pointer; }
      [data-editor-selected] { outline: 2px solid #2563eb !important; }
    \`;
    document.head.appendChild(style);

    // Helper to get computed styles relevant for editing
    function getEditableStyles(el) {
      const computed = window.getComputedStyle(el);
      return {
        fontSize: computed.fontSize,
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        fontFamily: computed.fontFamily,
        fontWeight: computed.fontWeight,
        textAlign: computed.textAlign,
        lineHeight: computed.lineHeight,
        letterSpacing: computed.letterSpacing,
      };
    }

    // Message handler
    window.addEventListener('message', (event) => {
      const { type, payload } = event.data;
      
      if (type === 'UPDATE_CONTENT') {
        const el = document.querySelector(\`[data-editor-id="\${payload.id}"]\`);
        if (el) {
          el.innerHTML = payload.content;
        }
      }
      
      if (type === 'UPDATE_STYLE') {
        const el = document.querySelector(\`[data-editor-id="\${payload.id}"]\`);
        if (el) {
          Object.assign(el.style, payload.styles);
        }
      }

      if (type === 'GET_HTML') {
        window.parent.postMessage({
          type: 'HTML_RESPONSE',
          payload: {
            html: document.body.innerHTML
          }
        }, '*');
      }
    });

    // Hover handling
    document.body.addEventListener('mouseover', (e) => {
      e.stopPropagation();
      const target = e.target;
      if (target === document.body) return;
      target.setAttribute('data-editor-hover', 'true');
    });

    document.body.addEventListener('mouseout', (e) => {
      const target = e.target;
      target.removeAttribute('data-editor-hover');
    });

    // Click/Selection handling
    document.body.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Remove previous selection
      document.querySelectorAll('[data-editor-selected]').forEach(el => 
        el.removeAttribute('data-editor-selected')
      );

      const target = e.target;
      if (target === document.body) {
        window.parent.postMessage({ type: 'SELECTION_CLEARED' }, '*');
        return;
      }
      
      // Generate ID if missing
      if (!target.dataset.editorId) {
        target.dataset.editorId = 'el-' + Math.random().toString(36).substr(2, 9);
      }

      target.setAttribute('data-editor-selected', 'true');

      const rect = target.getBoundingClientRect();
      
      window.parent.postMessage({
        type: 'ELEMENT_SELECTED',
        payload: {
          id: target.dataset.editorId,
          tagName: target.tagName,
          rect: {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
          },
          computedStyle: getEditableStyles(target),
          content: target.innerHTML
        }
      }, '*');
    });
  }

  // Start initialization
  initBridge();
})();
`;
