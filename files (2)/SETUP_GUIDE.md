# ⚙️ Basera — Setup Guide

Step-by-step instructions to run Basera locally from scratch.

---

## Prerequisites

Install these before anything else:

| Tool | Version | Download |
|---|---|---|
| Node.js | v18+ | https://nodejs.org |
| Git | Any | https://git-scm.com |
| VS Code | Any | https://code.visualstudio.com |

Verify installations:
```bash
node -v     # should print v18.x.x or higher
npm -v      # should print v9.x.x or higher
git --version
```

---

## Step 1 — Create the Next.js Project

```bash
npx create-next-app@latest basera
```

When prompted, answer:
```
✔ Would you like to use TypeScript? → No  (use JavaScript for simplicity)
✔ Would you like to use ESLint? → Yes
✔ Would you like to use Tailwind CSS? → Yes
✔ Would you like to use `src/` directory? → No
✔ Would you like to use App Router? → Yes
✔ Would you like to customize the default import alias? → No
```

Then navigate into the project:
```bash
cd basera
```

---

## Step 2 — Install Dependencies

```bash
npm install mongoose nextauth bcryptjs cloudinary multer
npm install @googlemaps/js-api-loader
npm install -D @types/node
```

**What each package does:**

| Package | Purpose |
|---|---|
| `mongoose` | MongoDB ODM for schema-based data modeling |
| `next-auth` | Authentication (email/password + Google OAuth) |
| `bcryptjs` | Hashing passwords before storing in DB |
| `cloudinary` | Image upload and CDN |
| `@googlemaps/js-api-loader` | Google Maps in the browser |

---

## Step 3 — Set Up MongoDB Atlas (Free)

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free account
3. Click **Build a Database** → Choose **Free (M0 tier)**
4. Choose a region closest to you → Click **Create**
5. Set a **username and password** (save these!)
6. Under **Network Access**, click **Add IP Address** → Select **Allow Access from Anywhere** (`0.0.0.0/0`)
7. Go to **Database** → Click **Connect** → **Drivers**
8. Copy the connection string — it looks like:
   ```
   mongodb+srv://youruser:yourpassword@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
   ```
9. Replace `<password>` with your actual password and add your DB name:
   ```
   mongodb+srv://youruser:yourpassword@cluster0.abc123.mongodb.net/basera
   ```

---

## Step 4 — Set Up NextAuth Secret

Generate a secure random secret:

```bash
openssl rand -base64 32
```

Copy the output — this is your `NEXTAUTH_SECRET`.

---

## Step 5 — Set Up Google OAuth (Optional)

This enables **"Login with Google"** button.

1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project called `Basera`
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client IDs**
5. Application type: **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for local)
   - `https://your-basera-url.vercel.app/api/auth/callback/google` (for prod)
7. Click **Create** → Copy **Client ID** and **Client Secret**

---

## Step 6 — Set Up Google Maps API

1. In the same Google Cloud project, go to **APIs & Services** → **Library**
2. Search for and enable:
   - **Maps JavaScript API**
   - **Places API**
   - **Geocoding API**
3. Go to **Credentials** → Click your API key → **Restrict key**
4. Under **Application restrictions**, choose **HTTP referrers**
5. Add:
   - `http://localhost:3000/*`
   - `https://your-basera-url.vercel.app/*`
6. Copy the API key

---

## Step 7 — Set Up Cloudinary (Free Image Hosting)

1. Go to [https://cloudinary.com](https://cloudinary.com) → Sign up free
2. Go to your Dashboard
3. Copy your **Cloud Name**, **API Key**, and **API Secret**

---

## Step 8 — Create Environment File

Create `.env.local` in the project root:

```bash
touch .env.local
```

Open it and add all your keys:

```env
# ─── MongoDB ────────────────────────────────────────
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.abc123.mongodb.net/basera

# ─── NextAuth ───────────────────────────────────────
NEXTAUTH_SECRET=your_openssl_output_here
NEXTAUTH_URL=http://localhost:3000

# ─── Google OAuth ───────────────────────────────────
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123xyz

# ─── Google Maps (public — safe to expose) ──────────
NEXT_PUBLIC_GOOGLE_MAPS_KEY=AIzaSyABC123...

# ─── Cloudinary ─────────────────────────────────────
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abc123xyz789secret
```

> ⚠️ **Never commit `.env.local` to GitHub.** It's already in `.gitignore` by default.

---

## Step 9 — Create the MongoDB Connection Utility

```js
// lib/mongodb.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local');
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
```

---

## Step 10 — Set Up NextAuth

```js
// lib/auth.js
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from './mongodb';
import User from '@/models/User';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        if (!user || !user.password) return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.id = token.id;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
```

```js
// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

---

## Step 11 — Add Sample Scripts to package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "seed": "node scripts/seed.js"
  }
}
```

---

## Step 12 — Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the Basera home page.

---

## Step 13 — Deploy to Vercel

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit — Basera v1"
   git remote add origin https://github.com/yourusername/basera.git
   git push -u origin main
   ```

2. Go to [https://vercel.com](https://vercel.com) → Sign in with GitHub

3. Click **New Project** → Import your `basera` repository

4. In the **Environment Variables** section, add all the same variables from your `.env.local`

5. Change `NEXTAUTH_URL` to your Vercel URL:
   ```
   NEXTAUTH_URL=https://basera-yourusername.vercel.app
   ```

6. Click **Deploy** — Vercel builds and deploys automatically

7. Your live URL is ready: `https://basera-yourusername.vercel.app` ✅

---

## Common Issues

**`MongooseError: Can't call openUri()`**
→ You're connecting to MongoDB multiple times. Make sure you're using the cached `dbConnect()` utility everywhere.

**`[next-auth] error: No secret`**
→ `NEXTAUTH_SECRET` is missing or `.env.local` wasn't loaded. Restart the dev server after editing env file.

**Google Maps not showing**
→ Check that you enabled "Maps JavaScript API" in Google Cloud Console and the API key is correct in `.env.local`.

**Images not uploading**
→ Verify your Cloudinary credentials. Make sure your upload preset exists or you're using signed uploads.

**`Module not found` errors**
→ Run `npm install` again. Make sure you're in the project root directory.
