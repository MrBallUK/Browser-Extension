// Default keywords organized by category
const DEFAULT_KEYWORDS = {
    violence: [
        'murder', 'killed', 'attack', 'terror', 'shooting', 'gunman', 'gunmen', 'armed',
        'violence', 'rape', 'raped', 'victim', 'massacre'
    ],
    death: [
        'death', 'died', 'dead', 'fatal', 'suicide', 'dies'
    ],
    disaster: [
        'crash', 'accident', 'emergency', 'disaster', 'crisis', 'catastrophe', 'tragedy',
        'tragic', 'sinks', 'crashes', 'panic', 'tsunami'
    ],
    politics: [
        'trump', 'politics', 'putin', 'scandal', 'russia', 'russian', 'syria', 'syrian'
    ],
    health: [
        'hospital', 'disease', 'virus', 'infection', 'outbreak', 'pandemic', 'epidemic'
    ],
    crime: [
        'jail', 'arrest', 'criminal', 'prison', 'villain', 'crime'
    ]
};

// Load current keywords
let currentKeywords = [];

// Load settings from storage
function loadSettings() {
    chrome.storage.sync.get(['blockedKeywords', 'enabledCategories'], (data) => {
        if (data.blockedKeywords && data.enabledCategories) {
            currentKeywords = data.enabledCategories.reduce((acc, category) => {
                return acc.concat(data.blockedKeywords[category] || []);
            }, []);
            console.log('Loaded keywords:', currentKeywords);
        }
    });
}

// Function to replace content with positive message
function replaceContent(element) {
    const quotes = [
        {
            title: "Stay positive!",
            description: "Here's something more uplifting instead.",
            image: "https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?w=300"
        },
        // ... other quotes ...
    ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    // Create replacement content
    const replacement = document.createElement('div');
    replacement.className = 'positive-content';
    replacement.innerHTML = `
        <h3>${randomQuote.title}</h3>
        <p>${randomQuote.description}</p>
        ${randomQuote.image ? `<img src="${randomQuote.image}" alt="Positive image">` : ''}
    `;
    
    // Replace the content
    element.style.display = 'none';
    element.insertAdjacentElement('afterend', replacement);
}

// Function to check text for keywords
function containsBlockedKeywords(text) {
    if (!text || typeof text !== 'string') return false;
    text = text.toLowerCase();
    return currentKeywords.some(keyword => {
        const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'i');
        return regex.test(text);
    });
}

// Function to scan element for keywords
function scanForKeywords(element) {
    if (!element || element.hasAttribute('data-processed')) return;
    
    // Get text content
    const text = element.textContent.trim();
    if (!text || text.length < 10) return;
    
    // Check for keywords
    if (containsBlockedKeywords(text)) {
        console.log('Found blocked content:', text.substring(0, 100));
        replaceContent(element);
        element.setAttribute('data-processed', 'true');
        updateBadgeCount();
    }
}

// Function to update badge count
function updateBadgeCount() {
    const processedElements = document.querySelectorAll('[data-processed="true"]');
    chrome.runtime.sendMessage({
        type: 'updateBadge',
        count: processedElements.length
    });
}

// Site-specific processors
const SITE_PROCESSORS = {
    CNN: {
        hostname: 'cnn.com',
        selectors: {
            articles: [
                'article',
                '.container__article',
                '.container__item',
                '.card',
                '.media__body'
            ].join(', '),
            headlines: [
                '.container__headline',
                '.container__title',
                '.headline',
                '.title'
            ].join(', ')
        },
        processPage: function() {
            // Process headlines first
            document.querySelectorAll(this.selectors.headlines).forEach(element => {
                if (!element.hasAttribute('data-processed')) {
                    scanForKeywords(element);
                }
            });
            
            // Process articles
            document.querySelectorAll(this.selectors.articles).forEach(element => {
                if (!element.hasAttribute('data-processed')) {
                    scanForKeywords(element);
                }
            });
        }
    },
    BBC: {
        hostname: 'bbc.com',
        selectors: {
            articles: [
                'article',
                '.gs-c-promo',
                '.media__content',
                '.story-body'
            ].join(', '),
            headlines: [
                '.gs-c-promo-heading',
                '.media__title',
                '.story-body__h1'
            ].join(', ')
        },
        processPage: function() {
            // Process headlines first
            document.querySelectorAll(this.selectors.headlines).forEach(element => {
                if (!element.hasAttribute('data-processed')) {
                    scanForKeywords(element);
                }
            });
            
            // Process articles
            document.querySelectorAll(this.selectors.articles).forEach(element => {
                if (!element.hasAttribute('data-processed')) {
                    scanForKeywords(element);
                }
            });
        }
    },
    SKY: {
        hostname: 'news.sky.com',
        selectors: {
            articles: [
                'article',
                '[data-component="ArticleBody"]',
                '.sdc-article-body',
                '[data-component="StoryCard"]',
                '[data-component="StoryBlock"]',
                '[data-component="Text"]'
            ].join(', '),
            headlines: [
                '[data-component="Headline"]',
                '.sdc-site-tile__headline',
                '.sdc-article-header__title'
            ].join(', ')
        },
        processPage: function() {
            // Process headlines first
            document.querySelectorAll(this.selectors.headlines).forEach(element => {
                if (!element.hasAttribute('data-processed')) {
                    scanForKeywords(element);
                }
            });
            
            // Process articles
            document.querySelectorAll(this.selectors.articles).forEach(element => {
                if (!element.hasAttribute('data-processed')) {
                    scanForKeywords(element);
                }
            });
        }
    }
};

// Function to get current site processor
function getCurrentSiteProcessor() {
    const hostname = window.location.hostname.toLowerCase();
    for (const [name, processor] of Object.entries(SITE_PROCESSORS)) {
        if (hostname.includes(processor.hostname)) {
            return processor;
        }
    }
    return null;
}

// Function to process page content
function processPage() {
    const siteProcessor = getCurrentSiteProcessor();
    if (siteProcessor) {
        siteProcessor.processPage();
    } else {
        // Generic processor for unsupported sites
        document.querySelectorAll('p, h1, h2, h3, article').forEach(element => {
            if (!element.hasAttribute('data-processed')) {
                scanForKeywords(element);
            }
        });
    }
}

// Set up mutation observer
function setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
        let shouldProcess = false;
        
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {  // Element node
                    shouldProcess = true;
                }
            });
        });
        
        if (shouldProcess) {
            processPage();
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Initialize extension
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    processPage();
    setupMutationObserver();
});

// Listen for settings changes
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'settingsChanged') {
        loadSettings();
        processPage();
    }
});
