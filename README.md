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
- **Real-time Processing**: Automated case analysis

### Database (Supabase)
- **Cases**: Transaction and dispute data
- **Agent Analysis**: AI findings and metrics
- **Risk Signals**: Weight consistency and identity data

## 🤖 AI Agent Specialization

### 1. Visual Agent
- **Model**: `llama-4-scout-17b-16e-instruct`
- **Purpose**: Image analysis and visual verification
- **Outputs**: Similarity, condition, authenticity assessment

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

## 🔄 Complete Reproducibility Guide

### 📚 Documentation Files
- **[COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md)** - Detailed step-by-step reproduction guide
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Essential commands and troubleshooting
- **[DATA_MANIFEST.md](DATA_MANIFEST.md)** - Complete inventory of all data and assets
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Vercel deployment instructions

### 🚀 Quick Start (30 minutes)
1. **Clone Repository**: `git clone https://github.com/RajAmbavane/LUXE.git`
2. **Follow Setup Guide**: See [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md)
3. **Extract Images**: From `cases (2).xlsx` to `public/images/cases/`
4. **Run Migrations**: 4 SQL files in Supabase
5. **Configure Environment**: API keys in `.env` files
6. **Install & Run**: `npm install` + `pip install -r requirements.txt`
7. **Verify**: `python verify_setup.py` should show 6/6 checks passed

### ✅ What You Get
- **16 Luxury Cases** with complete fraud detection data
- **32 Risk Signals** (weight consistency + item identity)
- **3-Agent AI Pipeline** with Groq specialization
- **Before/After Images** for visual fraud analysis
- **Varied Decisions** (3 APPROVE, 9 DENY, 4 ESCALATE)
- **Production Deployment** ready for Vercel

### Prerequisites
- Node.js 18+
- Python 3.9+
- Supabase account
- Groq API key

### Step 1: Clone Repository
```bash
git clone https://github.com/RajAmbavane/LUXE.git
cd LUXE
```

### Step 2: Database Setup (Supabase)

#### 2.1 Create Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create new project
3. Note your project URL and keys

#### 2.2 Run Database Migrations
Execute these SQL files in order in your Supabase SQL Editor:

**Migration 1: Initial Schema**
```sql
-- Copy and paste content from: supabase/migrations/001_initial_schema.sql
-- This creates: cases, agent_analysis, risk_signals tables with indexes
```

**Migration 2: Sample Data**
```sql
-- Copy and paste content from: supabase/migrations/002_sample_data.sql
-- This inserts: 16 luxury marketplace dispute cases with complete metadata
```

**Migration 3: Weight & Identity Data**
```sql
-- Copy and paste content from: supabase/migrations/003_weight_identity_data.sql
-- This populates: Weight consistency and item identity verification data
```

**Migration 4: Image URLs**
```sql
-- Copy and paste content from: supabase/migrations/004_add_image_urls.sql
-- This adds: Image URL columns and links to case images
```

#### 2.3 Extract Case Images
The repository includes a `cases (2).xlsx` file with before/after images for all 16 cases.

**Extract Images from Excel:**
1. Run the setup script: `python extract_images_from_excel.py`
2. Open `cases (2).xlsx` in Excel
3. For each case, right-click on images and select "Save as Picture"
4. Save images with exact names:
   - `public/images/cases/LX-2101/original.jpg`
   - `public/images/cases/LX-2101/returned.jpg`
   - (Repeat for all 16 cases)
5. Verify setup: `python verify_images.py`

**Image Requirements:**
- Format: JPG or PNG
- Size: Minimum 800x800px recommended
- Quality: High resolution for AI visual analysis
- Naming: Exactly `original.jpg` and `returned.jpg`

