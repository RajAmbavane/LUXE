# Render Auto-Deployment Guide

## ✅ Your Deployment is Now Active

Your Render service at `https://luxeresolve-intelligence.onrender.com` is configured for **automatic deployment** whenever you push to GitHub.

## 🔄 How Auto-Deployment Works

1. **You push to GitHub** (`git push origin main`)
2. **Render detects the push** (webhook automatically triggered)
3. **Render rebuilds your service** (5-10 minutes)
4. **Service updates automatically** (zero downtime)
5. **Your app stays live** throughout the process

## 🔐 Environment Variables on Render

Your secrets are **safely stored on Render** and NOT in git:

### Frontend Variables (Already Set)
```
VITE_SUPABASE_URL=https://gsjsvycqsaxzmdnworbk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Backend Variables (Already Set)
```
SUPABASE_URL=https://gsjsvycqsaxzmdnworbk.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VISION_MODEL=meta-llama/llama-4-scout-17b-16e-instruct
TEXT_DATA_MODEL=llama-3.3-70b-versatile
SYNTHESIS_MODEL=llama-3.3-70b-versatile
LLM_PROVIDER=groq
LLM_TEMPERATURE=0.3
LLM_MAX_TOKENS=2000
AGENT_PIPELINE_VERSION=3-agent-specialization-v2
```

## 📋 Workflow: Push Code → Auto-Deploy

### Step 1: Make Changes Locally
```bash
# Edit files, test locally
npm run dev  # Frontend
uvicorn app.main:app --reload --port 8000  # Backend (separate terminal)
```

### Step 2: Commit & Push
```bash
git add .
git commit -m "your message"
git push origin main
```

### Step 3: Render Auto-Deploys
- Go to [render.com/dashboard](https://render.com/dashboard)
- Click on `luxeresolve-intelligence` service
- Watch the "Deploys" tab
- Status will show: `Building` → `Deploying` → `Live`

### Step 4: Verify Deployment
```bash
# Check service is running
curl https://luxeresolve-intelligence.onrender.com/health

# Should return: {"status":"ok"}
```

## ⚠️ IMPORTANT: Keep Secrets Out of Git

### ✅ DO THIS
```bash
# Secrets stay in .env files (locally only)
# .env files are in .gitignore
# Secrets are set on Render dashboard
git push origin main  # Only code goes to GitHub
```

### ❌ DON'T DO THIS
```bash
# Never commit .env files
git add .env  # ❌ WRONG - will expose secrets

# Never hardcode secrets in code
const API_KEY = "gsk_..."  # ❌ WRONG - will expose secrets
```

## 🔍 Monitoring Your Deployment

### Check Deployment Status
1. Go to [render.com/dashboard](https://render.com/dashboard)
2. Click `luxeresolve-intelligence`
3. Look at the status indicator:
   - 🟢 **Green** = Running
   - 🟡 **Yellow** = Deploying
   - 🔴 **Red** = Failed

### View Logs
1. Click on your service
2. Go to "Logs" tab
3. Select "Runtime Logs" to see live logs
4. Select "Build Logs" to see build errors

### Check Health
```bash
curl https://luxeresolve-intelligence.onrender.com/health
```

## 🚀 Deployment Checklist

Before pushing, verify:

- [ ] `.env` files are NOT staged (`git status` shows no .env)
- [ ] Code changes are tested locally
- [ ] No hardcoded secrets in code
- [ ] `git log` shows your commits
- [ ] Ready to push with `git push origin main`

## 📊 Expected Deployment Timeline

| Step | Time | Status |
|------|------|--------|
| Push to GitHub | 0s | ✅ Complete |
| Render detects | 10-30s | 🔄 Processing |
| Build starts | 30s | 🔄 Building |
| Build completes | 3-5 min | ✅ Built |
| Deploy starts | 5 min | 🔄 Deploying |
| Service live | 5-10 min | 🟢 Live |

## ✅ Success Indicators

Your deployment is successful when:

1. ✅ Service shows green status on Render
2. ✅ Health endpoint returns `{"status":"ok"}`
3. ✅ Dashboard loads at `https://luxeresolve-intelligence.onrender.com`
4. ✅ Cases display correctly
5. ✅ Images load in visual analysis
6. ✅ No errors in browser console

## 🆘 Troubleshooting

### Deployment Stuck on "Building"
- Check Build Logs for errors
- Common causes: npm install failed, TypeScript errors
- Fix: Resolve errors locally, push again

### Service Shows Red Status
- Check Runtime Logs for errors
- Common causes: Missing env vars, Supabase connection failed
- Fix: Verify environment variables on Render dashboard

### "Application Loading" Forever
- Check browser console (F12)
- Check Network tab for failed requests
- Verify backend health: `curl https://your-url/health`

### Images Not Loading
- Verify Supabase storage bucket exists
- Check image paths in database
- Verify Supabase credentials are correct

## 📞 Quick Reference

| Action | Command |
|--------|---------|
| Push changes | `git push origin main` |
| Check status | Visit Render dashboard |
| View logs | Render dashboard → Logs tab |
| Test health | `curl https://your-url/health` |
| Redeploy manually | Render dashboard → Manual Deploy |

## 🎯 Your Setup is Complete

✅ **Auto-deployment is active**
✅ **Secrets are secure on Render**
✅ **Code is on GitHub**
✅ **Service is live and monitoring**

Just push code to GitHub and Render handles the rest!

