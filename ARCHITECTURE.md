# 🏗️ Project Architecture & Workflow

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (Client)                      │
│                   http://localhost:3000                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React Component (page.tsx)                          │   │
│  │  - Display todos list                               │   │
│  │  - Form for adding/editing todos                    │   │
│  │  - Show statistics (completed, overdue)             │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────────────┘
                   │ API Calls (JSON)
                   │
┌──────────────────▼──────────────────────────────────────────┐
│                 Next.js Server (Node.js)                    │
│              Running on http://localhost:3000               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  API Routes (app/api/todos/)                         │   │
│  │  ├─ GET /api/todos         → List all todos        │   │
│  │  ├─ POST /api/todos        → Create new todo       │   │
│  │  ├─ PATCH /api/todos/[id]  → Update todo           │   │
│  │  └─ DELETE /api/todos/[id] → Delete todo           │   │
│  └──────────────────────────────────────────────────────┘   │
│                        │                                     │
│  ┌──────────────────────▼──────────────────────────────┐   │
│  │  Prisma Client (ORM)                                │   │
│  │  - Validates data                                   │   │
│  │  - Generates TypeScript types                       │   │
│  │  - Manages database connections                     │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────────────┘
                   │ SQL Queries
                   │
┌──────────────────▼──────────────────────────────────────────┐
│              Database (SQLite or PostgreSQL)                │
│                    dev.db or todo_db                        │
│         ┌─────────────────────────────┐                    │
│         │     todos table             │                    │
│         ├─────────────────────────────┤                    │
│         │ id    Int (PK)              │                    │
│         │ title String                │                    │
│         │ description String          │                    │
│         │ completed Boolean           │                    │
│         │ priority String             │                    │
│         │ dueDate DateTime            │                    │
│         │ tags String                 │                    │
│         │ createdAt DateTime          │                    │
│         │ updatedAt DateTime          │                    │
│         └─────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Creating a Todo

```
1. User fills form (title, description, etc.)
   ↓
2. Frontend sends POST request to /api/todos
   {
     title: "Buy groceries",
     description: "Milk, eggs, bread",
     priority: "HIGH",
     dueDate: "2026-04-15",
     tags: ["shopping"]
   }
   ↓
3. Next.js API receives request (route.ts POST handler)
   ↓
4. Validates data (title is required)
   ↓
5. Prisma creates record in database
   ↓
6. Database returns new todo with ID
   ↓
7. API responds with JSON response
   ↓
8. Frontend updates component state
   ↓
9. Component re-renders, new todo appears in list
```

---

## Data Flow: Fetching Todos

```
1. Page loads (page.tsx useEffect)
   ↓
2. Frontend sends GET request to /api/todos
   ↓
3. Next.js API receives request (route.ts GET handler)
   ↓
4. Prisma queries database
   ↓
5. Database returns all todos sorted by:
   - completed status (false first)
   - dueDate (earliest first)
   - createdAt (newest first)
   ↓
6. API responds with JSON array of todos
   ↓
7. Frontend state updates with todos
   ↓
8. Component renders all todos as cards
```

---

## File Dependencies

```
page.tsx
├── uses → /api/todos (GET) → Prisma → Database
├── uses → /api/todos (POST) → Prisma → Database
├── uses → /api/todos/[id] (PATCH) → Prisma → Database
└── uses → /api/todos/[id] (DELETE) → Prisma → Database

route.ts (app/api/todos/)
├── imports → @/lib/prisma → Prisma Client
└── queries → Todo model → Database (SQLite/PostgreSQL)

schema.prisma
└── defines → Todo model with 8 fields
    └── creates → dev.db (SQLite) or remote DB (PostgreSQL)

lib/prisma.ts
└── exports → Prisma Client singleton instance
    └── prevents → connection pool exhaustion

layout.tsx & globals.css
└── provides → styling and page structure
```

---

## Environment Variables

```
.env (Development)
├── DATABASE_URL → Points to local dev.db (SQLite)
└── Keep SECRET! (in .gitignore)

.env.example (Reference)
├── Shows example values
├── Safe to commit
└── Help new developers
```

---

## Command Flow

```
npm install
    ↓ (installs all packages)
    ↓
npm run prepare
    ↓ (runs: prisma generate)
    ├─→ Reads schema.prisma
    ├─→ Generates Prisma Client types
    └─→ Creates node_modules/.prisma/client

npm run db:push
    ├─→ Compares schema.prisma with database
    ├─→ Creates/alters tables if needed
    ├─→ Creates dev.db (if SQLite)
    └─→ Returns success/error

npm run dev
    ├─→ Starts Next.js dev server on port 3000
    ├─→ Hot reloads on file changes
    ├─→ Compiles TypeScript
    └─→ Makes API routes available
```

---

## Priority Levels

When creating/updating todos:

```
Priority = "LOW" | "MEDIUM" | "HIGH"

Example:
{
  title: "Review code",
  priority: "HIGH"        ✓ Correct
  priority: "URGENT"      ✗ Invalid (only 3 options)
  priority: "high"        ✗ Invalid (case-sensitive)
}
```

---

## Tags Format

Tags are stored as comma-separated string:

```
Frontend sends: ["react", "typescript", "bug"]
    ↓
     Gets converted: "react,typescript,bug"
    ↓
Stored in DB as string

When retrieved:
    ↓
Split back to array for display: ["react", "typescript", "bug"]
```

---

## Error Handling

### API Errors Handled:

1. **Invalid ID format**
   - Status: 400
   - Message: "Invalid todo id."

2. **Missing title**
   - Status: 400
   - Message: "Title is required and must be a string."

3. **Todo not found**
   - Status: 400+ (Prisma error)
   - Message: Prisma error details

4. **Database connection error**
   - Check DATABASE_URL
   - Verify database is running
   - Check credentials

---

## Index Strategy

The Todo model includes indexes for better query performance:

```prisma
@@index([completed])      # Fast filtering by completion status
@@index([dueDate])        # Fast sorting by due date
@@index([priority])       # Fast filtering by priority
```

---

See **SETUP_GUIDE.md** for detailed setup instructions and **QUICKSTART.md** for rapid onboarding.
