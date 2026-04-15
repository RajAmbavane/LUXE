"""
Text/Data Agent v1 — Groq text-only specialization.
Analyzes behavioral, shipping, account history, and structured data.
Uses fast, efficient text model (Mixtral or Llama).
"""

import os, time, json
from typing import Dict, Any
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("LLM_API_KEY") or os.getenv("GROQ_API_KEY")
TEXT_MODEL = os.getenv("TEXT_DATA_MODEL", "mixtral-8x7b-32768")


class TextDataAgent:
    """Text/data agent: behavioral, shipping, account history, structured data analysis."""
    
    def __init__(self):
        self.name = "text_data_agent"
        self.version = "1.0.0"
        self.model = TEXT_MODEL
        self.specialization = "text_data"
        self.client = Groq(api_key=GROQ_API_KEY)
        
        # Initialize Supabase client for fetching weight/identity data
        try:
            from supabase import create_client
            supabase_url = os.getenv("SUPABASE_URL")
            supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
            if supabase_url and supabase_key:
                self.supabase = create_client(supabase_url, supabase_key)
            else:
                self.supabase = None
        except:
            self.supabase = None

    def analyze(self, case_data: Dict[str, Any], behavioral_metrics: Dict[str, Any]) -> Dict[str, Any]:
        """Enhanced analysis with improved metric calculations and reasoning."""
        start_time = time.time()
        try:
            # Fetch weight and identity data from database if available
            weight_identity_data = self._fetch_weight_identity_data(case_data)
            
            # Call Groq for intelligent analysis
            context = self._build_context(case_data, behavioral_metrics, weight_identity_data)
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert fraud detection analyst. Analyze cases systematically and provide structured JSON responses with accurate risk assessments."
                    },
                    {
                        "role": "user", 
                        "content": context
                    }
                ],
                temperature=0.1,  # Very low temperature for consistent analysis
                max_tokens=2500,  # Increased for detailed analysis
                top_p=0.9,  # Focus on high-probability tokens
            )
            
            response_text = response.choices[0].message.content
            findings = self._parse_response(response_text, case_data, behavioral_metrics)
            
            # Integrate weight and identity data into findings
            if weight_identity_data:
                findings = self._integrate_weight_identity_data(findings, weight_identity_data)
            
            # Enhanced metric calculations
            enhanced_findings = self._enhance_metrics(findings, case_data, behavioral_metrics)
            
            # Improved recommendation logic
            recommendation, confidence = self._make_recommendation(enhanced_findings, case_data)
            
            # Generate detailed reasoning
            reasoning = self._generate_reasoning(enhanced_findings, recommendation, confidence)
            
            return {
                "agent_name": self.name,
                "agent_version": self.version,
                "analysis_type": "behavioral",
                "specialization": self.specialization,
                "findings": enhanced_findings,
                "confidence_score": confidence,
                "agent_recommendation": recommendation,
                "recommendation_confidence": confidence,
                "reasoning": reasoning,
                "execution_time_ms": int((time.time() - start_time) * 1000),
                "status": "completed",
            }
        except Exception as e:
            print(f"[TextDataAgent] Analysis error: {e}")
            import traceback
            traceback.print_exc()
            
            # Fetch weight and identity data for fallback
            weight_identity_data = self._fetch_weight_identity_data(case_data)
            
            # Enhanced fallback with better metrics
            fallback_findings = self._compute_enhanced_fallback(case_data, behavioral_metrics)
            
            # Integrate weight and identity data into fallback findings
            if weight_identity_data:
                fallback_findings = self._integrate_weight_identity_data(fallback_findings, weight_identity_data)
            
            recommendation, confidence = self._make_recommendation(fallback_findings, case_data)
            reasoning = self._generate_reasoning(fallback_findings, recommendation, confidence)
            
            return {
                "agent_name": self.name,
                "agent_version": self.version,
                "analysis_type": "behavioral",
                "specialization": self.specialization,
                "findings": fallback_findings,
                "confidence_score": confidence,
                "agent_recommendation": recommendation,
                "recommendation_confidence": confidence,
                "reasoning": reasoning,
                "execution_time_ms": int((time.time() - start_time) * 1000),
                "status": "completed_fallback",
                "error_message": str(e),
            }

    def _fetch_weight_identity_data(self, case_data: Dict[str, Any]) -> Dict[str, Any]:
        """Fetch weight consistency and item identity data from database."""
        if not self.supabase or not case_data:
            return {}
        
        try:
            # Get the case UUID - it could be in 'id' field or we need to look it up by 'case_id'
            case_uuid = case_data.get("id")
            case_id_str = case_data.get("case_id")
            
            if not case_uuid and case_id_str:
                # Look up by case_id string
                case_response = self.supabase.table("cases").select("id").eq("case_id", case_id_str).execute()
                if not case_response.data:
                    print(f"[TextDataAgent] Case not found: {case_id_str}")
                    return {}
                case_uuid = case_response.data[0]["id"]
            
            if not case_uuid:
                print(f"[TextDataAgent] No case UUID available")
                return {}
            
            # Fetch risk signals for this case
            signals_response = self.supabase.table("risk_signals").select("*").eq("case_id", case_uuid).execute()
            
            weight_data = {}
            identity_data = {}
            
            for signal in signals_response.data:
                if signal.get("signal_name") == "Weight Consistency":
                    weight_data = {
                        "score": signal.get("impact_score", 0) / 100.0,
                        "status": signal.get("severity", "medium"),
                        "value": signal.get("value", "")
                    }
                    print(f"[TextDataAgent] Found Weight Consistency: {weight_data['score']:.0%}")
                elif signal.get("signal_name") == "Item Identity Confidence":
                    identity_data = {
                        "score": 1.0 - (signal.get("impact_score", 0) / 100.0),  # Invert back
                        "status": signal.get("severity", "medium"),
                        "value": signal.get("value", "")
                    }
                    print(f"[TextDataAgent] Found Item Identity: {identity_data['score']:.0%}")
            
            if weight_data or identity_data:
                print(f"[TextDataAgent] Successfully fetched weight/identity data for {case_id_str or case_uuid}")
            
            return {
                "weight_consistency": weight_data,
                "item_identity": identity_data
            }
        except Exception as e:
            print(f"[TextDataAgent] Error fetching weight/identity data: {e}")
            import traceback
            traceback.print_exc()
            return {}

    def _integrate_weight_identity_data(self, findings: Dict, weight_identity_data: Dict) -> Dict:
        """Integrate fetched weight and identity data into findings."""
        if not weight_identity_data:
            return findings
        
        # Update weight consistency if available from database
        if weight_identity_data.get("weight_consistency") and weight_identity_data["weight_consistency"].get("score") is not None:
            weight = weight_identity_data["weight_consistency"]
            findings["weight_consistency"] = {
                "score": weight.get("score", 0),
                "status": weight.get("status", "medium"),
                "discrepancy_percentage": weight.get("score", 0) * 100,
                "is_fraud_signal": weight.get("score", 0) > 0.30,
                "detail": f"{weight.get('value', 'Weight data')} - from database"
            }
            print(f"[TextDataAgent] Integrated Weight Consistency from database: {findings['weight_consistency']['score']:.0%}")
        
        # Update item identity if available from database
        if weight_identity_data.get("item_identity") and weight_identity_data["item_identity"].get("score") is not None:
            identity = weight_identity_data["item_identity"]
            findings["item_identity_confidence"] = {
                "confidence_score": identity.get("score", 0.5),
                "level": "high" if identity.get("score", 0) > 0.70 else ("medium" if identity.get("score", 0) > 0.40 else "low"),
                "serial_match_impact": 0.5,
                "accessory_match_impact": 0.5,
                "packaging_impact": 0.5,
                "is_fraud_signal": identity.get("score", 0) < 0.40,
                "detail": f"{identity.get('value', 'Identity data')} - from database"
            }
            print(f"[TextDataAgent] Integrated Item Identity from database: {findings['item_identity_confidence']['confidence_score']:.0%}")
        
        return findings

    def _build_context(self, case_data: Dict, behavioral_metrics: Dict, weight_identity_data: Dict = None) -> str:
        """Build enhanced prompt context for intelligent text analysis."""
        meta = case_data.get("metadata") or {}
        
        # Build weight and identity section
        weight_identity_section = ""
        if weight_identity_data:
            weight = weight_identity_data.get("weight_consistency", {})
            identity = weight_identity_data.get("item_identity", {})
            
            weight_str = f"- Score: {weight.get('score', 0):.0%} ({weight.get('status', 'unknown')})" if weight else "- No data available"
            identity_str = f"- Confidence: {identity.get('score', 0):.0%}" if identity else "- No data available"
            
            weight_identity_section = f"""
VERIFICATION DATA (From Database):
Weight Consistency:
{weight_str}
  {weight.get('value', '')}

Item Identity:
{identity_str}
  {identity.get('value', '')}
"""
        
        # Extract key data points with better structure
        case_summary = f"""
CASE ANALYSIS REQUEST
Item: {case_data.get('item_title', 'Unknown')} by {case_data.get('brand', 'Unknown')}
Value: ${case_data.get('price', 0):,.0f}
Dispute Type: {case_data.get('dispute_type', 'Unknown')}
Case ID: {case_data.get('case_id', 'Unknown')}

BUYER PROFILE:
- Name: {case_data.get('buyer_name', 'Unknown')}
- Account Age: {case_data.get('buyer_account_age_days', 0)} days
- Return Rate: {case_data.get('buyer_return_rate', 0):.1%}
- Dispute History: {case_data.get('buyer_dispute_count', 0)} cases
- Past Fraud Flags: {meta.get('buyer_past_fraud_flags', 0)}
- Return Pattern: {behavioral_metrics.get('buyer_return_pattern', 'normal')}
- Communication: {behavioral_metrics.get('buyer_communication_quality', 'professional')}
- Evidence Provided: {behavioral_metrics.get('buyer_evidence_provided', True)}
- Evidence Quality: {behavioral_metrics.get('buyer_evidence_quality', 'high')}

SELLER PROFILE:
- Name: {case_data.get('seller_name', 'Unknown')}
- Rating: {meta.get('seller_rating', 'Unknown')}
- Dispute Count: {meta.get('seller_dispute_count', 0)}
- Resolution Rate: {behavioral_metrics.get('seller_dispute_resolution_rate', 0.95):.0%}

SHIPPING & LOGISTICS:
- Method: {case_data.get('shipping_method', 'Unknown')}
- Days to Deliver: {meta.get('days_to_deliver', 'Unknown')}
- Signature Required: {case_data.get('delivery_signature_required', False)}
- Return Timing: {behavioral_metrics.get('return_initiated_days_after_delivery', 'Unknown')} days after delivery
- Dispute Timing: {behavioral_metrics.get('dispute_initiated_days_after_return', 'Unknown')} days after return

PHYSICAL EVIDENCE:
- Outbound Weight: {meta.get('outbound_weight_grams', 'Unknown')}g
- Returned Weight: {meta.get('returned_weight_grams', 'Unknown')}g
- Serial Match: {meta.get('serial_number_match', 'Unknown')}
- Accessories Present: {meta.get('accessories_present', 'Unknown')}
- Packaging Intact: {meta.get('packaging_intact', 'Unknown')}
{weight_identity_section}
"""

        prompt = f"""{case_summary}

You are an expert fraud analyst. Analyze this case and provide detailed findings in JSON format.

Focus on these key areas:
1. Buyer Risk Assessment (account age, history, patterns)
2. Fraud Propensity Analysis (behavioral indicators, red flags)
3. Weight & Identity Verification (physical evidence consistency)
4. Shipping & Custody Analysis (logistics anomalies)
5. Policy Trigger Evaluation (rule-based fraud patterns)

Respond with this exact JSON structure:
{{
  "buyer_assessment": {{
    "buyer_risk_score": 0.0-1.0,
    "risk_level": "low|medium|high|critical",
    "key_risk_factors": ["factor1", "factor2"],
    "account_age_risk": 0.0-1.0,
    "return_pattern_analysis": "detailed assessment",
    "communication_assessment": "professional|neutral|hostile"
  }},
  "seller_assessment": {{
    "seller_risk_score": 0.0-1.0,
    "seller_reliability": "high|medium|low",
    "dispute_handling": "excellent|good|poor"
  }},
  "temporal_patterns": {{
    "return_timing_risk": 0.0-1.0,
    "dispute_timing_risk": 0.0-1.0,
    "temporal_risk_score": 0.0-1.0,
    "timing_flags": ["flag1", "flag2"]
  }},
  "weight_consistency": {{
    "score": 0.0-1.0,
    "status": "normal|medium|high|critical",
    "discrepancy_percentage": 0.0-100.0,
    "is_fraud_signal": true|false,
    "detail": "explanation"
  }},
  "item_identity_confidence": {{
    "confidence_score": 0.0-1.0,
    "level": "high|medium|low",
    "serial_match_impact": 0.0-1.0,
    "accessory_match_impact": 0.0-1.0,
    "packaging_impact": 0.0-1.0,
    "is_fraud_signal": true|false,
    "detail": "explanation"
  }},
  "buyer_fraud_propensity": {{
    "propensity_score": 0.0-1.0,
    "level": "low|medium|high|critical",
    "value_risk_component": 0.0-1.0,
    "history_risk_component": 0.0-1.0,
    "pattern_risk_component": 0.0-1.0,
    "key_factors": ["factor1", "factor2"],
    "is_fraud_signal": true|false
  }},
  "custody_anomaly": {{
    "anomaly_score": 0.0-1.0,
    "level": "low|medium|high",
    "delivery_risk": 0.0-1.0,
    "carrier_fault_likelihood": 0.0-1.0,
    "flags": ["flag1", "flag2"],
    "suggests_carrier_fault": true|false
  }},
  "policy_triggers": {{
    "triggered": true|false,
    "trigger_count": 0-10,
    "critical_triggers": 0-10,
    "high_triggers": 0-10,
    "medium_triggers": 0-10,
    "triggers": [
      {{"id": "T1", "name": "trigger name", "severity": "critical|high|medium", "detail": "explanation"}}
    ],
    "enforcement": "APPROVE_REFUND|DENY_REFUND|ESCALATE|MANUAL_REVIEW"
  }},
  "overall_confidence": 0.50-0.98,
  "recommendation": "APPROVE_REFUND|DENY_REFUND|ESCALATE",
  "reasoning": "detailed explanation of analysis and recommendation"
}}

Analysis Guidelines:
- High-value items (>$2000) require stricter scrutiny
- New accounts (<90 days) with expensive claims are high risk
- Weight discrepancies >10% are significant fraud indicators
- Serial returners with disputes should trigger escalation
- Missing accessories + weight mismatch = critical fraud pattern
- Immediate returns (<2 days) require careful evaluation
- Consider carrier fault for shipping damage disputes
"""
        return prompt

    def _parse_response(self, response_text: str, case_data: Dict, behavioral_metrics: Dict) -> Dict:
        """Parse JSON response from model."""
        try:
            # Extract JSON from response
            import re
            match = re.search(r"\{.*\}", response_text, re.DOTALL)
            if match:
                data = json.loads(match.group())
                return data
        except Exception as e:
            print(f"[TextDataAgent] Parse error: {e}")
        
        # Fallback: compute metrics locally
        return self._compute_enhanced_fallback(case_data, behavioral_metrics)

    def _enhance_metrics(self, findings: Dict, case_data: Dict, behavioral_metrics: Dict) -> Dict:
        """Enhance and validate metric calculations."""
        enhanced = findings.copy()
        
        try:
            # Only recalculate if not already set from database
            # Check if weight_consistency came from database (has "from database" in detail)
            weight_from_db = enhanced.get("weight_consistency", {}).get("detail", "").lower().endswith("from database")
            if not weight_from_db and (not enhanced.get("weight_consistency") or enhanced["weight_consistency"].get("detail", "").startswith("Weight data unavailable")):
                enhanced["weight_consistency"] = self._calculate_weight_consistency(case_data)
            
            # Check if item_identity came from database
            identity_from_db = enhanced.get("item_identity_confidence", {}).get("detail", "").lower().endswith("from database")
            if not identity_from_db and (not enhanced.get("item_identity_confidence") or enhanced["item_identity_confidence"].get("detail", "").startswith("Estimated")):
                enhanced["item_identity_confidence"] = self._calculate_item_identity(case_data, behavioral_metrics)
            
            # Enhance fraud propensity with advanced scoring
            enhanced["buyer_fraud_propensity"] = self._calculate_fraud_propensity(case_data, behavioral_metrics, enhanced.get("buyer_assessment", {}))
            
            # Enhance custody anomaly analysis
            enhanced["custody_anomaly"] = self._calculate_custody_anomaly(case_data, behavioral_metrics)
            
            # Enhanced policy trigger engine
            enhanced["policy_triggers"] = self._calculate_policy_triggers(enhanced, case_data)
            
            # Validate all metrics are within expected ranges
            self._validate_metrics(enhanced)
            
        except Exception as e:
            print(f"[TextDataAgent] Metric enhancement error: {e}")
            # Fallback to basic calculations if enhancement fails
            enhanced = self._compute_enhanced_fallback(case_data, behavioral_metrics)
        
        return enhanced

    def _validate_metrics(self, metrics: Dict) -> None:
        """Validate that all metrics are within expected ranges."""
        validations = [
            ("weight_consistency.score", 0.0, 1.0),
            ("item_identity_confidence.confidence_score", 0.0, 1.0),
            ("buyer_fraud_propensity.propensity_score", 0.0, 1.0),
            ("custody_anomaly.anomaly_score", 0.0, 1.0),
        ]
        
        for path, min_val, max_val in validations:
            keys = path.split('.')
            value = metrics
            for key in keys:
                value = value.get(key, 0.5)
                if not isinstance(value, (int, float)):
                    break
            
            if isinstance(value, (int, float)):
                if not (min_val <= value <= max_val):
                    print(f"[TextDataAgent] Warning: {path} = {value} outside range [{min_val}, {max_val}]")

    def _calculate_weight_consistency(self, case_data: Dict) -> Dict:
        """Enhanced weight consistency calculation."""
        meta = case_data.get("metadata", {})
        outbound = meta.get("outbound_weight_grams")
        returned = meta.get("returned_weight_grams")
        price = case_data.get("price", 0)
        dispute_type = case_data.get("dispute_type", "")
        
        if outbound and returned:
            ob = float(outbound)
            rb = float(returned)
            if ob > 0:
                discrepancy_pct = abs(ob - rb) / ob
                
                # Enhanced scoring based on item value and type
                base_score = min(1.0, discrepancy_pct * 2.0)
                
                # Luxury items have stricter weight tolerance
                if price > 5000:
                    base_score *= 1.3
                elif price > 2000:
                    base_score *= 1.1
                
                score = round(min(1.0, base_score), 3)
                
                # Enhanced status determination
                if score > 0.80:
                    status = "critical"
                elif score > 0.50:
                    status = "high"
                elif score > 0.20:
                    status = "medium"
                else:
                    status = "normal"
                
                return {
                    "score": score,
                    "status": status,
                    "discrepancy_percentage": round(discrepancy_pct * 100, 1),
                    "outbound_weight_grams": ob,
                    "returned_weight_grams": rb,
                    "is_fraud_signal": score > 0.30,
                    "detail": f"Weight changed from {ob:.0f}g to {rb:.0f}g ({discrepancy_pct:.1%} difference)"
                }
        
        # Fallback estimation based on dispute type and value
        if dispute_type in ("Return Fraud", "Counterfeit") and price > 2000:
            estimated_score = 0.45
            status = "high"
            detail = "Weight data unavailable - estimated high risk based on dispute type and value"
        else:
            estimated_score = 0.10
            status = "normal"
            detail = "Weight data unavailable - estimated low risk"
        
        return {
            "score": estimated_score,
            "status": status,
            "discrepancy_percentage": 0.0,
            "is_fraud_signal": estimated_score > 0.30,
            "detail": detail
        }

    def _calculate_item_identity(self, case_data: Dict, behavioral_metrics: Dict) -> Dict:
        """Enhanced item identity confidence calculation."""
        meta = case_data.get("metadata", {})
        serial_match = meta.get("serial_number_match")
        accessories = meta.get("accessories_present")
        packaging = meta.get("packaging_intact")
        price = case_data.get("price", 0)
        dispute_type = case_data.get("dispute_type", "")
        
        components = []
        details = []
        
        # Serial number analysis (40% weight)
        if serial_match is True:
            components.append(0.95)
            details.append("Serial number matches")
        elif serial_match is False:
            components.append(0.05)
            details.append("Serial number mismatch")
        
        # Accessories analysis (35% weight)
        if accessories is True:
            components.append(0.90)
            details.append("All accessories present")
        elif accessories is False:
            components.append(0.15)
            details.append("Missing accessories")
        
        # Packaging analysis (25% weight)
        if packaging is True:
            components.append(0.85)
            details.append("Original packaging intact")
        elif packaging is False:
            components.append(0.30)
            details.append("Packaging damaged/missing")
        
        if components:
            # Weighted average based on importance
            weights = [0.40, 0.35, 0.25][:len(components)]
            confidence_score = sum(c * w for c, w in zip(components, weights)) / sum(weights)
        else:
            # Estimation based on dispute type and value
            if dispute_type == "Counterfeit":
                confidence_score = 0.20
                details.append("Estimated low confidence - counterfeit dispute")
            elif dispute_type == "Return Fraud":
                confidence_score = 0.35
                details.append("Estimated medium-low confidence - return fraud dispute")
            elif price > 5000:
                confidence_score = 0.60
                details.append("Estimated medium confidence - high-value item")
            else:
                confidence_score = 0.75
                details.append("Estimated good confidence - standard case")
        
        confidence_score = round(confidence_score, 3)
        
        # Enhanced level determination
        if confidence_score > 0.80:
            level = "high"
        elif confidence_score > 0.50:
            level = "medium"
        else:
            level = "low"
        
        return {
            "confidence_score": confidence_score,
            "level": level,
            "serial_match_impact": 0.95 if serial_match is True else (0.05 if serial_match is False else 0.50),
            "accessory_match_impact": 0.90 if accessories is True else (0.15 if accessories is False else 0.50),
            "packaging_impact": 0.85 if packaging is True else (0.30 if packaging is False else 0.50),
            "is_fraud_signal": confidence_score < 0.40,
            "detail": "; ".join(details) if details else "No verification data available"
        }

    def _calculate_fraud_propensity(self, case_data: Dict, behavioral_metrics: Dict, buyer_assessment: Dict) -> Dict:
        """Enhanced fraud propensity calculation with advanced scoring."""
        price = case_data.get("price", 0)
        return_rate = case_data.get("buyer_return_rate", 0) / 100.0  # Convert percentage
        disputes = case_data.get("buyer_dispute_count", 0)
        account_age = case_data.get("buyer_account_age_days", 365)
        fraud_flags = case_data.get("metadata", {}).get("buyer_past_fraud_flags", 0)
        
        # Behavioral factors
        return_pattern = behavioral_metrics.get("buyer_return_pattern", "normal")
        refund_seeking = behavioral_metrics.get("buyer_refund_seeking_behavior", 0.1)
        communication = behavioral_metrics.get("buyer_communication_quality", "professional")
        
        # Value risk component (0-1)
        if price > 10000:
            value_risk = 0.90
        elif price > 5000:
            value_risk = 0.70
        elif price > 2000:
            value_risk = 0.45
        elif price > 500:
            value_risk = 0.20
        else:
            value_risk = 0.05
        
        # History risk component (0-1)
        fraud_risk = min(1.0, fraud_flags * 0.40)
        dispute_risk = min(1.0, disputes / 8.0)
        return_risk = min(1.0, return_rate * 2.0)
        history_risk = (fraud_risk * 0.50 + dispute_risk * 0.30 + return_risk * 0.20)
        
        # Pattern risk component (0-1)
        pattern_multipliers = {
            "serial_returner": 1.8,
            "frequent": 1.4,
            "occasional": 1.1,
            "normal": 1.0
        }
        pattern_mult = pattern_multipliers.get(return_pattern, 1.0)
        
        communication_risk = {
            "hostile": 0.40,
            "neutral": 0.15,
            "professional": 0.05
        }.get(communication, 0.10)
        
        pattern_risk = min(1.0, (refund_seeking * 0.60 + communication_risk * 0.40) * pattern_mult)
        
        # Account age risk
        if account_age < 30 and price > 2000:
            age_risk = 0.50
        elif account_age < 90 and price > 1000:
            age_risk = 0.30
        else:
            age_risk = 0.05
        
        # Combined propensity score
        propensity_score = round(min(1.0,
            value_risk * 0.25 + 
            history_risk * 0.35 + 
            pattern_risk * 0.25 + 
            age_risk * 0.15
        ), 3)
        
        # Enhanced level determination
        if propensity_score > 0.80:
            level = "critical"
        elif propensity_score > 0.60:
            level = "high"
        elif propensity_score > 0.35:
            level = "medium"
        else:
            level = "low"
        
        # Key factors identification
        factors = []
        if fraud_flags > 0:
            factors.append(f"{fraud_flags} prior fraud flag(s)")
        if price > 5000:
            factors.append(f"High-value claim (${price:,.0f})")
        if return_pattern in ("serial_returner", "frequent"):
            factors.append(f"Return pattern: {return_pattern}")
        if disputes > 2:
            factors.append(f"{disputes} dispute history")
        if account_age < 90 and price > 1000:
            factors.append(f"New account ({account_age} days)")
        if refund_seeking > 0.6:
            factors.append("High refund-seeking behavior")
        if communication == "hostile":
            factors.append("Hostile communication pattern")
        
        if not factors:
            factors.append("Low historical fraud indicators")
        
        return {
            "propensity_score": propensity_score,
            "level": level,
            "value_risk_component": round(value_risk, 3),
            "history_risk_component": round(history_risk, 3),
            "pattern_risk_component": round(pattern_risk, 3),
            "key_factors": factors,
            "is_fraud_signal": propensity_score > 0.50
        }

    def _calculate_custody_anomaly(self, case_data: Dict, behavioral_metrics: Dict) -> Dict:
        """Enhanced custody anomaly calculation."""
        meta = case_data.get("metadata", {})
        days_to_deliver = meta.get("days_to_deliver")
        carrier = case_data.get("shipping_method", "")
        signature_required = case_data.get("delivery_signature_required", False)
        dispute_type = case_data.get("dispute_type", "")
        price = case_data.get("price", 0)
        
        anomaly_score = 0.0
        flags = []
        
        # Delivery time analysis
        if days_to_deliver:
            delivery_days = int(days_to_deliver)
            if delivery_days > 21:
                anomaly_score += 0.40
                flags.append(f"Extremely long delivery ({delivery_days} days)")
            elif delivery_days > 14:
                anomaly_score += 0.25
                flags.append(f"Long delivery time ({delivery_days} days)")
            elif delivery_days > 7:
                anomaly_score += 0.10
                flags.append(f"Delayed delivery ({delivery_days} days)")
        
        # Signature requirement analysis
        if not signature_required and price > 3000:
            anomaly_score += 0.30
            flags.append("No signature required on high-value shipment")
        elif not signature_required and price > 1000:
            anomaly_score += 0.15
            flags.append("No signature required on valuable shipment")
        
        # Dispute type analysis
        if dispute_type == "Shipping Damage":
            anomaly_score += 0.50
            flags.append("Shipping damage indicates carrier handling issues")
        elif dispute_type == "Item Not Received":
            anomaly_score += 0.45
            flags.append("Item not received - possible transit loss")
        
        # Carrier analysis
        if not carrier or carrier.lower() in ("unknown", "other", ""):
            anomaly_score += 0.20
            flags.append("Carrier not identified")
        
        anomaly_score = round(min(1.0, anomaly_score), 3)
        
        # Enhanced level determination
        if anomaly_score > 0.60:
            level = "high"
        elif anomaly_score > 0.30:
            level = "medium"
        else:
            level = "low"
        
        # Carrier fault likelihood
        carrier_fault_likelihood = 0.0
        if dispute_type in ("Shipping Damage", "Item Not Received"):
            carrier_fault_likelihood = min(1.0, anomaly_score * 1.5)
        
        return {
            "anomaly_score": anomaly_score,
            "level": level,
            "delivery_risk": min(1.0, anomaly_score * 0.8) if days_to_deliver else 0.0,
            "carrier_fault_likelihood": round(carrier_fault_likelihood, 3),
            "flags": flags,
            "suggests_carrier_fault": carrier_fault_likelihood > 0.40
        }

    def _calculate_policy_triggers(self, findings: Dict, case_data: Dict) -> Dict:
        """Enhanced policy trigger engine with comprehensive rules."""
        triggers = []
        price = case_data.get("price", 0)
        dispute_type = case_data.get("dispute_type", "")
        
        # Extract metrics
        weight = findings.get("weight_consistency", {})
        identity = findings.get("item_identity_confidence", {})
        fraud_prop = findings.get("buyer_fraud_propensity", {})
        custody = findings.get("custody_anomaly", {})
        buyer = findings.get("buyer_assessment", {})
        
        # T1: Critical Weight + Value Mismatch
        if weight.get("score", 0) > 0.50 and price > 2000:
            triggers.append({
                "id": "T1",
                "name": "Weight + Value Mismatch",
                "severity": "critical",
                "detail": f"Significant weight discrepancy ({weight.get('discrepancy_percentage', 0):.1%}) on ${price:,.0f} item"
            })
        
        # T2: Identity Failure + Fraud Dispute (but not if we have good database data)
        identity_from_db = identity.get("detail", "").lower().endswith("from database")
        identity_score = identity.get("confidence_score", 1)
        
        # Only trigger if identity is low AND not from database with good score
        should_trigger_t2 = (
            identity_score < 0.40 and 
            dispute_type in ("Return Fraud", "Counterfeit") and
            not (identity_from_db and identity_score > 0.70)  # Don't trigger if DB data shows high confidence
        )
        
        if should_trigger_t2:
            triggers.append({
                "id": "T2", 
                "name": "Identity Failure + Fraud Dispute",
                "severity": "critical",
                "detail": f"Low identity confidence ({identity_score:.0%}) in {dispute_type.lower()} case"
            })
        
        # T3: Serial Returner + High Value
        buyer_assessment = findings.get("buyer_assessment", {})
        if buyer_assessment.get("buyer_risk_score", 0) > 0.60 and price > 3000:
            triggers.append({
                "id": "T3",
                "name": "High-Risk Buyer + High Value",
                "severity": "high", 
                "detail": f"High-risk buyer profile ({buyer_assessment.get('buyer_risk_score', 0):.0%}) claiming ${price:,.0f}"
            })
        
        # T4: Critical Fraud Propensity
        if fraud_prop.get("propensity_score", 0) > 0.75:
            triggers.append({
                "id": "T4",
                "name": "Critical Fraud Propensity",
                "severity": "critical",
                "detail": f"Fraud propensity score {fraud_prop.get('propensity_score', 0):.0%} - multiple risk factors"
            })
        
        # T5: Immediate Return + Missing Evidence
        temporal = findings.get("temporal_patterns", {})
        if temporal.get("return_timing_risk", 0) > 0.70:
            triggers.append({
                "id": "T5",
                "name": "Suspicious Return Timing",
                "severity": "high",
                "detail": "Return initiated immediately after delivery"
            })
        
        # T6: Carrier Fault Override
        if custody.get("suggests_carrier_fault", False) and custody.get("carrier_fault_likelihood", 0) > 0.60:
            triggers.append({
                "id": "T6",
                "name": "Likely Carrier Fault",
                "severity": "medium",
                "detail": f"Carrier fault likelihood {custody.get('carrier_fault_likelihood', 0):.0%}"
            })
        
        # T7: New Account + Luxury Claim
        account_age = case_data.get("buyer_account_age_days", 365)
        if account_age < 60 and price > 5000:
            triggers.append({
                "id": "T7",
                "name": "New Account + Luxury Claim", 
                "severity": "high",
                "detail": f"{account_age}-day account claiming ${price:,.0f} luxury item"
            })
        
        # Count triggers by severity
        critical_count = len([t for t in triggers if t["severity"] == "critical"])
        high_count = len([t for t in triggers if t["severity"] == "high"])
        medium_count = len([t for t in triggers if t["severity"] == "medium"])
        
        # Determine enforcement action
        if critical_count >= 2:
            enforcement = "DENY_REFUND"
        elif critical_count >= 1 and high_count >= 1:
            enforcement = "DENY_REFUND"
        elif critical_count >= 1 or high_count >= 2:
            enforcement = "ESCALATE"
        elif high_count >= 1 or medium_count >= 2:
            enforcement = "MANUAL_REVIEW"
        else:
            enforcement = "APPROVE_REFUND"
        
        return {
            "triggered": len(triggers) > 0,
            "trigger_count": len(triggers),
            "critical_triggers": critical_count,
            "high_triggers": high_count,
            "medium_triggers": medium_count,
            "triggers": triggers,
            "enforcement": enforcement
        }

    def _make_recommendation(self, findings: Dict, case_data: Dict) -> tuple:
        """Enhanced recommendation logic with better decision making."""
        # Extract key metrics
        buyer_risk = findings.get("buyer_assessment", {}).get("buyer_risk_score", 0.2)
        fraud_propensity = findings.get("buyer_fraud_propensity", {}).get("propensity_score", 0.2)
        weight_score = findings.get("weight_consistency", {}).get("score", 0.1)
        identity_confidence = findings.get("item_identity_confidence", {}).get("confidence_score", 0.8)
        custody_anomaly = findings.get("custody_anomaly", {}).get("anomaly_score", 0.1)
        policy_triggers = findings.get("policy_triggers", {})
        
        # Policy enforcement takes precedence
        enforcement = policy_triggers.get("enforcement", "APPROVE_REFUND")
        critical_triggers = policy_triggers.get("critical_triggers", 0)
        high_triggers = policy_triggers.get("high_triggers", 0)
        
        # Enhanced decision logic
        if enforcement == "DENY_REFUND":
            recommendation = "DENY_REFUND"
            confidence = 0.90 if critical_triggers >= 2 else 0.85
        elif enforcement == "ESCALATE":
            recommendation = "ESCALATE"
            confidence = 0.75
        elif fraud_propensity > 0.70 and (weight_score > 0.40 or identity_confidence < 0.30):
            recommendation = "DENY_REFUND"
            confidence = 0.80
        elif buyer_risk > 0.60 and fraud_propensity > 0.50:
            recommendation = "ESCALATE"
            confidence = 0.70
        elif identity_confidence < 0.25 and weight_score > 0.30:
            recommendation = "DENY_REFUND"
            confidence = 0.75
        elif custody_anomaly > 0.60 and findings.get("custody_anomaly", {}).get("suggests_carrier_fault", False):
            recommendation = "ESCALATE"  # Carrier fault cases need manual review
            confidence = 0.65
        elif fraud_propensity < 0.20 and buyer_risk < 0.30 and identity_confidence > 0.70:
            recommendation = "APPROVE_REFUND"
            confidence = 0.85
        else:
            recommendation = "ESCALATE"
            confidence = 0.60
        
        # Adjust confidence based on signal strength
        signal_strength = (fraud_propensity + buyer_risk + weight_score + (1 - identity_confidence)) / 4
        if signal_strength > 0.70:
            confidence = min(0.95, confidence + 0.10)
        elif signal_strength < 0.30:
            confidence = max(0.55, confidence - 0.10)
        
        return recommendation, round(confidence, 3)

    def _generate_reasoning(self, findings: Dict, recommendation: str, confidence: float) -> str:
        """Generate detailed reasoning for the recommendation."""
        # Extract key findings
        buyer_assessment = findings.get("buyer_assessment", {})
        fraud_propensity = findings.get("buyer_fraud_propensity", {})
        weight_consistency = findings.get("weight_consistency", {})
        identity_confidence = findings.get("item_identity_confidence", {})
        policy_triggers = findings.get("policy_triggers", {})
        
        reasoning_parts = []
        
        # Policy triggers
        if policy_triggers.get("triggered", False):
            trigger_count = policy_triggers.get("trigger_count", 0)
            critical_count = policy_triggers.get("critical_triggers", 0)
            if critical_count > 0:
                reasoning_parts.append(f"Critical policy violations detected ({critical_count} critical triggers)")
            else:
                reasoning_parts.append(f"Policy triggers activated ({trigger_count} total)")
        
        # Fraud propensity
        fraud_score = fraud_propensity.get("propensity_score", 0)
        fraud_level = fraud_propensity.get("level", "low")
        if fraud_score > 0.60:
            reasoning_parts.append(f"High fraud propensity ({fraud_score:.0%}) - {fraud_level} risk buyer profile")
        elif fraud_score > 0.30:
            reasoning_parts.append(f"Moderate fraud indicators ({fraud_score:.0%})")
        
        # Weight and identity
        weight_score = weight_consistency.get("score", 0)
        identity_score = identity_confidence.get("confidence_score", 1)
        
        if weight_score > 0.40:
            reasoning_parts.append(f"Significant weight discrepancy ({weight_score:.0%})")
        if identity_score < 0.40:
            reasoning_parts.append(f"Low item identity confidence ({identity_score:.0%})")
        
        # Buyer assessment
        buyer_risk = buyer_assessment.get("buyer_risk_score", 0)
        if buyer_risk > 0.50:
            reasoning_parts.append(f"High-risk buyer profile ({buyer_risk:.0%})")
        
        # Generate final reasoning
        if recommendation == "DENY_REFUND":
            if reasoning_parts:
                reasoning = f"Refund denial recommended: {'; '.join(reasoning_parts)}. Multiple fraud indicators exceed approval threshold."
            else:
                reasoning = "Refund denial recommended based on comprehensive risk analysis."
        elif recommendation == "APPROVE_REFUND":
            reasoning = f"Refund approval recommended: Low fraud risk profile with {confidence:.0%} confidence. All verification checks passed."
        else:  # ESCALATE
            if reasoning_parts:
                reasoning = f"Manual review required: {'; '.join(reasoning_parts)}. Mixed signals require human judgment."
            else:
                reasoning = "Manual review recommended due to moderate confidence and mixed risk indicators."
        
        return reasoning

    def _compute_enhanced_fallback(self, case_data: Dict, behavioral_metrics: Dict) -> Dict:
        """Enhanced fallback computation with better metrics."""
        # Use the enhanced calculation methods directly
        weight_consistency = self._calculate_weight_consistency(case_data)
        item_identity = self._calculate_item_identity(case_data, behavioral_metrics)
        fraud_propensity = self._calculate_fraud_propensity(case_data, behavioral_metrics, {})
        custody_anomaly = self._calculate_custody_anomaly(case_data, behavioral_metrics)
        
        # Basic buyer assessment
        price = case_data.get("price", 0)
        account_age = case_data.get("buyer_account_age_days", 365)
        return_rate = case_data.get("buyer_return_rate", 0) / 100.0
        disputes = case_data.get("buyer_dispute_count", 0)
        
        buyer_risk = min(1.0, 
            (0.3 if account_age < 90 else 0.1) +
            min(0.4, return_rate * 2) +
            min(0.3, disputes / 5.0)
        )
        
        buyer_assessment = {
            "buyer_risk_score": round(buyer_risk, 3),
            "risk_level": "high" if buyer_risk > 0.6 else "medium" if buyer_risk > 0.3 else "low",
            "key_risk_factors": []
        }
        
        # Combine all findings
        findings = {
            "buyer_assessment": buyer_assessment,
            "seller_assessment": {"seller_risk_score": 0.1, "seller_reliability": "high"},
            "temporal_patterns": {"temporal_risk_score": 0.2, "timing_flags": []},
            "weight_consistency": weight_consistency,
            "item_identity_confidence": item_identity,
            "buyer_fraud_propensity": fraud_propensity,
            "custody_anomaly": custody_anomaly,
        }
        
        # Calculate policy triggers
        findings["policy_triggers"] = self._calculate_policy_triggers(findings, case_data)
        
        return findings
