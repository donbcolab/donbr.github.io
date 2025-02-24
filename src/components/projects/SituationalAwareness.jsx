import React, { useEffect, useRef } from 'react';

function SituationalAwareness() {
  const containerRef = useRef(null);
  
  useEffect(() => {
    // Load ECharts
    const echartsScript = document.createElement('script');
    echartsScript.src = 'https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js';
    echartsScript.async = true;
    document.head.appendChild(echartsScript);
    
    echartsScript.onload = () => {
      // Load the viewer script after ECharts is loaded
      const viewerScript = document.createElement('script');
      viewerScript.src = '/js/situational-awareness.js';
      viewerScript.async = true;
      document.body.appendChild(viewerScript);
    };
    
    // Clean up
    return () => {
      document.head.removeChild(echartsScript);
      // Remove viewer script if it was added
      const viewerScript = document.querySelector('script[src="/js/situational-awareness.js"]');
      if (viewerScript) {
        document.body.removeChild(viewerScript);
      }
    };
  }, []);
  
  return (
    <div>
      <div id="graph-container" style={{ width: '100%', height: '700px', border: '1px solid #ddd', backgroundColor: 'white' }}></div>
      <div className="mt-4 flex gap-4">
        <button id="zoomIn" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500">Zoom In</button>
        <button id="zoomOut" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500">Zoom Out</button>
        <button id="resetView" className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500">Reset View</button>
        <button id="toggleLayout" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500">Toggle Layout</button>
      </div>
    </div>
  );
}

export default SituationalAwareness;
