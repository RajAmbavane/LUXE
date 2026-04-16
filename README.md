# LuxeResolve Intelligence

An AI-powered fraud detection system for luxury marketplace disputes using advanced computer vision and behavioral analysis.

## 🌐 **Live Demo**
**🚀 [https://luxeresolve.onrender.com](https://luxeresolve.onrender.com)**

## 🎯 Overview

LuxeResolve Intelligence is a sophisticated fraud detection platform that combines:
- **3-Agent AI Specialization** using Groq models
- **6 Advanced Fraud Detection Metrics**
- **Real-time Visual & Behavioral Analysis**
- **Intelligent Decision Synthesis**

## ⚠️ **CRITICAL: Security & Compatibility Notice**

### 🔒 **Security Requirements**
- **NEVER commit `.env` files** - Contains sensitive API keys
- **Rotate Supabase keys** if accidentally exposed
- **Use service role key** for backend, anon key for frontend

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

#### 2.2 Run ALL 5 Migrations (CRITICAL)
Execute these SQL files **in order** in Supabase SQL Editor:

**Migration 1**: `supabase/migrations/001_initial_schema.sql`
**Migration 2**: `supabase/migrations/002_sample_cases.sql`  
**Migration 3**: `supabase/migrations/003_weight_identity_data.sql`
**Migration 4**: `supabase/migrations/004_add_image_urls.sql`
**Migration 5**: `supabase/migrations/005_missing_tables.sql` ⚠️ **REQUIRED**

#### 2.3 Verify Database
```sql
-- Run this query to verify all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Should show: agent_analysis, audit_logs, behavioral_metrics, 
-- case_images, cases, decisions, risk_signals
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

### Step 4: Extract Images (REQUIRED)
```bash
# Use the working image extraction script
python extract_images_real.py

# Verify extraction worked
python verify_image_content.py
# Should show: ✅ All 16 cases have both images
```

### Step 5: Start Application
```bash
# Terminal 1 - Backend
cd backend
uvicorn app.main:app --reload --port 8000

# Terminal 2 - Frontend
npm run dev
```

### Step 6: Verify Setup
```bash
# Run comprehensive verification
python verify_setup.py
# Should show: ✅ 6/6 checks passed

# Check decision distribution
python backend/show_all_decisions.py
# Should show: 3 APPROVE, 9 DENY, 4 ESCALATE
```

## 🔧 **Common Issues & Fixes**

### Issue 1: "Failed to fetch" Errors
**Cause**: Using localhost URLs in production  
**Fix**: All API calls use relative URLs (already fixed)

### Issue 2: Missing Tables Error
**Cause**: Migration 5 not run  
**Fix**: Execute `supabase/migrations/005_missing_tables.sql`

### Issue 3: Python Syntax Error (3.9)
**Cause**: `X | None` syntax used  
**Fix**: Code uses `Optional[X]` for compatibility

### Issue 4: Image Loading Failed
**Cause**: Visual agent can't load local images  
**Fix**: Updated `_url_to_base64()` to handle filesystem paths

### Issue 5: Service Role Key Exposed
**Cause**: `.env` committed to git  
**Fix**: 
```bash
# Remove from git history
git rm --cached .env backend/.env
git commit -m "Remove exposed environment files"
git push --force

# Rotate keys in Supabase dashboard
# Add to .gitignore (already done)
```

### Issue 6: Rate Limit Errors
**Cause**: Processing 16 cases too quickly  
**Fix**: Added 5-second delays between cases

### Issue 7: Wrong Environment Variable Names
**Cause**: Mismatch between code and docs  
**Fix**: Use `VITE_SUPABASE_ANON_KEY` (standardized)

## 📁 **Required Files Structure**
```
LUXE/
├── .env                     # Frontend environment (DO NOT COMMIT)
├── .env.example            # Frontend template
├── backend/
│   ├── .env                # Backend environment (DO NOT COMMIT)  
│   ├── .env.example        # Backend template
│   └── requirements.txt    # Clean dependencies (no TensorFlow)
├── supabase/migrations/    # ALL 5 SQL files required
├── public/images/cases/    # 16 case folders with images
├── extract_images_real.py  # Working image extraction
└── verify_setup.py         # Comprehensive verification
```

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Dashboard**: Marketplace analytics and case overview
- **Case Queue**: Pending cases management  
- **Case Details**: Individual case analysis
- **Risk Reasoning**: AI decision explanations
- **Actions & Approvals**: Decision management

### Backend (FastAPI + Python)
- **3-Agent Pipeline**: Visual, Text/Data, and Synthesis agents
- **Groq Integration**: Specialized AI models for each task
- **Supabase Database**: Case data and analysis storage
- **Real-time Processing**: Automated case analysis with rate limiting

### Database (Supabase)
- **7 Tables**: cases, agent_analysis, decisions, behavioral_metrics, case_images, risk_signals, audit_logs
- **RLS Policies**: Row-level security for data protection
- **32 Risk Signals**: Weight consistency and identity data for all 16 cases

## 🤖 AI Agent Specialization

### 1. Visual Agent
- **Model**: `llama-4-scout-17b-16e-instruct`
- **Purpose**: Image analysis and visual verification
- **Outputs**: Similarity, condition, authenticity assessment
- **Fixed**: Now handles local filesystem image paths

### 2. Text/Data Agent  
- **Model**: `llama-3.3-70b-versatile`
- **Purpose**: Behavioral analysis and fraud detection
- **Outputs**: 6 advanced fraud metrics

### 3. Synthesis Agent
- **Model**: `llama-3.3-70b-versatile`
- **Purpose**: Decision synthesis and reasoning
- **Outputs**: Final decision with structured reasoning

## 📊 Advanced Fraud Metrics

1. **Multi-Point Weight Consistency Score** - Physical verification
2. **Item Identity Confidence Score** - Serial/accessory matching
3. **Buyer Fraud Propensity Score** - Historical risk assessment
4. **Custody Anomaly Score** - Shipping irregularities
5. **Policy Trigger Engine** - Rule-based fraud patterns
6. **Decision Confidence Score** - AI certainty measurement

## 📚 **Complete Documentation**
- **[LuxeResolve_Team_Reproducibility_Guide.md](LuxeResolve_Team_Reproducibility_Guide.md)** - 5-page comprehensive guide
- **[COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md)** - Detailed step-by-step instructions
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Production deployment on Render
- **[DATA_MANIFEST.md](DATA_MANIFEST.md)** - Complete data inventory

## 🚀 Production Deployment

### Render.com (Recommended)
1. **Fork repository** to your GitHub
2. **Create Render account** and connect GitHub
3. **New Web Service** from your fork
4. **Configuration**:
   - Runtime: Python 3
   - Build: `pip install -r backend/requirements.txt && npm install && npm run build && mkdir -p backend/app/static && cp -r dist/* backend/app/static/`
   - Start: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. **Environment Variables**: Add all backend/.env variables
6. **Deploy**: Automatic build and deployment

## 📊 Sample Dataset Details

### Case Distribution
- **16 Total Cases** across luxury brands (Rolex, Hermès, Cartier, etc.)
- **Price Range**: $1,450 - $32,000
- **Decision Variety**: 3 Approvals (19%), 9 Denials (56%), 4 Escalations (25%)

### Fraud Indicators
- **Weight Discrepancies**: 5% - 70% variations between shipped and returned items
- **Identity Confidence**: 18% - 97% verification levels
- **Risk Profiles**: Mix of low, medium, and high-risk cases

## 🛠️ Development

### Backend Structure
```
backend/
├── app/
│   ├── agents/              # AI agent implementations
│   │   ├── visual_agent.py      # Image analysis (fixed local paths)
│   │   ├── text_data_agent.py   # Behavioral analysis  
│   │   └── synthesis_agent.py   # Decision synthesis
│   ├── main.py             # FastAPI application
│   ├── agent_pipeline.py   # Agent orchestration with rate limiting
│   └── signals.py          # Risk signal processing
├── requirements.txt        # Clean dependencies (no TensorFlow/Keras)
└── show_all_decisions.py   # Decision monitoring utility
```

### Frontend Structure  
```
src/
├── components/             # React components
├── pages/                 # Application pages
│   ├── Dashboard.tsx          # Analytics overview
│   ├── CaseQueue.tsx          # Case management
│   ├── CaseDetails.tsx        # Individual case view
│   └── RiskReasoning.tsx      # AI explanations
├── hooks/                 # Custom React hooks (fixed API URLs)
├── lib/                   # Utility functions
└── integrations/          # Supabase integration
```

## ✅ **Success Criteria**

After following this guide, you should have:
- ✅ **All 7 Database Tables** created and populated
- ✅ **16 Cases with Images** extracted and verified
- ✅ **3-Agent AI Pipeline** processing cases with rate limiting
- ✅ **Varied Decisions** (3 approve, 9 deny, 4 escalate)
- ✅ **Working Frontend** with all pages functional
- ✅ **No Security Issues** (no exposed keys)
- ✅ **Python 3.9+ Compatible** code

## 🆘 **Troubleshooting**

### Verification Commands
```bash
# Check Python version
python --version  # Should be 3.9+

# Verify database tables
python -c "
from supabase import create_client
import os
from dotenv import load_dotenv
load_dotenv('backend/.env')
client = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_SERVICE_ROLE_KEY'))
tables = client.table('information_schema.tables').select('table_name').eq('table_schema', 'public').execute()
print('Tables:', [t['table_name'] for t in tables.data])
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

# Verify images
ls public/images/cases/*/  # Should show original.jpg and returned.jpg for each case
```

### Get Help
- **GitHub Issues**: [Report problems](https://github.com/RajAmbavane/LUXE/issues)
- **Live Demo**: [Test expected behavior](https://luxeresolve.onrender.com)
- **Documentation**: Check all .md files in repository

---

**This system demonstrates production-ready AI fraud detection with complete reproducibility and security best practices.**