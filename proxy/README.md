# Spaggiari API Proxy

This is a simple CORS proxy for the Spaggiari API, allowing the web version to work on iOS and other platforms.

## Why do we need this?

Browser extensions can bypass CORS restrictions using `declarativeNetRequest`, but regular websites cannot. This lightweight proxy:

- Adds required headers (User-Agent, API Key)
- Enables CORS for browser requests
- Nothing more, nothing less

## Deployment (Choose ONE)

### ⭐ Cloudflare Workers (Recommended)

**Why Cloudflare Workers?**

- 100% FREE (100,000 requests/day)
- No server to maintain
- Global edge network (super fast)
- Deploy in 2 minutes

**Setup:**

1. **Install Wrangler CLI**

   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare** (creates account if needed)

   ```bash
   wrangler login
   ```

3. **Deploy**

   ```bash
   cd proxy
   wrangler deploy
   ```

4. **Copy your worker URL**
   - Output will show: `https://spaggiari-proxy.your-username.workers.dev`
   - Update this URL in `/shared/config.js`

**Test locally first:**

```bash
cd proxy
wrangler dev
# Opens at http://localhost:8787
```

---

### 🔧 Self-Hosted (If you really want control)

Only if you need to self-host or Cloudflare doesn't work for you.

**Simple Node.js proxy:**

```javascript
// server.js
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_BASE = "https://web.spaggiari.eu/rest/v1";
const API_KEY = "Tg1NWEwNGIgIC0K";

app.all("*", async (req, res) => {
  try {
    const response = await fetch(`${API_BASE}${req.path}`, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "Z-Dev-ApiKey": API_KEY,
        "User-Agent": "CVVS/std/4.1.7 Android/10",
        ...(req.headers["z-auth-token"] && {
          "Z-Auth-Token": req.headers["z-auth-token"],
        }),
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);
```

**Deploy to:**

- Railway.app (free tier, easy)
- Render.com (free tier)
- Your own VPS

## Security for Production

Change CORS in `worker.js`:

```javascript
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://yourdomain.com", // Change from "*"
  // ... rest
};
```
