# Web Version

This is the website version that works on iOS, Android, and all browsers.

## Features

- ✅ Works on iOS Safari (no extension support needed)
- ✅ Can be added to iOS home screen as PWA
- ✅ Same functionality as browser extension
- ✅ Responsive design for all devices
- ✅ Uses proxy to bypass CORS restrictions

## Setup

1. **Deploy the proxy** (see `/proxy/README.md`)

   - Cloudflare Workers (recommended - free)
   - Vercel/Netlify serverless functions
   - Self-hosted backend

2. **Update proxy URL**

   - Edit `/shared/config.js`
   - Change `proxyUrl` to your deployed proxy URL

3. **Deploy the website**
   - Option 1: GitHub Pages (free, static hosting)
   - Option 2: Netlify (free, automatic deploys)
   - Option 3: Vercel (free, automatic deploys)
   - Option 4: Any static hosting service

## Deployment

### GitHub Pages

1. Push your code to GitHub
2. Go to Settings > Pages
3. Select branch and `/web` folder
4. Your site will be at `https://yourusername.github.io/StudentIntrest/`

### Netlify

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Run: `netlify deploy --dir=web --prod`
3. Or connect your GitHub repo for automatic deploys

### Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel --prod`
3. Set root directory to `web/`

## Local Testing

```bash
# Simple Python server
cd web
python3 -m http.server 8000

# Or Node.js
npx serve .
```

Then open http://localhost:8000

**Note:** Make sure your proxy is running locally or use a deployed proxy URL.

## iOS Home Screen App

Users can add this to their iOS home screen:

1. Open in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. The app will look and feel like a native app!

## Security Notes

For production:

1. Use HTTPS (required for iOS home screen apps)
2. Update CORS settings in proxy to allow only your domain
3. Consider adding authentication/rate limiting to proxy
4. Don't commit API keys (use environment variables in proxy)
