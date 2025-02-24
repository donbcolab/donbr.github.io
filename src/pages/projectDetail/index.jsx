import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Import project components
import GdeltViewer from '../../components/projects/GdeltViewer';
import CytoscapeViewer from '../../components/projects/CytoscapeViewer';
import EventAnalyzer from '../../components/projects/EventAnalyzer';
import SituationalAwareness from '../../components/projects/SituationalAwareness';

function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  
  // Map of project IDs to their respective components
  const projectComponents = {
    'gdelt': GdeltViewer,
    'cytoscape': CytoscapeViewer,
    'event-analyzer': EventAnalyzer,
    'situational-awareness': SituationalAwareness
  };
  
  // Project data
  const projectData = {
    'gdelt': {
      title: 'GDELT GKG Viewer',
      description: 'An interactive viewer for the GDELT Global Knowledge Graph. Built as a single-page prototype application using React, Tailwind CSS, and Leaflet for map visualizations, it offers a searchable record list, tone analysis, version toggling, and an intuitive user interface for exploring multidimensional data.'
    },
    'cytoscape': {
      title: 'STRING Network Viewer',
      description: 'Interactive visualization of protein-protein interaction networks using Cytoscape.js. Features dynamic layouts, protein information display, and interaction details.'
    },
    'event-analyzer': {
      title: 'Event Analysis System',
      description: 'An interactive system for analyzing social media events using pattern matching and ontology support. This demo showcases event classification, temporal analysis, and entity extraction capabilities.'
    },
    'situational-awareness': {
      title: 'Situational Awareness Graph',
      description: 'Interactive network visualization demonstrating relationships between different aspects of situational awareness, including disaster response, cybersecurity threats, and supply chain disruptions.'
    }
  };
  
  useEffect(() => {
    // If invalid project ID, redirect to projects page
    if (!projectData[projectId]) {
      navigate('/projects');
      return;
    }
    
    setProject(projectData[projectId]);
  }, [projectId, navigate]);
  
  if (!project) return <div>Loading...</div>;
  
  // Dynamically render the project component
  const ProjectComponent = projectComponents[projectId];
  
  return (
    <div className="bg-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <button 
          onClick={() => navigate('/projects')} 
          className="text-gray-500 hover:text-gray-900 mb-4"
        >
          ← Back to Projects
        </button>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{project.title}</h1>
        <p className="text-gray-600 mb-8">{project.description}</p>
        
        {/* Project content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <ProjectComponent />
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailPage;
