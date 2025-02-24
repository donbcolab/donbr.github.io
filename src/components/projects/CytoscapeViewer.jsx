import React, { useEffect, useRef } from 'react';

function CytoscapeViewer() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Load Cytoscape.js
    const cytoscapeScript = document.createElement('script');
    cytoscapeScript.src = 'https://unpkg.com/cytoscape@3.31.0/dist/cytoscape.min.js';
    cytoscapeScript.async = true;
    document.head.appendChild(cytoscapeScript);

    cytoscapeScript.onload = () => {
      // Check if the script has already been loaded
      if (!document.querySelector('script[src="/js/cytoscape-viewer.js"]')) {
        // Load the viewer script after Cytoscape is loaded
        const viewerScript = document.createElement('script');
        viewerScript.src = '/js/cytoscape-viewer.js';
        viewerScript.async = true;
        document.body.appendChild(viewerScript);
      }
    };

    // Clean up
    return () => {
      document.head.removeChild(cytoscapeScript);
      // Remove viewer script if it was added
      const viewerScript = document.querySelector('script[src="/js/cytoscape-viewer.js"]');
      if (viewerScript) {
        document.body.removeChild(viewerScript);
      }
    };
  },);

  return (
    <div>
      <div id="title"></div>
      <div id="cy" style={{ width: '100%', height: '600px', display: 'block', border: '1px solid #ddd' }}></div>
      <div className="controls space-x-4">
        <button id="fit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500">
          Fit View
        </button>
        <button id="showAll" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500">
          Show All Properties
        </button>
      </div>
      <div id="info" style={{ 
        position: 'fixed',
        right: '20px',
        top: '20px',
        background: 'white',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        maxWidth: '300px',
        display: 'none',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        zIndex: 1000
      }}></div>
      <div id="error-message" style={{
        position: 'absolute',
        left: '20px',
        top: '20px',
        background: '#f8d7da',
        color: '#721c24',
        padding: '10px',
        border: '1px solid #f5c6cb',
        borderRadius: '4px',
        display: 'none'
      }}></div>
    </div>
  );
}

export default CytoscapeViewer;