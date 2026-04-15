-- Add Weight Consistency and Item Identity columns to cases table
-- Migration: Add weight and identity verification data columns

ALTER TABLE cases
ADD COLUMN IF NOT EXISTS weight_consistency_score DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS weight_consistency_status VARCHAR(50),
ADD COLUMN IF NOT EXISTS weight_consistency_detail TEXT,
ADD COLUMN IF NOT EXISTS item_identity_confidence DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS item_identity_level VARCHAR(50),
ADD COLUMN IF NOT EXISTS item_identity_detail TEXT;

-- Add comments for documentation
COMMENT ON COLUMN cases.weight_consistency_score IS 'Weight consistency score (0-1) indicating likelihood of weight fraud';
COMMENT ON COLUMN cases.weight_consistency_status IS 'Status level: normal, medium, high, critical';
COMMENT ON COLUMN cases.weight_consistency_detail IS 'Detailed explanation of weight consistency assessment';
COMMENT ON COLUMN cases.item_identity_confidence IS 'Item identity confidence score (0-1)';
COMMENT ON COLUMN cases.item_identity_level IS 'Confidence level: low confidence, medium confidence, medium-high confidence, high confidence';
COMMENT ON COLUMN cases.item_identity_detail IS 'Detailed explanation of item identity assessment';