#### 2.4 Verify Database Setup
Run this query to confirm setup:
```sql
-- Verify all tables and data
SELECT 
    'Cases' as table_name, COUNT(*) as record_count 
FROM cases
UNION ALL
SELECT 
    'Risk Signals' as table_name, COUNT(*) as record_count 
FROM risk_signals
UNION ALL
SELECT 
    'Cases with Images' as table_name, COUNT(*) as record_count 
FROM cases 
WHERE original_image_url IS NOT NULL AND returned_image_url IS NOT NULL;

-- Should show: Cases: 16, Risk Signals: 32, Cases with Images: 16
```

### Step 3: Environment Configuration

#### 3.1 Frontend Environment
Create `.env` in root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### 3.2 Backend Environment
Create `backend/.env`:
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Groq API Configuration
GROQ_API_KEY=your_groq_api_key
LLM_API_KEY=your_groq_api_key

# 3-Agent Model Configuration
VISION_MODEL=meta-llama/llama-4-scout-17b-16e-instruct
TEXT_DATA_MODEL=llama-3.3-70b-versatile
SYNTHESIS_MODEL=llama-3.3-70b-versatile

# Application Configuration
LLM_PROVIDER=groq
LLM_TEMPERATURE=0.3
LLM_MAX_TOKENS=2000
PORT=8000
AGENT_PIPELINE_VERSION=3-agent-specialization-v2
```

### Step 4: Install Dependencies

#### 4.1 Frontend Dependencies
```bash
npm install
```

#### 4.2 Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 5: Run the Application

#### 5.1 Start Backend Server
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

#### 5.2 Start Frontend Development Server
```bash
# In new terminal, from root directory
npm run dev
```

#### 5.3 Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Step 6: Verify System Operation

#### 6.1 Check Case Processing
```bash
cd backend
python show_all_decisions.py
```

Expected output:
```
🟢 APPROVE:  3 cases (19%)
🔴 DENY:     9 cases (56%) 
🟡 ESCALATE: 4 cases (25%)
   TOTAL:    16 cases
```

#### 6.2 Test Frontend Features
1. **Dashboard**: View marketplace analytics
2. **Case Queue**: Browse 16 sample cases
3. **Case Details**: Click any case for detailed analysis
4. **Risk Reasoning**: View AI decision explanations
5. **Actions & Approvals**: See decision recommendations

#### 6.3 Verify AI Pipeline
The system should automatically process cases showing:
- Visual analysis results
- Behavioral analysis with 6 metrics
- Synthesis decisions (APPROVE/DENY/ESCALATE)
- Structured AI reasoning

## 📊 Sample Dataset Details

### Case Distribution
- **16 Total Cases** across luxury brands (Rolex, Hermès, Cartier, etc.)
- **Price Range**: $1,850 - $35,000
- **Dispute Types**: Return Fraud, Counterfeit, Item Not As Described, Shipping Damage
- **Decision Variety**: 3 Approvals, 9 Denials, 4 Escalations

### Fraud Indicators
- **Weight Discrepancies**: 8% - 70% variations
- **Identity Confidence**: 10% - 90% verification levels
- **Buyer Risk Profiles**: New accounts to established users
- **Fraud History**: 0-7 previous fraud flags

### Key Test Cases
- **LX-2105**: Clear approval (shipping damage, high identity confidence)
- **LX-2120**: Clear denial (70% weight loss, multiple fraud flags)
- **LX-2109**: Escalation (mixed signals, moderate risk)

## 🚀 Deployment

### Vercel Deployment
1. Connect repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

See `DEPLOYMENT_GUIDE.md` for detailed deployment instructions.

## 🛠️ Development

### Backend Structure
```
backend/
├── app/
│   ├── agents/           # AI agent implementations
│   │   ├── visual_agent.py      # Image analysis
│   │   ├── text_data_agent.py   # Behavioral analysis
│   │   └── synthesis_agent.py   # Decision synthesis
│   ├── main.py          # FastAPI application
│   ├── agent_pipeline.py # Agent orchestration
│   └── signals.py       # Risk signal processing
├── requirements.txt     # Python dependencies
└── show_all_decisions.py # Decision monitoring utility
```

### Frontend Structure
```
src/
├── components/          # React components
├── pages/              # Application pages
│   ├── Dashboard.tsx        # Analytics overview
│   ├── CaseQueue.tsx        # Case management
│   ├── CaseDetails.tsx      # Individual case view
│   └── RiskReasoning.tsx    # AI explanations
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── integrations/       # Supabase integration
```

### Database Schema
```
cases                    # Core case data
├── id (UUID)           # Primary key
├── case_id (VARCHAR)   # Human-readable ID
├── metadata (JSONB)    # Flexible case data
└── ... (50+ columns)   # Comprehensive case fields

