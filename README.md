# KARIN Pvt. Ltd. — Website

> Full-stack company website with React frontend + Node.js backend.

---

## 📁 Project Structure

```
karin-website/
├── src/                        ← React frontend
│   ├── App.jsx                 ← root with routing + theme + loading
│   ├── main.jsx                ← React entry point
│   ├── data/index.js           ← ✏️ edit all site content here
│   ├── styles/
│   │   ├── global.css          ← resets, buttons, shared
│   │   └── themes.css          ← dark (lime) + light (blue) variables
│   ├── hooks/useReveal.js      ← scroll animation hook
│   ├── components/
│   │   ├── Cursor.jsx          ← dot + ring cursor
│   │   ├── LoadingScreen.jsx   ← branded intro animation
│   │   ├── Navbar.jsx          ← sticky nav + mobile menu + theme toggle
│   │   ├── Hero.jsx            ← hero section
│   │   ├── Stats.jsx           ← 4 key numbers
│   │   ├── Services.jsx        ← 6 service cards
│   │   ├── Work.jsx            ← project list
│   │   ├── Team.jsx            ← team cards
│   │   ├── Testimonials.jsx    ← client reviews
│   │   ├── FAQ.jsx             ← accordion FAQ
│   │   ├── Contact.jsx         ← form → backend API
│   │   ├── Footer.jsx
│   │   └── NotFound.jsx        ← 404 page
│   └── pages/
│       ├── AdminLogin.jsx      ← /admin login page
│       └── AdminDashboard.jsx  ← /admin/dashboard inbox
│
├── server/                     ← Node.js backend
│   ├── index.js                ← Express server entry
│   ├── models/
│   │   ├── Message.js          ← MongoDB contact form schema
│   │   └── Admin.js            ← Admin user schema
│   ├── routes/
│   │   ├── contact.js          ← POST/GET/PATCH/DELETE messages
│   │   └── auth.js             ← POST login, GET /me
│   ├── middleware/auth.js      ← JWT guard
│   ├── scripts/createAdmin.js  ← run once to seed admin
│   └── .env.example            ← copy to .env
│
├── package.json                ← frontend deps
├── vite.config.js
├── index.html
├── .env.example                ← copy to .env
└── README.md
```

---

## 🚀 How to Run

### Prerequisites
- **Node.js 18+** → [nodejs.org](https://nodejs.org) (download LTS)
- **MongoDB** → free at [mongodb.com/atlas](https://mongodb.com/atlas)
- **Gmail App Password** → [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

---

### Step 1 — Frontend setup

```bash
# In the root karin-website/ folder:
npm install

# Copy the env template and fill in values
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
# Open: http://localhost:5173
```

---

### Step 2 — Backend setup

```bash
# Open a second terminal
cd server
npm install

# Copy the env template
cp .env.example .env
```

Edit `server/.env` with your real values:
```
MONGO_URI=mongodb+srv://...
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-app-password
CONTACT_RECEIVER=hello@karinpvt.in
ADMIN_USERNAME=kaushiki
ADMIN_PASSWORD=YourStrongPassword
JWT_SECRET=any-long-random-string
```

Create your admin account (run ONCE):
```bash
node scripts/createAdmin.js
```

Start the backend:
```bash
npm run dev
# Running at: http://localhost:5000
# Health check: http://localhost:5000/api/health
```

---

### Step 3 — Visit the site

| URL | What it is |
|-----|------------|
| `http://localhost:5173` | Main website |
| `http://localhost:5173/admin` | Admin login |
| `http://localhost:5173/admin/dashboard` | Message inbox |

---

## ✏️ Updating Content

All text content lives in one file: **`src/data/index.js`**

- `STATS` — the 4 numbers in the stats bar
- `SERVICES` — service cards
- `PROJECTS` — work/case studies
- `TEAM` — team member cards
- `TESTIMONIALS` — client quotes
- `FAQS` — accordion questions

---

## 📦 Build for Production

```bash
# Frontend build
npm run build
# Output in: dist/

# Backend — run with PM2 or any Node host
cd server && node index.js
```

---

## 🌐 Deploy

| Service | What for |
|---------|---------|
| [Vercel](https://vercel.com) | Frontend (free) |
| [Railway](https://railway.app) | Backend (free tier) |
| [MongoDB Atlas](https://mongodb.com/atlas) | Database (free tier) |
