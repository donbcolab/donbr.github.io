import type { Project, ProjectDetail } from '../types';

// Project data
const projects: Project[] = [
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

// Project details data
const projectDetails: Record<string, ProjectDetail> = {
  'gdelt': {
    id: 'gdelt',
    title: 'GDELT GKG Viewer',
    description: 'An interactive viewer for the GDELT Global Knowledge Graph.',
    tags: ['React', 'Tailwind CSS', 'Leaflet', 'Data Visualization'],
    link: '/projects/gdelt',
    fullDescription: 'An interactive viewer for the GDELT Global Knowledge Graph. Built as a single-page prototype application using React, Tailwind CSS, and Leaflet for map visualizations, it offers a searchable record list, tone analysis, version toggling, and an intuitive user interface for exploring multidimensional data.',
    technologies: ['React', 'Tailwind CSS', 'Leaflet', 'Data Visualization'],
    githubUrl: 'https://github.com/donbr/donbr.github.io'
  },
  'cytoscape': {
    id: 'cytoscape',
    title: 'STRING Network Viewer',
    description: 'Interactive visualization of protein-protein interaction networks using Cytoscape.js.',
    tags: ['Cytoscape.js', 'Network Analysis', 'Bioinformatics'],
    link: '/projects/cytoscape',
    fullDescription: 'Interactive visualization of protein-protein interaction networks using Cytoscape.js. Features dynamic layouts, protein information display, and interaction details.',
    technologies: ['Cytoscape.js', 'JavaScript', 'Network Analysis', 'Bioinformatics'],
    githubUrl: 'https://github.com/donbr/donbr.github.io'
  },
  'event-analyzer': {
    id: 'event-analyzer',
    title: 'Event Analysis System',
    description: 'An interactive system for analyzing social media events using pattern matching and ontology support.',
    tags: ['JavaScript', 'NLP', 'Pattern Matching'],
    link: '/projects/event-analyzer',
    fullDescription: 'An interactive system for analyzing social media events using pattern matching and ontology support. This demo showcases event classification, temporal analysis, and entity extraction capabilities.',
    technologies: ['JavaScript', 'NLP', 'Pattern Matching', 'Ontology'],
    githubUrl: 'https://github.com/donbr/donbr.github.io'
  },
  'situational-awareness': {
    id: 'situational-awareness',
    title: 'Situational Awareness Graph',
    description: 'Interactive network visualization for situational awareness scenarios.',
    tags: ['Python', 'NetworkX', 'Graph Analysis'],
    link: '/projects/situational-awareness',
    fullDescription: 'Interactive network visualization demonstrating relationships between different aspects of situational awareness, including disaster response, cybersecurity threats, and supply chain disruptions.',
    technologies: ['ECharts', 'JavaScript', 'Network Analysis', 'Visualization'],
    githubUrl: 'https://github.com/donbr/donbr.github.io'
  }
};

/**
 * Get all projects
 * @returns Array of projects
 */
export function getAllProjects(): Project[] {
  return projects;
}

/**
 * Get project details by ID
 * @param id Project ID
 * @returns Project details or undefined if not found
 */
export function getProjectById(id: string): ProjectDetail | undefined {
  return projectDetails[id];
}
