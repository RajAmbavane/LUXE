-- Migration 6: Improved Dataset Alignment
-- Align visual analysis results with buyer/seller history and behavioral patterns

-- Update cases with aligned data where visual analysis shows problems
-- Cases with bad visual analysis should have corresponding buyer/seller issues

-- HIGH FRAUD CASES (Visual + Behavioral Issues)
UPDATE cases SET 
    buyer_return_rate = 28.5,
    buyer_dispute_count = 7,
    buyer_account_age_days = 35,
    seller_dispute_count = 2,
    metadata = jsonb_set(
        metadata,
        '{buyer_past_fraud_flags}',
        '5'::jsonb
    ) || jsonb_set(
        metadata,
        '{outbound_weight_grams}',
        '220'::jsonb
    ) || jsonb_set(
        metadata,
        '{returned_weight_grams}',
        '75'::jsonb
    ) || jsonb_set(
        metadata,
        '{serial_number_match}',
        'false'::jsonb
    ) || jsonb_set(
        metadata,
        '{accessories_present}',
        'false'::jsonb
    ) || jsonb_set(
        metadata,
        '{packaging_intact}',
        'false'::jsonb
    )
WHERE case_id = 'LX-2120';

UPDATE cases SET 
    buyer_return_rate = 25.6,
    buyer_dispute_count = 5,
    buyer_account_age_days = 25,
    seller_dispute_count = 1,
    metadata = jsonb_set(
        metadata,
        '{buyer_past_fraud_flags}',
        '3'::jsonb
    ) || jsonb_set(
        metadata,
        '{outbound_weight_grams}',
        '220'::jsonb
    ) || jsonb_set(
        metadata,
        '{returned_weight_grams}',
        '75'::jsonb
    ) || jsonb_set(
        metadata,
        '{serial_number_match}',
        'false'::jsonb
    ) || jsonb_set(
        metadata,
        '{accessories_present}',
        'false'::jsonb
    ) || jsonb_set(
        metadata,
        '{packaging_intact}',
        'false'::jsonb
    )
WHERE case_id = 'LX-2107';

UPDATE cases SET 
    buyer_return_rate = 22.1,
    buyer_dispute_count = 6,
    buyer_account_age_days = 60,
    seller_dispute_count = 1,
    metadata = jsonb_set(
        metadata,
        '{buyer_past_fraud_flags}',
        '4'::jsonb
    ) || jsonb_set(
        metadata,
        '{outbound_weight_grams}',
        '155'::jsonb
    ) || jsonb_set(
        metadata,
        '{returned_weight_grams}',
        '65'::jsonb
    ) || jsonb_set(
        metadata,
        '{serial_number_match}',
        'false'::jsonb
    ) || jsonb_set(
        metadata,
        '{accessories_present}',
        'false'::jsonb
    ) || jsonb_set(
        metadata,
        '{packaging_intact}',
        'false'::jsonb
    )
WHERE case_id = 'LX-2113';

UPDATE cases SET 
    buyer_return_rate = 15.2,
    buyer_dispute_count = 3,
    buyer_account_age_days = 45,
    seller_dispute_count = 2,
    metadata = jsonb_set(
        metadata,
        '{buyer_past_fraud_flags}',
        '1'::jsonb
    ) || jsonb_set(
        metadata,
        '{outbound_weight_grams}',
        '150'::jsonb
    ) || jsonb_set(
        metadata,
        '{returned_weight_grams}',
        '95'::jsonb
    ) || jsonb_set(
        metadata,
        '{serial_number_match}',
        'false'::jsonb
    ) || jsonb_set(
        metadata,
        '{accessories_present}',
        'false'::jsonb
    ) || jsonb_set(
        metadata,
        '{packaging_intact}',
        'false'::jsonb
    )
WHERE case_id = 'LX-2101';

-- MODERATE FRAUD CASES (Some visual issues + moderate behavioral flags)
UPDATE cases SET 
    buyer_return_rate = 14.7,
    buyer_dispute_count = 3,
    buyer_account_age_days = 220,
    seller_dispute_count = 4,
    metadata = jsonb_set(
        metadata,
        '{buyer_past_fraud_flags}',
        '2'::jsonb
    ) || jsonb_set(
        metadata,
        '{outbound_weight_grams}',
        '820'::jsonb
    ) || jsonb_set(
        metadata,
        '{returned_weight_grams}',
        '370'::jsonb
    ) || jsonb_set(
        metadata,
        '{serial_number_match}',
        'false'::jsonb
    ) || jsonb_set(
        metadata,
        '{accessories_present}',
        'true'::jsonb
    ) || jsonb_set(
        metadata,
        '{packaging_intact}',
        'false'::jsonb
    )
