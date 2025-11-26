# CVV Average Calculator - Browser Extension

A 100% client-side browser extension for calculating grade averages from ClasseViva.

## Features

✅ **100% Client-Side Processing** - All logic runs in your browser
✅ **No Server Required** - Direct API calls from extension
✅ **Zero Data Storage** - Credentials never saved anywhere
✅ **Privacy First** - No tracking, no logging, no external servers
✅ **Automatic Calculations** - Real-time grade averages
✅ **Works Offline** - Once loaded, UI works without internet (except API calls)

## Installation

### Chrome/Edge

1. Open Chrome/Edge and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `browser-extension` folder
5. The extension icon will appear in your toolbar

### Firefox

1. Open Firefox and go to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Navigate to the `browser-extension` folder
4. Select the `manifest.json` file
5. The extension will be loaded temporarily

## Usage

1. Click the extension icon in your browser toolbar
2. Enter your ClasseViva credentials (User ID and Password)
3. Click "Login"
4. View your grades and calculated averages
5. All calculations happen instantly in your browser

## Privacy & Security

- **No server involvement** - Extension talks directly to ClasseViva API
- **No data storage** - Credentials are only in memory during session
- **Open source** - All code is visible and auditable
- **No tracking** - No analytics, no telemetry, no third parties
- **Credentials never logged** - Nothing is saved to disk or sent anywhere

## How It Works

1. User enters credentials in extension popup
2. Extension makes direct HTTPS request to ClasseViva API
3. API returns grades data
4. JavaScript calculates averages in browser
5. Results displayed in popup
6. Data cleared when popup closes

## Files

- `manifest.json` - Extension configuration
- `popup.html` - User interface
- `app.js` - 100% client-side logic
- `icon*.png` - Extension icons

## Technical Details

- **Manifest Version**: 3 (latest)
- **Permissions**: Only ClasseViva API access
- **No background scripts** - Runs only when opened
- **No data collection** - Zero external connections

## Building for Production

To package for Chrome Web Store or Firefox Add-ons:

```bash
cd browser-extension
zip -r cvv-calculator.zip .
```

Upload the zip file to the respective store.

## Support

This extension is open source and community maintained. All processing happens on your device.
