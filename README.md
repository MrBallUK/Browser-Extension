# Negative News Chrome Extension Blocker

This Chrome extension filters out negative or sad articles from popular news websites. It helps create a more positive browsing experience by hiding articles that contain negative keywords.

## Features

- Automatically hides articles containing negative keywords
- Works on major news websites
- Shows a brief notification when active
- Updates dynamically as you scroll or new content loads
- Customizable keyword filtering by categories:
  - Violence (e.g., murder, attack, terror)
  - Death (e.g., died, fatal)
  - Disaster (e.g., crash, emergency, crisis)
  - Politics (e.g., scandal, controversy)
  - Health (e.g., disease, outbreak)
  - Crime (e.g., arrest, prison)
- Enable/disable specific keyword categories
- Add custom keywords to any category
- Manage list of filtered news domains
- Option to temporarily disable filtering
- Dark/Light mode support

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select the extension directory
4. The extension will automatically start working when you visit supported news websites

## How it Works

The extension scans article headlines for negative keywords and hides articles that contain these words. It works continuously as you browse, filtering both initial content and dynamically loaded articles. Users can customize their experience through the options page, including managing keyword categories and news domains.

## Supported Websites

The extension works on major news websites including:

### Primary Support
- BBC News (bbc.com, bbc.co.uk)
- Sky News (news.sky.com)
- The Guardian (theguardian.com)
- New York Times (nytimes.com)
- CNN (cnn.com)
- Fox News (foxnews.com)
- Reuters (reuters.com)
- Bloomberg (bloomberg.com)
- Washington Post (washingtonpost.com)
- NBC News (nbcnews.com)
- CBS News (cbsnews.com)
- ABC News (abcnews.go.com)
- Google News (news.google.com)
- MSN News (msn.com)
- Yahoo News (news.yahoo.com)

### Generic Support
The extension also works on other news websites that use common article structures and HTML elements. The effectiveness may vary depending on the website's specific layout.

## Customization

The extension offers several ways to customize your experience:

1. **Keyword Categories**: Enable or disable entire categories of keywords
2. **Custom Keywords**: Add your own keywords to any category
3. **Domain Management**: Add or remove news websites from the filter
4. **Filter Toggle**: Quickly enable/disable the extension through the popup

## Version

1.1.0 - Added customizable settings and dark mode support

## License

MIT License

Copyright (c) 2024 Steve Ball

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
