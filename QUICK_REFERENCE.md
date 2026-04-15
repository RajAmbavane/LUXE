# Quick Reference - LuxeResolve Intelligence

## 🚀 Essential Commands

### Setup & Verification
```bash
# Clone repository
git clone https://github.com/RajAmbavane/LUXE.git && cd LUXE

# Setup image directories
python extract_images_from_excel.py

# Verify images extracted
python verify_images.py

# Verify complete system
python verify_setup.py

# Check decisions
cd backend && python show_all_decisions.py
```

### Installation
```bash
# Frontend
npm install

# Backend  
cd backend && pip install -r requirements.txt
```

### Running
```bash
# Backend (Terminal 1)
cd backend && uvicorn app.main:app --reload --port 8000

# Frontend (Terminal 2)
npm run dev
```

## 📋 Required Files

### Environment Files
- `.env` - Frontend Supabase config
- `backend/.env` - Backend API keys and config

### Database Migrations (Run in order)
1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_sample_data.sql` 
3. `supabase/migrations/003_weight_identity_data.sql`
4. `supabase/migrations/004_add_image_urls.sql`

### Image Structure
```
public/images/cases/
├── LX-2101/original.jpg + returned.jpg
├── LX-2102/original.jpg + returned.jpg
└── ... (16 cases total)
```

## 🔑 API Keys Needed

1. **Supabase**: Project URL + anon key + service role key
2. **Groq**: API key for AI models

## ✅ Success Indicators

- `python verify_setup.py` → 6/6 checks passed
- `python show_all_decisions.py` → 16 cases with varied decisions
- Frontend at http://localhost:5173 → All pages working
- Backend at http://localhost:8000 → API responding

## 📊 Expected Results

**Decision Distribution:**
- 🟢 APPROVE: 3 cases (19%)
- 🔴 DENY: 9 cases (56%) 
- 🟡 ESCALATE: 4 cases (25%)

**Database Records:**
- Cases: 16
- Risk Signals: 32
- Images: 32 (2 per case)

## 🔧 Troubleshooting

**Database Issues**: Check Supabase credentials in `backend/.env`  
**API Issues**: Verify Groq API key is valid  
**Image Issues**: Run `python verify_images.py`  
**Build Issues**: Delete `node_modules` and `npm install`  

## 📖 Full Documentation

See `COMPLETE_SETUP_GUIDE.md` for detailed step-by-step instructions.