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
        'jail', 'arrest', 'criminal', 'prison', 'villain', 'crime', 'murder', 'murdering'
    ]
};

// Default news domains
const DEFAULT_DOMAINS = [
    'bbc.com',
    'bbc.co.uk',
    'theguardian.com',
    'nytimes.com',
    'cnn.com',
    'foxnews.com',
    'reuters.com',
    'bloomberg.com',
    'washingtonpost.com',
    'nbcnews.com',
    'cbsnews.com',
    'abcnews.go.com',
    'news.sky.com',
    'news.google.com',
    'msn.com',
    'news.yahoo.com'
];

// Initialize the categories and their containers
document.addEventListener('DOMContentLoaded', function() {
    displayKeywords();
    
    // Set up the add keyword form
    const addKeywordForm = document.getElementById('addKeywordForm');
    if (addKeywordForm) {
        addKeywordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const categorySelect = document.getElementById('categorySelect');
            const newKeywordInput = document.getElementById('newKeyword');
            
            if (categorySelect && newKeywordInput) {
                const category = categorySelect.value;
                const keyword = newKeywordInput.value.trim().toLowerCase();
                if (category && keyword) {
                    addKeyword(category, keyword);
                }
            }
        });
    }
});

// Load settings when the page opens
document.addEventListener('DOMContentLoaded', () => {
    initializeSettings();
    loadSettings();
});

// Initialize default settings if not already set
function initializeSettings() {
    chrome.storage.sync.get(['blockedKeywords', 'domains', 'domainFilterEnabled', 'enabledCategories'], (data) => {
        const updates = {};
        
        // Initialize keywords if not set
        if (!data.blockedKeywords) {
            updates.blockedKeywords = DEFAULT_KEYWORDS;
        }
        
        // Initialize domains if not set
        if (!data.domains) {
            updates.domains = DEFAULT_DOMAINS;
        }
        
        // Initialize domain filter if not set
        if (data.domainFilterEnabled === undefined) {
            updates.domainFilterEnabled = true;
        }
        
        // Initialize enabled categories if not set
        if (!data.enabledCategories) {
            updates.enabledCategories = Object.keys(DEFAULT_KEYWORDS);
        }
        
        // Save updates if any
        if (Object.keys(updates).length > 0) {
            chrome.storage.sync.set(updates, () => {
                console.log('Settings initialized:', updates);
                loadSettings(); // Reload settings after initialization
            });
        }
    });
}

// Load settings from storage
function loadSettings() {
    chrome.storage.sync.get(['blockedKeywords', 'enabledCategories', 'domains', 'domainFilterEnabled'], (data) => {
        // Load domain settings
        const domainFilterEnabled = data.domainFilterEnabled ?? true;
        document.getElementById('domainFilterEnabled').checked = domainFilterEnabled;
        
        // Load domains
        const domains = data.domains || DEFAULT_DOMAINS;
        const domainsContainer = document.getElementById('domains');
        domainsContainer.innerHTML = '';
        domains.forEach(domain => {
            const domainElement = createDomainElement(domain);
            domainsContainer.appendChild(domainElement);
        });

        // Load categories and keywords
        const categories = data.blockedKeywords || DEFAULT_KEYWORDS;
        const enabledCategories = data.enabledCategories || Object.keys(categories);
        const categoriesContainer = document.getElementById('categories');
        categoriesContainer.innerHTML = '';

        Object.entries(categories).forEach(([category, keywords]) => {
            const categoryElement = createCategoryElement(category, keywords, enabledCategories.includes(category));
            categoriesContainer.appendChild(categoryElement);
        });
    });
}

function createCategoryElement(category, keywords, enabled) {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'category';
    
    // Create category header
    const header = document.createElement('div');
    header.className = 'category-header';
    
    // Create toggle switch
    const toggleLabel = document.createElement('label');
    toggleLabel.className = 'toggle-switch';
    
    const toggleInput = document.createElement('input');
    toggleInput.type = 'checkbox';
    toggleInput.checked = enabled;
    toggleInput.addEventListener('change', () => {
        updateEnabledCategories(category, toggleInput.checked);
    });
    
    const toggleSlider = document.createElement('span');
    toggleSlider.className = 'toggle-slider';
    
    toggleLabel.appendChild(toggleInput);
    toggleLabel.appendChild(toggleSlider);
    
    const categoryLabel = document.createElement('label');
    categoryLabel.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    
    header.appendChild(toggleLabel);
    header.appendChild(categoryLabel);
    
    // Create keyword list
    const keywordList = document.createElement('div');
    keywordList.className = 'keyword-list';
    
    keywords.forEach(keyword => {
        const keywordElement = createKeywordElement(category, keyword);
        keywordList.appendChild(keywordElement);
    });
    
    // Create input group for new keywords
    const inputGroup = document.createElement('div');
    inputGroup.className = 'keyword-input-group';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Add new keyword';
    
    const addButton = document.createElement('button');
    addButton.textContent = 'Add';
    addButton.onclick = () => {
        const keyword = input.value.trim().toLowerCase();
        if (keyword) {
            addKeyword(category, keyword);
            input.value = '';
        }
    };
    
    // Add keypress event listener for Enter key
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const keyword = input.value.trim().toLowerCase();
            if (keyword) {
                addKeyword(category, keyword);
                input.value = '';
            }
        }
    });
    
    inputGroup.appendChild(input);
    inputGroup.appendChild(addButton);
    
    categoryDiv.appendChild(header);
    categoryDiv.appendChild(keywordList);
    categoryDiv.appendChild(inputGroup);
    
    return categoryDiv;
}

