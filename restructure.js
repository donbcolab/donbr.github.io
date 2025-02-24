#!/usr/bin/env node

/**
 * GitHub Pages React/Vite Project Structure Script
 * 
 * This script reorganizes a GitHub Pages portfolio site following Vite/React best practices.
 * It creates a standardized directory structure and sets up proper React components and routing.
 * 
 * Usage:
 * 1. Save this script as restructure.js
 * 2. Run: node restructure.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Index HTML transform function
function transformIndexHtml(content) {
  // Transform the index.html to use the React entry point
  return content.replace(
    /<body>([\s\S]*?)<\/body>/,
    '<body>\n  <div id="root"></div>\n  <script type="module" src="/src/main.jsx"></script>\n</body>'
  );
}

// Configuration
const config = {
  // Root directory for the project (current directory)
  rootDir: '.',
  transformIndexHtml: transformIndexHtml,
  // Directory structure to create
  dirs: {
    src: {
      _self: 'src',
      components: {
        _self: 'src/components',
        common: 'src/components/common',
        layout: 'src/components/layout',
        projects: 'src/components/projects'
      },
      pages: {
        _self: 'src/pages',
        home: 'src/pages/home',
        projects: 'src/pages/projects',
        projectDetail: 'src/pages/projectDetail'
      },
      hooks: 'src/hooks',
      lib: 'src/lib',
      services: 'src/services',
      assets: {
        _self: 'src/assets',
        images: 'src/assets/images',
        icons: 'src/assets/icons',
        data: 'src/assets/data'
      }
    },
    public: 'public',
    scripts: 'scripts'
  },
  // File mappings from current structure to new structure
  fileMappings: [
    // Keep index.html in the root (required for Vite)
    { from: 'index.html', to: 'index.html', transform: transformIndexHtml },
    
    // CSS files
    { from: 'assets/css/styles.css', to: 'src/assets/styles/main.css' },
    
    // Data files
    { from: 'assets/js/gdelt-gkg.json', to: 'src/assets/data/gdelt-gkg.json' },
    { from: 'assets/js/situational-awareness-graph.json', to: 'src/assets/data/situational-awareness-graph.json' },
    { from: 'assets/js/string.cyjs', to: 'src/assets/data/string.cyjs' },
    
    // Transformers demo - keep structure but put in public
    { from: 'assets/projects/transformers-demo', to: 'public/projects/transformers-demo' },
    
    // Project content files - will be imported by React components
    { from: 'assets/js/event-analyzer.js', to: 'public/js/event-analyzer.js' },
    { from: 'assets/js/gdelt-gkg.js', to: 'public/js/gdelt-gkg.js' },
    { from: 'assets/js/cytoscape-viewer.js', to: 'public/js/cytoscape-viewer.js' },
    { from: 'assets/js/situational-awareness.js', to: 'public/js/situational-awareness.js' }
  ],
  // Files to create
  filesToCreate: [
    // Root index.html (entry point for Vite)
    {
      path: 'index.html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Don Branson - AI Engineer & Solutions Architect Portfolio" />
  <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
  <title>Don Branson - AI Engineer & Solutions Architect</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>`
    },
    // TypeScript definition for projects
    {
      path: 'src/types/index.ts',
      content: `export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
}

export interface ProjectDetail extends Project {
  fullDescription?: string;
  technologies?: string[];
  githubUrl?: string;
  demoUrl?: string;
}
`
    },
    // Project data service
    {
      path: 'src/services/projectService.ts',
      content: `import type { Project, ProjectDetail } from '../types';

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
`
    },
    // tsconfig.node.json
    {
      path: 'tsconfig.node.json',
      content: `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
`
    },
    // GitHub Actions workflow
    {
      path: '.github/workflows/deploy.yml',
      content: `name: Build and Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout 🛎️
        uses: actions/checkout@v3

      - name: Setup Node.js ⚙️
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install Dependencies 📦
        run: npm ci
        
      - name: Cache dependencies
        uses: actions/cache@v3
        with:
          path: |
            node_modules
            ~/.cache/Cypress
          key: \${{ runner.os }}-node-\${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            \${{ runner.os }}-node-

      - name: Lint 🧹
        run: npm run lint

      - name: Type Check 🔍
        run: npm run typecheck
        
      - name: Build 🔨
        run: npm run build
        
      - name: Check build output 🔍
        run: |
          if [ ! -f "dist/index.html" ]; then
            echo "Build failed: index.html not found in dist directory"
            exit 1
          fi

      - name: Deploy to GitHub Pages 🚀
        if: github.ref == 'refs/heads/main'
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
          branch: gh-pages
          clean: true`
    },
    // React entry point
    {
      path: 'src/main.jsx',
      content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './assets/styles/main.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
`
    },
    // Main App component
    {
      path: 'src/App.jsx',
      content: `import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/home';
import ProjectsPage from './pages/projects';
import ProjectDetailPage from './pages/projectDetail';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
`
    },
    // Header component
    {
      path: 'src/components/layout/Header.jsx',
      content: `import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <Link to="/" className="flex items-center py-4">
                <span className="font-semibold text-gray-700 text-lg">Don Branson</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/#about" className="py-4 px-2 text-gray-500 hover:text-gray-900">About</Link>
            <Link to="/#expertise" className="py-4 px-2 text-gray-500 hover:text-gray-900">Expertise</Link>
            <Link to="/#certifications" className="py-4 px-2 text-gray-500 hover:text-gray-900">Certifications</Link>
            <Link to="/projects" className="py-4 px-2 text-gray-500 hover:text-gray-900">Projects</Link>
            <Link to="/#contact" className="py-4 px-2 text-gray-500 hover:text-gray-900">Contact</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
`
    },
    // Footer component
    {
      path: 'src/components/layout/Footer.jsx',
      content: `import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p>&copy; {currentYear} Don Branson. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
`
    },
    // Home page
    {
      path: 'src/pages/home/index.jsx',
      content: `import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Don Branson</h1>
            <p className="text-xl text-gray-600 mb-8">AI Engineer & Solutions Architect</p>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Versatile professional with over two decades of expertise in AI engineering, solutions architecture, and business solution implementation.
            </p>
            <div className="flex justify-center space-x-4">
              <a href="https://github.com/donbr" className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-700">GitHub</a>
              <a href="https://www.linkedin.com/in/donbranson/" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-500">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">About Me</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 leading-relaxed mb-4">
              Based in Southern California, I'm a solutions architect and AI engineer with comprehensive expertise spanning program management, 
              architecture, development, and business solution implementation. I specialize in delivering outcomes across diverse industries 
              including travel and transportation, public sector, life sciences, telecommunications, and insurance.
            </p>
            <p className="text-gray-600 leading-relaxed">
              I'm particularly focused on cutting-edge AI technologies including generative AI, large language models, and computer vision, 
              with a strong emphasis on responsible AI development and deployment.
            </p>
          </div>
        </div>
      </section>

      {/* Additional sections would be added here */}
    </div>
  );
}

