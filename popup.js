document.addEventListener('DOMContentLoaded', () => {
    // Load saved settings
    chrome.storage.sync.get(['contentFilter', 'adBlocker'], (result) => {
        document.getElementById('contentFilter').checked = result.contentFilter !== false;
        document.getElementById('adBlocker').checked = result.adBlocker !== false;
    });

    // Save settings when changed
    document.getElementById('contentFilter').addEventListener('change', (e) => {
        chrome.storage.sync.set({ contentFilter: e.target.checked });
        // Notify content script
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { 
                type: 'settingsChanged',
                contentFilter: e.target.checked
            });
        });
    });

    document.getElementById('adBlocker').addEventListener('change', (e) => {
        chrome.storage.sync.set({ adBlocker: e.target.checked });
        // Notify content script
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { 
                type: 'settingsChanged',
                adBlocker: e.target.checked
            });
        });
    });

    // Open options page
    document.getElementById('options').addEventListener('click', () => {
        chrome.runtime.openOptionsPage();
    });
});
