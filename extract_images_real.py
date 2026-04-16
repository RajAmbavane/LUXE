#!/usr/bin/env python3
"""
Real Image Extraction Script for LuxeResolve Intelligence
Extracts images from cases (2).xlsx and saves them to public/images/cases/

This script actually works, unlike the manual guide version.
"""

import os
import sys
from pathlib import Path
import openpyxl
from PIL import Image
import io

def extract_images_from_excel():
    """Extract all images from the Excel file to the correct directory structure."""
    
    # Check if Excel file exists
    excel_file = Path("cases (2).xlsx")
    if not excel_file.exists():
        print("❌ Error: 'cases (2).xlsx' not found in current directory")
        print("   Please ensure the Excel file is in the root directory")
        return False
    
    # Create base directory
    base_dir = Path("public/images/cases")
    base_dir.mkdir(parents=True, exist_ok=True)
    
    try:
        # Load workbook
        print("📂 Loading Excel file...")
        workbook = openpyxl.load_workbook(excel_file)
        worksheet = workbook.active
        
        # Get case IDs from column A (starting from row 2)
        case_ids = []
        for row in range(2, 18):  # Rows 2-17 for 16 cases
            cell_value = worksheet.cell(row=row, column=1).value
            if cell_value:
                case_ids.append(str(cell_value).strip())
        
        print(f"📋 Found {len(case_ids)} cases: {', '.join(case_ids)}")
        
        # Extract images for each case
        extracted_count = 0
        for i, case_id in enumerate(case_ids):
            row = i + 2  # Excel row (1-indexed, starting from row 2)
            
            # Create case directory
            case_dir = base_dir / case_id
            case_dir.mkdir(exist_ok=True)
            
            # Extract original image (column X = 24)
            original_img = extract_image_from_cell(worksheet, row, 24)
            if original_img:
                original_path = case_dir / "original.jpg"
                original_img.save(original_path, "JPEG", quality=95)
                print(f"  ✅ {case_id}/original.jpg")
                extracted_count += 1
            else:
                print(f"  ❌ {case_id}/original.jpg - No image found")
            
            # Extract returned image (column Y = 25)  
            returned_img = extract_image_from_cell(worksheet, row, 25)
            if returned_img:
                returned_path = case_dir / "returned.jpg"
                returned_img.save(returned_path, "JPEG", quality=95)
                print(f"  ✅ {case_id}/returned.jpg")
                extracted_count += 1
            else:
                print(f"  ❌ {case_id}/returned.jpg - No image found")
        
        workbook.close()
        
        print(f"\n🎉 Extraction complete!")
        print(f"   📊 Extracted {extracted_count} images from {len(case_ids)} cases")
        print(f"   📁 Images saved to: {base_dir.absolute()}")
        
        # Verify extraction
        verify_extraction()
        
        return True
        
    except Exception as e:
        print(f"❌ Error extracting images: {str(e)}")
        return False

def extract_image_from_cell(worksheet, row, col):
    """Extract image from a specific Excel cell."""
    try:
        # Get all images in the worksheet
        for image in worksheet._images:
            # Check if image is in the target cell
            if (image.anchor._from.row == row - 1 and  # openpyxl uses 0-indexed rows
                image.anchor._from.col == col - 1):    # openpyxl uses 0-indexed cols
                
                # Get image data
                image_data = image._data()
                
                # Convert to PIL Image
                pil_image = Image.open(io.BytesIO(image_data))
                
                # Convert to RGB if necessary (removes alpha channel)
                if pil_image.mode in ('RGBA', 'LA', 'P'):
                    pil_image = pil_image.convert('RGB')
                
                return pil_image
                
    except Exception as e:
        print(f"    Warning: Could not extract image from row {row}, col {col}: {e}")
    
    return None

def verify_extraction():
    """Verify that all images were extracted correctly."""
    print("\n🔍 Verifying extraction...")
    
    base_dir = Path("public/images/cases")
    if not base_dir.exists():
        print("❌ Images directory not found")
        return False
    
    # Expected case IDs
    expected_cases = [
        "LX-2101", "LX-2102", "LX-2103", "LX-2104", "LX-2105", "LX-2106", 
        "LX-2107", "LX-2109", "LX-2110", "LX-2111", "LX-2112", "LX-2113", 
        "LX-2116", "LX-2117", "LX-2118", "LX-2120"
    ]
    
    success_count = 0
    for case_id in expected_cases:
        case_dir = base_dir / case_id
        original_path = case_dir / "original.jpg"
        returned_path = case_dir / "returned.jpg"
        
        if original_path.exists() and returned_path.exists():
            # Check file sizes
            orig_size = original_path.stat().st_size
            ret_size = returned_path.stat().st_size
            
            if orig_size > 1000 and ret_size > 1000:  # At least 1KB each
                print(f"  ✅ {case_id}: original ({orig_size:,} bytes), returned ({ret_size:,} bytes)")
                success_count += 1
            else:
                print(f"  ⚠️  {case_id}: Files too small (may be corrupted)")
        else:
            missing = []
            if not original_path.exists():
                missing.append("original.jpg")
            if not returned_path.exists():
                missing.append("returned.jpg")
            print(f"  ❌ {case_id}: Missing {', '.join(missing)}")
    
    print(f"\n📊 Verification Results:")
    print(f"   ✅ {success_count}/{len(expected_cases)} cases have both images")
    
    if success_count == len(expected_cases):
        print("   🎉 All images extracted successfully!")
        return True
    else:
        print("   ⚠️  Some images are missing or corrupted")
        return False

def main():
    """Main function."""
    print("🖼️  LuxeResolve Image Extraction Tool")
    print("=" * 50)
    
    # Check dependencies
    try:
        import openpyxl
        import PIL
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("   Install with: pip install openpyxl Pillow")
        sys.exit(1)
    
    # Extract images
    success = extract_images_from_excel()
    
    if success:
        print("\n✅ Image extraction completed successfully!")
        print("   You can now run the application with all case images available.")
    else:
        print("\n❌ Image extraction failed!")
        print("   Please check the error messages above and try again.")
        sys.exit(1)

if __name__ == "__main__":
    main()