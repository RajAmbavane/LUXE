-- LuxeResolve Intelligence Sample Data
-- 16 luxury marketplace dispute cases for testing and demonstration

-- Insert sample cases with comprehensive data
INSERT INTO cases (
    case_id, transaction_id, brand, item_title, price, dispute_type, status,
    buyer_name, seller_name, buyer_account_age_days, buyer_return_rate, buyer_dispute_count,
    seller_account_age_days, seller_total_sales, seller_dispute_count,
    shipping_method, delivery_signature_required, delivery_date, return_initiated_date,
    metadata
) VALUES 
-- Case 1: LX-2101 - High-risk return fraud
('LX-2101', 'TXN-45123', 'Rolex', 'Rolex Submariner Date', 12500.00, 'Return Fraud', 'under_review',
 'Marcus Chen', 'Elena Rodriguez', 45, 15.2, 3,
 1200, 85, 2,
 'FedEx', true, '2026-03-15', '2026-03-18',
 '{"notes": "Weight discrepancy reported", "ship_date": "2026-03-12", "days_to_deliver": 3, "days_to_return": 3, "buyer_account_id": "ACC-001", "seller_account_id": "ACC-051", "buyer_account_active": "yes", "seller_account_active": "yes", "buyer_past_fraud_flags": 1, "seller_past_fraud_flags": 0, "outbound_weight_grams": 150, "returned_weight_grams": 95, "serial_number_match": false, "accessories_present": false, "packaging_intact": false}'::jsonb),

-- Case 2: LX-2102 - Legitimate return
('LX-2102', 'TXN-67890', 'Cartier', 'Cartier Tank Solo', 3200.00, 'Item Not As Described', 'under_review',
 'Sarah Johnson', 'Michael Zhang', 890, 3.1, 0,
 2100, 150, 1,
 'UPS', true, '2026-03-10', '2026-03-25',
 '{"notes": "Minor scratches on case", "ship_date": "2026-03-08", "days_to_deliver": 2, "days_to_return": 15, "buyer_account_id": "ACC-002", "seller_account_id": "ACC-052", "buyer_account_active": "yes", "seller_account_active": "yes", "buyer_past_fraud_flags": 0, "seller_past_fraud_flags": 0, "outbound_weight_grams": 85, "returned_weight_grams": 82, "serial_number_match": true, "accessories_present": true, "packaging_intact": true}'::jsonb),

-- Case 3: LX-2103 - Mixed signals case
('LX-2103', 'TXN-11234', 'Hermès', 'Hermès Birkin 35', 18900.00, 'Counterfeit', 'under_review',
 'Jennifer Liu', 'Antoine Dubois', 320, 8.7, 1,
 1800, 45, 3,
 'DHL', false, '2026-02-28', '2026-03-05',
 '{"notes": "Authentication concerns", "ship_date": "2026-02-25", "days_to_deliver": 3, "days_to_return": 5, "buyer_account_id": "ACC-003", "seller_account_id": "ACC-053", "buyer_account_active": "yes", "seller_account_active": "yes", "buyer_past_fraud_flags": 0, "seller_past_fraud_flags": 1, "outbound_weight_grams": 1200, "returned_weight_grams": 1020, "serial_number_match": true, "accessories_present": true, "packaging_intact": false}'::jsonb),

-- Case 4: LX-2104 - Escalation required
('LX-2104', 'TXN-55667', 'Louis Vuitton', 'Louis Vuitton Neverfull MM', 1850.00, 'Return Fraud', 'under_review',
 'David Park', 'Isabella Romano', 150, 12.4, 2,
 950, 78, 4,
 'USPS', false, '2026-03-20', '2026-03-22',
 '{"notes": "Immediate return after delivery", "ship_date": "2026-03-18", "days_to_deliver": 2, "days_to_return": 2, "buyer_account_id": "ACC-004", "seller_account_id": "ACC-054", "buyer_account_active": "yes", "seller_account_active": "yes", "buyer_past_fraud_flags": 2, "seller_past_fraud_flags": 0, "outbound_weight_grams": 650, "returned_weight_grams": 425, "serial_number_match": false, "accessories_present": false, "packaging_intact": true}'::jsonb),

