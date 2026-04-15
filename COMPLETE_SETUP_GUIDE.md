# Complete Setup Guide - LuxeResolve Intelligence

This guide contains **everything** needed to reproduce the LuxeResolve Intelligence system from scratch, including all data, images, and configuration steps.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Repository Setup](#repository-setup)
3. [Database Setup](#database-setup)
4. [Image Extraction](#image-extraction)
5. [Environment Configuration](#environment-configuration)
6. [Installation & Running](#installation--running)
7. [Verification](#verification)
8. [Deployment](#deployment)

## Prerequisites

### Required Accounts & Keys
- **Supabase Account**: [supabase.com](https://supabase.com) (Free tier sufficient)
- **Groq API Key**: [console.groq.com](https://console.groq.com) (Free tier sufficient)
- **Node.js**: Version 18+ ([nodejs.org](https://nodejs.org))
- **Python**: Version 3.9+ ([python.org](https://python.org))

### Get Your API Keys
1. **Supabase**:
   - Create project at supabase.com
   - Go to Settings → API
   - Copy: Project URL, anon key, service_role key

2. **Groq**:
   - Sign up at console.groq.com
   - Go to API Keys
   - Create new key and copy it

## Repository Setup

### Clone Repository
```bash
git clone https://github.com/RajAmbavane/LUXE.git
cd LUXE
```

### Verify Repository Contents
```bash
# Check all required files are present
ls -la
# Should see: README.md, package.json, backend/, src/, supabase/, public/
```

## Database Setup

### Step 1: Create Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose organization and enter project details
4. Wait for project to be ready (2-3 minutes)
5. Note your project URL and keys from Settings → API

### Step 2: Run Database Migrations

**IMPORTANT**: Run these SQL scripts in **exact order** in your Supabase SQL Editor:

#### Migration 1: Initial Schema
```sql
-- Copy ENTIRE content from: supabase/migrations/001_initial_schema.sql
-- Paste into Supabase SQL Editor and run
-- This creates: cases, agent_analysis, risk_signals tables
```

#### Migration 2: Sample Data  
```sql
-- Copy ENTIRE content from: supabase/migrations/002_sample_data.sql
-- Paste into Supabase SQL Editor and run
-- This inserts: 16 luxury marketplace dispute cases
```

#### Migration 3: Weight & Identity Data
```sql
-- Copy ENTIRE content from: supabase/migrations/003_weight_identity_data.sql
-- Paste into Supabase SQL Editor and run
-- This adds: 32 risk signals (weight + identity data)
```

#### Migration 4: Image URLs
```sql
-- Copy ENTIRE content from: supabase/migrations/004_add_image_urls.sql
-- Paste into Supabase SQL Editor and run
-- This adds: Image URL columns for visual analysis
```

### Step 3: Verify Database Setup
Run this verification query in Supabase SQL Editor:
```sql
-- Verification Query
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

-- Expected Results:
-- Cases: 16
-- Risk Signals: 32  
-- Cases with Images: 16
```

## Image Extraction

### The Excel File
The repository includes `cases (2).xlsx` with before/after images for all 16 cases.

### Extraction Process

#### Step 1: Setup Image Directories
```bash
python extract_images_from_excel.py
```

#### Step 2: Extract Images from Excel
1. **Open** `cases (2).xlsx` in Microsoft Excel
2. **For each case** (LX-2101 through LX-2120):

**Case LX-2101 - Rolex Submariner Date ($12,500)**
- Find the "BEFORE" image (original listing)
- Right-click → "Save as Picture" 
- Save as: `public/images/cases/LX-2101/original.jpg`
- Find the "AFTER" image (returned item)
- Right-click → "Save as Picture"
- Save as: `public/images/cases/LX-2101/returned.jpg`

**Case LX-2102 - Cartier Tank Solo ($3,200)**
- Save BEFORE image as: `public/images/cases/LX-2102/original.jpg`
- Save AFTER image as: `public/images/cases/LX-2102/returned.jpg`

**Case LX-2103 - Hermès Birkin 35 ($18,900)**
- Save BEFORE image as: `public/images/cases/LX-2103/original.jpg`
- Save AFTER image as: `public/images/cases/LX-2103/returned.jpg`

**Case LX-2104 - Louis Vuitton Neverfull MM ($1,850)**
- Save BEFORE image as: `public/images/cases/LX-2104/original.jpg`
- Save AFTER image as: `public/images/cases/LX-2104/returned.jpg`

**Case LX-2105 - Patek Philippe Calatrava ($28,500)**
- Save BEFORE image as: `public/images/cases/LX-2105/original.jpg`
- Save AFTER image as: `public/images/cases/LX-2105/returned.jpg`

**Case LX-2106 - Chanel Classic Flap Bag ($7,200)**
- Save BEFORE image as: `public/images/cases/LX-2106/original.jpg`
- Save AFTER image as: `public/images/cases/LX-2106/returned.jpg`

**Case LX-2107 - Audemars Piguet Royal Oak Offshore ($35,000)**
- Save BEFORE image as: `public/images/cases/LX-2107/original.jpg`
- Save AFTER image as: `public/images/cases/LX-2107/returned.jpg`

**Case LX-2109 - Prada Saffiano Tote ($2,100)**
- Save BEFORE image as: `public/images/cases/LX-2109/original.jpg`
- Save AFTER image as: `public/images/cases/LX-2109/returned.jpg`

**Case LX-2110 - Bulgari Serpenti Watch ($4,800)**
- Save BEFORE image as: `public/images/cases/LX-2110/original.jpg`
- Save AFTER image as: `public/images/cases/LX-2110/returned.jpg`

**Case LX-2111 - Tiffany Setting Engagement Ring ($8,900)**
- Save BEFORE image as: `public/images/cases/LX-2111/original.jpg`
- Save AFTER image as: `public/images/cases/LX-2111/returned.jpg`

**Case LX-2112 - Cartier Love Bracelet ($7,400)**
- Save BEFORE image as: `public/images/cases/LX-2112/original.jpg`
- Save AFTER image as: `public/images/cases/LX-2112/returned.jpg`

**Case LX-2113 - Omega Speedmaster Professional ($5,200)**
- Save BEFORE image as: `public/images/cases/LX-2113/original.jpg`
- Save AFTER image as: `public/images/cases/LX-2113/returned.jpg`

**Case LX-2116 - Gucci Dionysus Bag ($3,100)**
- Save BEFORE image as: `public/images/cases/LX-2116/original.jpg`
- Save AFTER image as: `public/images/cases/LX-2116/returned.jpg`

**Case LX-2117 - Bottega Veneta Intrecciato Bag ($4,200)**
- Save BEFORE image as: `public/images/cases/LX-2117/original.jpg`
- Save AFTER image as: `public/images/cases/LX-2117/returned.jpg`

**Case LX-2118 - Omega Seamaster Aqua Terra ($6,800)**
- Save BEFORE image as: `public/images/cases/LX-2118/original.jpg`
- Save AFTER image as: `public/images/cases/LX-2118/returned.jpg`

**Case LX-2120 - Van Cleef & Arpels Alhambra Necklace ($9,500)**
- Save BEFORE image as: `public/images/cases/LX-2120/original.jpg`
- Save AFTER image as: `public/images/cases/LX-2120/returned.jpg`

#### Step 3: Verify Image Extraction
```bash
python verify_images.py
```
**Expected Output**: "✅ Complete: 16/16 cases" and "🎉 All images ready!"

## Environment Configuration

### Frontend Environment (.env)
Create `.env` file in root directory:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Backend Environment (backend/.env)
Create `backend/.env` file:
```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Groq API Configuration  
GROQ_API_KEY=your_groq_api_key_here
LLM_API_KEY=your_groq_api_key_here

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

**Replace placeholders with your actual values:**
- `your-project-id` → Your Supabase project ID
- `your_supabase_anon_key_here` → Your Supabase anon key
- `your_supabase_service_role_key_here` → Your Supabase service role key
- `your_groq_api_key_here` → Your Groq API key

## Installation & Running

### Step 1: Install Dependencies

**Frontend Dependencies:**
```bash
npm install
```

**Backend Dependencies:**
```bash
cd backend
pip install -r requirements.txt
cd ..
```

### Step 2: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Step 3: Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Verification

### Automated System Check
```bash
python verify_setup.py
```

**Expected Output:**
```
🚀 LuxeResolve Intelligence - Setup Verification
==================================================
🔧 Checking Environment Variables...
✅ All environment variables configured
🗄️ Checking Database Connection...
✅ Cases table: 16 records
✅ Risk signals table: 32 records
✅ Agent analysis table: Ready
🤖 Checking Groq API Connection...
✅ Groq API: Connected and working
🧠 Checking AI Agents...
✅ Visual Agent: visual_agent v3.0.0
✅ Text/Data Agent: text_data_agent v1.0.0
✅ Synthesis Agent: synthesis_agent v1.0.0
🎨 Checking Frontend Setup...
✅ Frontend files: All present
✅ Dependencies: Installed
🎯 Testing Decision Processing...
✅ Decision processing: Working

==================================================
📊 Verification Results: 6/6 checks passed
🎉 SUCCESS! Your LuxeResolve Intelligence system is fully set up and ready!
```

### Manual Verification

#### Check Case Processing
```bash
cd backend
python show_all_decisions.py
```

**Expected Output:**
```
================================================================================
ALL CASE DECISIONS
================================================================================
🟢 LX-2105: APPROVE_REFUND  (85%) | Weight=20%, Identity=75%
🟢 LX-2102: APPROVE_REFUND  (85%) | Weight=18%, Identity=82%
🟢 LX-2110: APPROVE_REFUND  (85%) | Weight=10%, Identity=85%
🔴 LX-2101: DENY_REFUND     (80%) | Weight=60%, Identity=20%
🔴 LX-2107: DENY_REFUND     (80%) | Weight=65%, Identity=15%
🔴 LX-2113: DENY_REFUND     (80%) | Weight=58%, Identity=22%
🔴 LX-2116: DENY_REFUND     (80%) | Weight=55%, Identity=25%
🔴 LX-2117: DENY_REFUND     (80%) | Weight=40%, Identity=45%
🔴 LX-2118: DENY_REFUND     (80%) | Weight=38%, Identity=48%
🔴 LX-2120: DENY_REFUND     (80%) | Weight=70%, Identity=10%
🔴 LX-2106: DENY_REFUND     (80%) | Weight=45%, Identity=55%
🔴 LX-2112: DENY_REFUND     (80%) | Weight=8%, Identity=90%
🟡 LX-2103: ESCALATE        (60%) | Weight=15%, Identity=80%
🟡 LX-2104: ESCALATE        (68%) | Weight=35%, Identity=50%
🟡 LX-2109: ESCALATE        (57%) | Weight=12%, Identity=88%
🟡 LX-2111: ESCALATE        (75%) | Weight=42%, Identity=52%

================================================================================
SUMMARY
================================================================================
🟢 APPROVE:  3 cases (19%)
🔴 DENY:     9 cases (56%)
🟡 ESCALATE: 4 cases (25%)
   TOTAL:    16 cases
```

#### Test Frontend Features
1. **Dashboard**: View marketplace analytics with 4 metric cards
2. **Case Queue**: Browse all 16 cases with filtering
3. **Case Details**: Click any case to see detailed analysis
4. **Risk Reasoning**: View structured AI decision explanations
5. **Visual Analysis**: See before/after image comparisons (if images extracted)

## Deployment

### Vercel Deployment
1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Import from GitHub: `RajAmbavane/LUXE`

2. **Set Environment Variables** in Vercel dashboard:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Deploy**: Vercel will automatically build and deploy

### Production URLs
- **Frontend**: `https://your-project.vercel.app`
- **API**: `https://your-project.vercel.app/api`

## Troubleshooting

### Common Issues

#### Database Connection Failed
```bash
# Test connection
python -c "
from supabase import create_client
import os
from dotenv import load_dotenv
load_dotenv('backend/.env')
client = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_SERVICE_ROLE_KEY'))
print('✓ Connected:', len(client.table('cases').select('*').execute().data), 'cases')
"
```

#### Groq API Issues
```bash
# Test API
python -c "
from groq import Groq
import os
from dotenv import load_dotenv
load_dotenv('backend/.env')
client = Groq(api_key=os.getenv('GROQ_API_KEY'))
print('✓ Groq API working')
"
```

#### Missing Images
```bash
# Check image status
python verify_images.py
# If missing, re-extract from cases (2).xlsx
```

#### Frontend Build Issues
```bash
# Clear and reinstall
rm -rf node_modules dist
npm install
npm run build
```

## Success Criteria

After completing this guide, you should have:

✅ **Complete Database**: 16 cases + 32 risk signals  
✅ **Working AI Pipeline**: 3 agents processing cases  
✅ **Varied Decisions**: Mix of APPROVE/DENY/ESCALATE  
✅ **Visual Analysis**: Before/after image comparison  
✅ **Frontend Interface**: All pages functional  
✅ **Real-time Processing**: Cases analyzed with AI reasoning  
✅ **Production Deployment**: Live system on Vercel  

## Support

If you encounter issues:
1. Check this guide step-by-step
2. Run `python verify_setup.py` for diagnostics
3. Verify all environment variables are set correctly
4. Ensure all 4 database migrations ran successfully
5. Confirm all 32 images are extracted and named correctly

---

**🎉 Congratulations!** You now have a fully functional AI-powered fraud detection system with complete reproducibility.