# Game Hub Backend - TypeScript + SQL + Prisma

A modern REST API backend for Game Hub, built with TypeScript, Prisma ORM, and SQL database support.

## 🚀 Features

- ✅ **TypeScript** - Full type safety
- ✅ **Prisma ORM** - Type-safe database client with auto-generated types
- ✅ **PostgreSQL** - Primary database (MySQL also supported)
- ✅ **RESTful API** - Clean REST architecture
- ✅ **Authentication** - JWT-based auth with bcrypt
- ✅ **File Uploads** - Game files and cover images
- ✅ **Prisma Migrate** - Database schema management
- ✅ **Prisma Studio** - Visual database browser

## 📁 Project Structure

```
Backend/
├── prisma/
│   └── schema.prisma    # Prisma schema definition
├── src/
│   ├── config/          # Prisma client configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Multer upload, etc.
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   └── server.ts        # Main entry point
├── dist/                # Compiled JavaScript (auto-generated)
├── package.json
├── tsconfig.json
└── .env                 # Environment variables
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd Script/Backend
npm install
```

### 2. Database Setup

**For PostgreSQL (Default):**
```sql
CREATE DATABASE game_hub;
```

**For MySQL (Optional):**
```sql
CREATE DATABASE game_hub;
```
Note: Change `provider = "postgresql"` to `provider = "mysql"` in `prisma/schema.prisma`

### 3. Configure Environment

Create a `.env` file in `Script/Backend`:

```env
# Server
PORT=3000
NODE_ENV=development

# Database (PostgreSQL - Default)
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/game_hub"

# OR Database (MySQL - change provider in schema.prisma)
# DATABASE_URL="mysql://root:yourpassword@localhost:3306/game_hub"

# JWT Secret
JWT_SECRET=a3f8d9c2e1b4f6a9c8d7e3f1a9b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0

# File Upload
MAX_FILE_SIZE=524288000
```

### 4. Run Prisma Migrations

Generate Prisma Client and create database tables:

```bash
npx prisma generate
npx prisma db push
```

Or use migrations for production:

```bash
npx prisma migrate dev --name init
```

### 5. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

## 📡 API Endpoints

### Authentication
- `POST /register` - Register new user
- `POST /login` - Login user

### User Profile
- `GET /profile/:userId` - Get user profile
- `PUT /profile/:userId` - Update profile

### Games
- `POST /addGame` - Upload new game (multipart/form-data)
- `GET /games` - Get all games
- `GET /games/:gameId` - Get game by ID
- `GET /play/:gameId` - Serve game HTML

### Test
- `GET /test` - Server health check

## 🔄 Migration from Mo**Prisma**
4. **IDs**: MongoDB ObjectId → UUID
5. **Schema**: NoSQL documents → SQL tables with relations

### Data Migration Steps:

1. **Export MongoDB data:**
```bash
mongoexport --db=game-hub --collection=users --out=users.json
mongoexport --db=game-hub --collection=games --out=games.json
```

2. **Transform and import** (you'll need to write a migration script to convert ObjectIds to UUIDs and adjust structure)

## 🗄️ Prisma Schema

The database schema is defined in [prisma/schema.prisma](prisma/schema.prisma):

```prisma
model User {
  id             String   @id @default(uuid())
  username       String   @unique
  email          String   @unique
  password       String
  fullName       String?
  profilePicture String?
  bio            String?
  createdAt      DateTime @default(now())
  games          Game[]
}

model Game {
  id         String   @id @default(uuid())
  title      String
  shortDesc  String?
  fullDesc   String?
  gameType   String?
  tags       Json?
  coverImage String?
  gameFile   String?
  creatorId  String?
  creator    User?    @relation(fields: [creatorId], references: [id])
  createdAt  DateTime @default(now())
}
```

## 🔧 Prisma Commands

**Generate Prisma Client (after schema changes):**
```bash
npx prisma generate
```

**Push schema to database (dev):**
```bash
npx prisma db push
```

**Create and run migrations (production):**
```bash
npx prisma migrate dev --name your_migration_name
npx prisma migrate deploy
```

**Open Prisma Studio (visual database browser):**
```bash
npx prisma studio
```

**Reset database:**
```bash
npx prisma migrate reset
```

**View database schema:**
```bash
npx prisma db pull
```
Prisma automatically generates TypeScript types for your models
- Use `prisma db push` for rapid prototyping in development
- Use `prisma migrate` for production-ready versioned migrations
- Prisma Studio provides a visual interface at http://localhost:5555
```bash
npm run migration:revert
```

## 🧪 Testing
`DATABASE_URL` in `.env` file
- Ensure MySQL/PostgreSQL service is running
- Check database exists: `SHOW DATABASES;` (MySQL) or `\l` (PostgreSQL)

**Prisma Client not found:**
```bash
npx prisma generate
```

**Schema out of sync:**
```bash
npx prisma db push
```
curl http://localhost:3000/test
```

## 📝 Notes

- TypeORM automatically creates tables in development mode (`synchronize: true`)
- In production, use migrations instead of auto-sync
- JWT tokens expire in 7 days
- Max file upload size: 500MB (configurable in .env)
- Game files are extracted to `uploads/games/{game-name}/`

## 🐛 Troubleshooting

**Database connection error:**
- Verify database credentials in `.env`
- Ensure MySQL/PostgreSQL service is running
- Check database exists: `SHOW DATABASES;` (MySQL) or `\l` (PostgreSQL)

**TypeScript errors:**
```bash
npm run build
```

**Port already in use:**
- Change `PORT` in `.env` file
- Or kill process: `netstat -ano | findstr :3000` then `taskkill /PID <PID> /F`

## 📄 License

MIT