-- Case 5: LX-2105 - Clear approval case
('LX-2105', 'TXN-78901', 'Patek Philippe', 'Patek Philippe Calatrava', 28500.00, 'Shipping Damage', 'under_review',
 'Robert Kim', 'Sophie Martin', 1200, 2.1, 0,
 2800, 25, 0,
 'FedEx', true, '2026-02-14', '2026-02-16',
 '{"notes": "Crystal cracked during shipping", "ship_date": "2026-02-12", "days_to_deliver": 2, "days_to_return": 2, "buyer_account_id": "ACC-005", "seller_account_id": "ACC-055", "buyer_account_active": "yes", "seller_account_active": "yes", "buyer_past_fraud_flags": 0, "seller_past_fraud_flags": 0, "outbound_weight_grams": 180, "returned_weight_grams": 175, "serial_number_match": true, "accessories_present": true, "packaging_intact": false}'::jsonb),

-- Case 6: LX-2106 - Moderate fraud risk
('LX-2106', 'TXN-23456', 'Chanel', 'Chanel Classic Flap Bag', 7200.00, 'Return Fraud', 'under_review',
 'Amanda Foster', 'Lucas Silva', 75, 18.9, 4,
 1500, 95, 2,
 'UPS', true, '2026-03-08', '2026-03-10',
 '{"notes": "Serial number concerns", "ship_date": "2026-03-05", "days_to_deliver": 3, "days_to_return": 2, "buyer_account_id": "ACC-006", "seller_account_id": "ACC-056", "buyer_account_active": "yes", "seller_account_active": "yes", "buyer_past_fraud_flags": 1, "seller_past_fraud_flags": 0, "outbound_weight_grams": 890, "returned_weight_grams": 490, "serial_number_match": false, "accessories_present": true, "packaging_intact": true}'::jsonb),

-- Case 7: LX-2107 - High fraud indicators
('LX-2107', 'TXN-34567', 'Audemars Piguet', 'AP Royal Oak Offshore', 35000.00, 'Return Fraud', 'under_review',
 'Kevin Wong', 'Maria Gonzalez', 25, 25.6, 5,
 800, 42, 1,
 'DHL', false, '2026-03-01', '2026-03-02',
 '{"notes": "New account, high-value claim", "ship_date": "2026-02-28", "days_to_deliver": 1, "days_to_return": 1, "buyer_account_id": "ACC-007", "seller_account_id": "ACC-057", "buyer_account_active": "yes", "seller_account_active": "yes", "buyer_past_fraud_flags": 3, "seller_past_fraud_flags": 0, "outbound_weight_grams": 220, "returned_weight_grams": 75, "serial_number_match": false, "accessories_present": false, "packaging_intact": false}'::jsonb),

-- Case 8: LX-2109 - Borderline case
('LX-2109', 'TXN-45678', 'Prada', 'Prada Saffiano Tote', 2100.00, 'Item Not As Described', 'under_review',
 'Lisa Thompson', 'Jean-Pierre Moreau', 450, 6.8, 1,
 1100, 68, 3,
 'FedEx', true, '2026-03-12', '2026-03-20',
 '{"notes": "Color variation claimed", "ship_date": "2026-03-10", "days_to_deliver": 2, "days_to_return": 8, "buyer_account_id": "ACC-009", "seller_account_id": "ACC-059", "buyer_account_active": "yes", "seller_account_active": "yes", "buyer_past_fraud_flags": 0, "seller_past_fraud_flags": 1, "outbound_weight_grams": 750, "returned_weight_grams": 665, "serial_number_match": true, "accessories_present": true, "packaging_intact": true}'::jsonb),

-- Case 9: LX-2110 - Clear legitimate case
('LX-2110', 'TXN-56789', 'Bulgari', 'Bulgari Serpenti Watch', 4800.00, 'Defective Item', 'under_review',
 'Thomas Anderson', 'Yuki Tanaka', 950, 1.8, 0,
 2200, 110, 1,
 'UPS', true, '2026-02-20', '2026-02-28',
 '{"notes": "Crown mechanism faulty", "ship_date": "2026-02-18", "days_to_deliver": 2, "days_to_return": 8, "buyer_account_id": "ACC-010", "seller_account_id": "ACC-060", "buyer_account_active": "yes", "seller_account_active": "yes", "buyer_past_fraud_flags": 0, "seller_past_fraud_flags": 0, "outbound_weight_grams": 95, "returned_weight_grams": 90, "serial_number_match": true, "accessories_present": true, "packaging_intact": true}'::jsonb),