agent_analysis          # AI analysis results
├── case_id (UUID)      # Foreign key to cases
├── agent_name          # visual_agent, text_data_agent, synthesis_agent
├── findings (JSONB)    # Detailed AI findings
└── reasoning (TEXT)    # Human-readable explanations

risk_signals           # Fraud detection metrics
├── case_id (UUID)     # Foreign key to cases
├── signal_name        # Weight Consistency, Item Identity Confidence
├── impact_score       # Numerical risk score
└── metadata (JSONB)   # Signal-specific data
```

## 📈 Expected Results

After successful setup, you should observe:

### Decision Distribution
- **Varied Decisions**: Not all cases result in the same outcome
- **Risk-Based Logic**: High-risk cases → DENY, Low-risk → APPROVE
- **Mixed Signals**: Conflicting evidence → ESCALATE

### AI Reasoning Quality
- **Structured Format**: Clear decision at top, detailed analysis below
- **6 Metrics Visible**: All advanced fraud metrics displayed
- **Evidence-Based**: Decisions supported by specific data points

### Performance Metrics
- **Processing Speed**: ~2-3 seconds per case analysis
- **Decision Confidence**: 60-95% confidence scores
- **Database Integration**: Real-time weight/identity data usage

## 🔧 Troubleshooting

### Common Issues

#### Database Connection
```bash
# Test Supabase connection
python -c "
from supabase import create_client
import os
from dotenv import load_dotenv
load_dotenv()
client = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_SERVICE_ROLE_KEY'))
print('✓ Database connected:', len(client.table('cases').select('*').execute().data), 'cases found')
"
```

#### Groq API Issues
```bash
# Test Groq API
python -c "
from groq import Groq
import os
from dotenv import load_dotenv
load_dotenv()
client = Groq(api_key=os.getenv('GROQ_API_KEY'))
print('✓ Groq API connected')
"
```

#### Frontend Build Issues
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Support Resources
- **Supabase Docs**: https://supabase.com/docs
- **Groq API Docs**: https://console.groq.com/docs
- **Vite Docs**: https://vitejs.dev/guide/

## 📊 Monitoring

### Decision Monitoring
```bash
cd backend
python show_all_decisions.py
```

### Database Queries
```sql
-- View case metrics summary
SELECT * FROM case_metrics_summary ORDER BY case_id;

-- Check AI analysis status
SELECT agent_name, COUNT(*) as analyses_count 
FROM agent_analysis 
GROUP BY agent_name;

-- Monitor risk signals
SELECT signal_name, AVG(impact_score) as avg_impact
FROM risk_signals 
GROUP BY signal_name;
```

## 📄 License

This project is proprietary software for LuxeResolve Intelligence.

## 🤝 Contributing

This is a private project. Contact the development team for contribution guidelines.

---

## 🎯 Success Criteria

After following this guide, you should have:
- ✅ **Complete Database**: 16 cases with 32 risk signals
- ✅ **Working AI Pipeline**: 3 agents processing cases
- ✅ **Varied Decisions**: Mix of APPROVE/DENY/ESCALATE outcomes
- ✅ **Frontend Interface**: All pages functional and displaying data
- ✅ **Real-time Processing**: Cases analyzed with AI reasoning
- ✅ **Reproducible System**: Anyone can recreate from scratch

This system demonstrates advanced AI-powered fraud detection with real-world complexity and production-ready architecture.