# LuxeResolve Intelligence

An AI-powered fraud detection system for luxury marketplace disputes using advanced computer vision and behavioral analysis.

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

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- Supabase account
- Groq API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd luxeresolve-intelligence
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Environment Setup**
   
   Create `.env` in root:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   
   Create `backend/.env`:
   ```env
   GROQ_API_KEY=your_groq_api_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
   
   # 3-Agent Configuration
   VISION_MODEL=meta-llama/llama-4-scout-17b-16e-instruct
   TEXT_DATA_MODEL=llama-3.3-70b-versatile
   SYNTHESIS_MODEL=llama-3.3-70b-versatile
   ```

### Running the Application

1. **Start the backend**
   ```bash
   cd backend
   uvicorn app.main:app --reload --port 8000
   ```

2. **Start the frontend**
   ```bash
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

## 📈 Decision Distribution

The system produces varied, intelligent decisions:
- **APPROVE_REFUND**: Low weight discrepancy + high identity confidence
- **DENY_REFUND**: High weight discrepancy or low identity confidence  
- **ESCALATE**: Mixed signals requiring manual review

## 🛠️ Development

### Backend Structure
```
backend/
├── app/
│   ├── agents/           # AI agent implementations
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
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── integrations/       # External service integrations
```

## 🔧 Configuration

### Model Configuration
- **Vision Model**: Optimized for image analysis
- **Text Model**: Fast behavioral analysis
- **Synthesis Model**: Complex decision reasoning

### Database Schema
- **Cases**: Core transaction data
- **Agent Analysis**: AI findings storage
- **Risk Signals**: Fraud detection metrics

## 📊 Monitoring

Use the monitoring utility to check decision distribution:
```bash
cd backend
python show_all_decisions.py
```

## 🚀 Deployment

### Vercel (Frontend)
1. Connect repository to Vercel
2. Set environment variables
3. Deploy automatically on push

### Backend Deployment
- Compatible with any Python hosting service
- Requires environment variables configuration
- Supports auto-scaling with FastAPI

## 📄 License

This project is proprietary software for LuxeResolve Intelligence.

## 🤝 Contributing

This is a private project. Contact the development team for contribution guidelines.