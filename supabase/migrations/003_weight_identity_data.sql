-- Weight Consistency and Item Identity Data
-- Populate risk_signals table with advanced fraud detection metrics

-- Insert Weight Consistency signals for all 16 cases
INSERT INTO risk_signals (case_id, signal_name, signal_type, value, impact_score, severity, confidence, description, metadata)
SELECT 
    c.id as case_id,
    'Weight Consistency' as signal_name,
    'physical_verification' as signal_type,
    CASE c.case_id
        WHEN 'LX-2101' THEN '60% weight discrepancy (150g → 95g)'
        WHEN 'LX-2102' THEN '18% weight discrepancy (85g → 82g)'
        WHEN 'LX-2103' THEN '15% weight discrepancy (1200g → 1020g)'
        WHEN 'LX-2104' THEN '35% weight discrepancy (650g → 425g)'
        WHEN 'LX-2105' THEN '20% weight discrepancy (180g → 175g)'
        WHEN 'LX-2106' THEN '45% weight discrepancy (890g → 490g)'
        WHEN 'LX-2107' THEN '65% weight discrepancy (220g → 75g)'
        WHEN 'LX-2109' THEN '12% weight discrepancy (750g → 665g)'
        WHEN 'LX-2110' THEN '10% weight discrepancy (95g → 90g)'
        WHEN 'LX-2111' THEN '42% weight discrepancy (45g → 26g)'
        WHEN 'LX-2112' THEN '8% weight discrepancy - minimal'
        WHEN 'LX-2113' THEN '58% weight discrepancy (155g → 65g)'
        WHEN 'LX-2116' THEN '55% weight discrepancy (820g → 370g)'
        WHEN 'LX-2117' THEN '40% weight discrepancy (950g → 570g)'
        WHEN 'LX-2118' THEN '38% weight discrepancy - moderate'
        WHEN 'LX-2120' THEN '70% weight discrepancy (85g → 25g)'
    END as value,
    CASE c.case_id
        WHEN 'LX-2101' THEN 60
        WHEN 'LX-2102' THEN 18
        WHEN 'LX-2103' THEN 15
        WHEN 'LX-2104' THEN 35
        WHEN 'LX-2105' THEN 20
        WHEN 'LX-2106' THEN 45
        WHEN 'LX-2107' THEN 65
        WHEN 'LX-2109' THEN 12
        WHEN 'LX-2110' THEN 10
        WHEN 'LX-2111' THEN 42
        WHEN 'LX-2112' THEN 8
        WHEN 'LX-2113' THEN 58
        WHEN 'LX-2116' THEN 55
        WHEN 'LX-2117' THEN 40
        WHEN 'LX-2118' THEN 38
        WHEN 'LX-2120' THEN 70
    END as impact_score,
    CASE c.case_id
        WHEN 'LX-2101' THEN 'high'
        WHEN 'LX-2102' THEN 'low'
        WHEN 'LX-2103' THEN 'low'
        WHEN 'LX-2104' THEN 'medium'
        WHEN 'LX-2105' THEN 'low'
        WHEN 'LX-2106' THEN 'medium'
        WHEN 'LX-2107' THEN 'critical'
        WHEN 'LX-2109' THEN 'low'
        WHEN 'LX-2110' THEN 'low'
        WHEN 'LX-2111' THEN 'medium'
        WHEN 'LX-2112' THEN 'low'
        WHEN 'LX-2113' THEN 'high'
        WHEN 'LX-2116' THEN 'high'
        WHEN 'LX-2117' THEN 'medium'
        WHEN 'LX-2118' THEN 'medium'
        WHEN 'LX-2120' THEN 'critical'
    END as severity,
    0.95 as confidence,
    'Physical weight verification comparing outbound vs returned item weight' as description,
    jsonb_build_object(
        'outbound_weight', (c.metadata->>'outbound_weight_grams')::integer,
        'returned_weight', (c.metadata->>'returned_weight_grams')::integer,
        'discrepancy_type', 'weight_loss',
        'verification_method', 'precision_scale'
    ) as metadata
FROM cases c;

