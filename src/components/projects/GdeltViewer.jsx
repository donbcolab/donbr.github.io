import React, { useEffect, useRef } from 'react';

function GdeltViewer() {
  const containerRef = useRef(null);
  
  useEffect(() => {
    // Load the legacy script
    const script = document.createElement('script');
    script.src = '/js/gdelt-gkg.js';
    script.async = true;
    document.body.appendChild(script);
    
    // Clean up
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  return (
    <div>
      {/* This div will be used by the legacy script */}
      <div id="root" ref={containerRef}></div>
    </div>
  );
}

export default GdeltViewer;
