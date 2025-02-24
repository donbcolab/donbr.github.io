import React, { useEffect, useState } from 'react';

function EventAnalyzer() {
  const [result, setResult] = useState('');
  const [input, setInput] = useState('BREAKING: Major protest gathering @downtown_group in New York City at 14:30 today. #CivilRights Organization reports over 1000 participants at Times Square.');
  
  useEffect(() => {
    // Load Lodash
    const lodashScript = document.createElement('script');
    lodashScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js';
    lodashScript.async = true;
    document.head.appendChild(lodashScript);
    
    lodashScript.onload = () => {
      // Load the event analyzer script after Lodash is loaded
      const analyzerScript = document.createElement('script');
      analyzerScript.src = '/js/event-analyzer.js';
      analyzerScript.async = true;
      document.body.appendChild(analyzerScript);
      
      // Wait for script to load before initializing
      analyzerScript.onload = initializeAnalyzer;
    };
    
    function initializeAnalyzer() {
      // If the script has defined an EventAnalyzer class
      if (window.EventAnalyzer) {
        const analyzer = new window.EventAnalyzer();
        analyzeText(analyzer, input);
      }
    }
    
    // Clean up
    return () => {
      document.head.removeChild(lodashScript);
      // Remove analyzer script if it was added
      const analyzerScript = document.querySelector('script[src="/js/event-analyzer.js"]');
      if (analyzerScript) {
        document.body.removeChild(analyzerScript);
      }
    };
  }, []);
  
  const analyzeText = async (analyzer, text) => {
    try {
      const analysis = await analyzer.analyzeTweet(text);
      
      // Format the results
      const formattedResult = {
        ...analysis,
        confidence: `${(analysis.confidence * 100).toFixed(1)}%`,
        summary: generateSummary(analysis)
      };
      
      setResult(JSON.stringify(formattedResult, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };
  
  // This function should match the one in the original script
  const generateSummary = (analysis) => {
    const parts = [];
    
    if (analysis.type) {
      parts.push(`Type: ${analysis.type}`);
    }
    
    if (analysis.time && analysis.time.length > 0) {
      const times = analysis.time.map(t => t.value).join(', ');
      parts.push(`Time: ${times}`);
    }
    
    if (analysis.place && analysis.place.length > 0) {
      const places = analysis.place.map(p => p.value).join(', ');
      parts.push(`Location: ${places}`);
    }
    
    if (analysis.entities && analysis.entities.length > 0) {
      const entities = analysis.entities.map(e => `${e.type}: ${e.value}`).join(', ');
      parts.push(`Entities: ${entities}`);
    }
    
    return parts.join(' | ');
  };
  
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  
  const handleAnalyzeClick = () => {
    if (window.EventAnalyzer) {
      const analyzer = new window.EventAnalyzer();
      analyzeText(analyzer, input);
    }
  };
  
  return (
    <div>
      <div className="mb-4">
        <label htmlFor="tweetInput" className="block text-gray-700 font-medium mb-2">Enter text to analyze:</label>
        <textarea 
          id="tweetInput" 
          rows="4" 
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={handleInputChange}
        />
      </div>
      <button 
        id="analyzeBtn" 
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-500 transition-colors"
        onClick={handleAnalyzeClick}
      >
        Analyze Text
      </button>
      
      {/* Results Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Analysis Results:</h3>
        <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm font-mono">{result}</pre>
      </div>
    </div>
  );
}

export default EventAnalyzer;
