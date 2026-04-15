# 🚀 LuxeResolve Intelligence - Deployment Guide

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ Supabase project with database setup
- ✅ Groq API key
- ✅ GitHub repository (https://github.com/RajAmbavane/LUXE)
- ✅ Vercel account

## 🌐 Vercel Deployment Steps

### 1. Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import from GitHub: `RajAmbavane/LUXE`
4. Select the repository and click "Import"

### 2. Configure Environment Variables

In Vercel project settings, add these environment variables:

#### Frontend Environment Variables
```env
VITE_SUPABASE_URL=https://gsjsvycqsaxzmdnworbk.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Backend Environment Variables (for API routes)
```env
GROQ_API_KEY=your_groq_api_key_here
SUPABASE_URL=https://gsjsvycqsaxzmdnworbk.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# 3-Agent Configuration
VISION_MODEL=meta-llama/llama-4-scout-17b-16e-instruct
TEXT_DATA_MODEL=llama-3.3-70b-versatile
SYNTHESIS_MODEL=llama-3.3-70b-versatile
LLM_PROVIDER=groq
LLM_API_KEY=your_groq_api_key_here
LLM_TEMPERATURE=0.3
LLM_MAX_TOKENS=2000
PORT=8000
```

### 3. Deploy

1. Click "Deploy" in Vercel
2. Wait for build to complete
3. Your app will be available at: `https://your-project-name.vercel.app`

## 🔧 Configuration Details

### Build Settings
- **Framework**: Vite (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### API Routes
- Backend API accessible at: `/api/*`
- Automatically routed to Python backend
- FastAPI integration with Vercel Functions

## 🗄️ Database Setup

Your Supabase database should have these tables:
- `cases` - Case data and metadata
- `agent_analysis` - AI analysis results
- `risk_signals` - Weight and identity data

## 🧪 Testing Deployment

After deployment, test these endpoints:
- Frontend: `https://your-app.vercel.app`
- API Health: `https://your-app.vercel.app/api/health`
- Case Processing: `https://your-app.vercel.app/api/process-cases`

## 📊 Monitoring

Use these tools to monitor your deployment:
- Vercel Analytics (built-in)
- Vercel Functions logs
- Supabase Dashboard for database monitoring

## 🔄 Continuous Deployment

The repository is configured for automatic deployment:
- Push to `main` branch triggers deployment
- Environment variables persist across deployments
- Zero-downtime deployments

## 🚨 Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check environment variables are set
   - Verify all dependencies in package.json

2. **API Errors**
   - Ensure Groq API key is valid
   - Check Supabase connection strings

3. **Database Connection Issues**
   - Verify Supabase service role key
   - Check database table structure

### Support
- Check Vercel deployment logs
- Review browser console for frontend errors
- Monitor Supabase logs for database issues

## 🎯 Success Metrics

After successful deployment, you should see:
- ✅ Frontend loads without errors
- ✅ Dashboard shows marketplace analytics
- ✅ Case processing works end-to-end
- ✅ AI reasoning displays properly
- ✅ All 16 cases show varied decisions

## 📈 Performance Optimization

For production optimization:
- Enable Vercel Analytics
- Configure caching headers
- Monitor API response times
- Set up error tracking

---

🎉 **Congratulations!** Your LuxeResolve Intelligence system is now deployed and ready for production use.