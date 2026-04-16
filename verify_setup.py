#!/usr/bin/env python3
"""
LuxeResolve Intelligence Setup Verification Script
Comprehensive verification of all system components.
"""

import os
import sys
from pathlib import Path
import json

def check_python_version():
    """Check Python version compatibility."""
    print("1️⃣  Checking Python version...")
    
    version = sys.version_info
    if version.major == 3 and version.minor >= 9:
        print(f"   ✅ Python {version.major}.{version.minor}.{version.micro} (compatible)")
        return True
    else:
        print(f"   ❌ Python {version.major}.{version.minor}.{version.micro} (requires 3.9+)")
        return False

def check_dependencies():
    """Check required Python packages."""
    print("2️⃣  Checking Python dependencies...")
    
    required_packages = [
        'fastapi', 'uvicorn', 'supabase', 'groq', 'pydantic', 
        'python-dotenv', 'httpx', 'numpy', 'PIL'
    ]
    
    missing = []
    for package in required_packages:
        try:
            if package == 'PIL':
                import PIL
            else:
                __import__(package)
            print(f"   ✅ {package}")
        except ImportError:
            print(f"   ❌ {package} (missing)")
            missing.append(package)
    
    if missing:
        print(f"   Install missing packages: pip install {' '.join(missing)}")
        return False
    
    return True

def check_environment_files():
    """Check environment configuration files."""
    print("3️⃣  Checking environment files...")
    
    # Check frontend .env
    frontend_env = Path(".env")
    if frontend_env.exists():
        print("   ✅ Frontend .env exists")
        
        # Check required variables
        with open(frontend_env) as f:
            content = f.read()
            if "VITE_SUPABASE_URL" in content and "VITE_SUPABASE_ANON_KEY" in content:
                print("   ✅ Frontend environment variables present")
            else:
                print("   ❌ Frontend environment variables missing")
                return False
    else:
        print("   ❌ Frontend .env missing (copy from .env.example)")
        return False
    
    # Check backend .env
    backend_env = Path("backend/.env")
    if backend_env.exists():
        print("   ✅ Backend .env exists")
        
        # Check required variables
        with open(backend_env) as f:
            content = f.read()
            required_vars = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "GROQ_API_KEY"]
            missing_vars = [var for var in required_vars if var not in content]
            
            if not missing_vars:
                print("   ✅ Backend environment variables present")
            else:
                print(f"   ❌ Backend environment variables missing: {', '.join(missing_vars)}")
                return False
    else:
        print("   ❌ Backend .env missing (copy from backend/.env.example)")
        return False
    
    return True

def check_database_connection():
    """Check Supabase database connection and tables."""
    print("4️⃣  Checking database connection...")
    
    try:
        from supabase import create_client
        from dotenv import load_dotenv
        
        # Load backend environment
        load_dotenv("backend/.env")
        
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        
        if not url or not key:
            print("   ❌ Supabase credentials not found in backend/.env")
            return False
        
        # Test connection
        client = create_client(url, key)
        
        # Check required tables
        required_tables = [
            'cases', 'agent_analysis', 'risk_signals', 'behavioral_metrics',
            'decisions', 'audit_logs', 'case_images'
        ]
        
        for table in required_tables:
            try:
                result = client.table(table).select("*").limit(1).execute()
                print(f"   ✅ Table '{table}' accessible")
            except Exception as e:
                print(f"   ❌ Table '{table}' error: {str(e)[:50]}...")
                return False
        
        # Check case count
        cases = client.table("cases").select("*").execute()
        case_count = len(cases.data)
        
        if case_count >= 16:
            print(f"   ✅ Database has {case_count} cases")
        else:
            print(f"   ❌ Database has only {case_count} cases (expected 16)")
            return False
        
        return True
        
    except Exception as e:
        print(f"   ❌ Database connection failed: {str(e)[:100]}...")
        return False

