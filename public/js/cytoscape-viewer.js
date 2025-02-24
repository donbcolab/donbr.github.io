document.addEventListener('DOMContentLoaded', async function() {
  const titleDiv = document.getElementById('title');
  const infoBox = document.getElementById('info');
  const errorMessage = document.getElementById('error-message');
  let networkData;
  
  try {
    const response = await fetch('/data/string.cyjs');
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    networkData = await response.json();
    if (!networkData?.elements) {
      throw new Error("Invalid network data format");
    }
    // Set title using network metadata
    if (networkData.data) {
      titleDiv.innerHTML = `<h2>${networkData.data.network_type} - ${networkData.data.species}</h2>`;
    }
  } catch (e) {
    console.error("Error loading network data:", e);
    errorMessage.innerHTML = `<h2>Error Loading Network</h2><p>${e.message}</p>`;
    errorMessage.style.display = 'block';
    return;
  }
  
  const cy = cytoscape({
    container: document.getElementById('cy'),
    elements: networkData.elements,
    style: [
      {
        selector: 'node',
        style: {
          'label': 'data(display_name)',
          'background-color': 'data(stringdb_node_color)',
          'text-outline-width': 2,
          'text-outline-color': 'white',
          'text-valign': 'center',
          'text-halign': 'center',
          'width': 50,
          'height': 50,
          'font-size': '12px',
          'text-wrap': 'wrap'
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 'mapData(stringdb_score, 0, 1, 1, 8)',
          'line-color': '#666',
          'curve-style': 'bezier',
          'opacity': 0.8,
          'label': 'data(stringdb_score)',
          'text-rotation': 'autorotate',
          'text-opacity': 0,
          'font-size': '10px'
        }
      },
      {
        selector: 'edge:selected',
        style: {
          'text-opacity': 1,
          'line-color': '#333',
          'width': 'mapData(stringdb_score, 0, 1, 2, 10)'
        }
      },
      {
        selector: 'node:selected',
        style: {
          'border-width': 3,
          'border-color': '#333'
        }
      },
      {
        selector: 'node:active',
        style: {
          'overlay-opacity': 0.3,
          'overlay-color': '#000'
        }
      }
    ],
    layout: {
      name: 'cose',
      idealEdgeLength: 100,
      nodeOverlap: 20,
      refresh: 20,
      fit: true,
      padding: 30,
      randomize: false,
      componentSpacing: 100,
      nodeRepulsion: 400000,
      edgeElasticity: 100,
      nestingFactor: 5,
      gravity: 80,
      numIter: 1000,
      initialTemp: 200,
      coolingFactor: 0.95,
      minTemp: 1.0
    },
    minZoom: 0.2,
    maxZoom: 3,
    wheelSensitivity: 0.3,
    boxSelectionEnabled: true,
    selectionType: 'single'
  });
  
  // Node tap: show detailed information
  cy.on('tap', 'node', function(evt) {
    const data = evt.target.data();
    let infoHtml = `
      <button class="close-btn" aria-label="Close">&times;</button>
      <h3>${data.display_name}</h3>
      <p><strong>Description:</strong> ${data.stringdb_description}</p>
      <p><strong>Family:</strong> ${data.target_family}</p>
      <p><strong>Development Level:</strong> ${data.target_development_level}</p>
      <hr>
      <p><strong>Expression Levels:</strong></p>
      <ul>
        <li>Brain: ${data.tissue_nervous_system ?? 'N/A'}</li>
        <li>Heart: ${data.tissue_heart ?? 'N/A'}</li>
        <li>Liver: ${data.tissue_liver ?? 'N/A'}</li>
        <li>Kidney: ${data.tissue_kidney ?? 'N/A'}</li>
      </ul>
    `;
    infoBox.innerHTML = infoHtml;
    infoBox.style.display = 'block';
    
    // Add close button handler
    document.querySelector('#info .close-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      infoBox.style.display = 'none';
    });
  });

  // Add keyboard support for accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && infoBox.style.display === 'block') {
      infoBox.style.display = 'none';
    }
  });

  // Add window resize handler to ensure info box stays within viewport
  window.addEventListener('resize', () => {
    if (infoBox.style.display === 'block') {
      const rect = infoBox.getBoundingClientRect();
      if (rect.bottom > window.innerHeight) {
        infoBox.style.top = `${window.innerHeight - rect.height - 20}px`;
      }
    }
  });
  
  // Edge tap: show interaction details
  cy.on('tap', 'edge', function(evt) {
    const data = evt.target.data();
    let infoHtml = `
      <h3>Interaction Details</h3>
      <p><strong>Combined Score:</strong> ${data.stringdb_score}</p>
      <p><strong>Evidence Types:</strong></p>
      <ul>
        <li>Experiments: ${data.stringdb_experiments ?? 'N/A'}</li>
        <li>Database: ${data.stringdb_databases ?? 'N/A'}</li>
        <li>Textmining: ${data.stringdb_textmining ?? 'N/A'}</li>
        <li>Coexpression: ${data.stringdb_coexpression ?? 'N/A'}</li>
      </ul>
    `;
    infoBox.innerHTML = infoHtml;
    infoBox.style.display = 'block';
  });
  
  // Hide info box when background is tapped
  cy.on('tap', function(evt) {
    if (evt.target === cy) {
      infoBox.style.display = 'none';
    }
  });
  
  // Button handlers
  document.getElementById('fit').addEventListener('click', () => {
    cy.fit();
  });
  
  document.getElementById('showAll').addEventListener('click', () => {
    alert("Show All Properties functionality is not implemented yet.");
  });
});