-- Insert Item Identity Confidence signals for all 16 cases
INSERT INTO risk_signals (case_id, signal_name, signal_type, value, impact_score, severity, confidence, description, metadata)
SELECT 
    c.id as case_id,
    'Item Identity Confidence' as signal_name,
    'identity_verification' as signal_type,
    CASE c.case_id
        WHEN 'LX-2101' THEN '20% identity confidence - multiple mismatches'
        WHEN 'LX-2102' THEN '82% identity confidence - all elements match'
        WHEN 'LX-2103' THEN '80% identity confidence - serial match, packaging issues'
        WHEN 'LX-2104' THEN '50% identity confidence - mixed signals'
        WHEN 'LX-2105' THEN '75% identity confidence - shipping damage only'
        WHEN 'LX-2106' THEN '55% identity confidence - serial concerns'
        WHEN 'LX-2107' THEN '15% identity confidence - complete mismatch'
        WHEN 'LX-2109' THEN '88% identity confidence - excellent match'
        WHEN 'LX-2110' THEN '85% identity confidence - perfect verification'
        WHEN 'LX-2111' THEN '52% identity confidence - accessories missing'
        WHEN 'LX-2112' THEN '90% identity confidence - high authenticity'
        WHEN 'LX-2113' THEN '22% identity confidence - fraud indicators'
        WHEN 'LX-2116' THEN '25% identity confidence - authentication failed'
        WHEN 'LX-2117' THEN '45% identity confidence - pattern issues'
        WHEN 'LX-2118' THEN '48% identity confidence - moderate concerns'
        WHEN 'LX-2120' THEN '10% identity confidence - critical fraud'
    END as value,
    -- Impact score is inverted (100 - confidence) since low confidence = high impact
    CASE c.case_id
        WHEN 'LX-2101' THEN 80  -- 100 - 20
        WHEN 'LX-2102' THEN 18  -- 100 - 82
        WHEN 'LX-2103' THEN 20  -- 100 - 80
        WHEN 'LX-2104' THEN 50  -- 100 - 50
        WHEN 'LX-2105' THEN 25  -- 100 - 75
        WHEN 'LX-2106' THEN 45  -- 100 - 55
        WHEN 'LX-2107' THEN 85  -- 100 - 15
        WHEN 'LX-2109' THEN 12  -- 100 - 88
        WHEN 'LX-2110' THEN 15  -- 100 - 85
        WHEN 'LX-2111' THEN 48  -- 100 - 52
        WHEN 'LX-2112' THEN 10  -- 100 - 90
        WHEN 'LX-2113' THEN 78  -- 100 - 22
        WHEN 'LX-2116' THEN 75  -- 100 - 25
        WHEN 'LX-2117' THEN 55  -- 100 - 45
        WHEN 'LX-2118' THEN 52  -- 100 - 48
        WHEN 'LX-2120' THEN 90  -- 100 - 10
    END as impact_score,
    CASE c.case_id
        WHEN 'LX-2101' THEN 'critical'
        WHEN 'LX-2102' THEN 'low'
        WHEN 'LX-2103' THEN 'low'
        WHEN 'LX-2104' THEN 'medium'
        WHEN 'LX-2105' THEN 'low'
        WHEN 'LX-2106' THEN 'medium'
        WHEN 'LX-2107' THEN 'critical'
        WHEN 'LX-2109' THEN 'low'
        WHEN 'LX-2110' THEN 'low'
        WHEN 'LX-2111' THEN 'medium'
        WHEN 'LX-2112' THEN 'low'
        WHEN 'LX-2113' THEN 'critical'
        WHEN 'LX-2116' THEN 'critical'
        WHEN 'LX-2117' THEN 'medium'
        WHEN 'LX-2118' THEN 'medium'
        WHEN 'LX-2120' THEN 'critical'
    END as severity,
    0.92 as confidence,
    'Item identity verification based on serial numbers, accessories, and packaging' as description,
    jsonb_build_object(
        'serial_match', (c.metadata->>'serial_number_match')::boolean,
        'accessories_present', (c.metadata->>'accessories_present')::boolean,
        'packaging_intact', (c.metadata->>'packaging_intact')::boolean,
        'verification_components', array['serial', 'accessories', 'packaging']
    ) as metadata
FROM cases c;

-- Verify data insertion
SELECT 
    'Weight Consistency signals inserted: ' || COUNT(*) as status
FROM risk_signals 
WHERE signal_name = 'Weight Consistency'
UNION ALL
SELECT 
    'Item Identity signals inserted: ' || COUNT(*) as status
FROM risk_signals 
WHERE signal_name = 'Item Identity Confidence';

-- Create summary view for easy monitoring
CREATE OR REPLACE VIEW case_metrics_summary AS
SELECT 
    c.case_id,
    c.brand,
    c.item_title,
    c.price,
    c.dispute_type,
    c.recommended_action,
    ws.impact_score as weight_consistency_pct,
    (100 - iis.impact_score) as item_identity_pct,
    CASE 
        WHEN ws.impact_score > 50 OR (100 - iis.impact_score) < 30 THEN 'HIGH_RISK'
        WHEN ws.impact_score > 30 OR (100 - iis.impact_score) < 50 THEN 'MEDIUM_RISK'
        ELSE 'LOW_RISK'
    END as overall_risk_level
FROM cases c
LEFT JOIN risk_signals ws ON c.id = ws.case_id AND ws.signal_name = 'Weight Consistency'
LEFT JOIN risk_signals iis ON c.id = iis.case_id AND iis.signal_name = 'Item Identity Confidence'
ORDER BY c.case_id;