def check_groq_api():
    """Check Groq API connection."""
    print("5️⃣  Checking Groq API connection...")
    
    try:
        from groq import Groq
        from dotenv import load_dotenv
        
        load_dotenv("backend/.env")
        api_key = os.getenv("GROQ_API_KEY")
        
        if not api_key:
            print("   ❌ GROQ_API_KEY not found in backend/.env")
            return False
        
        # Test API connection
        client = Groq(api_key=api_key)
        
        # Try a simple completion
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": "Hello"}],
            model="llama-3.3-70b-versatile",
            max_tokens=10
        )
        
        if response.choices:
            print("   ✅ Groq API connection successful")
            return True
        else:
            print("   ❌ Groq API returned no response")
            return False
            
    except Exception as e:
        print(f"   ❌ Groq API connection failed: {str(e)[:100]}...")
        return False

def check_images():
    """Check case images extraction."""
    print("6️⃣  Checking case images...")
    
    base_dir = Path("public/images/cases")
    if not base_dir.exists():
        print("   ❌ Images directory not found")
        print("   Run: python extract_images_real.py")
        return False
    
    # Expected case IDs
    expected_cases = [
        "LX-2101", "LX-2102", "LX-2103", "LX-2104", "LX-2105", "LX-2106", 
        "LX-2107", "LX-2109", "LX-2110", "LX-2111", "LX-2112", "LX-2113", 
        "LX-2116", "LX-2117", "LX-2118", "LX-2120"
    ]
    
    complete_cases = 0
    for case_id in expected_cases:
        case_dir = base_dir / case_id
        original_path = case_dir / "original.jpg"
        returned_path = case_dir / "returned.jpg"
        
        if original_path.exists() and returned_path.exists():
            # Check file sizes
            orig_size = original_path.stat().st_size
            ret_size = returned_path.stat().st_size
            
            if orig_size > 1000 and ret_size > 1000:  # At least 1KB each
                complete_cases += 1
    
    if complete_cases == len(expected_cases):
        print(f"   ✅ All {complete_cases} cases have both images")
        return True
    else:
        print(f"   ❌ Only {complete_cases}/{len(expected_cases)} cases have both images")
        print("   Run: python extract_images_real.py")
        return False

def check_node_dependencies():
    """Check Node.js dependencies."""
    print("7️⃣  Checking Node.js dependencies...")
    
    # Check if node_modules exists
    if not Path("node_modules").exists():
        print("   ❌ node_modules not found")
        print("   Run: npm install")
        return False
    
    # Check package.json
    if not Path("package.json").exists():
        print("   ❌ package.json not found")
        return False
    
    # Check if key dependencies exist
    key_deps = ["react", "typescript", "vite", "@tanstack/react-query"]
    missing = []
    
    for dep in key_deps:
        dep_path = Path(f"node_modules/{dep}")
        if dep_path.exists():
            print(f"   ✅ {dep}")
        else:
            print(f"   ❌ {dep} (missing)")
            missing.append(dep)
    
    if missing:
        print("   Run: npm install")
        return False
    
    return True

def main():
    """Run all verification checks."""
    print("🔍 LuxeResolve Intelligence Setup Verification")
    print("=" * 60)
    
    checks = [
        check_python_version,
        check_dependencies,
        check_environment_files,
        check_database_connection,
        check_groq_api,
        check_images,
        check_node_dependencies
    ]
    
    passed = 0
    total = len(checks)
    
    for check in checks:
        try:
            if check():
                passed += 1
            print()  # Add spacing between checks
        except Exception as e:
            print(f"   ❌ Check failed with error: {str(e)[:100]}...")
            print()
    
    # Summary
    print("=" * 60)
    print(f"📊 Verification Results: {passed}/{total} checks passed")
    
    if passed == total:
        print("🎉 All checks passed! Your system is ready.")
        print("\n🚀 Next steps:")
        print("   1. Start backend: cd backend && uvicorn app.main:app --reload --port 8000")
        print("   2. Start frontend: npm run dev")
        print("   3. Open browser: http://localhost:5173")
        print("   4. Check live demo: https://luxeresolve.onrender.com")
        return True
    else:
        print("❌ Some checks failed. Please fix the issues above.")
        print("\n📚 Documentation:")
        print("   - README.md: Complete setup guide")
        print("   - LuxeResolve_Team_Reproducibility_Guide.md: 5-page guide")
        print("   - .env.example files: Environment templates")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)