-- Case 10: LX-2111 - Complex mixed signals
('LX-2111', 'TXN-67890', 'Tiffany & Co.', 'Tiffany Setting Engagement Ring', 8900.00, 'Return Fraud', 'under_review',
 'Rachel Green', 'Alessandro Rossi', 180, 11.2, 2,
 1600, 55, 2,
 'FedEx', true, '2026-03-05', '2026-03-08',
 '{"notes": "Diamond clarity dispute", "ship_date": "2026-03-03", "days_to_deliver": 2, "days_to_return": 3, "buyer_account_id": "ACC-011", "seller_account_id": "ACC-061", "buyer_account_active": "yes", "seller_account_active": "yes", "buyer_past_fraud_flags": 1, "seller_past_fraud_flags": 0, "outbound_weight_grams": 45, "returned_weight_grams": 26, "serial_number_match": true, "accessories_present": false, "packaging_intact": true}'::jsonb),

-- Case 11: LX-2112 - Interesting edge case
('LX-2112', 'TXN-27190', 'Cartier', 'Cartier Love Bracelet', 7400.00, 'Return Fraud', 'under_review',
 'Oliver Harrison', 'Mina Nakamura', 1430, 2.4, 0,
 280, 0, 0,
 'DHL', false, '2026-03-12', '2026-03-15',
 '{"notes": "Engraving not as described", "ship_date": "2026-03-08", "days_to_deliver": 4, "days_to_return": 3, "buyer_account_id": "ACC-012", "seller_account_id": "ACC-093", "buyer_account_active": "yes", "seller_account_active": "no", "buyer_past_fraud_flags": 0, "seller_past_fraud_flags": 0}'::jsonb),

-- Case 12: LX-2113 - Clear fraud case
('LX-2113', 'TXN-78123', 'Omega', 'Omega Speedmaster Professional', 5200.00, 'Return Fraud', 'under_review',
 'Daniel Miller', 'Francesca Bianchi', 60, 22.1, 6,
 1900, 88, 1,
 'USPS', false, '2026-02-25', '2026-02-26',
 '{"notes": "Immediate return, weight issues", "ship_date": "2026-02-23", "days_to_deliver": 2, "days_to_return": 1, "buyer_account_id": "ACC-013", "seller_account_id": "ACC-063", "buyer_account_active": "yes", "seller_account_active": "yes", "buyer_past_fraud_flags": 4, "seller_past_fraud_flags": 0, "outbound_weight_grams": 155, "returned_weight_grams": 65, "serial_number_match": false, "accessories_present": false, "packaging_intact": false}'::jsonb),

-- Case 13: LX-2116 - Moderate fraud risk
('LX-2116', 'TXN-89234', 'Gucci', 'Gucci Dionysus Bag', 3100.00, 'Counterfeit', 'under_review',
 'Michelle Davis', 'Carlos Mendoza', 220, 14.7, 3,
 750, 62, 4,
 'UPS', true, '2026-03-18', '2026-03-21',
 '{"notes": "Authentication failed", "ship_date": "2026-03-16", "days_to_deliver": 2, "days_to_return": 3, "buyer_account_id": "ACC-016", "seller_account_id": "ACC-066", "buyer_account_active": "yes", "seller_account_active": "yes", "buyer_past_fraud_flags": 2, "seller_past_fraud_flags": 1, "outbound_weight_grams": 820, "returned_weight_grams": 370, "serial_number_match": false, "accessories_present": true, "packaging_intact": false}'::jsonb),

-- Case 14: LX-2117 - Policy trigger case
('LX-2117', 'TXN-90345', 'Bottega Veneta', 'Bottega Veneta Intrecciato Bag', 4200.00, 'Return Fraud', 'under_review',
 'Christopher Lee', 'Valentina Ferrari', 95, 16.8, 4,
 1300, 72, 3,
 'DHL', false, '2026-03-22', '2026-03-23',
 '{"notes": "Pattern mismatch reported", "ship_date": "2026-03-20", "days_to_deliver": 2, "days_to_return": 1, "buyer_account_id": "ACC-017", "seller_account_id": "ACC-067", "buyer_account_active": "yes", "seller_account_active": "yes", "buyer_past_fraud_flags": 2, "seller_past_fraud_flags": 0, "outbound_weight_grams": 950, "returned_weight_grams": 570, "serial_number_match": true, "accessories_present": false, "packaging_intact": true}'::jsonb),

