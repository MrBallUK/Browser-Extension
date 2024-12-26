// Default keywords for different categories
const DEFAULT_KEYWORDS = {
    violence: [
        'kill', 'attack', 'fight', 'war', 'bomb', 'shooting', 'shot', 'death',
        'violent', 'assault', 'terror', 'terrorist', 'explosion', 'combat'
    ],
    disaster: [
        'crash', 'accident', 'disaster', 'emergency', 'crisis', 'catastrophe',
        'tragedy', 'tragic', 'earthquake', 'flood', 'hurricane', 'tornado'
    ],
    health: [
        'hospital', 'disease', 'virus', 'infection', 'outbreak', 'pandemic', 'epidemic'
    ],
    crime: [
        'jail', 'arrest', 'criminal', 'prison', 'villain', 'crime', 'murder', 'murdering'
    ]
};

// Initialize extension settings
chrome.runtime.onInstalled.addListener(() => {
    // Set default settings
    chrome.storage.sync.get(['contentFilter', 'adBlocker', 'blockedKeywords', 'enabledCategories'], (result) => {
        const updates = {};
        
        // Set content filter if not set
        if (!result.hasOwnProperty('contentFilter')) {
            updates.contentFilter = true;
        }
        
        // Set ad blocker if not set
        if (!result.hasOwnProperty('adBlocker')) {
            updates.adBlocker = true;
        }
        
        // Set keywords if not set
        if (!result.blockedKeywords || Object.keys(result.blockedKeywords).length === 0) {
            updates.blockedKeywords = DEFAULT_KEYWORDS;
        }
        
        // Set enabled categories if not set
        if (!result.enabledCategories || result.enabledCategories.length === 0) {
            updates.enabledCategories = Object.keys(DEFAULT_KEYWORDS);
        }
        
        // Save updates if needed
        if (Object.keys(updates).length > 0) {
            chrome.storage.sync.set(updates, () => {
                console.log('Settings initialized:', updates);
            });
        }
    });
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'updateBadge') {
        // Update badge text
        const text = request.count > 0 ? request.count.toString() : '';
        chrome.browserAction.setBadgeText({
            text: text,
            tabId: sender.tab.id
        });
        
        // Update badge color
        chrome.browserAction.setBadgeBackgroundColor({
            color: '#4CAF50',
            tabId: sender.tab.id
        });
    }
});
