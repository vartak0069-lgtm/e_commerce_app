# 🛍️ E-Commerce Platform

A full-stack e-commerce web app built with **Node.js + Express + Supabase + Razorpay**,
using a plain HTML/CSS/JS frontend (no build tools needed). Built entirely using
**FREE tier services** - perfect for college/internship projects, zero cost.

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** Supabase (PostgreSQL) - free tier
- **Auth:** JWT (access + refresh tokens)
- **Payments:** Razorpay **TEST MODE** (free, no real transactions)
- **Email:** Gmail SMTP with App Password (free, no SendGrid needed)
- **Frontend:** Plain HTML, CSS, JavaScript (no framework)

## 🚀 Quick Setup (all free)

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Supabase (free)
1. Go to https://supabase.com → Sign up → New Project
2. Go to **Project Settings → API** and copy:
   - Project URL → `SUPABASE_URL`
   - `anon` public key → `SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`
3. Go to **SQL Editor** → paste and run `database/schema.sql`
4. Then paste and run `database/seeds/seed.sql` for sample data

### 3. Set up Razorpay (free, TEST MODE)
1. Go to https://razorpay.com → Sign up (no card needed for test mode)
2. Dashboard → **Settings → API Keys → Generate Test Key**
3. Copy `Key Id` and `Key Secret` → these start with `rzp_test_` (100% free, no real money)
4. Use test card **4111 1111 1111 1111**, any future expiry, any CVV to simulate payments

### 4. Set up Email (free, via Gmail)
1. Go to your Google Account → **Security → 2-Step Verification** (turn on if not already)
2. Search "App Passwords" → generate one for "Mail"
3. Use your Gmail address as `EMAIL_USER` and the generated 16-character code as `EMAIL_PASS`

### 5. Configure environment
```bash
cp .env.example .env
# then fill in all the values from steps 2-4 above
```

### 6. Generate a JWT secret (no API needed)
Any long random string works, e.g. run this in a terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Paste the output into `JWT_SECRET` and generate another for `JWT_REFRESH_SECRET`.

### 7. Run the app
```bash
npm run dev
```
Visit **http://localhost:5000**

## 📁 Project Structure
See `FOLDER_STRUCTURE.md` style layout:
- `src/` - backend (models, controllers, routes, middleware, services)
- `public/` - frontend static assets (CSS, JS, images)
- `views/` - HTML pages
- `database/` - SQL schema, migrations, seed data
- `tests/` - Jest unit + integration tests
- `docs/` - API and database documentation

## 🧪 Running Tests
```bash
npm test
```

## 💳 Important: This uses Razorpay TEST MODE
No real money ever moves. Perfect for demos, internships, and college projects.
When you're ready for production, just swap in live keys (`rzp_live_...`) and
verify KYC on Razorpay - everything else in the code stays the same.

## 🔑 Free Services Used (summary)
| Service | Purpose | Cost |
|---|---|---|
| Supabase | Database | Free tier |
| Razorpay (test mode) | Payments | Free |
| Gmail SMTP | Emails | Free |
| In-memory cache | Caching (instead of Redis) | Free |
| Local disk storage | File uploads (instead of S3) | Free |
