#!/bin/bash

# Simple test script for Docker deployment

set -e

echo "🧪 Testing CVV Calculator Docker Setup"
echo "======================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi
echo "✅ Docker is running"

# Check if docker compose is available
if ! command -v docker compose &> /dev/null; then
    echo "❌ docker compose not found. Please install it."
    exit 1
fi
echo "✅ docker compose is available"

# Check for .env file
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file"
else
    echo "✅ .env file exists"
fi

# Build and start services
echo ""
echo "🔨 Building Docker images..."
docker compose build

echo ""
echo "🚀 Starting services..."
docker compose up -d

# Wait for services to be healthy
echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check proxy health
echo ""
echo "🔍 Checking proxy health..."
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Proxy is healthy"
else
    echo "❌ Proxy health check failed"
    docker compose logs proxy
    exit 1
fi

# Check web health
echo ""
echo "🔍 Checking web service..."
if curl -f http://localhost:8080/health > /dev/null 2>&1; then
    echo "✅ Web service is healthy"
else
    echo "❌ Web health check failed"
    docker compose logs web
    exit 1
fi

# Show status
echo ""
echo "📊 Service Status:"
docker compose ps

echo ""
echo "✅ All tests passed!"
echo ""
echo "🎉 Your CVV Calculator is running!"
echo ""
echo "📱 Access points:"
echo "   - Web App: http://localhost:8080"
echo "   - Proxy API: http://localhost:3000"
echo ""
echo "📝 Useful commands:"
echo "   - View logs: docker compose logs -f"
echo "   - Stop services: docker compose down"
echo "   - Restart: docker compose restart"
echo ""
echo "🔧 Next steps:"
echo "   1. Update shared/config.js with your proxy URL"
echo "   2. Test the login at http://localhost:8080"
echo "   3. See DOCKER.md for production deployment"
