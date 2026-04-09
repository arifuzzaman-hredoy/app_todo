# 🚀 Quick Start (5 Minutes)

## For Absolute Beginners

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Database
```bash
npm run prepare
npm run db:push
```

### Step 3: Start the App
```bash
npm run dev
```

### Step 4: Open Browser
Go to: **http://localhost:3000**

---

## That's it! 🎉

Your todo app is now running locally.

### Next Steps:
- Add some todos using the form
- Click edit/delete buttons to manage them
- Check out `SETUP_GUIDE.md` for full documentation

---

## Useful Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Optimize for production |
| `npm start` | Run production version |
| `npm run db:push` | Update database schema |
| `npm run prisma -- studio` | Open database viewer |

---

## Common Issues?

**Port 3000 in use?**
```bash
npm run dev -- -p 3001
```

**Database missing?**
```bash
npm run db:push
```

**Packages not working?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run prepare
npm run db:push
```

---

See **SETUP_GUIDE.md** for detailed instructions.
