#!/bin/bash

# Build script to convert web app into browser extension
# This copies and adapts the web version to work as a browser extension

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB_DIR="$SCRIPT_DIR/web"
SHARED_DIR="$SCRIPT_DIR/shared"
EXT_DIR="$SCRIPT_DIR/browser-extension"

echo "🔨 Building browser extension from web app..."

# Create extension directory if it doesn't exist
mkdir -p "$EXT_DIR"

echo "📋 Copying shared modules..."
# Copy shared JavaScript files
cp -v "$SHARED_DIR/config.js" "$EXT_DIR/"
cp -v "$SHARED_DIR/api.js" "$EXT_DIR/"
cp -v "$SHARED_DIR/calculator.js" "$EXT_DIR/"
cp -v "$SHARED_DIR/ui-bootstrap.js" "$EXT_DIR/"

echo "📦 Downloading Bootstrap locally for CSP compliance..."
# Download Bootstrap and Bootstrap Icons locally (required for extension CSP)
curl -sL https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css -o "$EXT_DIR/bootstrap.min.css"
curl -sL https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js -o "$EXT_DIR/bootstrap.bundle.min.js"
curl -sL https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.min.css -o "$EXT_DIR/bootstrap-icons.min.css"
echo "   ✓ Bootstrap files downloaded"

echo "🎨 Creating extension page.html from web index.html..."
# Read the web index.html and modify it for extension use
cat "$WEB_DIR/index.html" | \
  # Change title
  sed 's/<title>.*<\/title>/<title>CVV Average Calculator - Extension<\/title>/' | \
  # Replace CDN Bootstrap CSS with local files
  sed 's|<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">|<link href="bootstrap.min.css" rel="stylesheet">|' | \
  sed 's|<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">|<link rel="stylesheet" href="bootstrap-icons.min.css">|' | \
  # Replace CDN Bootstrap JS with local file
  sed 's|<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>|<script src="bootstrap.bundle.min.js"><\/script>|' | \
  # Update script tags to load from same directory (not shared/)
  sed 's|<script src="shared/config.js"></script>|<script src="config.js"><\/script>|' | \
  sed 's|<script src="shared/api.js"></script>|<script src="api.js"><\/script>|' | \
  sed 's|<script src="shared/calculator.js"></script>|<script src="calculator.js"><\/script>|' | \
  sed 's|<script src="shared/ui-bootstrap.js"></script>|<script src="ui-bootstrap.js"><\/script>|' | \
  # Add extension-specific note
  sed 's|<p class="text-center text-muted mb-4">.*</p>|<p class="text-center text-muted mb-4">Browser Extension - 100% Client-Side</p>|' \
  > "$EXT_DIR/page.html"

echo "📦 Checking manifest.json..."
if [ -f "$EXT_DIR/manifest.json" ]; then
  echo "   manifest.json already exists (keeping as-is)"
else
  echo "   WARNING: manifest.json not found in $EXT_DIR"
fi

echo "🧹 Removing old app.js (now using modular approach)..."
rm -f "$EXT_DIR/app.js"

echo ""
echo "✅ Extension build complete!"
echo ""
echo "📂 Extension files in: $EXT_DIR"
echo "   - page.html (main UI)"
echo "   - bootstrap.min.css (Bootstrap CSS - local)"
echo "   - bootstrap.bundle.min.js (Bootstrap JS - local)"
echo "   - bootstrap-icons.min.css (Bootstrap Icons - local)"
echo "   - config.js (environment config)"
echo "   - api.js (API calls)"
echo "   - calculator.js (grade calculations)"
echo "   - ui-bootstrap.js (UI with Bootstrap + sessions)"
echo "   - manifest.json (extension manifest)"
echo "   - background.js (service worker)"
echo ""
echo "🚀 To test the extension:"
echo "   1. Open chrome://extensions"
echo "   2. Enable 'Developer mode'"
echo "   3. Click 'Load unpacked'"
echo "   4. Select: $EXT_DIR"
echo ""
