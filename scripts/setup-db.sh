#!/bin/bash

# Database setup script for Real Estate Map API

echo "🚀 Starting PostgreSQL database setup..."

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install Docker Desktop."
    exit 1
fi

# Start PostgreSQL
echo "🐘 Starting PostgreSQL container..."
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Run Prisma migrations
echo "🔄 Running Prisma migrations..."
npm run prisma:migrate

# Generate Prisma client
echo "📦 Generating Prisma client..."
npm run prisma:generate

echo "✅ Database setup complete!"
echo "📊 View database: npm run prisma:studio"
