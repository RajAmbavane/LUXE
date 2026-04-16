-- Migration 5: Missing Tables and RLS Policies
-- This migration creates tables that were referenced in code but missing from previous migrations

-- Create behavioral_metrics table if it doesn't exist
CREATE TABLE IF NOT EXISTS behavioral_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    buyer_return_pattern TEXT,
    buyer_dispute_pattern TEXT,
    buyer_refund_seeking_behavior DECIMAL(3,2),
    buyer_communication_quality TEXT,
    buyer_response_time_hours INTEGER,
    buyer_evidence_provided BOOLEAN,
    buyer_evidence_quality TEXT,
    seller_response_time_hours INTEGER,
    seller_dispute_resolution_rate DECIMAL(3,2),
    seller_refund_acceptance_rate DECIMAL(3,2),
    seller_communication_quality TEXT,
    seller_evidence_provided BOOLEAN,
    seller_evidence_quality TEXT,
    return_initiated_days_after_delivery INTEGER,
    dispute_initiated_days_after_return INTEGER,
    buyer_risk_level TEXT,
    seller_risk_level TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create decisions table if it doesn't exist
CREATE TABLE IF NOT EXISTS decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    recommended_action TEXT,
    final_action TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    actor_name TEXT,
    details JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create case_images table if it doesn't exist
CREATE TABLE IF NOT EXISTS case_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    image_type TEXT NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    before_image_url TEXT,
    after_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS (Row Level Security) policies to prevent 406 errors
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavioral_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_images ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for development (adjust for production)
CREATE POLICY "Allow all operations on cases" ON cases FOR ALL USING (true);
CREATE POLICY "Allow all operations on agent_analysis" ON agent_analysis FOR ALL USING (true);
CREATE POLICY "Allow all operations on risk_signals" ON risk_signals FOR ALL USING (true);
CREATE POLICY "Allow all operations on behavioral_metrics" ON behavioral_metrics FOR ALL USING (true);
CREATE POLICY "Allow all operations on decisions" ON decisions FOR ALL USING (true);
CREATE POLICY "Allow all operations on audit_logs" ON audit_logs FOR ALL USING (true);
CREATE POLICY "Allow all operations on case_images" ON case_images FOR ALL USING (true);

-- Insert sample behavioral metrics for all cases
INSERT INTO behavioral_metrics (
    case_id, buyer_return_pattern, buyer_dispute_pattern, buyer_refund_seeking_behavior,
    buyer_communication_quality, buyer_response_time_hours, buyer_evidence_provided,
    buyer_evidence_quality, seller_response_time_hours, seller_dispute_resolution_rate,
    seller_refund_acceptance_rate, seller_communication_quality, seller_evidence_provided,
    seller_evidence_quality, return_initiated_days_after_delivery, dispute_initiated_days_after_return,
    buyer_risk_level, seller_risk_level
) 
SELECT 
    id as case_id,
    'normal' as buyer_return_pattern,
    'none' as buyer_dispute_pattern,
    0.15 as buyer_refund_seeking_behavior,
    'professional' as buyer_communication_quality,
    24 as buyer_response_time_hours,
    true as buyer_evidence_provided,
    'high' as buyer_evidence_quality,
    12 as seller_response_time_hours,
    0.95 as seller_dispute_resolution_rate,
    0.92 as seller_refund_acceptance_rate,
    'professional' as seller_communication_quality,
    true as seller_evidence_provided,
    'high' as seller_evidence_quality,
    5 as return_initiated_days_after_delivery,
    2 as dispute_initiated_days_after_return,
    'low' as buyer_risk_level,
    'low' as seller_risk_level
FROM cases
WHERE NOT EXISTS (
    SELECT 1 FROM behavioral_metrics WHERE behavioral_metrics.case_id = cases.id
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_behavioral_metrics_case_id ON behavioral_metrics(case_id);
CREATE INDEX IF NOT EXISTS idx_decisions_case_id ON decisions(case_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_case_id ON audit_logs(case_id);
CREATE INDEX IF NOT EXISTS idx_case_images_case_id ON case_images(case_id);

-- Verify all tables exist
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('cases', 'agent_analysis', 'risk_signals', 'behavioral_metrics', 'decisions', 'audit_logs', 'case_images');
    
    IF table_count = 7 THEN
        RAISE NOTICE '✅ All 7 required tables exist';
    ELSE
        RAISE NOTICE '❌ Missing tables. Expected 7, found %', table_count;
    END IF;
END $$;