# JSPrep Pro — JavaScript Interview Prep SaaS

A full-stack Next.js SaaS app for JS interview preparation with Firebase Auth, Firestore progress tracking, and Razorpay subscription payments.

## Tech Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Auth**: Firebase Authentication (Google Sign-In)
- **Database**: Firestore (per-user progress, bookmarks, quiz scores, streaks)
- **Payments**: Razorpay (subscription, ₹199/month)
- **Deployment**: Vercel (recommended)

## Features

| Feature | Free | Pro |
|---------|------|-----|
| View all 21 questions | ✅ | ✅ |
| Track up to 5 mastered | ✅ | ✅ |
| Unlimited mastery tracking | ❌ | ✅ |
| Bookmarks | ❌ | ✅ |
| Quiz / Flashcard mode | ❌ | ✅ |
| Progress analytics | ❌ | ✅ |
| Daily streak tracking | ❌ | ✅ |

---

## Setup Guide

### Step 1: Firebase Setup

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project (e.g. "jsprep-pro")
3. Go to **Build > Authentication > Get started**
   - Enable **Google** as a sign-in provider
   - Add your domain to authorized domains when deploying
4. Go to **Build > Firestore Database > Create database**
   - Start in **test mode** (update rules before going live)
5. Go to **Project Settings > Your apps > Add app (Web)**
   - Register app, copy the config values

### Step 2: Razorpay Setup

1. Sign up at [razorpay.com](https://razorpay.com) (free)
2. Go to **Settings > API Keys**
3. Generate a key pair (use Test mode for development)
4. Copy the **Key ID** and **Key Secret**

### Step 3: Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

### Step 4: Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Firestore Security Rules

Replace test mode rules with these before going live:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import your repo
3. Add all environment variables in Vercel dashboard
4. Deploy! Your app will be live at `your-app.vercel.app`

### Post-deploy:
- Add your Vercel domain to Firebase **Authorized Domains**
- Set up **Razorpay Webhook** pointing to `https://your-domain.com/api/razorpay/webhook`

---

## Razorpay Webhook (Production)

In your Razorpay Dashboard → Webhooks → Add Webhook:
- URL: `https://your-domain.com/api/razorpay/webhook`
- Events: `payment.captured`
- Secret: same as `RAZORPAY_KEY_SECRET`

For production, use **Firebase Admin SDK** in the webhook to update Firestore server-side.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx           # Landing page
│   ├── auth/page.tsx      # Google sign-in
│   ├── dashboard/page.tsx # Questions + progress tracking
│   ├── quiz/page.tsx      # Flashcard quiz mode (Pro)
│   ├── analytics/page.tsx # Progress charts (Pro)
│   └── api/razorpay/
│       └── webhook/       # Payment verification
├── components/
│   ├── layout/Navbar.tsx
│   └── ui/PaywallBanner.tsx
├── hooks/useAuth.tsx       # Auth context
├── lib/
│   ├── firebase.ts         # Firebase config
│   └── userProgress.ts     # Firestore helpers
└── data/questions.ts       # All 21 questions
```

---

## Adding More Questions

Edit `src/data/questions.ts` and add objects to the `questions` array. The UI is fully dynamic — categories, filters, and progress tracking update automatically.

---

## License

MIT — build your own interview prep SaaS!
# jsprep-pro
