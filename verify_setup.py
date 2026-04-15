#!/usr/bin/env python3
"""
LuxeResolve Intelligence - Setup Verification Script
Verifies complete system setup and reproducibility
"""

import os
import sys
from dotenv import load_dotenv

def check_environment():
    """Check environment variables"""
    print("🔧 Checking Environment Variables...")
    
    load_dotenv()
    load_dotenv('backend/.env')
    
    required_vars = [
        'SUPABASE_URL',
        'SUPABASE_SERVICE_ROLE_KEY', 
        'GROQ_API_KEY',
        'VISION_MODEL',
        'TEXT_DATA_MODEL',
        'SYNTHESIS_MODEL'
    ]
    
    missing = []
    for var in required_vars:
        if not os.getenv(var):
            missing.append(var)
    
    if missing:
        print(f"❌ Missing environment variables: {', '.join(missing)}")
        return False
    else:
        print("✅ All environment variables configured")
        return True

def check_database():
    """Check database connection and data"""
    print("\n🗄️ Checking Database Connection...")
    
    try:
        from supabase import create_client
        
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        
        if not supabase_url or not supabase_key:
            print("❌ Supabase credentials not found")
            return False
        
        supabase = create_client(supabase_url, supabase_key)
        
        # Check cases table
        cases = supabase.table("cases").select("*").execute()
        case_count = len(cases.data)
        print(f"✅ Cases table: {case_count} records")
        
        if case_count != 16:
            print(f"⚠️ Expected 16 cases, found {case_count}")
            return False
        
        # Check risk signals
        signals = supabase.table("risk_signals").select("*").execute()
        signal_count = len(signals.data)
        print(f"✅ Risk signals table: {signal_count} records")
        
        if signal_count != 32:
            print(f"⚠️ Expected 32 risk signals, found {signal_count}")
            return False
        
        # Check agent analysis table exists
        try:
            analysis = supabase.table("agent_analysis").select("*").limit(1).execute()
            print("✅ Agent analysis table: Ready")
        except Exception as e:
            print(f"❌ Agent analysis table issue: {e}")
            return False
        
        return True
        
    except ImportError:
        print("❌ Supabase library not installed. Run: pip install supabase")
        return False
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def check_groq_api():
    """Check Groq API connection"""
    print("\n🤖 Checking Groq API Connection...")
    
    try:
        from groq import Groq
        
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            print("❌ GROQ_API_KEY not found")
            return False
        
        client = Groq(api_key=api_key)
        
        # Test API with simple request
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": "Hello"}],
            max_tokens=10
        )
        
        print("✅ Groq API: Connected and working")
        return True
        
    except ImportError:
        print("❌ Groq library not installed. Run: pip install groq")
        return False
    except Exception as e:
        print(f"❌ Groq API connection failed: {e}")
        return False

def check_agents():
    """Check AI agents can be imported"""
    print("\n🧠 Checking AI Agents...")
    
    try:
        sys.path.append('backend')
        
        from app.agents.visual_agent import VisualAgent
        from app.agents.text_data_agent import TextDataAgent
        from app.agents.synthesis_agent import SynthesisAgent
        
        visual = VisualAgent()
        text_data = TextDataAgent()
        synthesis = SynthesisAgent()
        
        print(f"✅ Visual Agent: {visual.name} v{visual.version}")
        print(f"✅ Text/Data Agent: {text_data.name} v{text_data.version}")
        print(f"✅ Synthesis Agent: {synthesis.name} v{synthesis.version}")
        
        return True
        
    except ImportError as e:
        print(f"❌ Agent import failed: {e}")
        return False
    except Exception as e:
        print(f"❌ Agent initialization failed: {e}")
        return False

def check_frontend():
    """Check frontend dependencies"""
    print("\n🎨 Checking Frontend Setup...")
    
    # Check package.json exists
    if not os.path.exists('package.json'):
        print("❌ package.json not found")
        return False
    
    # Check node_modules exists
    if not os.path.exists('node_modules'):
        print("❌ node_modules not found. Run: npm install")
        return False
    
    # Check key files exist
    required_files = [
        'src/App.tsx',
        'src/pages/Dashboard.tsx',
        'src/pages/CaseQueue.tsx',
        'src/pages/RiskReasoning.tsx',
        'src/integrations/supabase/client.ts'
    ]
    
    for file in required_files:
        if not os.path.exists(file):
            print(f"❌ Missing file: {file}")
            return False
    
    print("✅ Frontend files: All present")
    print("✅ Dependencies: Installed")
    
    return True

def run_decision_test():
    """Test decision processing"""
    print("\n🎯 Testing Decision Processing...")
    
    try:
        sys.path.append('backend')
        os.chdir('backend')
        
        # Import and run decision check
        exec(open('show_all_decisions.py').read())
        
        print("✅ Decision processing: Working")
        return True
        
    except Exception as e:
        print(f"❌ Decision processing failed: {e}")
        return False
    finally:
        os.chdir('..')

def main():
    """Main verification function"""
    print("🚀 LuxeResolve Intelligence - Setup Verification")
    print("=" * 60)
    
    checks = [
        ("Environment Variables", check_environment),
        ("Database Setup", check_database),
        ("Groq API", check_groq_api),
        ("AI Agents", check_agents),
        ("Frontend Setup", check_frontend),
        ("Decision Processing", run_decision_test)
    ]
    
    passed = 0
    total = len(checks)
    
    for name, check_func in checks:
        try:
            if check_func():
                passed += 1
        except Exception as e:
            print(f"❌ {name} check failed with error: {e}")
    
    print("\n" + "=" * 60)
    print(f"📊 Verification Results: {passed}/{total} checks passed")
    
    if passed == total:
        print("🎉 SUCCESS! Your LuxeResolve Intelligence system is fully set up and ready!")
        print("\n🚀 Next Steps:")
        print("1. Start backend: cd backend && uvicorn app.main:app --reload --port 8000")
        print("2. Start frontend: npm run dev")
        print("3. Open browser: http://localhost:5173")
        return True
    else:
        print("❌ Setup incomplete. Please fix the issues above and run again.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)