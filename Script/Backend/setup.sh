#!/bin/bash

echo "🚀 Setting up Game Hub Backend (TypeScript + SQL + Prisma)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update .env with your DATABASE_URL"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your DATABASE_URL (PostgreSQL)"
echo "2. Create database: psql -U postgres then CREATE DATABASE game_hub;"
echo "3. Run: npx prisma db push"
echo "4. Run: npm run dev"
echo ""
