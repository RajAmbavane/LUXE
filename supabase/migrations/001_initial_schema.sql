-- LuxeResolve Intelligence Database Schema
-- Complete database setup for fraud detection system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Cases table - Core transaction and dispute data
CREATE TABLE IF NOT EXISTS cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id VARCHAR(50) UNIQUE NOT NULL,
    transaction_id VARCHAR(100),
    brand VARCHAR(100),
    item_title VARCHAR(500),
    price DECIMAL(10,2),
    dispute_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    risk_score INTEGER DEFAULT 0,
    recommended_action VARCHAR(50),
    confidence INTEGER DEFAULT 0,
    assigned_to VARCHAR(100),
    buyer_id VARCHAR(100),
    seller_id VARCHAR(100),
    buyer_name VARCHAR(200),
    seller_name VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadata JSON field for flexible data storage
    metadata JSONB,
    
    -- Item details
    item_category VARCHAR(100),
    item_condition_reported VARCHAR(100),
    item_condition_actual VARCHAR(100),
    item_sku VARCHAR(100),
    item_color VARCHAR(50),
    item_size VARCHAR(50),
    item_material VARCHAR(100),
    
    -- Dispute details
    dispute_reason TEXT,
    dispute_date TIMESTAMP WITH TIME ZONE,
    
    -- Buyer profile
    buyer_account_age_days INTEGER,
    buyer_total_purchases INTEGER DEFAULT 0,
    buyer_return_rate DECIMAL(5,2) DEFAULT 0,
    buyer_dispute_count INTEGER DEFAULT 0,
    buyer_dispute_history TEXT,
    buyer_avg_rating DECIMAL(3,2),
    buyer_feedback_count INTEGER DEFAULT 0,
    buyer_country VARCHAR(100),
    buyer_account_status VARCHAR(50),
    
    -- Seller profile
    seller_account_age_days INTEGER,
    seller_total_sales INTEGER DEFAULT 0,
    seller_return_rate DECIMAL(5,2) DEFAULT 0,
    seller_dispute_count INTEGER DEFAULT 0,
    seller_dispute_history TEXT,
    seller_avg_rating DECIMAL(3,2),
    seller_feedback_count INTEGER DEFAULT 0,
    seller_country VARCHAR(100),
    seller_account_status VARCHAR(50),
    seller_verification_status VARCHAR(50),
    
    -- Transaction details
    transaction_date TIMESTAMP WITH TIME ZONE,
    shipping_method VARCHAR(100),
    shipping_cost DECIMAL(10,2),
    shipping_tracking_number VARCHAR(200),
    delivery_date TIMESTAMP WITH TIME ZONE,
    delivery_signature_required BOOLEAN DEFAULT FALSE,
    return_initiated_date TIMESTAMP WITH TIME ZONE,
    return_received_date TIMESTAMP WITH TIME ZONE,
    
    -- AI Analysis Results
    ai_explanation TEXT,
    
    -- Weight and Identity Verification (Advanced Metrics)
    weight_consistency_score DECIMAL(3,2),
    weight_consistency_status VARCHAR(50),
    weight_consistency_detail TEXT,
    item_identity_confidence DECIMAL(3,2),
    item_identity_level VARCHAR(50),
    item_identity_detail TEXT
);

-- Agent Analysis table - Stores AI agent findings
CREATE TABLE IF NOT EXISTS agent_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    agent_name VARCHAR(100) NOT NULL,
    agent_version VARCHAR(20),
    analysis_type VARCHAR(100),
    specialization VARCHAR(100),
    findings JSONB,
    confidence_score DECIMAL(4,3),
    agent_recommendation VARCHAR(100),
    recommendation_confidence DECIMAL(4,3),
    reasoning TEXT,
    execution_time_ms INTEGER,
    status VARCHAR(50),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Risk Signals table - Stores fraud detection metrics
CREATE TABLE IF NOT EXISTS risk_signals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    signal_name VARCHAR(200) NOT NULL,
    signal_type VARCHAR(100),
    value TEXT,
    impact_score INTEGER,
    severity VARCHAR(50),
    confidence DECIMAL(4,3),
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cases_case_id ON cases(case_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_dispute_type ON cases(dispute_type);
CREATE INDEX IF NOT EXISTS idx_cases_created_at ON cases(created_at);
CREATE INDEX IF NOT EXISTS idx_agent_analysis_case_id ON agent_analysis(case_id);
CREATE INDEX IF NOT EXISTS idx_agent_analysis_agent_name ON agent_analysis(agent_name);
CREATE INDEX IF NOT EXISTS idx_risk_signals_case_id ON risk_signals(case_id);
CREATE INDEX IF NOT EXISTS idx_risk_signals_signal_name ON risk_signals(signal_name);

-- Comments for documentation
COMMENT ON TABLE cases IS 'Core cases table storing transaction disputes and fraud detection data';
COMMENT ON TABLE agent_analysis IS 'AI agent analysis results for each case';
COMMENT ON TABLE risk_signals IS 'Individual fraud detection signals and metrics';

COMMENT ON COLUMN cases.metadata IS 'Flexible JSON storage for additional case metadata';
COMMENT ON COLUMN cases.weight_consistency_score IS 'Weight consistency score (0-1) indicating likelihood of weight fraud';
COMMENT ON COLUMN cases.item_identity_confidence IS 'Item identity confidence score (0-1)';
COMMENT ON COLUMN agent_analysis.findings IS 'Detailed JSON findings from AI agent analysis';
COMMENT ON COLUMN risk_signals.metadata IS 'Additional signal metadata in JSON format';

-- Update trigger for cases table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_analysis_updated_at BEFORE UPDATE ON agent_analysis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_risk_signals_updated_at BEFORE UPDATE ON risk_signals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();