<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Database (Prisma v6 + SQLite)

## Schema

Tables: User, Admin, Niche, Resource, Progress

Seed DB (744 resources, admin + demo user):
```
npx tsx seed.ts
```

Create migration:
```
npx prisma migrate dev --name <name>
```

Regenerate client:
```
npx prisma generate
```

Open Studio:
```
npx prisma studio
```

## API Routes

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/niches` | List all niches |
| GET | `/api/niches/[id]` | Get niche with resources |
| POST | `/api/niches` | Create niche |
| PUT | `/api/niches/[id]` | Update niche |
| DELETE | `/api/niches/[id]` | Delete niche |
| GET | `/api/resources` | List resources (filter by nicheId, category, level, search) |
| POST | `/api/resources` | Create resource |
| PUT | `/api/resources/[id]` | Update resource |
| DELETE | `/api/resources/[id]` | Delete resource |
| POST | `/api/auth/login` | Login (returns cookie) |
| POST | `/api/auth/logout` | Logout (clears cookies) |
| POST | `/api/users` | Register user |
| GET | `/api/progress/[userId]` | Get user progress |
| POST | `/api/progress/[userId]` | Toggle resource completion |

## Default Accounts

| Type | Username | Password |
|---|---|---|
| Admin | `admin` | `admin123` |
| User | `demo` | `demo123` |
