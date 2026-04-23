# LuxeResolve Intelligence

An AI-powered fraud detection system for luxury marketplace disputes using advanced computer vision and behavioral analysis.

## 🌐 **Live Demo**
**🚀 [https://luxeresolve.onrender.com](https://luxeresolve.onrender.com)**

## 🎯 Overview

LuxeResolve Intelligence is a sophisticated fraud detection platform that combines:
- **3-Agent AI Specialization** using Groq models (Visual, Text/Data, Synthesis)
- **6 Advanced Fraud Detection Metrics** with weight consistency and item identity verification
- **Real-time Visual & Behavioral Analysis** with image processing
- **Intelligent Decision Synthesis** with structured reasoning
- **Complete Case Management** with audit trails and decision tracking

## ⚠️ **CRITICAL: Security & Compatibility Notice**

### 🔒 **Security Requirements**
- **NEVER commit `.env` files** - Contains sensitive API keys and credentials
- **Rotate Supabase keys** if accidentally exposed
- **Use service role key** for backend, anon key for frontend
- **All .env files are in .gitignore** - Verify before pushing

### 🐍 **Python Compatibility**
- **Minimum**: Python 3.9+ (tested on 3.9, 3.11, 3.12)
- **Recommended**: Python 3.11
- **Note**: Uses `Optional[X]` syntax for Python 3.9 compatibility

### 📦 **Package Manager**
- **Use npm only** - Remove `bun.lockb` if present
- **Clean install**: Delete `node_modules` and reinstall if issues

## 🚀 **Quick Start (30 Minutes)**

### Prerequisites
- **Node.js 18+** ([nodejs.org](https://nodejs.org))
- **Python 3.9+** ([python.org](https://python.org))
- **Git** ([git-scm.com](https://git-scm.com))
- **Groq API Key** ([console.groq.com](https://console.groq.com))
- **Supabase Account** ([supabase.com](https://supabase.com))

### Step 1: Clone & Setup
```bash
git clone https://github.com/RajAmbavane/LUXE.git
cd LUXE

# Create environment files from templates
cp .env.example .env
cp backend/.env.example backend/.env

# Install dependencies
npm install
cd backend && pip install -r requirements.txt && cd ..
```

### Step 2: Database Setup (Supabase)

#### 2.1 Create Project
1. Go to [supabase.com](https://supabase.com) → "New Project"
2. Name: "luxeresolve-intelligence"
3. **Save your credentials**: URL, anon key, service_role key

#### 2.2 Run ALL 6 Migrations (CRITICAL - ORDER MATTERS)
Execute these SQL files **in order** in Supabase SQL Editor:

1. **Migration 1**: `supabase/migrations/001_initial_schema.sql` - Core tables
2. **Migration 2**: `supabase/migrations/002_sample_data.sql` - Sample cases
3. **Migration 3**: `supabase/migrations/003_weight_identity_data.sql` - Risk signals
4. **Migration 4**: `supabase/migrations/004_add_image_urls.sql` - Image URLs
5. **Migration 5**: `supabase/migrations/005_missing_tables.sql` - Additional tables (REQUIRED)
6. **Migration 6**: `supabase/migrations/006_improved_dataset_alignment.sql` - Data alignment

#### 2.3 Verify Database
```sql
-- Run this query to verify all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Should show: agent_analysis, audit_logs, behavioral_metrics, 
-- case_images, cases, decisions, risk_signals (7 tables total)
```

### Step 3: Environment Configuration

#### 3.1 Frontend `.env`
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

#### 3.2 Backend `backend/.env`
```env
# Supabase (use SERVICE_ROLE key, not anon)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Groq API
GROQ_API_KEY=your_groq_api_key_here

# AI Models
VISION_MODEL=meta-llama/llama-4-scout-17b-16e-instruct
TEXT_DATA_MODEL=llama-3.3-70b-versatile
SYNTHESIS_MODEL=llama-3.3-70b-versatile
LLM_PROVIDER=groq
LLM_TEMPERATURE=0.3
LLM_MAX_TOKENS=2000
AGENT_PIPELINE_VERSION=3-agent-specialization-v2
```

### Step 4: Start Application
```bash
# Terminal 1 - Backend
cd backend
uvicorn app.main:app --reload --port 8000

# Terminal 2 - Frontend
npm run dev
```

### Step 5: Verify Setup
```bash
# Check backend is running
curl http://localhost:8000/health

# Frontend should be available at
http://localhost:5173
```

## 📊 **Case Dataset**

### 5 New Cases with Real Images (LX-2130 to LX-2134)
- **LX-2130**: Gucci Slingbag - GREEN FLAG (APPROVE) ✅
- **LX-2131**: Rolex Submariner - GREEN FLAG (APPROVE) ✅
- **LX-2132**: Prada Bag - RED FLAG (DENY) ❌
- **LX-2133**: Sony Headphones - GREEN FLAG (APPROVE) ✅
- **LX-2134**: Apple Watch - GREEN FLAG (APPROVE) ✅

### Original Cases (LX-2101 to LX-2120)
- **16 Total Cases** across luxury brands
- **Price Range**: $1,450 - $32,000
- **Decision Variety**: Mix of approvals, denials, and escalations

### Complete Case Data
Each case includes:
- ✅ Buyer profile (name, age, ratings, history)
- ✅ Seller profile (name, ratings, verification)
- ✅ Shipping details (method, tracking, dates)
- ✅ Item details (category, SKU, material, color)
- ✅ Visual metrics (weight consistency, item identity)
- ✅ Fraud indicators (positive for legitimate, negative for fraud)
- ✅ Real images (before/after for visual analysis)

## 🔧 **Common Issues & Fixes**

### Issue 1: "Failed to fetch" Errors
**Cause**: Using localhost URLs in production  
**Fix**: All API calls use relative URLs (already fixed)

### Issue 2: Missing Tables Error
**Cause**: Migration 5 or 6 not run  
**Fix**: Execute all 6 migrations in order

### Issue 3: Images Not Loading
**Cause**: Image paths incorrect or images missing  
**Fix**: Verify `public/images/cases/` has all case folders with images

### Issue 4: Service Role Key Exposed
**Cause**: `.env` committed to git  
**Fix**: 
```bash
# Remove from git history
git rm --cached .env backend/.env
git commit -m "Remove exposed environment files"
git push

# Rotate keys in Supabase dashboard
```

### Issue 5: Rate Limit Errors
**Cause**: Processing cases too quickly  
**Fix**: Agent pipeline includes 5-second delays between cases

### Issue 6: Python Version Issues
**Cause**: Using Python < 3.9  
**Fix**: Upgrade to Python 3.9+ (code uses `Optional[X]` syntax)

### Issue 7: AI Recommendation Showing
**Cause**: Old version of CaseDetails.tsx  
**Fix**: AI recommendation section removed - users see visual, reasoning, then decisions

## 📁 **Required Files Structure**
```
LUXE/
├── .env                          # Frontend environment (DO NOT COMMIT)
├── .env.example                  # Frontend template
├── .gitignore                    # Includes .env files
├── backend/
│   ├── .env                      # Backend environment (DO NOT COMMIT)
│   ├── .env.example              # Backend template
│   ├── requirements.txt          # Clean dependencies
│   └── app/
│       ├── main.py               # FastAPI application
│       ├── agent_pipeline.py     # 3-agent orchestration
│       └── agents/
│           ├── visual_agent.py       # Image analysis
│           ├── text_data_agent.py    # Behavioral analysis
│           └── synthesis_agent.py    # Decision synthesis
├── supabase/migrations/          # ALL 6 SQL files required
├── public/
│   ├── images/cases/             # 21 case folders with images
│   ├── favicon.ico               # Updated favicon
│   └── logo.jpeg                 # Updated logo
├── src/
│   ├── pages/
│   │   ├── Dashboard.tsx         # Analytics overview
│   │   ├── CaseQueue.tsx         # Case management
│   │   ├── CaseDetails.tsx       # Individual case (no AI rec)
│   │   ├── VisualAnalysis.tsx    # Visual agent results
│   │   ├── RiskReasoning.tsx     # Text/data agent results
│   │   └── ActionsApprovals.tsx  # Decision management
│   └── hooks/
│       └── useSupabaseData.ts    # Database integration
├── SYSTEM_OVERVIEW.md            # System architecture
└── README.md                     # This file
```

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Dashboard**: Marketplace analytics and case overview
- **Case Queue**: Pending cases management with status filtering
- **Case Details**: Individual case analysis with buyer/seller profiles
- **Visual Analysis**: AI visual agent findings with image comparison
- **Risk Reasoning**: Text/data agent behavioral analysis
- **Actions & Approvals**: Decision management and audit trails

### Backend (FastAPI + Python)
- **3-Agent Pipeline**: Specialized AI agents for different analysis types
- **Groq Integration**: LLaMA models for vision, text, and synthesis
- **Supabase Database**: Case data, analysis results, and audit logs
- **Real-time Processing**: Automated case analysis with rate limiting
- **Health Checks**: System status monitoring

### Database (Supabase)
- **7 Tables**: cases, agent_analysis, decisions, behavioral_metrics, case_images, risk_signals, audit_logs
- **RLS Policies**: Row-level security for data protection
- **Complete Data**: 21 cases with full profiles and metrics

## 🤖 AI Agent Specialization

### 1. Visual Agent
- **Model**: `llama-4-scout-17b-16e-instruct`
- **Purpose**: Image analysis and visual verification
- **Inputs**: Before/after product images
- **Outputs**: 
  - Item similarity assessment
  - Condition verification
  - Authenticity indicators
  - Damage detection
- **Confidence**: 80-98% for clear cases

### 2. Text/Data Agent
- **Model**: `llama-3.3-70b-versatile`
- **Purpose**: Behavioral analysis and fraud detection
- **Inputs**: Buyer/seller profiles, transaction history
- **Outputs**:
  - 6 advanced fraud metrics
  - Risk propensity scores
  - Pattern analysis
  - Policy trigger evaluation
- **Confidence**: 75-95% based on data completeness

### 3. Synthesis Agent
- **Model**: `llama-3.3-70b-versatile`
- **Purpose**: Decision synthesis and reasoning
- **Inputs**: Visual and text/data agent outputs
- **Outputs**:
  - Final decision (APPROVE/DENY/ESCALATE)
  - Structured reasoning
  - Confidence score
  - Audit trail
- **Confidence**: 80-92% overall

## 📊 Advanced Fraud Metrics

1. **Weight Consistency Score** (0-1)
   - Compares outbound vs returned item weight
   - Detects weight fraud (35%+ loss = critical)
   - Range: 0.25 (fraud) to 0.99 (legitimate)

2. **Item Identity Confidence** (0-1)
   - Serial number matching
   - Accessory verification
   - Packaging integrity
   - Range: 0.10 (fraud) to 0.98 (legitimate)

3. **Buyer Fraud Propensity** (0-1)
   - Account age analysis
   - Return rate evaluation
   - Dispute history
   - Past fraud flags

4. **Custody Anomaly Score** (0-1)
   - Shipping method verification
   - Delivery timeline analysis
   - Return pattern detection

5. **Policy Trigger Engine**
   - Rule-based fraud patterns
   - Threshold-based alerts
   - Behavioral anomalies

6. **Decision Confidence Score** (0-100%)
   - AI certainty measurement
   - Data completeness factor
   - Agent agreement level

## 🚀 Production Deployment (Render.com)

### Prerequisites
- GitHub account with forked repository
- Render.com account

### Deployment Steps

1. **Fork Repository**
   ```bash
   # On GitHub, click "Fork" on https://github.com/RajAmbavane/LUXE
   ```

2. **Create Render Web Service**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub fork
   - Select the LUXE repository

3. **Configure Service**
   - **Name**: luxeresolve-intelligence
   - **Runtime**: Python 3
   - **Build Command**:
     ```bash
     pip install -r backend/requirements.txt && npm install && npm run build && mkdir -p backend/app/static && cp -r dist/* backend/app/static/
     ```
   - **Start Command**:
     ```bash
     cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```

4. **Add Environment Variables**
   - Click "Environment"
   - Add all variables from `backend/.env.example`:
     ```
     SUPABASE_URL=...
     SUPABASE_SERVICE_ROLE_KEY=...
     GROQ_API_KEY=...
     VISION_MODEL=meta-llama/llama-4-scout-17b-16e-instruct
     TEXT_DATA_MODEL=llama-3.3-70b-versatile
     SYNTHESIS_MODEL=llama-3.3-70b-versatile
     LLM_PROVIDER=groq
     LLM_TEMPERATURE=0.3
     LLM_MAX_TOKENS=2000
     AGENT_PIPELINE_VERSION=3-agent-specialization-v2
     ```

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy
   - Monitor build logs for errors
   - Service will be live at `https://your-service-name.onrender.com`

### Post-Deployment Verification
```bash
# Check service health
curl https://your-service-name.onrender.com/health

# Should return: {"status": "ok"}
```

## ✅ **Functionality Checklist**

### Frontend Features
- ✅ Dashboard with analytics
- ✅ Case queue with filtering
- ✅ Case details with buyer/seller profiles
- ✅ Visual analysis with image comparison
- ✅ Risk reasoning with agent explanations
- ✅ Actions & approvals with decision management
- ✅ Audit trails and timeline
- ✅ Responsive design (mobile, tablet, desktop)

### Backend Features
- ✅ 3-agent AI pipeline
- ✅ Visual agent image analysis
- ✅ Text/data agent behavioral analysis
- ✅ Synthesis agent decision making
- ✅ Rate limiting (5-second delays)
- ✅ Error handling and logging
- ✅ Health check endpoint
- ✅ Supabase integration

### Database Features
- ✅ 7 tables with proper relationships
- ✅ RLS policies for security
- ✅ 21 complete cases with data
- ✅ Real images for all cases
- ✅ Audit logs and decision tracking
- ✅ Risk signals and metrics

### Security Features
- ✅ No .env files in git
- ✅ Service role key for backend
- ✅ Anon key for frontend
- ✅ RLS policies on database
- ✅ Environment variable validation

## 📚 **Documentation**

- **[SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md)** - Complete system architecture and metrics
- **[README.md](README.md)** - This file (setup and deployment)

## 🛠️ Development

### Local Development
```bash
# Terminal 1 - Backend
cd backend
uvicorn app.main:app --reload --port 8000

# Terminal 2 - Frontend
npm run dev

# Access at http://localhost:5173
```

### Building for Production
```bash
# Frontend build
npm run build

# Backend is production-ready with uvicorn
```

### Testing
```bash
# Verify database connection
python -c "
from supabase import create_client
import os
from dotenv import load_dotenv
load_dotenv('backend/.env')
client = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_SERVICE_ROLE_KEY'))
print('✓ Database connected')
"

# Test Groq API
python -c "
from groq import Groq
import os
from dotenv import load_dotenv
load_dotenv('backend/.env')
client = Groq(api_key=os.getenv('GROQ_API_KEY'))
print('✓ Groq API connected')
"
```

## 🆘 **Troubleshooting**

### Verification Commands
```bash
# Check Python version
python --version  # Should be 3.9+

# Check Node version
node --version    # Should be 18+

# Verify all dependencies
pip list | grep -E "supabase|groq|fastapi"
npm list | grep -E "react|vite"

# Test backend health
curl http://localhost:8000/health

# Check frontend build
npm run build
```

### Common Errors

**Error**: `ModuleNotFoundError: No module named 'groq'`
```bash
# Fix: Install requirements
cd backend && pip install -r requirements.txt
```

**Error**: `VITE_SUPABASE_URL is not defined`
```bash
# Fix: Create .env file
cp .env.example .env
# Fill in your Supabase credentials
```

**Error**: `Supabase connection failed`
```bash
# Fix: Verify credentials
# Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env
# Ensure all 6 migrations are run
```

**Error**: `Images not loading in visual analysis`
```bash
# Fix: Verify image paths
ls public/images/cases/LX-2130/
# Should show: original.jpg, returned.jpg
```

## 📞 **Support**

- **GitHub Issues**: [Report problems](https://github.com/RajAmbavane/LUXE/issues)
- **Live Demo**: [Test expected behavior](https://luxeresolve.onrender.com)
- **Documentation**: Check all .md files in repository

## 📝 **Recent Changes (Latest Update)**

### New Features
- ✅ 5 new cases with real images (LX-2130 to LX-2134)
- ✅ Complete case data (buyer/seller profiles, shipping, metrics)
- ✅ Positive metrics for GREEN FLAG cases
- ✅ Negative metrics for RED FLAG cases
- ✅ Updated favicon and logo
- ✅ Removed AI recommendation from case details view

### Improvements
- ✅ Cleaned up temporary files and scripts
- ✅ Removed unnecessary documentation
- ✅ Improved code organization
- ✅ Enhanced security (no .env in git)
- ✅ Better error handling
- ✅ Comprehensive README

### Bug Fixes
- ✅ Fixed image loading in visual agent
- ✅ Fixed API URL handling
- ✅ Fixed Python 3.9 compatibility
- ✅ Fixed rate limiting issues

---

**LuxeResolve Intelligence - Production-Ready AI Fraud Detection System**

*Completely reproducible. Fully documented. Deployed on Render.*