function createKeywordElement(category, keyword) {
    const keywordDiv = document.createElement('div');
    keywordDiv.className = 'keyword';
    
    const keywordText = document.createElement('span');
    keywordText.textContent = keyword;
    
    const removeButton = document.createElement('button');
    removeButton.className = 'remove-keyword';
    removeButton.innerHTML = '×';
    removeButton.onclick = () => {
        chrome.storage.sync.get(['blockedKeywords'], (data) => {
            const keywords = data.blockedKeywords || {};
            const categoryKeywords = keywords[category] || [];
            const index = categoryKeywords.indexOf(keyword);
            
            if (index > -1) {
                categoryKeywords.splice(index, 1);
                keywords[category] = categoryKeywords;
                
                chrome.storage.sync.set({ blockedKeywords: keywords }, () => {
                    showNotification('Keyword removed successfully');
                    keywordDiv.remove();
                    reloadActiveTabs();
                });
            }
        });
    };
    
    keywordDiv.appendChild(keywordText);
    keywordDiv.appendChild(removeButton);
    
    return keywordDiv;
}

function createDomainElement(domain) {
    const div = document.createElement('div');
    div.className = 'domain-item';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = domain;
    input.addEventListener('change', () => updateDomain(domain, input.value));
    
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.className = 'remove';
    removeButton.addEventListener('click', () => removeDomain(domain));
    
    div.appendChild(input);
    div.appendChild(removeButton);
    return div;
}

function updateEnabledCategories(category, enabled) {
    chrome.storage.sync.get(['enabledCategories'], (data) => {
        let enabledCategories = data.enabledCategories || [];
        if (enabled && !enabledCategories.includes(category)) {
            enabledCategories.push(category);
        } else if (!enabled) {
            enabledCategories = enabledCategories.filter(c => c !== category);
        }
        chrome.storage.sync.set({ enabledCategories }, () => {
            console.log('Updated enabled categories:', enabledCategories);
        });
    });
}

function removeKeyword(category, keyword) {
    chrome.storage.sync.get(['blockedKeywords'], (data) => {
        const keywords = data.blockedKeywords || {};
        const categoryKeywords = keywords[category] || [];
        const index = categoryKeywords.indexOf(keyword);
        
        if (index > -1) {
            categoryKeywords.splice(index, 1);
            keywords[category] = categoryKeywords;
            
            chrome.storage.sync.set({ blockedKeywords: keywords }, () => {
                showNotification('Keyword removed successfully');
                reloadActiveTabs();
            });
        }
    });
}

function updateDomain(oldDomain, newDomain) {
    chrome.storage.sync.get(['domains'], (data) => {
        let domains = data.domains || [];
        const index = domains.indexOf(oldDomain);
        if (index !== -1) {
            domains[index] = newDomain;
            chrome.storage.sync.set({ domains }, () => {
                loadSettings();
            });
        }
    });
}

function removeDomain(domain) {
    chrome.storage.sync.get(['domains'], (data) => {
        let domains = data.domains || [];
        domains = domains.filter(d => d !== domain);
        chrome.storage.sync.set({ domains }, () => {
            loadSettings();
        });
    });
}

function addKeyword(category, keyword) {
    if (!keyword) return;
    
    chrome.storage.sync.get(['blockedKeywords'], function(data) {
        let keywords = data.blockedKeywords || {};
        keywords[category] = keywords[category] || [];
        
        // Check if keyword already exists
        if (!keywords[category].includes(keyword)) {
            keywords[category].push(keyword);
            
            chrome.storage.sync.set({ blockedKeywords: keywords }, function() {
                console.log('Keyword added:', keyword, 'to category:', category);
                displayKeywords();
                showNotification('Keyword added successfully!', 'success');
                
                // Clear input field
                document.getElementById('newKeyword').value = '';
            });
        } else {
            showNotification('Keyword already exists in this category!', 'error');
        }
    });
}

