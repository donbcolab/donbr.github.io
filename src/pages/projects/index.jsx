import React from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '../../components/common/ProjectCard';

function ProjectsPage() {
  const projects = [
    {
      id: 'gdelt',
      title: 'GDELT GKG Viewer',
      description: 'An interactive viewer for the GDELT Global Knowledge Graph.',
      tags: ['React', 'Tailwind CSS', 'Leaflet', 'Data Visualization'],
      link: '/projects/gdelt'
    },
    {
      id: 'cytoscape',
      title: 'STRING Network Viewer',
      description: 'Interactive visualization of protein-protein interaction networks using Cytoscape.js.',
      tags: ['Cytoscape.js', 'Network Analysis', 'Bioinformatics'],
      link: '/projects/cytoscape'
    },
    {
      id: 'event-analyzer',
      title: 'Event Analysis System',
      description: 'An interactive system for analyzing social media events using pattern matching and ontology support.',
      tags: ['JavaScript', 'NLP', 'Pattern Matching'],
      link: '/projects/event-analyzer'
    },
    {
      id: 'situational-awareness',
      title: 'Situational Awareness Graph',
      description: 'Interactive network visualization for situational awareness scenarios.',
      tags: ['Python', 'NetworkX', 'Graph Analysis'],
      link: '/projects/situational-awareness'
    }
  ];

  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Recent Projects</h1>
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map(project => (
            <ProjectCard 
              key={project.id}
              id={project.id}
              title={project.title}
              description={project.description}
              tags={project.tags}
              link={project.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProjectsPage;