export default HomePage;
`
    },
    // Projects page
    {
      path: 'src/pages/projects/index.jsx',
      content: `import React from 'react';
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
`
    },
    // ProjectCard component
    {
      path: 'src/components/common/ProjectCard.jsx',
      content: `import React from 'react';
import { Link } from 'react-router-dom';

function ProjectCard({ id, title, description, tags, link }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 project-card">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <span 
            key={index} 
            className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-4">
        <Link to={link} className="text-blue-600 hover:text-blue-800">
          View Project →
        </Link>
      </div>
    </div>
  );
}

export default ProjectCard;
`
    },
    // Project Detail page
    {
      path: 'src/pages/projectDetail/index.jsx',
      content: `import React, { useEffect, useState } from 'react';
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
`
    },
    // GdeltViewer component stub
    {
      path: 'src/components/projects/GdeltViewer.jsx',
      content: `import React, { useEffect, useRef } from 'react';

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
`
    },
    // CytoscapeViewer component stub
    {
      path: 'src/components/projects/CytoscapeViewer.jsx',
      content: `import React, { useEffect, useRef } from 'react';

function CytoscapeViewer() {
  const containerRef = useRef(null);
  
  useEffect(() => {
    // Load Cytoscape.js
    const cytoscapeScript = document.createElement('script');
    cytoscapeScript.src = 'https://unpkg.com/cytoscape@3.31.0/dist/cytoscape.min.js';
    cytoscapeScript.async = true;
    document.head.appendChild(cytoscapeScript);
    
    cytoscapeScript.onload = () => {
      // Load the viewer script after Cytoscape is loaded
      const viewerScript = document.createElement('script');
      viewerScript.src = '/js/cytoscape-viewer.js';
      viewerScript.async = true;
      document.body.appendChild(viewerScript);
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
  }, []);
  
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
`
    },
    // SituationalAwareness component stub
    {
      path: 'src/components/projects/SituationalAwareness.jsx',
      content: `import React, { useEffect, useRef } from 'react';

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
`
    },
    // EventAnalyzer component stub
    {
      path: 'src/components/projects/EventAnalyzer.jsx',
      content: `import React, { useEffect, useState } from 'react';

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
        confidence: \`\${(analysis.confidence * 100).toFixed(1)}%\`,
        summary: generateSummary(analysis)
      };
      
      setResult(JSON.stringify(formattedResult, null, 2));
    } catch (error) {
      setResult(\`Error: \${error.message}\`);
    }
  };
  
  // This function should match the one in the original script
  const generateSummary = (analysis) => {
    const parts = [];
    
    if (analysis.type) {
      parts.push(\`Type: \${analysis.type}\`);
    }
    
    if (analysis.time && analysis.time.length > 0) {
      const times = analysis.time.map(t => t.value).join(', ');
      parts.push(\`Time: \${times}\`);
    }
    
    if (analysis.place && analysis.place.length > 0) {
      const places = analysis.place.map(p => p.value).join(', ');
      parts.push(\`Location: \${places}\`);
    }
    
    if (analysis.entities && analysis.entities.length > 0) {
      const entities = analysis.entities.map(e => \`\${e.type}: \${e.value}\`).join(', ');
      parts.push(\`Entities: \${entities}\`);
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
`
    },
    // Vite config
    {
      path: 'vite.config.js',
      content: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  // Configure base for GitHub Pages deployment
  base: '/donbr.github.io/',
  
  // Add React plugin
  plugins: [react()],
  
  // Resolve aliases for easier imports
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@lib': resolve(__dirname, 'src/lib'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@pages': resolve(__dirname, 'src/pages')
    }
  },
  
  // Configure build output
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
`
    },
    // Package.json
    {
      path: 'package.json',
      content: `{
  "name": "donbr-github-io",
  "version": "1.0.0",
  "description": "Don Branson's portfolio website",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write 'src/**/*.{js,jsx,ts,tsx,html,css}'"
  },
  "devDependencies": {
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.56.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "postcss": "^8.4.32",
    "prettier": "^3.1.1",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.3",
    "vite": "^5.0.10"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.1"
  }
}
`
    },
    // TypeScript config
    {
      path: 'tsconfig.json',
      content: `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    
    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    
    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    
    /* Paths */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@assets/*": ["src/assets/*"],
      "@lib/*": ["src/lib/*"],
      "@hooks/*": ["src/hooks/*"],
      "@pages/*": ["src/pages/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
`
    }
  ]
};

// Helper function to create directories recursively
function createDirectories(dirs, root) {
  for (const [key, value] of Object.entries(dirs)) {
    if (key === '_self') {
      // Create the directory specified by _self
      const dirPath = path.join(root, value);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dirPath}`);
      }
    } else if (typeof value === 'object') {
      // Recursively process nested directory objects
      const subPath = value._self ? path.join(root, value._self) : path.join(root, value);
      if (!fs.existsSync(subPath)) {
        fs.mkdirSync(subPath, { recursive: true });
        console.log(`Created directory: ${subPath}`);
      }
      // Continue recursion for nested structures
      if (typeof value === 'object' && !Array.isArray(value)) {
        createDirectories(value, root);
      }
    } else if (typeof value === 'string') {
      // Handle direct path strings
      const dirPath = path.join(root, value);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dirPath}`);
      }
    }
  }
}

// Helper function to move files
function moveFiles(fileMappings, root) {
  fileMappings.forEach(mapping => {
    const fromPath = path.join(root, mapping.from);
    const toPath = path.join(root, mapping.to);
    if (fs.existsSync(fromPath)) {
      const toDir = path.dirname(toPath);
      if (!fs.existsSync(toDir)) {
        fs.mkdirSync(toDir, { recursive: true });
      }
      fs.renameSync(fromPath, toPath);
      console.log(`Moved: ${fromPath} -> ${toPath}`);
    }
  });
}

// Helper function to create files
function createFiles(filesToCreate, root) {
  filesToCreate.forEach(file => {
    const filePath = path.join(root, file.path);
    const fileDir = path.dirname(filePath);
    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true });
    }
    fs.writeFileSync(filePath, file.content);
    console.log(`Created file: ${filePath}`);
  });
}

// Main function to restructure the project
function restructureProject(config) {
  const root = path.resolve(config.rootDir);
  createDirectories(config.dirs, root);
  moveFiles(config.fileMappings, root);
  createFiles(config.filesToCreate, root);
  console.log('Project restructured successfully.');
}

// Run the script
restructureProject(config);