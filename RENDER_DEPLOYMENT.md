# Render Deployment Guide - LuxeResolve Intelligence

## 🚀 Quick Deployment (10 Minutes)

### Prerequisites
- GitHub account with forked repository
- Render.com account (free tier available)
- Supabase project with all 6 migrations run

### Step 1: Fork Repository
1. Go to [https://github.com/RajAmbavane/LUXE](https://github.com/RajAmbavane/LUXE)
2. Click "Fork" button
3. Select your account

### Step 2: Create Render Web Service
1. Go to [render.com](https://render.com)
2. Sign in with GitHub
3. Click "New +" → "Web Service"
4. Select your forked LUXE repository
5. Click "Connect"

### Step 3: Configure Service
**Basic Settings:**
- **Name**: `luxeresolve-intelligence`
- **Environment**: `Python 3`
- **Region**: Choose closest to you
- **Branch**: `main`

**Build & Deploy:**
- **Build Command**:
```bash
pip install -r backend/requirements.txt && npm install && npm run build && mkdir -p backend/app/static && cp -r dist/* backend/app/static/
```

- **Start Command**:
```bash
cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Step 4: Add Environment Variables
Click "Environment" and add these variables:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
GROQ_API_KEY=your_groq_api_key_here
VISION_MODEL=meta-llama/llama-4-scout-17b-16e-instruct
TEXT_DATA_MODEL=llama-3.3-70b-versatile
SYNTHESIS_MODEL=llama-3.3-70b-versatile
LLM_PROVIDER=groq
LLM_TEMPERATURE=0.3
LLM_MAX_TOKENS=2000
AGENT_PIPELINE_VERSION=3-agent-specialization-v2
```

### Step 5: Deploy
1. Click "Create Web Service"
2. Render will automatically build and deploy
3. Wait for "Your service is live" message
4. Your app is now at: `https://luxeresolve-intelligence.onrender.com`

---

## 🔍 How to Check Render Deployment Issues

### 1. **Check Deployment Status**
- Go to your Render dashboard
- Click on your service
- Look at the "Status" indicator:
  - 🟢 **Green**: Service is running
  - 🟡 **Yellow**: Deploying
  - 🔴 **Red**: Failed or crashed

### 2. **View Build Logs**
1. Click on your service
2. Go to "Logs" tab
3. Select "Build Logs" from dropdown
4. Look for errors during build

**Common Build Errors:**
```
ERROR: pip install failed
→ Fix: Check requirements.txt syntax

ERROR: npm install failed
→ Fix: Check package.json syntax

ERROR: npm run build failed
→ Fix: Check TypeScript errors in src/
```

### 3. **View Runtime Logs**
1. Click on your service
2. Go to "Logs" tab
3. Select "Runtime Logs" from dropdown
4. Look for errors during execution

**Common Runtime Errors:**
```
ModuleNotFoundError: No module named 'groq'
→ Fix: Ensure requirements.txt has all dependencies

SUPABASE_URL is required
→ Fix: Check environment variables are set

Connection refused on port 8000
→ Fix: Check Start Command is correct
```

### 4. **Test Health Endpoint**
```bash
# Replace with your Render URL
curl https://luxeresolve-intelligence.onrender.com/health

# Should return:
# {"status":"ok"}
```

### 5. **Check Frontend Loading**
1. Open your Render URL in browser
2. Open Developer Console (F12)
3. Check for errors:
   - **Network errors**: Check API calls
   - **CORS errors**: Check backend CORS settings
   - **Supabase errors**: Check environment variables

### 6. **Monitor Service Health**
1. Go to Render dashboard
2. Click on your service
3. Check "Metrics" tab:
   - CPU usage
   - Memory usage
   - Request count
   - Error rate

---

## 🐛 Troubleshooting Guide

### Issue 1: Build Fails with "npm install failed"
**Symptoms**: Build log shows npm error
**Cause**: Missing or corrupted package.json
**Fix**:
```bash
# Locally
npm install
npm run build
git add package-lock.json
git commit -m "Update package-lock.json"
git push origin main
```

### Issue 2: "SUPABASE_URL is required"
**Symptoms**: Frontend shows error, console shows undefined
**Cause**: Environment variables not set
**Fix**:
1. Go to Render service settings
2. Click "Environment"
3. Verify all variables are set
4. Redeploy service (click "Manual Deploy")

### Issue 3: Backend Returns 502 Bad Gateway
**Symptoms**: API calls fail with 502 error
**Cause**: Backend crashed or not responding
**Fix**:
1. Check Runtime Logs for errors
2. Verify Supabase credentials
3. Check Groq API key is valid
4. Redeploy service

### Issue 4: Frontend Loads but Shows "Application Loading"
**Symptoms**: Page stuck on loading screen
**Cause**: Backend not responding or API calls failing
**Fix**:
1. Open browser console (F12)
2. Check Network tab for failed requests
3. Verify backend health: `curl https://your-url/health`
4. Check Render logs for backend errors

### Issue 5: Images Not Loading
**Symptoms**: Visual analysis shows broken images
**Cause**: Image paths incorrect or Supabase storage not configured
**Fix**:
1. Verify images are in `public/images/cases/`
2. Check Supabase storage bucket exists
3. Verify image URLs in database

### Issue 6: Slow Performance / Timeouts
**Symptoms**: Requests take >30 seconds or timeout
**Cause**: Rate limiting or slow Groq API
**Fix**:
1. Check Groq API status
2. Verify Supabase connection
3. Check Render metrics for resource usage
4. Consider upgrading Render plan

### Issue 7: "Port already in use"
**Symptoms**: Build fails with port error
**Cause**: Using hardcoded port instead of $PORT
**Fix**: Ensure Start Command uses `$PORT` variable:
```bash
cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

---

## ✅ Verification Checklist

After deployment, verify everything works:

### Frontend
- [ ] Dashboard loads
- [ ] Case queue displays cases
- [ ] Can click on a case
- [ ] Visual analysis shows images
- [ ] Risk reasoning displays agent findings
- [ ] Actions & approvals page works

### Backend
- [ ] Health endpoint responds: `curl https://your-url/health`
- [ ] Cases API works: `curl https://your-url/api/cases`
- [ ] No 502 errors in logs
- [ ] No timeout errors

### Database
- [ ] Supabase connection works
- [ ] All 21 cases visible
- [ ] Images load correctly
- [ ] Agent analysis data present

### AI Pipeline
- [ ] Visual agent processes images
- [ ] Text/data agent analyzes behavior
- [ ] Synthesis agent makes decisions
- [ ] No rate limit errors

---

## 📊 Monitoring & Maintenance

### Daily Checks
```bash
# Check service is running
curl https://luxeresolve-intelligence.onrender.com/health

# Check logs for errors
# Go to Render dashboard → Logs tab
```

### Weekly Checks
1. Review Render metrics
2. Check error rate
3. Monitor resource usage
4. Verify all features working

### Monthly Maintenance
1. Update dependencies: `npm update`, `pip install --upgrade -r requirements.txt`
2. Review and rotate API keys
3. Check Supabase usage
4. Backup database

---

## 🔐 Security Checklist

- [ ] No `.env` files in git
- [ ] All secrets in Render environment variables
- [ ] Service role key only in backend
- [ ] Anon key only in frontend
- [ ] CORS properly configured
- [ ] RLS policies enabled on Supabase

---

## 📞 Getting Help

### Render Support
- **Status Page**: [status.render.com](https://status.render.com)
- **Documentation**: [render.com/docs](https://render.com/docs)
- **Support**: [render.com/support](https://render.com/support)

### Common Resources
- **Build Logs**: Service → Logs → Build Logs
- **Runtime Logs**: Service → Logs → Runtime Logs
- **Metrics**: Service → Metrics
- **Environment**: Service → Environment

### Debug Commands
```bash
# Test backend health
curl https://your-url/health

# Test Supabase connection
curl https://your-url/api/cases

# Check service status
# Go to Render dashboard

# View logs
# Service → Logs tab
```

---

## 🎯 Expected Behavior

### On First Load
1. Frontend loads (may take 30-60 seconds on free tier)
2. Dashboard displays with 21 cases
3. Console shows Supabase connection successful
4. No errors in browser console

### When Clicking a Case
1. Case details load
2. Images display in visual analysis
3. Agent findings show in risk reasoning
4. Decision appears in actions tab

### Performance
- **Page load**: 2-5 seconds
- **Case details**: 1-2 seconds
- **AI processing**: 10-30 seconds (depends on Groq API)
- **Image loading**: 1-3 seconds

---

## 🚀 Deployment Success Indicators

✅ **You're successful when:**
- Service shows green status
- Health endpoint returns `{"status":"ok"}`
- Dashboard loads with all cases
- Images display correctly
- AI agents process cases
- No errors in logs
- All features working

---

**Your LuxeResolve Intelligence system is now live on Render!** 🎉
