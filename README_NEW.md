# CVV Average Calculator - Multi-Platform

Calculate your ClasseViva grade averages on **any platform**: browser extension (Chrome, Firefox, Edge) or web app (iOS, Android, Desktop).

## 🌟 Features

- ✅ **100% Client-Side** - Your credentials never stored on servers
- ✅ **Browser Extension** - Chrome, Firefox, Edge, Brave, Opera
- ✅ **iOS Compatible** - Works as a web app, can be added to home screen
- ✅ **Cross-Platform** - Shared codebase for consistency
- ✅ **Fast & Lightweight** - Minimal proxy for CORS bypass only
- ✅ **Real-time Calculations** - See what grade you need for 6.0 average

## 📁 Project Structure

```
├── browser-extension/   # Browser extension (original)
├── shared/             # Shared code (logic, UI, API)
│   ├── config.js       # Environment detection & config
│   ├── api.js          # API calls (login, grades)
│   ├── calculator.js   # Grade calculation logic
│   └── ui.js           # UI rendering & event handlers
├── web/                # Website version (iOS compatible)
│   ├── index.html      # Main HTML (loads shared scripts)
│   └── README.md       # Web deployment guide
├── proxy/              # CORS proxy (Cloudflare Worker)
│   ├── worker.js       # Cloudflare Worker script
│   ├── wrangler.toml   # Cloudflare config
│   └── README.md       # Proxy deployment options
└── package.json        # Build scripts & dependencies
```

## 🚀 Quick Start

### For Users

**Browser Extension:**

1. Download from Chrome Web Store (coming soon)
2. Or load unpacked from `browser-extension/` folder

**iOS/Web Version:**

1. Visit [your-deployed-site.com]
2. Login with your ClasseViva credentials
3. (Optional) Add to home screen for app-like experience

### For Developers

**1. Clone the repository**

```bash
git clone https://github.com/LucaCraft89/StudentIntrest.git
cd StudentIntrest
```

**2. Install dependencies**

```bash
npm install
```

**3. Deploy the proxy** (Required for web version)

#### Cloudflare Workers (Recommended - 100% FREE)

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare (creates account if needed)
wrangler login

# Deploy
npm run deploy:proxy

# Copy your worker URL (e.g., https://spaggiari-proxy.username.workers.dev)
# Update shared/config.js with this URL
```

That's it! No server, no maintenance, no cost. Just works.

**Alternative:** Self-hosted Node.js proxy (see `/proxy/README.md` if you really need this)

**4. Update proxy URL**

Edit `shared/config.js`:

```javascript
const ENV = {
  isExtension:
    typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.id,
  proxyUrl: "https://your-worker-url.workers.dev", // ← Update this
};
```

**5. Test locally**

Web version:

```bash
npm run dev:web
# Open http://localhost:8080
```

Proxy (local testing):

```bash
npm run dev:proxy
# Runs on http://localhost:8787
```

**6. Deploy the website**

**GitHub Pages** (Easiest - FREE)

1. Push to GitHub
2. Settings > Pages > Select branch and `/web` folder
3. Access at `https://username.github.io/StudentIntrest/`

**Or any static hosting:** Netlify, Vercel, Cloudflare Pages - they're all free and work perfectly

## 🔧 Development

### Shared Code Philosophy

The `shared/` folder contains all business logic, API calls, and UI rendering. Both the extension and website use these files:

- **Extension**: Copies files during build, uses `declarativeNetRequest` for CORS
- **Website**: References files directly, uses proxy for CORS

### Making Changes

1. Edit files in `shared/` folder
2. For extension: Run `npm run build:extension` to copy changes
3. For web: Refresh browser (shared files are loaded dynamically)

### Environment Detection

The code automatically detects whether it's running in an extension or browser:

```javascript
// In shared/config.js
const ENV = {
  isExtension:
    typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.id,
  proxyUrl: "...",
};

// API calls adapt automatically
if (ENV.isExtension) {
  // Direct API calls (extension bypasses CORS)
} else {
  // Use proxy for CORS
}
```

## 🔐 Privacy & Security

- **No data storage**: All calculations happen in your browser
- **No tracking**: No analytics or external scripts
- **Open source**: Review the code yourself
- **Credentials**: Only sent to official Spaggiari API
- **Proxy**: Only forwards requests, doesn't store anything

### Security Recommendations for Production

1. **Restrict CORS** in proxy:

   ```javascript
   const corsHeaders = {
     "Access-Control-Allow-Origin": "https://yourdomain.com", // Not "*"
   };
   ```

2. **Use HTTPS**: Required for iOS home screen apps

3. **Rate Limiting**: Add to proxy to prevent abuse

4. **Environment Variables**: Don't commit API keys
   ```bash
   # In wrangler.toml
   [vars]
   API_KEY = "your-key"
   ```

## 📱 iOS Home Screen App

Users can install the web version as a PWA:

1. Open in Safari
2. Tap Share button (⬆️)
3. Tap "Add to Home Screen"
4. App icon appears on home screen
5. Opens in fullscreen mode (looks like native app!)

## 🛠️ Troubleshooting

### "Failed to fetch grades"

1. Check if proxy is deployed: open your worker URL in browser - should show "OK" or error
2. Verify proxy URL in `shared/config.js` matches your worker URL
3. Check browser console (F12) for CORS errors

### Extension not loading

1. Run `npm run build:extension` to copy latest shared files
2. Reload extension in browser (chrome://extensions → reload)

### Local testing

- For web: `npm run dev:proxy` then `npm run dev:web`
- Set `proxyUrl` to `http://localhost:8787` in config.js for local testing

## 🚧 Comparison: Extension vs Web

| Feature          | Browser Extension       | Web Version                 |
| ---------------- | ----------------------- | --------------------------- |
| **Platform**     | Desktop only            | All (iOS, Android, Desktop) |
| **CORS Bypass**  | `declarativeNetRequest` | Proxy required              |
| **Installation** | Manual or store         | Just open URL               |
| **Updates**      | Manual                  | Automatic                   |
| **Offline**      | ❌                      | ❌ (could add PWA)          |
| **Native Feel**  | ✅                      | ✅ (on iOS home screen)     |

## 📈 Roadmap

- [ ] Add PWA manifest for offline support
- [ ] Implement caching for faster load times
- [ ] Add data export (CSV, PDF)
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Grade prediction/simulation
- [ ] Push notifications for new grades (PWA)

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both extension and web versions
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- ClasseViva API by Spaggiari
- Cloudflare Workers for free proxy hosting
- Community contributors

## 📞 Support

- Issues: [GitHub Issues](https://github.com/LucaCraft89/StudentIntrest/issues)
- Email: [your-email]
- Discord: [your-discord] (optional)

---

**Note:** This project is not affiliated with or endorsed by Spaggiari Group.
