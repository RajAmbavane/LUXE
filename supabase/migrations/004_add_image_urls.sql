-- Add image URLs to cases for visual analysis
-- Migration: Add image data for before/after visual comparison

-- Add image URL columns to cases table
ALTER TABLE cases 
ADD COLUMN IF NOT EXISTS original_image_url TEXT,
ADD COLUMN IF NOT EXISTS returned_image_url TEXT;

-- Update cases with image URLs pointing to our repository images
UPDATE cases SET 
    original_image_url = '/images/cases/' || case_id || '/original.jpg',
    returned_image_url = '/images/cases/' || case_id || '/returned.jpg'
WHERE case_id IN (
    'LX-2101', 'LX-2102', 'LX-2103', 'LX-2104', 'LX-2105', 'LX-2106', 'LX-2107', 
    'LX-2109', 'LX-2110', 'LX-2111', 'LX-2112', 'LX-2113', 'LX-2116', 'LX-2117', 
    'LX-2118', 'LX-2120'
);

-- Add comments for documentation
COMMENT ON COLUMN cases.original_image_url IS 'URL to original item image as listed/sold';
COMMENT ON COLUMN cases.returned_image_url IS 'URL to returned item image from buyer';

-- Create a view for easy image access
CREATE OR REPLACE VIEW case_images AS
SELECT 
    c.case_id,
    c.brand,
    c.item_title,
    c.dispute_type,
    c.original_image_url,
    c.returned_image_url,
    CASE 
        WHEN c.original_image_url IS NOT NULL AND c.returned_image_url IS NOT NULL 
        THEN 'both_available'
        WHEN c.original_image_url IS NOT NULL 
        THEN 'original_only'
        WHEN c.returned_image_url IS NOT NULL 
        THEN 'returned_only'
        ELSE 'no_images'
    END as image_status
FROM cases c
ORDER BY c.case_id;

-- Verify image URLs are set
SELECT 
    'Cases with image URLs: ' || COUNT(*) as status
FROM cases 
WHERE original_image_url IS NOT NULL AND returned_image_url IS NOT NULL;