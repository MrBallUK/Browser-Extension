// Ad blocking functionality using filter lists
class AdBlocker {
    constructor() {
        this.filters = new Set();
        this.cosmeticFilters = new Set();
        this.initialized = false;
        
        // Whitelist for essential content
        this.WHITELIST = [
            // CNN essential content
            /^https?:\/\/.*\.cnn\.com\/.*\/(content|article|video|media)\//i,
            /^https?:\/\/.*\.cnn\.com\/.*\/(static|assets|images)\//i,
            /^https?:\/\/.*\.cnn\.com\/.*\/(css|js|fonts)\//i,
            // Essential resources
            /^https?:\/\/.*\/(jquery|bootstrap|fontawesome)/i,
            /^https?:\/\/.*\/(css|js|fonts|images|assets)\//i
        ];

        // Only block these specific ad patterns
        this.AD_PATTERNS = [
            // Common ad networks
            /doubleclick\.net/i,
            /google-analytics\.com/i,
            /googlesyndication\.com/i,
            /adnxs\.com/i,
            /outbrain\.com/i,
            /taboola\.com/i,
            // Ad-specific paths
            /\/ads?\//i,
            /\/advert/i,
            /\/banner/i,
            /\/pop(up|under)/i
        ];

        this.FILTER_LISTS = [
            'https://easylist.to/easylist/easylist.txt',
            'https://easylist.to/easylist/easyprivacy.txt'
        ];
    }

    async loadFilters() {
        for (const listUrl of this.FILTER_LISTS) {
            try {
                const response = await fetch(listUrl);
                const text = await response.text();
                this.parseFilterList(text);
            } catch (error) {
                console.error(`Error loading filter list ${listUrl}:`, error);
            }
        }
    }

    parseFilterList(text) {
        const lines = text.split('\n');
        for (const line of lines) {
            if (line && !line.startsWith('!') && !line.startsWith('[')) {
                if (line.startsWith('##')) {
                    // Cosmetic filter
                    this.cosmeticFilters.add(line.slice(2));
                } else if (!line.includes('##')) {
                    // Network filter
                    this.filters.add(this.parseFilterRule(line));
                }
            }
        }
    }

    parseFilterRule(rule) {
        // Convert Adblock Plus filter syntax to match pattern
        rule = rule.replace(/\^/g, '');
        rule = rule.replace(/\*/g, '.*');
        rule = rule.replace(/\|/g, '');
        return new RegExp(rule);
    }

    isWhitelisted(url) {
        return this.WHITELIST.some(pattern => pattern.test(url));
    }

    shouldBlock(url) {
        // Never block whitelisted content
        if (this.isWhitelisted(url)) {
            return false;
        }
        
        // Check against ad patterns
        return this.AD_PATTERNS.some(pattern => pattern.test(url));
    }

    isAd(element) {
        // Skip elements that are part of main content
        if (element.closest('article, [data-component="ArticleBody"], .article-body')) {
            return false;
        }

        // Common ad class names and IDs that are definitely ads
        const adPatterns = [
            'doubleclick',
            'sponsored-content',
            'taboola',
            'outbrain',
            'advertisement',
            'ad-slot',
            'ad-container'
        ];

        // Check class names
        const classNames = element.className || '';
        if (adPatterns.some(pattern => classNames.toLowerCase().includes(pattern))) {
            return true;
        }

        // Check ID
        const id = element.id || '';
        if (adPatterns.some(pattern => id.toLowerCase().includes(pattern))) {
            return true;
        }

        // Check data attributes
        for (const attr of element.attributes) {
            if (attr.name.startsWith('data-') && 
                adPatterns.some(pattern => attr.value.toLowerCase().includes(pattern))) {
                return true;
            }
        }

        return false;
    }

    applyCosmeticFilters() {
        // Only apply to obvious ad containers
        const adSelectors = [
            '[class*="doubleclick"]',
            '[class*="sponsored-content"]',
            '[class*="taboola"]',
            '[class*="outbrain"]',
            '[class*="advertisement"]',
            '[id*="doubleclick"]',
            '[id*="sponsored-content"]',
            '[id*="taboola"]',
            '[id*="outbrain"]',
            '[id*="advertisement"]'
        ].join(',');

        const style = document.createElement('style');
        style.id = 'adblock-cosmetic-filters';
        style.textContent = `${adSelectors} { display: none !important; }`;
        
        // Remove old style if it exists
        const oldStyle = document.getElementById('adblock-cosmetic-filters');
        if (oldStyle) {
            oldStyle.remove();
        }
        
        document.head.appendChild(style);
    }

    processNode(node) {
        // Skip if node is part of main content
        if (node.closest('article, [data-component="ArticleBody"], .article-body')) {
            return;
        }

        // Check if node is an ad
        if (this.isAd(node)) {
            node.style.display = 'none';
            return;
        }

        // Process iframes and images
        if (node.tagName === 'IFRAME' || node.tagName === 'IMG') {
            const src = node.src;
            if (src && this.shouldBlock(src)) {
                node.remove();
            }
        }
    }

    initializeMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        this.processNode(node);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    async initialize() {
        if (this.initialized) return;
        
        try {
            await this.loadFilters();
            this.initializeMutationObserver();
            this.applyCosmeticFilters();
            this.initialized = true;
            console.log('AdBlocker initialized with whitelist protection');
        } catch (error) {
            console.error('Error initializing AdBlocker:', error);
        }
    }
}

// Create and export instance
const adBlocker = new AdBlocker();
module.exports = { adBlocker };