WHERE case_id = 'LX-2116';

UPDATE cases SET 
    buyer_return_rate = 16.8,
    buyer_dispute_count = 4,
    buyer_account_age_days = 95,
    seller_dispute_count = 3,
    metadata = jsonb_set(
        metadata,
        '{buyer_past_fraud_flags}',
        '2'::jsonb
    ) || jsonb_set(
        metadata,
        '{outbound_weight_grams}',
        '950'::jsonb
    ) || jsonb_set(
        metadata,
        '{returned_weight_grams}',
        '570'::jsonb
    ) || jsonb_set(
        metadata,
        '{serial_number_match}',
        'true'::jsonb
    ) || jsonb_set(
        metadata,
        '{accessories_present}',
        'false'::jsonb
    ) || jsonb_set(
        metadata,
        '{packaging_intact}',
        'true'::jsonb
    )
WHERE case_id = 'LX-2117';

-- LEGITIMATE CASES (Good visual analysis + clean buyer/seller history)
UPDATE cases SET 
    buyer_return_rate = 2.1,
    buyer_dispute_count = 0,
    buyer_account_age_days = 1200,
    seller_dispute_count = 0,
    metadata = jsonb_set(
        metadata,
        '{buyer_past_fraud_flags}',
        '0'::jsonb
    ) || jsonb_set(
        metadata,
        '{outbound_weight_grams}',
        '180'::jsonb
    ) || jsonb_set(
        metadata,
        '{returned_weight_grams}',
        '175'::jsonb
    ) || jsonb_set(
        metadata,
        '{serial_number_match}',
        'true'::jsonb
    ) || jsonb_set(
        metadata,
        '{accessories_present}',
        'true'::jsonb
    ) || jsonb_set(
        metadata,
        '{packaging_intact}',
        'false'::jsonb
    )
WHERE case_id = 'LX-2105';

UPDATE cases SET 
    buyer_return_rate = 3.1,
    buyer_dispute_count = 0,
    buyer_account_age_days = 890,
    seller_dispute_count = 1,
    metadata = jsonb_set(
        metadata,
        '{buyer_past_fraud_flags}',
        '0'::jsonb
    ) || jsonb_set(
        metadata,
        '{outbound_weight_grams}',
        '85'::jsonb
    ) || jsonb_set(
        metadata,
        '{returned_weight_grams}',
        '82'::jsonb
    ) || jsonb_set(
        metadata,
        '{serial_number_match}',
        'true'::jsonb
    ) || jsonb_set(
        metadata,
        '{accessories_present}',
        'true'::jsonb
    ) || jsonb_set(
        metadata,
        '{packaging_intact}',
        'true'::jsonb
    )
WHERE case_id = 'LX-2102';

UPDATE cases SET 
    buyer_return_rate = 1.8,
    buyer_dispute_count = 0,
    buyer_account_age_days = 950,
    seller_dispute_count = 1,
    metadata = jsonb_set(
        metadata,
        '{buyer_past_fraud_flags}',
        '0'::jsonb
    ) || jsonb_set(
        metadata,
        '{outbound_weight_grams}',
        '95'::jsonb
    ) || jsonb_set(
        metadata,
        '{returned_weight_grams}',
        '90'::jsonb
    ) || jsonb_set(
        metadata,
        '{serial_number_match}',
        'true'::jsonb
    ) || jsonb_set(
        metadata,
        '{accessories_present}',
        'true'::jsonb
    ) || jsonb_set(
        metadata,
        '{packaging_intact}',
        'true'::jsonb
    )
WHERE case_id = 'LX-2110';

