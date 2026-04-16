# 🚀 Complete Render Deployment Guide

Deploy the entire LuxeResolve Intelligence system (frontend + backend + Groq AI) on Render.

## Why Render?

✅ **Full-Stack Support**: Deploy Python backend + React frontend together  
✅ **Groq API Compatible**: Perfect for AI/ML applications  
✅ **Free Tier**: Get started without cost  
✅ **Auto-Deploy**: Connects to GitHub for automatic deployments  
✅ **Environment Variables**: Secure API key management  
✅ **HTTPS**: SSL certificates included  
✅ **Custom Domains**: Add your own domain easily  

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ GitHub repository: `https://github.com/RajAmbavane/LUXE`
- ✅ Supabase project with 4 migrations completed
- ✅ Groq API key: Get from [console.groq.com](https://console.groq.com)
- ✅ Images extracted from Excel file (optional but recommended)

## Step 1: Create Render Account

1. Go to **[render.com](https://render.com)**
2. Click **"Get Started for Free"**
3. **Sign up with GitHub** (recommended for easy repo access)
4. Verify your email if required

## Step 2: Create New Web Service

1. In Render dashboard, click **"New +"**
2. Select **"Web Service"**
3. Choose **"Build and deploy from a Git repository"**
4. Click **"Connect account"** if GitHub isn't connected
5. Find and select **"RajAmbavane/LUXE"** repository
6. Click **"Connect"**

## Step 3: Configure Service Settings

### Basic Settings
- **Name**: `luxeresolve-intelligence` (or your preferred name)
- **Region**: Choose closest to your users (e.g., Oregon, Frankfurt)
- **Branch**: `main`
- **Root Directory**: Leave empty (uses repository root)

### Build Settings
- **Runtime**: `Python 3`
- **Build Command**: 
  ```bash
  pip install -r backend/requirements.txt && npm install && npm run build && mkdir -p backend/app/static && cp -r dist/* backend/app/static/
  ```
- **Start Command**: 
  ```bash
  cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
  ```

### Instance Type
- **Free**: Perfect for testing and demos
- **Starter ($7/month)**: For production use with better performance

## Step 4: Set Environment Variables

This is the **most critical step**. Add these environment variables:

### Required Variables

1. **GROQ_API_KEY**
   - Value: `your_groq_api_key_here`

2. **SUPABASE_URL**
   - Value: `https://gsjsvycqsaxzmdnworbk.supabase.co`

3. **SUPABASE_SERVICE_ROLE_KEY**
   - Value: Your Supabase service role key (get from Supabase Settings → API)

### AI Model Configuration

4. **VISION_MODEL**
   - Value: `meta-llama/llama-4-scout-17b-16e-instruct`

5. **TEXT_DATA_MODEL**
   - Value: `llama-3.3-70b-versatile`

6. **SYNTHESIS_MODEL**
   - Value: `llama-3.3-70b-versatile`

### Application Settings

7. **LLM_PROVIDER**
   - Value: `groq`

8. **LLM_TEMPERATURE**
   - Value: `0.3`

9. **LLM_MAX_TOKENS**
   - Value: `2000`

10. **AGENT_PIPELINE_VERSION**
    - Value: `3-agent-specialization-v2`

## Step 5: Deploy

1. Click **"Create Web Service"**
2. Render will start building your application
3. Watch the build logs in real-time
4. Wait for deployment to complete (usually 5-10 minutes)

### Expected Build Process
```
==> Installing Python dependencies
==> Installing Node.js dependencies  
==> Building React frontend
==> Copying frontend to backend static directory
==> Starting FastAPI server
==> Deploy successful!
```

## Step 6: Verify Deployment

### 6.1 Check Your Live URL
You'll get a URL like: `https://luxeresolve-intelligence.onrender.com`

### 6.2 Test API Health
Visit: `https://your-app.onrender.com/health`
Should return:
```json
{
  "status": "ok",
  "processing": false
}
```

### 6.3 Test Frontend
Visit: `https://your-app.onrender.com`
Should show the LuxeResolve Intelligence dashboard

### 6.4 Test Full Functionality
1. **Dashboard**: Should display marketplace analytics
2. **Case Queue**: Should show 16 cases from database
3. **Case Details**: Click any case to see AI analysis
4. **Risk Reasoning**: Should display structured AI reasoning
5. **Images**: Should show before/after comparisons (if extracted)

## Step 7: Configure Custom Domain (Optional)

### 7.1 Add Custom Domain
1. In Render dashboard, go to your service
2. Click **"Settings"** tab
3. Scroll to **"Custom Domains"**
4. Click **"Add Custom Domain"**
5. Enter your domain (e.g., `luxeresolve.com`)

### 7.2 Configure DNS
Add these DNS records at your domain provider:
- **Type**: CNAME
- **Name**: @ (or www)
- **Value**: `your-app.onrender.com`

## Step 8: Monitor and Maintain

### 8.1 View Logs
- Go to your service in Render dashboard
- Click **"Logs"** tab to see real-time application logs
- Monitor for any errors or issues

### 8.2 Auto-Deploy Setup
- **Already configured!** Render automatically deploys when you push to `main` branch
- Make changes → Push to GitHub → Automatic deployment

### 8.3 Performance Monitoring
- Check **"Metrics"** tab for performance data
- Monitor response times and error rates
- Upgrade to paid plan if needed for better performance

## 🎯 Expected Results

After successful deployment:

### ✅ Live Application
- **URL**: `https://your-app.onrender.com`
- **Frontend**: React dashboard fully functional
- **Backend**: FastAPI serving AI analysis
- **Database**: Connected to Supabase with all data
- **AI**: Groq models processing cases

### ✅ Full Functionality
- **16 Cases**: All luxury marketplace disputes visible
- **AI Analysis**: 3-agent pipeline working
- **Varied Decisions**: APPROVE/DENY/ESCALATE outcomes
- **Visual Analysis**: Before/after image comparison
- **Real-time Processing**: Cases analyzed on demand

### ✅ Production Features
- **HTTPS**: SSL certificate automatically provided
- **Global CDN**: Fast loading worldwide
- **Auto-scaling**: Handles traffic spikes
- **Monitoring**: Built-in performance metrics

## 🔧 Troubleshooting

### Build Fails
**Issue**: Build command fails
**Solution**: Check that all dependencies are in `backend/requirements.txt` and `package.json`

### Environment Variables
**Issue**: API keys not working
**Solution**: 
1. Verify all environment variables are set in Render dashboard
2. Check Supabase service role key is correct
3. Confirm Groq API key is valid

### Database Connection
**Issue**: No data showing
**Solution**:
1. Verify Supabase URL and key
2. Ensure all 4 database migrations were run
3. Check Supabase logs for connection errors

### Images Not Loading
**Issue**: Before/after images not displaying
**Solution**:
1. Extract images from `cases (2).xlsx`
2. Commit images to GitHub repository
3. Redeploy on Render

### Performance Issues
**Issue**: Slow response times
**Solution**:
1. Upgrade to Render Starter plan ($7/month)
2. Optimize database queries
3. Consider caching frequently accessed data

## 📊 Cost Breakdown

### Free Tier
- **Cost**: $0/month
- **Limitations**: 
  - 750 hours/month (enough for demos)
  - Sleeps after 15 minutes of inactivity
  - Slower cold starts

### Starter Plan
- **Cost**: $7/month
- **Benefits**:
  - Always-on (no sleeping)
  - Faster performance
  - More compute resources
  - Better for production use

## 🚀 Go Live Checklist

Before sharing your deployment:

- [ ] ✅ Build completes successfully
- [ ] ✅ All environment variables configured
- [ ] ✅ Database has all 4 migrations
- [ ] ✅ Health endpoint returns "ok"
- [ ] ✅ Dashboard loads with data
- [ ] ✅ Case queue shows 16 cases
- [ ] ✅ AI analysis works for sample cases
- [ ] ✅ Images display (if extracted)
- [ ] ✅ No console errors in browser
- [ ] ✅ Custom domain configured (optional)

## 🎉 Success!

Your LuxeResolve Intelligence system is now live on the internet with:

- **Complete AI Pipeline**: 3 specialized agents with Groq
- **Real Fraud Detection**: 16 luxury marketplace cases
- **Production Ready**: HTTPS, monitoring, auto-deploy
- **Scalable**: Can handle real-world traffic
- **Maintainable**: Easy updates via GitHub

**🌐 Live Demo**: [https://luxeresolve.onrender.com](https://luxeresolve.onrender.com)

**Share your live URL**: `https://your-app.onrender.com`

---

## 🆘 Need Help?

If you encounter issues:
1. Check Render build logs for specific errors
2. Verify all environment variables are set correctly
3. Test database connection in Supabase dashboard
4. Confirm Groq API key is working at console.groq.com
5. Review this guide step-by-step

**🎯 Result**: A fully functional, production-ready AI fraud detection system accessible worldwide!