function removeKeyword(category, keyword) {
    chrome.storage.sync.get(['blockedKeywords'], function(data) {
        let keywords = data.blockedKeywords || {};
        
        if (keywords[category]) {
            const index = keywords[category].indexOf(keyword);
            if (index > -1) {
                keywords[category].splice(index, 1);
                
                chrome.storage.sync.set({ blockedKeywords: keywords }, function() {
                    console.log('Keyword removed:', keyword, 'from category:', category);
                    displayKeywords();
                    showNotification('Keyword removed successfully!', 'success');
                });
            }
        }
    });
}

function displayKeywords() {
    chrome.storage.sync.get(['blockedKeywords', 'enabledCategories'], function(data) {
        const keywords = data.blockedKeywords || {};
        const enabledCategories = data.enabledCategories || Object.keys(keywords);
        
        // Get all category containers
        const categories = document.querySelectorAll('.category');
        categories.forEach(categoryDiv => {
            const categoryId = categoryDiv.id;
            if (!categoryId) return;
            
            // Clear existing content
            categoryDiv.innerHTML = '';
            
            // Create and add the toggle switch
            const toggleContainer = document.createElement('div');
            toggleContainer.className = 'category-header';
            
            const toggle = document.createElement('label');
            toggle.className = 'switch';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = enabledCategories.includes(categoryId);
            checkbox.addEventListener('change', () => toggleCategory(categoryId, checkbox.checked));
            
            const slider = document.createElement('span');
            slider.className = 'slider round';
            
            toggle.appendChild(checkbox);
            toggle.appendChild(slider);
            
            const title = document.createElement('span');
            title.textContent = categoryId;
            title.className = 'category-title';
            
            toggleContainer.appendChild(toggle);
            toggleContainer.appendChild(title);
            categoryDiv.appendChild(toggleContainer);
            
            // Create keywords container
            const keywordsContainer = document.createElement('div');
            keywordsContainer.className = 'keywords-container';
            
            // Add keywords if they exist
            if (keywords[categoryId] && Array.isArray(keywords[categoryId])) {
                keywords[categoryId].forEach(keyword => {
                    if (keyword) {
                        const keywordElement = document.createElement('span');
                        keywordElement.className = 'keyword';
                        
                        const keywordText = document.createElement('span');
                        keywordText.textContent = keyword;
                        keywordElement.appendChild(keywordText);
                        
                        const removeButton = document.createElement('button');
                        removeButton.innerHTML = '&times;';
                        removeButton.className = 'remove-keyword';
                        removeButton.onclick = () => removeKeyword(categoryId, keyword);
                        keywordElement.appendChild(removeButton);
                        
                        keywordsContainer.appendChild(keywordElement);
                    }
                });
            }
            
            categoryDiv.appendChild(keywordsContainer);
        });
    });
}

function toggleCategory(category, enabled) {
    if (!category) return;
    
    chrome.storage.sync.get(['enabledCategories'], function(data) {
        let enabledCategories = data.enabledCategories || [];
        
        if (enabled && !enabledCategories.includes(category)) {
            enabledCategories.push(category);
        } else if (!enabled) {
            enabledCategories = enabledCategories.filter(cat => cat !== category);
        }
        
        chrome.storage.sync.set({ enabledCategories }, function() {
            console.log('Category toggled:', category, enabled);
            showNotification(`Category ${enabled ? 'enabled' : 'disabled'}: ${category}`, 'success');
        });
    });
}

function reloadActiveTabs() {
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
            if (tab.url.startsWith('http')) {
                chrome.tabs.reload(tab.id);
            }
        });
    });
}

function showNotification(message, type = 'success') {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        document.body.appendChild(notification);
    }
    
    // Set notification style based on type
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Show notification
    notification.style.display = 'block';
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Add new domain button handler
document.getElementById('addDomain').addEventListener('click', () => {
    chrome.storage.sync.get(['domains'], (data) => {
        let domains = data.domains || [];
        domains.push('example.com');
        chrome.storage.sync.set({ domains }, () => {
            loadSettings();
        });
    });
});

// Domain filter toggle handler
document.getElementById('domainFilterEnabled').addEventListener('change', (e) => {
    chrome.storage.sync.set({ domainFilterEnabled: e.target.checked }, () => {
        console.log('Domain filter enabled:', e.target.checked);
    });
});

// Add event listeners
document.getElementById('addKeywordForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const category = document.getElementById('categorySelect').value;
    const keyword = document.getElementById('newKeyword').value.trim().toLowerCase();
    addKeyword(category, keyword);
});