-- Add buyer and seller IDs to all cases
UPDATE cases SET 
    buyer_id = CASE case_id
        WHEN 'LX-2101' THEN 'BYR-001'
        WHEN 'LX-2102' THEN 'BYR-002'
        WHEN 'LX-2103' THEN 'BYR-003'
        WHEN 'LX-2104' THEN 'BYR-004'
        WHEN 'LX-2105' THEN 'BYR-005'
        WHEN 'LX-2106' THEN 'BYR-006'
        WHEN 'LX-2107' THEN 'BYR-007'
        WHEN 'LX-2109' THEN 'BYR-009'
        WHEN 'LX-2110' THEN 'BYR-010'
        WHEN 'LX-2111' THEN 'BYR-011'
        WHEN 'LX-2112' THEN 'BYR-012'
        WHEN 'LX-2113' THEN 'BYR-013'
        WHEN 'LX-2116' THEN 'BYR-016'
        WHEN 'LX-2117' THEN 'BYR-017'
        WHEN 'LX-2118' THEN 'BYR-018'
        WHEN 'LX-2120' THEN 'BYR-020'
    END,
    seller_id = CASE case_id
        WHEN 'LX-2101' THEN 'SLR-051'
        WHEN 'LX-2102' THEN 'SLR-052'
        WHEN 'LX-2103' THEN 'SLR-053'
        WHEN 'LX-2104' THEN 'SLR-054'
        WHEN 'LX-2105' THEN 'SLR-055'
        WHEN 'LX-2106' THEN 'SLR-056'
        WHEN 'LX-2107' THEN 'SLR-057'
        WHEN 'LX-2109' THEN 'SLR-059'
        WHEN 'LX-2110' THEN 'SLR-060'
        WHEN 'LX-2111' THEN 'SLR-061'
        WHEN 'LX-2112' THEN 'SLR-062'
        WHEN 'LX-2113' THEN 'SLR-063'
        WHEN 'LX-2116' THEN 'SLR-066'
        WHEN 'LX-2117' THEN 'SLR-067'
        WHEN 'LX-2118' THEN 'SLR-068'
        WHEN 'LX-2120' THEN 'SLR-070'
    END
WHERE buyer_id IS NULL OR seller_id IS NULL;

-- Update behavioral metrics to align with visual analysis results
UPDATE behavioral_metrics SET
    buyer_return_pattern = CASE 
        WHEN case_id IN (
            SELECT id FROM cases WHERE case_id IN ('LX-2120', 'LX-2107', 'LX-2113', 'LX-2101')
        ) THEN 'frequent_returns'
        WHEN case_id IN (
            SELECT id FROM cases WHERE case_id IN ('LX-2116', 'LX-2117', 'LX-2118')
        ) THEN 'moderate_returns'
        ELSE 'normal'
    END,
    buyer_dispute_pattern = CASE 
        WHEN case_id IN (
            SELECT id FROM cases WHERE case_id IN ('LX-2120', 'LX-2107', 'LX-2113')
        ) THEN 'frequent_disputes'
        WHEN case_id IN (
            SELECT id FROM cases WHERE case_id IN ('LX-2101', 'LX-2116', 'LX-2117')
        ) THEN 'occasional_disputes'
        ELSE 'none'
    END,
    buyer_refund_seeking_behavior = CASE 
        WHEN case_id IN (
            SELECT id FROM cases WHERE case_id IN ('LX-2120', 'LX-2107', 'LX-2113', 'LX-2101')
        ) THEN 0.85
        WHEN case_id IN (
            SELECT id FROM cases WHERE case_id IN ('LX-2116', 'LX-2117', 'LX-2118')
        ) THEN 0.45
        ELSE 0.15
    END,
    buyer_risk_level = CASE 
        WHEN case_id IN (
            SELECT id FROM cases WHERE case_id IN ('LX-2120', 'LX-2107', 'LX-2113', 'LX-2101')
        ) THEN 'high'
        WHEN case_id IN (
            SELECT id FROM cases WHERE case_id IN ('LX-2116', 'LX-2117', 'LX-2118')
        ) THEN 'medium'
        ELSE 'low'
    END;

-- Add columns for buyer_id and seller_id if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cases' AND column_name = 'buyer_id') THEN
        ALTER TABLE cases ADD COLUMN buyer_id TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cases' AND column_name = 'seller_id') THEN
        ALTER TABLE cases ADD COLUMN seller_id TEXT;
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cases_buyer_id ON cases(buyer_id);
CREATE INDEX IF NOT EXISTS idx_cases_seller_id ON cases(seller_id);

-- Verify alignment
DO $$
DECLARE
    high_fraud_count INTEGER;
    legitimate_count INTEGER;
BEGIN
    -- Count high fraud cases (should have bad visual + bad behavioral)
    SELECT COUNT(*) INTO high_fraud_count
    FROM cases 
    WHERE case_id IN ('LX-2120', 'LX-2107', 'LX-2113', 'LX-2101')
    AND buyer_return_rate > 15
    AND buyer_dispute_count >= 3;
    
    -- Count legitimate cases (should have good visual + good behavioral)
    SELECT COUNT(*) INTO legitimate_count
    FROM cases 
    WHERE case_id IN ('LX-2102', 'LX-2105', 'LX-2110')
    AND buyer_return_rate < 5
    AND buyer_dispute_count = 0;
    
    RAISE NOTICE '✅ Dataset Alignment Complete:';
    RAISE NOTICE '   High Fraud Cases (visual + behavioral issues): %', high_fraud_count;
    RAISE NOTICE '   Legitimate Cases (clean visual + behavioral): %', legitimate_count;
    RAISE NOTICE '   All cases now have buyer_id and seller_id';
END $$;