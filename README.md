# CVV Average Calculator

Calculate your ClasseViva grade averages on **any platform**: Chrome extension, iOS web app, or Android.

[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](./DOCKER.md)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange?logo=cloudflare)](./proxy/README.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

> Spin-off of https://github.com/LucaCraft89/CVVSimpleAvgrage/ - Now with iOS support, Docker deployment, and more!

## 🚀 Quick Start

Choose your deployment method:

### 🐳 Docker (Self-Hosted) - Recommended for Production

```bash
cp .env.example .env
docker-compose up -d
# Access at http://localhost:8080
```

**[→ Full Docker Guide](DOCKER.md)**

### ☁️ Cloudflare Workers (Serverless) - Free & Fast

```bash
npm install -g wrangler
wrangler login
cd proxy && wrangler deploy
# Deploy web to GitHub Pages
```

**[→ Quick Start Guide](QUICKSTART.md)**

---

## 📖 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get running in 5 minutes
- **[DOCKER.md](DOCKER.md)** - Docker deployment, scaling & production
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Compare deployment options
- **[proxy/README.md](proxy/README.md)** - Proxy configuration

---

## ✨ Features

- ✅ **100% Client-Side** - Your data stays private
- ✅ **Cross-Platform** - Browser extension + Web app (iOS compatible)
- ✅ **Docker Ready** - One command deployment with scaling
- ✅ **Scalable** - From personal use to organization-wide
- ✅ **Free Options** - Cloudflare Workers or self-hosted
- ✅ **Real-time Calculations** - See what grade you need for 6.0

---

## 📁 Project Structure

```
├── browser-extension/   # Chrome/Firefox extension
├── shared/             # Shared code (API, logic, UI)
├── web/                # Website (iOS compatible)
├── proxy/              # CORS proxy (Node.js + Cloudflare Workers)
├── docker-compose.yml  # Docker orchestration
└── Dockerfiles         # Container definitions
```

---

## 🐳 Docker Deployment

```bash
# Quick start
docker-compose up -d

# With custom ports
PROXY_PORT=3001 WEB_PORT=8081 docker-compose up -d

# Scale proxy for high traffic
docker-compose up -d --scale proxy=3

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

See **[DOCKER.md](DOCKER.md)** for production setup, SSL, monitoring, and more.

---

## 📱 iOS Support

Works perfectly on iOS Safari! Can be added to home screen as a PWA:

1. Open website in Safari
2. Tap Share → "Add to Home Screen"
3. Works like a native app!

---

## 🎯 Use Cases

### Personal Use

Deploy on Cloudflare Workers (free) or Docker locally

### School/Class

Docker on shared server - scalable to hundreds of students

### Organization

Docker with Kubernetes - auto-scaling, custom domain

---

## 🚀 Test It Out

```bash
# Run automated tests
./test-docker.sh

# Or manually
docker-compose up -d
curl http://localhost:3000/health
curl http://localhost:8080/health
```

---

## 🔧 Development

```bash
# Local development
npm run dev:proxy-node  # Node.js proxy
npm run dev:web         # Web server

# Docker development
docker-compose up       # Watch logs

# Build extension
npm run build:extension
```

---

## 📊 Deployment Options

| Method                 | Cost     | Setup Time | Best For                    |
| ---------------------- | -------- | ---------- | --------------------------- |
| **Docker**             | $5-20/mo | 5 min      | Production, Full control    |
| **Cloudflare Workers** | FREE     | 2 min      | Quick start, No maintenance |

**[→ Full Comparison](DEPLOYMENT.md)**

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Test Docker deployment: `./test-docker.sh`
4. Submit pull request

---

## 📄 License

MIT License - see [LICENSE](LICENSE)

---

**Note:** Not affiliated with or endorsed by Spaggiari Group.
