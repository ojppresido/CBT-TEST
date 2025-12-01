const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Load the diagram map at server startup
let diagramMap = {};
try {
    const diagramMapData = fs.readFileSync('/workspace/math_diagram_map.json', 'utf8');
    diagramMap = JSON.parse(diagramMapData);
    console.log(`Loaded diagram map with ${Object.keys(diagramMap).length} diagrams`);
} catch (error) {
    console.error('Error loading diagram map:', error);
    // Create an empty map if file doesn't exist
    diagramMap = {};
}

const server = http.createServer((req, res) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  
  // Handle API endpoints for diagram retrieval
  if (req.url.startsWith('/api/diagram/')) {
    handleDiagramAPI(req, res);
    return;
  }
  
  // Set default file to serve
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(process.cwd(), filePath);
  
  // Determine content type based on file extension
  const extname = path.extname(filePath).toLowerCase();
  let contentType = 'text/html';
  
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
    case '.jpeg':
      contentType = 'image/jpg';
      break;
    case '.gif':
      contentType = 'image/gif';
      break;
    case '.svg':
      contentType = 'image/svg+xml';
      break;
    case '.ico':
      contentType = 'image/ico';
      break;
  }
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found
        res.writeHead(404);
        res.end('404 Not Found');
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Handle API requests for diagram retrieval
function handleDiagramAPI(req, res) {
  const urlParts = req.url.split('/');
  const questionId = urlParts[3]; // /api/diagram/:id
  
  if (!questionId) {
    res.writeHead(400);
    res.end(JSON.stringify({ error: 'Question ID is required' }));
    return;
  }
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  
  if (diagramMap[questionId]) {
    res.end(JSON.stringify({ 
      success: true, 
      questionId: parseInt(questionId),
      diagram: diagramMap[questionId],
      hasDiagram: true
    }));
  } else {
    res.end(JSON.stringify({ 
      success: true, 
      questionId: parseInt(questionId),
      diagram: getDefaultDiagram(questionId),
      hasDiagram: false
    }));
  }
}

// Generate a default diagram when no specific diagram exists
function getDefaultDiagram(questionId) {
  return `<svg width="200" height="100" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="180" height="80" fill="none" stroke="gray" stroke-width="2"/>
    <text x="100" y="55" text-anchor="middle" font-size="14" fill="gray">Question ${questionId}</text>
    <text x="100" y="75" text-anchor="middle" font-size="12" fill="gray">No diagram available</text>
  </svg>`;
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});