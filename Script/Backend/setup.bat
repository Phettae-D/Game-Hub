@echo off
echo 🚀 Setting up Game Hub Backend (TypeScript + SQL + Prisma)
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    copy .env.example .env
    echo ⚠️  Please update .env with your database credentials
) else (
    echo ✅ .env file already exists
)

echo.
echo ✅ Setup complete!
echo.
echo Next steps:
echo 1. Update .env with your DATABASE_URL (PostgreSQL)
echo 2. Create database: psql -U postgres then CREATE DATABASE game_hub;
echo 3. Run: npx prisma db push
echo 4. Run: npm run dev
echo.
pause
