Prisma setup and quick steps

1. Ensure you have a PostgreSQL database and set `DATABASE_URL` in `.env`:

   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

2. From `Script/DataBase` install dependencies:

```bash
npm install
# or to install only prisma tooling
npx prisma -v
```

3. Generate client and create initial migration:

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma studio    # optional: open Prisma Studio
```

Notes:
- The schema is at `prisma/schema.prisma` and maps the `users` and `games` tables.
- This project previously used MongoDB; adding Prisma requires a Postgres database.
