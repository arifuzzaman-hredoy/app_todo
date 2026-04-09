# 📝 Next.js Todo Application

A modern, fully-featured todo application built with **Next.js 16**, **React 19**, **Prisma 5**, and **TailwindCSS 4**. Supports both SQLite (default) and PostgreSQL databases.

## ✨ Features

- ✅ **Create todos** with title, description, priority, due date, and tags
- 📝 **Edit todos** - Update any field anytime
- ✓ **Toggle completion** - Mark todos as done/undone
- 🗑️ **Delete todos** - Remove tasks you no longer need
- 📊 **Dashboard stats** - See completed and overdue task counts
- 🎯 **Priority levels** - Organize by LOW, MEDIUM, HIGH priority
- 📅 **Due dates** - Never miss a deadline
- 🏷️ **Tags** - Categorize and find todos easily
- 🔄 **Smart sorting** - Todos sorted by status, due date, and creation time
- 🎨 **Responsive UI** - Beautiful design that works on all devices
- ⚡ **Fast & optimized** - Built with modern frameworks

## 🚀 Quick Start

### 5-Minute Setup

```bash
# 1. Install dependencies
npm install

# 2. Setup database
npm run prepare
npm run db:push

# 3. Start development server
npm run dev

# 4. Open browser
# Visit: http://localhost:3000
```

That's it! Your todo app is now running. 🎉

For detailed instructions, see **[QUICKSTART.md](./QUICKSTART.md)** (2 min read) or **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** (comprehensive guide).

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - 5-minute get-started guide
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup with all options
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design & data flow
- **[package.json](./package.json)** - Dependencies & scripts

## 🛠️ Available Commands

```bash
# Development
npm run dev              # Start dev server
npm run lint             # Check code quality

# Production
npm run build            # Optimize for production
npm start                # Run production server

# Database
npm run db:push          # Sync schema with database
npm run db:seed          # Run seed script (if available)
npm run prepare          # Generate Prisma Client
npm run prisma -- studio # Open Prisma Studio (SQL editor)
```

## 🗄️ Database Setup

### SQLite (Default)
```bash
npm run db:push
```
Creates `dev.db` in project root. Perfect for local development.

### PostgreSQL
1. Install PostgreSQL
2. Update `.env`:
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
```
3. Run `npm run db:push`

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed database instructions.

## 📁 Project Structure

```
app_todo/
├── app/
│   ├── api/todos/
│   │   ├── route.ts              # GET & POST endpoints
│   │   └── [id]/route.ts         # PATCH & DELETE endpoints
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Todo UI component
├── lib/
│   └── prisma.ts                # Prisma Client singleton
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── dev.db                   # SQLite database (auto-created)
├── public/                      # Static assets
├── .env                         # Environment variables
├── .env.example                 # Example environment
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── next.config.ts               # Next.js config
├── postcss.config.mjs           # PostCSS config
├── tailwind.config.js           # TailwindCSS config
├── eslint.config.mjs            # ESLint config
├── QUICKSTART.md                # Quick start guide
├── SETUP_GUIDE.md               # Comprehensive guide
├── ARCHITECTURE.md              # System architecture
└── README.md                    # This file
```

## 🌍 API Endpoints

All endpoints return JSON and handle full CRUD operations.

### GET - Fetch All Todos
```bash
curl http://localhost:3000/api/todos
```

### POST - Create New Todo
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "priority": "HIGH",
    "dueDate": "2026-04-15",
    "tags": ["shopping", "urgent"]
  }'
```

### PATCH - Update Todo
```bash
curl -X PATCH http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true,
    "priority": "MEDIUM"
  }'
```

### DELETE - Remove Todo
```bash
curl -X DELETE http://localhost:3000/api/todos/1
```

## 🔧 Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.2.3 | React framework |
| React | 19.2.4 | UI library |
| TypeScript | 5.7.2 | Type safety |
| Prisma | 5.21.0 | Database ORM |
| TailwindCSS | 4.0.0 | Styling |
| Node.js | 18+ | Runtime |
| SQLite/PostgreSQL | Latest | Database |

## 📊 Database Schema

```prisma
model Todo {
  id          Int       @id @default(autoincrement())
  title       String    @db.Text               # Required
  description String    @default("")           # Optional
  completed   Boolean   @default(false)         # Default: false
  priority    String    @default("MEDIUM")      # LOW|MEDIUM|HIGH
  dueDate     DateTime?                         # Optional date
  tags        String    @default("")            # Comma-separated
  createdAt   DateTime  @default(now())         # Auto timestamp
  updatedAt   DateTime  @updatedAt              # Auto timestamp
}
```

## 🎨 Frontend Usage

### Creating a Todo
1. Fill in the form fields
2. Select priority level
3. Choose a due date (optional)
4. Add tags (optional)
5. Click "Add Todo"

### Managing Todos
- **Edit**: Click the edit icon to modify fields
- **Complete**: Click checkbox to toggle completion
- **Delete**: Click trash icon to remove
- **View Stats**: Dashboard shows completion percentage and overdue count

## 🔐 Environment Variables

Create `.env` file (copy from `.env.example`):

```env
# For SQLite (default)
DATABASE_URL="file:./dev.db"

# For PostgreSQL, uncomment and update:
# DATABASE_URL="postgresql://user:password@localhost:5432/todo_db"
```

**⚠️ Important**: Never commit `.env` to Git. It's in `.gitignore` for security.

## 🐛 Troubleshooting

**Database not found?**
```bash
npm run db:push
```

**Prisma Client error?**
```bash
npm run prepare
```

**Port 3000 in use?**
```bash
npm run dev -- -p 3001
```

**Need fresh start?**
```bash
rm -rf node_modules .next
npm install
npm run prepare
npm run db:push
npm run dev
```

See [SETUP_GUIDE.md](./SETUP_GUIDE.md#-troubleshooting) for more solutions.

## 📖 Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Prisma Docs](https://www.prisma.io/docs)
- [TailwindCSS Docs](https://tailwindcss.com)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

## 🚀 Deployment

Ready to deploy? This app works on:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **Heroku**
- Any Node.js hosting

See [SETUP_GUIDE.md](./SETUP_GUIDE.md#-deployment) for deployment steps.

## 📄 License

This project is open source.

---

**Get started now!** 👉 [QUICKSTART.md](./QUICKSTART.md)

## Notes

This project uses the latest supported Next.js app router architecture and Prisma for database access. The database is stored locally in `dev.db` by default.
