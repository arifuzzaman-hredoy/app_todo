# Todo App - Complete Setup Guide

This is a modern Next.js 16 todo application with a Prisma database backend. Follow these steps to get it running.

---

## ✅ Prerequisites

Before starting, ensure you have installed:
- **Node.js** v18+ (LTS recommended) - [Download](https://nodejs.org/)
- **npm** v9+ (or yarn/pnpm)
- **Git** (optional, for version control)

Check versions:
```bash
node --version
npm --version
```

---

## 📋 Step 1: Install Dependencies

Navigate to the project directory and install all packages:

```bash
cd app_todo
npm install
```

This will install:
- **Next.js 16.2.3** - React framework
- **React 19.2.4** - UI library
- **Prisma 5.21.0** - Database ORM
- **TypeScript 5.7.2** - Type safety
- **TailwindCSS 4** - Styling
- **ESLint 9** - Code linting

---

## 🗄️ Step 2: Database Setup

### Option A: SQLite (Default - Recommended for Development)

**This is the default setup. The database file will be created automatically.**

1. **Generate Prisma Client:**
```bash
npm run prepare
```

2. **Create/Sync Database:**
```bash
npm run db:push
```

This will:
- Create `dev.db` in the project root
- Set up the Todo table with all fields
- Generate the Prisma Client

**Verify the database was created:**
- Check for `dev.db` file in the project root
- Or check `prisma/dev.db`

### Option B: PostgreSQL (Production)

If you want to use PostgreSQL:

1. **Install PostgreSQL** - [Download](https://www.postgresql.org/download/)

2. **Create a database:**
```bash
# Using psql
psql -U postgres
CREATE DATABASE todo_db;
\q
```

3. **Update `.env` file:**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/todo_db"
```

Replace:
- `username` - your PostgreSQL username (usually `postgres`)
- `password` - your PostgreSQL password
- `localhost:5432` - your PostgreSQL host and port
- `todo_db` - your database name

4. **Sync schema and create database:**
```bash
npm run db:push
```

---

## 📝 Database Schema

The Todo model includes:

```prisma
model Todo {
  id          Int       # Unique identifier
  title       String    # Todo title (required)
  description String    # Detailed description
  completed   Boolean   # Completion status (default: false)
  priority    String    # Priority level: "LOW", "MEDIUM", "HIGH"
  dueDate     DateTime  # Due date (optional)
  tags        String    # Comma-separated tags
  createdAt   DateTime  # Creation timestamp
  updatedAt   DateTime  # Last update timestamp
}
```

---

## 🚀 Step 3: Start Development Server

```bash
npm run dev
```

This starts the development server at **http://localhost:3000**

You should see:
```
▲ Next.js 16.2.3
✓ ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

Open your browser and navigate to: **http://localhost:3000**

---

## 📱 Using the Todo App

### Features:
- ✅ Create new todos with title, description, priority, and due date
- 📝 Add tags to organize todos
- ✏️ Edit existing todos
- ✓ Mark todos as complete/incomplete
- 🗑️ Delete todos
- 📊 View statistics (completed, overdue)
- 🎨 Clean, responsive UI

### How to Use:
1. **Add a Todo**: Fill in the form at the top and click "Add Todo"
2. **Edit**: Click the edit icon on any todo card
3. **Complete**: Click the checkbox to mark as done
4. **Delete**: Click the delete icon
5. **Filter**: Todos are sorted by completion status and due date

---

## 🛠️ Available Commands

```bash
# Development
npm run dev          # Start dev server on http://localhost:3000

# Production
npm run build        # Build for production
npm start            # Start production server

# Database
npm run db:push      # Sync Prisma schema to database
npm run db:seed      # Run seed script (if created)
npm run prepare      # Generate Prisma Client

# Prisma
npm run prisma       # Run Prisma CLI directly
# Example: npm run prisma -- studio (opens Prisma Studio)

# Linting
npm run lint         # Check code quality with ESLint
```

---

## 🔧 Project Structure

```
app_todo/
├── app/
│   ├── api/
│   │   └── todos/
│   │       ├── route.ts          # GET all, POST new
│   │       └── [id]/
│   │           └── route.ts      # PATCH update, DELETE
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Todo page (frontend)
│   └── favicon.ico
├── lib/
│   └── prisma.ts                 # Prisma Client instance
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── dev.db                    # SQLite database (created after db:push)
├── public/                       # Static files
├── .env                         # Environment variables (KEEP SECRET)
├── .env.example                 # Example env file
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── next.config.ts               # Next.js config
├── tailwind.config.js           # Tailwind config
├── eslint.config.mjs            # ESLint config
└── README.md                    # Project readme
```

---

## 🌍 API Endpoints

### GET All Todos
```bash
curl http://localhost:3000/api/todos
```

### Create Todo
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

### Update Todo
```bash
curl -X PATCH http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true,
    "description": "Updated description"
  }'
```

### Delete Todo
```bash
curl -X DELETE http://localhost:3000/api/todos/1
```

---

## 📊 Prisma Studio

View and manage your database visually:

```bash
npm run prisma -- studio
```

This opens Prisma Studio at **http://localhost:5555**

---

## 🐛 Troubleshooting

### Issue: Database not found
**Solution:**
```bash
npm run db:push
```

### Issue: Prisma Client not generated
**Solution:**
```bash
npm run prepare
```

### Issue: Port 3000 already in use
**Solution:**
```bash
npm run dev -- -p 3001
# Or find and kill the process using port 3000
```

### Issue: Slow performance on first run
**Solution:** This is normal. Next.js compiles your code on first run. Subsequent runs are faster.

### Issue: PostgreSQL connection error
**Solution:** Verify your `DATABASE_URL` in `.env`:
- PostgreSQL is running
- Credentials are correct
- Database exists
- Format is: `postgresql://[user]:[password]@[host]:[port]/[database]`

### Issue: ESLint errors
**Solution:**
```bash
npm run lint  # See all errors
```

---

## 🔐 Environment Variables

**NEVER commit `.env` to Git!**

Create a `.env` file in the root (copy from `.env.example`):

```env
# SQLite
DATABASE_URL="file:./dev.db"

# OR PostgreSQL
# DATABASE_URL="postgresql://user:password@localhost:5432/todo_db"
```

The `.gitignore` already includes `.env` to prevent accidental commits.

---

## 📦 Building for Production

```bash
# Build
npm run build

# Start production server
npm start
```

Then access at **http://localhost:3000**

---

## 🚀 Deployment

### Vercel (Recommended for Next.js)
1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Set environment variables
5. Deploy!

### Other Platforms
Ensure your hosting supports Node.js and the database you're using.

---

## 📚 Technology Stack

- **Frontend**: React 19, Next.js 16, TailwindCSS 4
- **Backend**: Next.js API Routes, Node.js
- **Database**: SQLite (default) or PostgreSQL
- **ORM**: Prisma 5
- **Language**: TypeScript 5
- **Dev Tools**: ESLint 9, VSCode

---

## ✨ Tips & Best Practices

1. **Always run `npm install` after pulling changes** - dependencies may have updated
2. **Use Prisma Studio** - `npm run prisma -- studio` for database debugging
3. **Check `.env.example`** - if you're missing environment variables
4. **Read the API code** - `app/api/todos/` for implementation details
5. **TypeScript types** - Use them! Check `app/page.tsx` for examples

---

## ❓ Need Help?

- Check [Next.js Docs](https://nextjs.org/docs)
- Check [Prisma Docs](https://www.prisma.io/docs)
- Check [React Docs](https://react.dev)
- Check [TailwindCSS Docs](https://tailwindcss.com/docs)

---

## 📄 License

This project is open source.

---

**Happy coding! 🎉**
