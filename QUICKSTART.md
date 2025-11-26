# Quick Start Guide

Get your ClasseViva calculator running on iOS in 5 minutes.

## Option 1: Docker (Easiest - Recommended)

```bash
# Copy environment file
cp .env.example .env

# Start everything
docker-compose up -d

# Access at http://localhost:8080
```

Done! See [DOCKER.md](DOCKER.md) for advanced configuration.

---

## Option 2: Cloudflare Workers (Serverless)

### Step 1: Deploy the Proxy

```bash
npm install -g wrangler
wrangler login
cd proxy
wrangler deploy
```

Copy the URL shown (e.g., `https://spaggiari-proxy.yourname.workers.dev`)

### Step 2: Update Config

Edit `shared/config.js`:

```javascript
const ENV = {
  isExtension:
    typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.id,
  proxyUrl: "https://spaggiari-proxy.yourname.workers.dev", // ← Paste your URL here
};
```

### Step 3: Deploy Website

Push to GitHub, then:

1. Go to repo Settings
2. Click "Pages"
3. Select main branch and `/web` folder
4. Done! Access at `https://yourname.github.io/StudentIntrest/`

### Step 4: iOS Users

1. Open the website in Safari
2. Tap Share → "Add to Home Screen"
3. Enjoy! Works like a native app

---

**That's it!** No Flask, no complicated setup, just works.

**Local testing:**

```bash
# Terminal 1
npm run dev:proxy

# Terminal 2
npm run dev:web

# Open http://localhost:8080
```
