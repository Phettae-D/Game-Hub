# Quick Start Guide - Prisma Backend

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
cd Script/Backend
npm install
```

### 2. Configure Database
Create `.env` file:
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/game_hub"
JWT_SECRET=a3f8d9c2e1b4f6a9c8d7e3f1a9b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0
```

### 3. Create Database
```bash
# PostgreSQL
psql -U postgres
CREATE DATABASE game_hub;
\q
```

### 4. Setup Prisma
```bash
# Generate Prisma Client
npx prisma generate

# Create tables
npx prisma db push

# (Optional) Seed demo data
npm run prisma:seed
```

### 5. Start Server
```bash
npm run dev
```

✅ Server running at http://localhost:3000

## 🎯 Test API

```bash
curl http://localhost:3000/test
```

## 📊 Open Prisma Studio (Database GUI)

```bash
npx prisma studio
```

Opens at http://localhost:5555

## 🔑 Key Prisma Commands

| Command | Description |
|---------|-------------|
| `npx prisma generate` | Generate Prisma Client after schema changes |
| `npx prisma db push` | Push schema changes to database (dev) |
| `npx prisma migrate dev` | Create migration (production-ready) |
| `npx prisma studio` | Open visual database browser |
| `npx prisma db pull` | Pull schema from existing database |

## 📝 Example: Change Schema

1. Edit `prisma/schema.prisma`
2. Run `npx prisma generate` 
3. Run `npx prisma db push`
4. Restart server

## 🔄 Switch Database Provider

**PostgreSQL → MySQL:**

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

2. Update `.env`:
```env
DATABASE_URL="mysql://root:password@localhost:3306/game_hub"
```

3. Run:
```bash
npx prisma generate
npx prisma db push
```

## 🐛 Common Issues

**"Prisma Client not generated"**
```bash
npx prisma generate
```

**"Can't reach database"**
- Check `DATABASE_URL` in `.env`
- Verify PostgreSQL service is running
- Test connection: `psql -U postgres`

**"Port 3000 already in use"**
- Change `PORT=3001` in `.env`
- Or: `netstat -ano | findstr :3000` → `taskkill /PID <pid> /F`

## 📚 Next Steps

- Read full [README.md](README.md)
- Explore API endpoints: `/register`, `/login`, `/games`
- Check out [Prisma Docs](https://www.prisma.io/docs)
