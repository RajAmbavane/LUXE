#!/usr/bin/env python3
"""
Extract Images from Excel File
Helps extract images from the cases Excel file and organize them properly
"""

import os
import sys
from pathlib import Path

def setup_image_directories():
    """Create all necessary image directories"""
    cases = [
        'LX-2101', 'LX-2102', 'LX-2103', 'LX-2104', 'LX-2105', 'LX-2106', 'LX-2107',
        'LX-2109', 'LX-2110', 'LX-2111', 'LX-2112', 'LX-2113', 'LX-2116', 'LX-2117',
        'LX-2118', 'LX-2120'
    ]
    
    base_dir = Path("public/images/cases")
    base_dir.mkdir(parents=True, exist_ok=True)
    
    for case_id in cases:
        case_dir = base_dir / case_id
        case_dir.mkdir(exist_ok=True)
        print(f"✓ Created directory: {case_dir}")
    
    print(f"\n📁 Created {len(cases)} case directories in public/images/cases/")

def extract_images_from_excel():
    """
    Extract images from Excel file
    Note: This requires manual extraction as Python libraries have limitations with embedded images
    """
    print("📋 MANUAL EXTRACTION REQUIRED")
    print("=" * 50)
    print("Python cannot automatically extract embedded images from Excel files.")
    print("Please follow these steps:")
    print()
    print("1. Open 'cases (2).xlsx' in Excel")
    print("2. For each case, right-click on images and 'Save as Picture'")
    print("3. Save images with these exact names:")
    print()
    
    cases_info = [
        ("LX-2101", "Rolex Submariner Date", "$12,500", "Return Fraud"),
        ("LX-2102", "Cartier Tank Solo", "$3,200", "Item Not As Described"),
        ("LX-2103", "Hermès Birkin 35", "$18,900", "Counterfeit"),
        ("LX-2104", "Louis Vuitton Neverfull MM", "$1,850", "Return Fraud"),
        ("LX-2105", "Patek Philippe Calatrava", "$28,500", "Shipping Damage"),
        ("LX-2106", "Chanel Classic Flap Bag", "$7,200", "Return Fraud"),
        ("LX-2107", "Audemars Piguet Royal Oak Offshore", "$35,000", "Return Fraud"),
        ("LX-2109", "Prada Saffiano Tote", "$2,100", "Item Not As Described"),
        ("LX-2110", "Bulgari Serpenti Watch", "$4,800", "Defective Item"),
        ("LX-2111", "Tiffany Setting Engagement Ring", "$8,900", "Return Fraud"),
        ("LX-2112", "Cartier Love Bracelet", "$7,400", "Return Fraud"),
        ("LX-2113", "Omega Speedmaster Professional", "$5,200", "Return Fraud"),
        ("LX-2116", "Gucci Dionysus Bag", "$3,100", "Counterfeit"),
        ("LX-2117", "Bottega Veneta Intrecciato Bag", "$4,200", "Return Fraud"),
        ("LX-2118", "Omega Seamaster Aqua Terra", "$6,800", "Return Fraud"),
        ("LX-2120", "Van Cleef & Arpels Alhambra Necklace", "$9,500", "Return Fraud"),
    ]
    
    for case_id, item, price, dispute in cases_info:
        print(f"   {case_id} - {item} ({price})")
        print(f"   → public/images/cases/{case_id}/original.jpg")
        print(f"   → public/images/cases/{case_id}/returned.jpg")
        print()
    
    print("4. Ensure images are named exactly 'original.jpg' and 'returned.jpg'")
    print("5. Run verification: python verify_images.py")

def verify_images():
    """Verify all images are present"""
    cases = [
        'LX-2101', 'LX-2102', 'LX-2103', 'LX-2104', 'LX-2105', 'LX-2106', 'LX-2107',
        'LX-2109', 'LX-2110', 'LX-2111', 'LX-2112', 'LX-2113', 'LX-2116', 'LX-2117',
        'LX-2118', 'LX-2120'
    ]
    
    missing = []
    present = []
    
    for case_id in cases:
        original = Path(f"public/images/cases/{case_id}/original.jpg")
        returned = Path(f"public/images/cases/{case_id}/returned.jpg")
        
        if original.exists() and returned.exists():
            present.append(case_id)
            print(f"✓ {case_id}: Both images present")
        else:
            missing.append(case_id)
            print(f"❌ {case_id}: Missing images")
            if not original.exists():
                print(f"   - Missing: original.jpg")
            if not returned.exists():
                print(f"   - Missing: returned.jpg")
    
    print(f"\n📊 Summary:")
    print(f"✓ Complete: {len(present)}/{len(cases)} cases")
    print(f"❌ Missing: {len(missing)} cases")
    
    if missing:
        print(f"\n🔧 Still need images for: {', '.join(missing)}")
        return False
    else:
        print(f"\n🎉 All images ready! Visual analysis will work perfectly.")
        return True

def main():
    """Main function"""
    if len(sys.argv) > 1 and sys.argv[1] == "verify":
        verify_images()
    else:
        print("🖼️ LuxeResolve Intelligence - Image Setup")
        print("=" * 50)
        setup_image_directories()
        print()
        extract_images_from_excel()

if __name__ == "__main__":
    main()