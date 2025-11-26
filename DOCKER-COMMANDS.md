# Docker Compose Quick Reference

## Basic Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Rebuild and restart
docker-compose up -d --build

# Scale proxy (3 instances)
docker-compose up -d --scale proxy=3
```

## Status & Monitoring

```bash
# Check status
docker-compose ps

# Check resource usage
docker stats cvv-proxy cvv-web

# Follow specific service logs
docker-compose logs -f proxy
docker-compose logs -f web

# Last 50 lines
docker-compose logs --tail=50
```

## Health Checks

```bash
# Check proxy
curl http://localhost:3000/health

# Check web
curl http://localhost:8080/health

# Full test
./test-docker.sh
```

## Troubleshooting

```bash
# View all logs
docker-compose logs

# Restart specific service
docker-compose restart proxy

# Rebuild specific service
docker-compose up -d --build proxy

# Stop and remove everything
docker-compose down -v

# Clean start
docker-compose down
docker-compose up -d --build
```

## Development

```bash
# Start with live logs
docker-compose up

# Start in background
docker-compose up -d

# Stop without removing
docker-compose stop

# Resume stopped services
docker-compose start
```

## Production

```bash
# Production with nginx reverse proxy
docker-compose --profile with-proxy up -d

# Update and restart (zero downtime)
docker-compose pull
docker-compose up -d

# Backup volumes
docker run --rm -v cvv-data:/data -v $(pwd):/backup alpine tar czf /backup/backup.tar.gz /data
```

## Configuration

```bash
# Edit environment
nano .env

# Apply changes
docker-compose down
docker-compose up -d

# View current config
docker-compose config
```

## Cleanup

```bash
# Stop and remove containers
docker-compose down

# Remove images too
docker-compose down --rmi all

# Remove everything including volumes
docker-compose down -v --rmi all

# Clean Docker system
docker system prune -a
```

## Custom Port Usage

```bash
# Use custom ports
PROXY_PORT=3001 WEB_PORT=8081 docker-compose up -d

# Or edit .env file
echo "PROXY_PORT=3001" >> .env
echo "WEB_PORT=8081" >> .env
docker-compose up -d
```
