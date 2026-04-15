#!/usr/bin/env python3
"""
Verify Images Setup
Checks that all case images are properly set up for visual analysis
"""

import os
from pathlib import Path

def verify_images():
    """Verify all images are present and properly named"""
    cases = [
        'LX-2101', 'LX-2102', 'LX-2103', 'LX-2104', 'LX-2105', 'LX-2106', 'LX-2107',
        'LX-2109', 'LX-2110', 'LX-2111', 'LX-2112', 'LX-2113', 'LX-2116', 'LX-2117',
        'LX-2118', 'LX-2120'
    ]
    
    print("🖼️ Verifying Case Images")
    print("=" * 50)
    
    complete_cases = []
    incomplete_cases = []
    
    for case_id in cases:
        case_dir = Path(f"public/images/cases/{case_id}")
        original = case_dir / "original.jpg"
        returned = case_dir / "returned.jpg"
        
        if original.exists() and returned.exists():
            # Check file sizes
            orig_size = original.stat().st_size
            ret_size = returned.stat().st_size
            
            if orig_size > 1000 and ret_size > 1000:  # At least 1KB each
                complete_cases.append(case_id)
                print(f"✅ {case_id}: Complete ({orig_size//1024}KB + {ret_size//1024}KB)")
            else:
                incomplete_cases.append(case_id)
                print(f"⚠️ {case_id}: Files too small (may be placeholders)")
        else:
            incomplete_cases.append(case_id)
            print(f"❌ {case_id}: Missing files")
            if not case_dir.exists():
                print(f"   📁 Directory missing: {case_dir}")
            else:
                if not original.exists():
                    print(f"   🖼️ Missing: original.jpg")
                if not returned.exists():
                    print(f"   🖼️ Missing: returned.jpg")
    
    print("\n" + "=" * 50)
    print(f"📊 Image Verification Results")
    print(f"✅ Complete cases: {len(complete_cases)}/{len(cases)}")
    print(f"❌ Incomplete cases: {len(incomplete_cases)}")
    
    if complete_cases:
        print(f"\n✅ Ready for visual analysis: {', '.join(complete_cases)}")
    
    if incomplete_cases:
        print(f"\n❌ Need images: {', '.join(incomplete_cases)}")
        print("\n🔧 Next steps:")
        print("1. Extract images from 'cases (2).xlsx'")
        print("2. Save as 'original.jpg' and 'returned.jpg' in each case folder")
        print("3. Run this script again to verify")
    else:
        print("\n🎉 All images ready! Visual analysis will work perfectly.")
        print("\n🚀 Next steps:")
        print("1. Commit images to git: git add public/images/")
        print("2. Update database: Run migration 004_add_image_urls.sql")
        print("3. Test visual analysis: python backend/show_all_decisions.py")
    
    return len(incomplete_cases) == 0

if __name__ == "__main__":
    verify_images()