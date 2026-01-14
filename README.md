> [!WARNING]
> This project is *super* in progress. some content may not be properly formatted or readable

# Drive Dark
A chrome extension to dark-theme *all* of Google Drive
---
## Installation
Currently, the chrome extension is not published in the Chrome web store. It needs to be added to your browser directly from source.

1. Clone this repository onto your local machine
2. Follow steps in Chrome's [tutorial](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked) for adding an unpacked extension from source
3. When updating the extension involves pulling the latest version from github, and then [reloading](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#reload) the extension in Chrome settings

## Support
This is a side project that gets *very little* of my time. Although Google Drive largely stays the same day-to-day, I expect the extension will break pretty quickly between updates and have certain UI elements/views missed in the implementation.

## Data Access
This extension *will* need permissions to access page contents when you are on any `https://docs.google.com/*` URL. That's how the extension can manipulate the styling to achieve dark mode. However, none of the contents on the page are being saved, recorded, sent or shared outside the browser. 