-- Case 15: LX-2118 - Complex authentication case
('LX-2118', 'TXN-90821', 'Omega', 'Omega Seamaster Aqua Terra', 6800.00, 'Return Fraud', 'under_review',
 'Hana Suzuki', 'Paul Leclerc', 1700, 8.1, 0,
 2300, 120, 6,
 'UPS', true, '2026-02-16', '2026-02-20',
 '{"notes": "Crown not threading correctly", "ship_date": "2026-02-12", "days_to_deliver": 4, "days_to_return": 4, "buyer_account_id": "ACC-019", "seller_account_id": "ACC-083", "buyer_account_active": "yes", "seller_account_active": "yes", "buyer_past_fraud_flags": 0, "seller_past_fraud_flags": 0}'::jsonb),

-- Case 16: LX-2120 - High-risk fraud pattern
('LX-2120', 'TXN-12456', 'Van Cleef & Arpels', 'VCA Alhambra Necklace', 9500.00, 'Return Fraud', 'under_review',
 'Stephanie White', 'Giorgio Armani', 35, 28.4, 7,
 600, 38, 2,
 'FedEx', true, '2026-03-25', '2026-03-26',
 '{"notes": "Multiple fraud indicators", "ship_date": "2026-03-23", "days_to_deliver": 2, "days_to_return": 1, "buyer_account_id": "ACC-020", "seller_account_id": "ACC-070", "buyer_account_active": "yes", "seller_account_active": "yes", "buyer_past_fraud_flags": 5, "seller_past_fraud_flags": 0, "outbound_weight_grams": 85, "returned_weight_grams": 25, "serial_number_match": false, "accessories_present": false, "packaging_intact": false}'::jsonb);

-- Update additional fields for all cases
UPDATE cases SET 
    buyer_avg_rating = 4.6,
    buyer_feedback_count = 0,
    seller_avg_rating = CASE 
        WHEN seller_total_sales > 100 THEN 4.8
        WHEN seller_total_sales > 50 THEN 4.6
        ELSE 5.0
    END,
    seller_feedback_count = seller_total_sales,
    item_category = CASE 
        WHEN brand IN ('Rolex', 'Patek Philippe', 'Audemars Piguet', 'Omega', 'Bulgari', 'Cartier') THEN 'Watch'
        WHEN brand IN ('Hermès', 'Louis Vuitton', 'Chanel', 'Prada', 'Gucci', 'Bottega Veneta') THEN 'Handbag'
        WHEN brand = 'Tiffany & Co.' THEN 'Jewelry'
        WHEN brand = 'Van Cleef & Arpels' THEN 'Jewelry'
        ELSE 'Luxury Goods'
    END,
    risk_score = CASE 
        WHEN case_id IN ('LX-2101', 'LX-2107', 'LX-2113', 'LX-2120') THEN 85
        WHEN case_id IN ('LX-2104', 'LX-2106', 'LX-2111', 'LX-2116', 'LX-2117', 'LX-2118') THEN 65
        WHEN case_id IN ('LX-2103', 'LX-2109', 'LX-2112') THEN 45
        ELSE 25
    END,
    recommended_action = CASE 
        WHEN case_id IN ('LX-2102', 'LX-2105', 'LX-2110') THEN 'APPROVE_REFUND'
        WHEN case_id IN ('LX-2101', 'LX-2107', 'LX-2113', 'LX-2116', 'LX-2117', 'LX-2118', 'LX-2120') THEN 'DENY_REFUND'
        ELSE 'ESCALATE'
    END,
    confidence = CASE 
        WHEN case_id IN ('LX-2102', 'LX-2105', 'LX-2110') THEN 85
        WHEN case_id IN ('LX-2101', 'LX-2107', 'LX-2113', 'LX-2116', 'LX-2117', 'LX-2118', 'LX-2120') THEN 80
        ELSE 65
    END;