# TechWord Daily 🌿
**100% free** — powered by Google Gemini AI (1,500 free requests/day)

---

## Deploy to Vercel — Step by Step

### STEP 1 — Get your FREE Gemini API Key (2 minutes)
1. Go to: https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key (starts with `AIza...`)
> ✅ This is completely free. No credit card needed.

---

### STEP 2 — Put the project on GitHub
1. Go to https://github.com → click **"New"** repository
2. Name it `techword-daily` → click **Create repository**
3. Upload all the files from this ZIP (keep the folder structure exactly as-is)

---

### STEP 3 — Deploy on Vercel (1 minute)
1. Go to https://vercel.com → sign in with GitHub
2. Click **"Add New Project"**
3. Select your `techword-daily` repo → click **Deploy**
4. Vercel auto-detects Next.js ✅

---

### STEP 4 — Add your API Key (critical!)
1. In Vercel, open your project → **Settings** → **Environment Variables**
2. Add a new variable:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** paste your key from Step 1
3. Click **Save**
4. Go to **Deployments** tab → click the 3 dots → **Redeploy**

---

### ✅ Done! Your app is live and free forever.

---

## Run locally (optional)
```bash
npm install

# Create a file called .env.local and add:
GEMINI_API_KEY=AIza...your-key-here

npm run dev
# Open http://localhost:3000
```

---

## FAQ
**Is it really free?**
Yes. Gemini 1.5 Flash gives you 1,500 free API calls per day and 1 million tokens/minute.
You'd have to use the app hundreds of times a day to exceed that.

**Does this cost anything on Vercel?**
No. Vercel's free Hobby plan is enough for this app.

**Can I change the topics or add more words?**
Yes — edit `pages/api/generate.js` and change the prompt to ask for more words or different topics.
