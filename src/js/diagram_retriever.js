// Function to retrieve diagrams by question ID from the centralized diagram map
const fs = require('fs');

class DiagramRetriever {
    constructor(diagramMapPath = '/workspace/math_diagram_map.json') {
        this.diagramMapPath = diagramMapPath;
        this.diagramMap = null;
        this.loadDiagramMap();
    }

    loadDiagramMap() {
        try {
            const diagramMapData = fs.readFileSync(this.diagramMapPath, 'utf8');
            this.diagramMap = JSON.parse(diagramMapData);
            console.log(`Loaded diagram map with ${Object.keys(this.diagramMap).length} diagrams`);
        } catch (error) {
            console.error('Error loading diagram map:', error);
            this.diagramMap = {};
        }
    }

    // Get diagram by question ID
    getDiagramByQuestionId(questionId) {
        if (!this.diagramMap) {
            this.loadDiagramMap();
        }

        const diagram = this.diagramMap[questionId];
        if (diagram) {
            return diagram;
        } else {
            console.warn(`No diagram found for question ID: ${questionId}`);
            return this.getDefaultDiagram(questionId);
        }
    }

    // Generate a default diagram when no specific diagram exists
    getDefaultDiagram(questionId) {
        return `<svg width="200" height="100" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="180" height="80" fill="none" stroke="gray" stroke-width="2"/>
            <text x="100" y="55" text-anchor="middle" font-size="14" fill="gray">Question ${questionId}</text>
            <text x="100" y="75" text-anchor="middle" font-size="12" fill="gray">No diagram available</text>
        </svg>`;
    }

    // Get diagram wrapped in HTML container
    getDiagramHTMLByQuestionId(questionId) {
        const diagram = this.getDiagramByQuestionId(questionId);
        return `<div class="diagram-container">
            <h5>Diagram:</h5>
            ${diagram}
        </div>`;
    }

    // Update the diagram map with a new diagram
    updateDiagram(questionId, svgContent) {
        if (!this.diagramMap) {
            this.loadDiagramMap();
        }

        this.diagramMap[questionId] = svgContent;
        
        // Save the updated map back to file
        fs.writeFileSync(this.diagramMapPath, JSON.stringify(this.diagramMap, null, 2));
        console.log(`Updated diagram for question ID: ${questionId}`);
    }

    // Get all question IDs that have diagrams
    getQuestionIdsWithDiagrams() {
        if (!this.diagramMap) {
            this.loadDiagramMap();
        }
        
        return Object.keys(this.diagramMap);
    }

    // Check if a question has a diagram
    hasDiagram(questionId) {
        if (!this.diagramMap) {
            this.loadDiagramMap();
        }
        
        return this.diagramMap.hasOwnProperty(questionId);
    }
}

// Export the DiagramRetriever class
module.exports = DiagramRetriever;

// Example usage
if (require.main === module) {
    const diagramRetriever = new DiagramRetriever();
    
    console.log('Available question IDs with diagrams:', diagramRetriever.getQuestionIdsWithDiagrams());
    
    // Example: Get diagram for question ID 6 (bearing question)
    const diagram = diagramRetriever.getDiagramByQuestionId(6);
    console.log('Diagram for question 6:', diagram.substring(0, 100) + '...');
    
    // Example: Get HTML for question ID 6
    const html = diagramRetriever.getDiagramHTMLByQuestionId(6);
    console.log('HTML for question 6:', html.substring(0, 100) + '...');
}