// event-analyzer.js
//
// This file implements the core functionality of the Event Analysis System.
// It defines classes for handling ontologies, event types, regex pattern registries,
// and the main EventAnalyzer class that processes input text to extract event details.

/**
 * OntologyRegistry holds predefined ontologies used to define relationships,
 * event types, and properties in the system. Additional ontologies can be added
 * here to support more complex semantic relationships.
 */
class OntologyRegistry {
    // Static property containing available ontologies.
    static ONTOLOGIES = {
        HEO: {
            relationships: ['causes', 'effects', 'participates_in'],
            eventTypes: ['historical', 'causal', 'participatory']
        },
        EVENT_ONTOLOGY: {
            relationships: ['sub_event', 'parallel_event', 'sequential_event'],
            properties: ['duration', 'frequency', 'scale']
        }
    };
}

/**
 * EventType defines constants for categorizing events and their severity.
 * TYPES represent different kinds of events, and SEVERITY levels provide a numeric scale.
 */
class EventType {
    static TYPES = {
        INCIDENT: 'Incident',
        GATHERING: 'Gathering',
        ANNOUNCEMENT: 'Announcement',
        CRISIS: 'Crisis'
    };

    static SEVERITY = {
        LOW: 1,
        MEDIUM: 2,
        HIGH: 3,
        CRITICAL: 4
    };
}

/**
 * PatternRegistry maintains regex patterns for extracting temporal, location,
 * and entity information from text. It also maps keywords to event types.
 */
class PatternRegistry {
    constructor() {
        // Regex patterns for temporal expressions, locations, and named entities.
        this.patterns = {
            temporal: {
                absolute: /\d{1,2}:\d{2}/, // Matches times like "14:30"
                relative: /(today|yesterday|tomorrow|tonight)/i, // Relative time terms
                date: /\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}/ // Matches dates (e.g., 12-31-2024)
            },
            location: {
                city: /in ([A-Z][a-z]+(?: [A-Z][a-z]+)*)/, // Matches city names with capital letters
                address: /at ([0-9]+(?:[A-Za-z]*)? [A-Z][a-z]+ (?:St|Ave|Rd|Blvd|Lane|Drive|Circle|Square))/i
            },
            entity: {
                person: /@([A-Za-z0-9_]+)/, // Matches Twitter-like handles for persons
                organization: /([A-Z][a-z]+ (?:Inc|Corp|LLC|Ltd|Organization|Association))/, // Matches organization names
                hashtag: /#([A-Za-z0-9_]+)/ // Matches hashtags
            }
        };

        // Maps event types to their corresponding trigger keywords.
        this.keywords = {
            [EventType.TYPES.INCIDENT]: ['happened', 'occurred', 'reported'],
            [EventType.TYPES.GATHERING]: ['protest', 'meeting', 'assembly'],
            [EventType.TYPES.ANNOUNCEMENT]: ['announced', 'declared', 'stated'],
            [EventType.TYPES.CRISIS]: ['emergency', 'crisis', 'disaster']
        };
    }
}

/**
 * EventAnalyzer is the main class that processes tweet text.
 * It leverages PatternRegistry to extract event type, time, location, and entities,
 * and calculates a confidence score based on the extracted features.
 */
class EventAnalyzer {
    constructor() {
        // Initialize with a new PatternRegistry instance.
        this.registry = new PatternRegistry();
    }

    /**
     * Analyzes the input tweet text and returns an event object.
     * The event object includes classification, extracted temporal data,
     * locations, entities, and a computed confidence score.
     *
     * @param {string} tweetText - The text to analyze.
     * @returns {Object} event - An object containing event details.
     */
    async analyzeTweet(tweetText) {
        const event = {
            text: tweetText,
            type: this.classifyEventType(tweetText),
            time: this.extractTime(tweetText),
            place: this.extractLocations(tweetText),
            entities: this.extractEntities(tweetText),
            relations: [], // Reserved for future relationship extraction
            confidence: 0,
            severity: EventType.SEVERITY.MEDIUM // Default severity level
        };

        // Calculate and assign a confidence score based on available data.
        event.confidence = this.calculateConfidence(event);
        return event;
    }

    /**
     * Determines the event type by checking for keyword matches.
     * Returns the event type with the highest keyword occurrence,
     * defaulting to 'Incident' if no keywords match.
     *
     * @param {string} text - The input text.
     * @returns {string} - The classified event type.
     */
    classifyEventType(text) {
        const matches = {};
        // Iterate through defined keywords for each event type.
        for (const [type, keywords] of Object.entries(this.registry.keywords)) {
            // Count how many keywords appear in the text (case-insensitive).
            matches[type] = keywords.filter(keyword => 
                text.toLowerCase().includes(keyword.toLowerCase())).length;
        }
        // Use lodash to get the event type with maximum keyword matches.
        return _.maxBy(Object.entries(matches), '[1]')?.[0] || EventType.TYPES.INCIDENT;
    }

