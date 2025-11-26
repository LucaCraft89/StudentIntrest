# Docker Deployment Guide

Run the CVV Average Calculator in Docker containers for easy deployment and scalability.

## Quick Start

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Start everything
docker compose up -d

# 3. Access the app
# Web: http://localhost:8080
# Proxy API: http://localhost:3000
```

Done! The app is running.

## What's Included

**Two services:**

- `proxy` - Node.js CORS proxy (port 3000)
- `web` - Nginx serving the web app (port 8080)

**Optional:**

- `nginx` - Reverse proxy to serve everything on one domain (port 80)

## Configuration

Edit `.env` file:

```bash
# Ports
PROXY_PORT=3000    # Proxy API port
WEB_PORT=8080      # Web app port
NGINX_PORT=80      # Reverse proxy port (optional)

# Security
API_KEY=Tg1NWEwNGIgIC0K
CORS_ORIGIN=*      # Change to your domain in production
```

## Usage

### Basic Commands

```bash
# Start services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down

# Rebuild after changes
docker compose up -d --build

# Check status
docker compose ps
```

### With Reverse Proxy (Optional)

If you want everything on one domain (web + API):

```bash
# Start with nginx reverse proxy
docker compose --profile with-proxy up -d

# Now access:
# - Web app: http://localhost/
# - API: http://localhost/api/
```

Update `shared/config.js`:

```javascript
const ENV = {
  isExtension:
    typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.id,
  proxyUrl: window.location.origin + "/api", // Uses same domain
};
```

## Production Deployment

### 1. Update Configuration

```bash
# .env
CORS_ORIGIN=https://yourdomain.com
NGINX_PORT=80
```

### 2. Add SSL (Recommended)

Use Caddy (automatic HTTPS):

```yaml
# docker compose.prod.yml
services:
  caddy:
    image: caddy:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - web
      - proxy

volumes:
  caddy_data:
  caddy_config:
```

```Caddyfile
# Caddyfile
yourdomain.com {
    reverse_proxy /api/* proxy:3000
    reverse_proxy /* web:80
}
```

### 3. Deploy

```bash
docker compose -f docker compose.yml -f docker compose.prod.yml up -d
```

## Scaling

### Scale proxy for high traffic:

```bash
# Run 3 proxy instances
docker compose up -d --scale proxy=3

# Nginx will load balance automatically
```

### Use orchestration (Kubernetes):

```bash
# Build images
docker compose build

# Push to registry
docker tag cvv-proxy:latest registry.example.com/cvv-proxy:latest
docker push registry.example.com/cvv-proxy:latest

# Deploy to k8s
kubectl apply -f k8s/
```

## Resource Limits

Add to `docker compose.yml`:

```yaml
services:
  proxy:
    # ... existing config
    deploy:
      resources:
        limits:
          cpus: "0.5"
          memory: 256M
        reservations:
          cpus: "0.25"
          memory: 128M
```

## Monitoring

### Health Checks

Both services have built-in health checks:

```bash
# Check health
curl http://localhost:3000/health  # Proxy
curl http://localhost:8080/health  # Web
```

### Logs

```bash
# All logs
docker compose logs -f

# Specific service
docker compose logs -f proxy
docker compose logs -f web

# Last 100 lines
docker compose logs --tail=100
```

### Docker Stats

```bash
docker stats cvv-proxy cvv-web
```

## Troubleshooting

### Services won't start

```bash
# Check logs
docker compose logs

# Rebuild
docker compose down
docker compose up -d --build
```

### Port already in use

```bash
# Change ports in .env
PROXY_PORT=3001
WEB_PORT=8081
```

### CORS errors

1. Check `CORS_ORIGIN` in `.env`
2. Restart: `docker compose restart proxy`
3. Verify in logs: `docker compose logs proxy`

### Can't connect to proxy from web

```bash
# Make sure proxy URL is correct
# If using docker compose, use service name:
# http://proxy:3000 (internal)
# http://localhost:3000 (external)
```

## Development

### Local development with hot reload:

```bash
# Proxy with auto-reload
cd proxy
npm install
npm run dev

# Web with live server
cd web
python3 -m http.server 8080
```

### Make changes and rebuild:

```bash
# Edit files, then:
docker compose up -d --build
```

## Deployment Platforms

### DigitalOcean App Platform

```yaml
# .do/app.yaml
name: cvv-calculator
services:
  - name: proxy
    github:
      repo: LucaCraft89/StudentIntrest
      branch: main
      deploy_on_push: true
    dockerfile_path: proxy/Dockerfile
    http_port: 3000

  - name: web
    github:
      repo: LucaCraft89/StudentIntrest
      branch: main
      deploy_on_push: true
    dockerfile_path: web/Dockerfile
    http_port: 80
```

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Fly.io

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Deploy proxy
cd proxy
fly launch

# Deploy web
cd ../web
fly launch
```

## Performance Tips

1. **Enable caching in nginx** (already configured)
2. **Use CDN** for static files
3. **Scale proxy horizontally** for high traffic
4. **Add Redis** for rate limiting (if needed)
5. **Use production Node.js image** (already using alpine)

## Security Checklist

- [ ] Change `CORS_ORIGIN` from `*` to your domain
- [ ] Use HTTPS in production
- [ ] Set up rate limiting (nginx or proxy level)
- [ ] Use environment variables for sensitive data
- [ ] Regular security updates: `docker compose pull && docker compose up -d`
- [ ] Monitor logs for suspicious activity

## Clean Up

```bash
# Stop and remove containers
docker compose down

# Remove images
docker compose down --rmi all

# Remove volumes (careful!)
docker compose down -v
```