    /**
     * Extracts temporal information from text by applying regex patterns.
     * Returns an array of objects, each with a type (absolute, relative, date) and its value.
     *
     * @param {string} text - The input text.
     * @returns {Array} - Array of extracted time objects.
     */
    extractTime(text) {
        const results = [];
        const patterns = this.registry.patterns.temporal;

        for (const [type, pattern] of Object.entries(patterns)) {
            const match = text.match(pattern);
            if (match) {
                results.push({ type, value: match[0] });
            }
        }
        return results;
    }

    /**
     * Extracts location details from text using regex patterns.
     * Returns an array with each location's type and value.
     *
     * @param {string} text - The input text.
     * @returns {Array} - Array of location objects.
     */
    extractLocations(text) {
        const results = [];
        const patterns = this.registry.patterns.location;

        for (const [type, pattern] of Object.entries(patterns)) {
            const match = text.match(pattern);
            if (match) {
                // The first captured group contains the location value.
                results.push({ type, value: match[1] });
            }
        }
        return results;
    }

    /**
     * Extracts named entities such as persons, organizations, and hashtags.
     * Uses global regex matching to find all instances, returning each entity's type,
     * value, and its position in the text.
     *
     * @param {string} text - The input text.
     * @returns {Array} - Array of entity objects.
     */
    extractEntities(text) {
        const results = [];
        const patterns = this.registry.patterns.entity;

        for (const [type, pattern] of Object.entries(patterns)) {
            // Use matchAll to capture all matches across the text.
            const matches = Array.from(text.matchAll(new RegExp(pattern, 'g')));
            for (const match of matches) {
                results.push({
                    type,
                    value: match[1],
                    position: match.index
                });
            }
        }
        return results;
    }

    /**
     * Calculates a confidence score for the event analysis.
     * The score is based on the presence of time, location, and entity data,
     * with an added base confidence value.
     *
     * @param {Object} event - The event object with extracted features.
     * @returns {number} - A confidence score between 0 and 1.
     */
    calculateConfidence(event) {
        let score = 0;
        if (event.time?.length) score += 0.3;
        if (event.place?.length) score += 0.3;
        if (event.entities?.length) score += 0.2;
        return Math.min(score + 0.2, 1); // Ensure a base confidence of 0.2
    }
}

/**
 * Generates a human-readable summary of the analysis.
 * Concatenates event type, time, location, and entity details into a summary string.
 *
 * @param {Object} analysis - The analyzed event object.
 * @returns {string} - A formatted summary string.
 */
function generateSummary(analysis) {
    const parts = [];
    
    if (analysis.type) {
        parts.push(`Type: ${analysis.type}`);
    }
    
    if (analysis.time.length > 0) {
        const times = analysis.time.map(t => t.value).join(', ');
        parts.push(`Time: ${times}`);
    }
    
    if (analysis.place.length > 0) {
        const places = analysis.place.map(p => p.value).join(', ');
        parts.push(`Location: ${places}`);
    }
    
    if (analysis.entities.length > 0) {
        const entities = analysis.entities.map(e => `${e.type}: ${e.value}`).join(', ');
        parts.push(`Entities: ${entities}`);
    }
    
    return parts.join(' | ');
}

// DOM event initialization after the page loads.
window.onload = () => {
    // Instantiate the analyzer.
    const analyzer = new EventAnalyzer();
    // Get DOM elements for the analyze button, text input, and result display.
    const button = document.getElementById('analyzeBtn');
    const input = document.getElementById('tweetInput');
    const result = document.getElementById('result');

    // Set up button click event to trigger analysis.
    button.onclick = async () => {
        try {
            const tweet = input.value;
            // Perform analysis on the provided tweet text.
            const analysis = await analyzer.analyzeTweet(tweet);
            
            // Format the results: convert confidence to a percentage and add a summary.
            const formattedResult = {
                ...analysis,
                confidence: `${(analysis.confidence * 100).toFixed(1)}%`,
                summary: generateSummary(analysis)
            };
            
            // Display the analysis as formatted JSON in the results section.
            result.innerHTML = JSON.stringify(formattedResult, null, 2);
            result.classList.add('text-sm', 'font-mono');
        } catch (error) {
            // Display error messages in case of failure.
            result.innerHTML = `Error: ${error.message}`;
            result.classList.add('text-red-600');
        }
    };

    // Optionally trigger an initial analysis on page load.
    button.click();
};
