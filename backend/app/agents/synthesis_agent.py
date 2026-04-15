"""
Synthesis Agent v1 — Groq synthesis specialization.
Reads outputs from Vision and Text/Data agents, makes final decision.
Uses reasoning model for complex decision synthesis.
"""

import os, time, json
from typing import Dict, Any, List
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("LLM_API_KEY") or os.getenv("GROQ_API_KEY")
SYNTHESIS_MODEL = os.getenv("SYNTHESIS_MODEL", "mixtral-8x7b-32768")


class SynthesisAgent:
    """Synthesis agent: reads both agent outputs, makes final decision."""
    
    def __init__(self):
        self.name = "synthesis_agent"
        self.version = "1.0.0"
        self.model = SYNTHESIS_MODEL
        self.specialization = "synthesis"
        self.client = Groq(api_key=GROQ_API_KEY)

    def analyze(self, visual: Dict[str, Any], text_data: Dict[str, Any], case_data: Dict[str, Any]) -> Dict[str, Any]:
        """Synthesize visual and text/data agent outputs into final decision."""
        start_time = time.time()
        try:
            # Build synthesis context
            context = self._build_synthesis_context(visual, text_data, case_data)
            
            # Call Groq synthesis model
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "user",
                        "content": context
                    }
                ],
                temperature=0.2,
                max_tokens=1200,
            )
            
            response_text = response.choices[0].message.content
            decision_data = self._parse_decision(response_text, visual, text_data)
            
            return {
                "agent_name": self.name,
                "agent_version": self.version,
                "analysis_type": "synthesis",
                "specialization": self.specialization,
                "findings": decision_data,
                "confidence_score": decision_data.get("decision_confidence", 0.75),
                "agent_recommendation": decision_data.get("final_decision", "ESCALATE"),
                "recommendation_confidence": decision_data.get("decision_confidence", 0.75),
                "reasoning": decision_data.get("structured_reasoning", decision_data.get("final_reasoning", "Synthesis analysis completed.")),
                "execution_time_ms": int((time.time() - start_time) * 1000),
                "status": "completed",
            }
        except Exception as e:
            print(f"[SynthesisAgent] Error: {e}")
            # Generate fallback reasoning even on error
            fallback_data = self._aggregate_fallback(visual, text_data)
            fallback_reasoning = self._generate_structured_reasoning(fallback_data, visual, text_data)
            
            return {
                "agent_name": self.name,
                "agent_version": self.version,
                "analysis_type": "synthesis",
                "specialization": self.specialization,
                "findings": fallback_data,
                "confidence_score": fallback_data.get("decision_confidence", 0.65),
                "agent_recommendation": fallback_data.get("final_decision", "ESCALATE"),
                "recommendation_confidence": fallback_data.get("decision_confidence", 0.65),
                "reasoning": fallback_reasoning,
                "execution_time_ms": int((time.time() - start_time) * 1000),
                "status": "completed_fallback",
                "error_message": str(e),
            }

    def _build_synthesis_context(self, visual: Dict, text_data: Dict, case_data: Dict) -> str:
        """Build context for synthesis decision."""
        v_findings = visual.get("findings", {})
        t_findings = text_data.get("findings", {})
        
        # Extract weight and identity data
        weight_consistency = t_findings.get('weight_consistency', {})
        item_identity = t_findings.get('item_identity_confidence', {})
        
        visual_summary = f"""
VISUAL AGENT OUTPUT:
- Similarity: {v_findings.get('similarity', {}).get('overall_similarity', 0):.0%}
- Condition: {v_findings.get('condition', {}).get('condition_score', 0):.0%}
- Same item: {v_findings.get('similarity', {}).get('is_same_item', True)}
- Auth concerns: {v_findings.get('authenticity', {}).get('authenticity_concerns', False)}
- Defects: {v_findings.get('defects', {}).get('defects_found', 0)}
- Confidence: {visual.get('confidence_score', 0):.0%}
- Recommendation: {visual.get('agent_recommendation', 'ESCALATE')}
"""
        
        text_summary = f"""
TEXT/DATA AGENT OUTPUT:
- Buyer risk: {t_findings.get('buyer_assessment', {}).get('buyer_risk_score', 0):.0%}
- Seller risk: {t_findings.get('seller_assessment', {}).get('seller_risk_score', 0):.0%}
- Temporal risk: {t_findings.get('temporal_patterns', {}).get('temporal_risk_score', 0):.0%}
- Fraud propensity: {t_findings.get('buyer_fraud_propensity', {}).get('propensity_score', 0):.0%}
- Weight consistency: {weight_consistency.get('score', 0):.0%} (is_fraud_signal: {weight_consistency.get('is_fraud_signal', False)})
- Item identity: {item_identity.get('confidence_score', 0):.0%} (level: {item_identity.get('level', 'unknown')})
- Custody anomaly: {t_findings.get('custody_anomaly', {}).get('anomaly_score', 0):.0%}
- Policy triggers: {t_findings.get('policy_triggers', {}).get('trigger_count', 0)}
- Confidence: {text_data.get('confidence_score', 0):.0%}
- Recommendation: {text_data.get('agent_recommendation', 'ESCALATE')}
"""
        
        case_summary = f"""
CASE SUMMARY:
- Item: {case_data.get('item_title', 'Unknown')} (${case_data.get('price', 0):,.0f})
- Dispute: {case_data.get('dispute_type', 'Unknown')}
- Buyer: {case_data.get('buyer_name', 'Unknown')} (account age: {case_data.get('buyer_account_age_days', 0)} days)
- Status: {case_data.get('status', 'pending')}
"""
        
        prompt = f"""You are a senior fraud decision maker synthesizing two specialized agent analyses.

{visual_summary}

{text_summary}

{case_summary}

Respond with ONLY this JSON (no markdown, no explanation):
{{
  "agent_agreement": "high|medium|low",
  "agreement_detail": "brief explanation of agreement level",
  "visual_signal_strength": "weak|moderate|strong|critical",
  "behavioral_signal_strength": "weak|moderate|strong|critical",
  "overall_risk_level": "low|medium|high|critical",
  "key_decision_factors": ["factor1", "factor2", "factor3"],
  "conflicting_signals": ["signal1", "signal2"] or [],
  "decision_confidence": 0.50-0.98,
  "final_decision": "APPROVE_REFUND|DENY_REFUND|ESCALATE",
  "final_reasoning": "2-3 sentence explanation of decision",
  "enforcement_action": "REVIEW|ESCALATE|DENY_REFUND|APPROVE_REFUND",
  "manual_review_recommended": true|false,
  "review_priority": "low|medium|high|critical"
}}

Decision rules:
1. APPROVE_REFUND if: Low weight discrepancy (<25%) AND high item identity (>70%) AND low fraud propensity (<20%)
2. DENY_REFUND if: High weight discrepancy (>50%) OR low item identity (<30%) OR high fraud propensity (>60%) OR policy triggers fired
3. ESCALATE if: Mixed signals (weight vs identity disagree) OR medium confidence OR agent disagreement
4. If both agents agree on same recommendation → HIGH confidence, apply decision
5. Weight consistency is critical: >50% discrepancy is strong fraud signal
6. Item identity >70% is strong legitimacy signal
7. Confidence = (agent_agreement_score * 0.35 + signal_strength * 0.40 + policy_alignment * 0.25)
"""
        return prompt

    def _parse_decision(self, response_text: str, visual: Dict, text_data: Dict) -> Dict:
        """Parse synthesis decision from model."""
        try:
            import re
            match = re.search(r"\{.*\}", response_text, re.DOTALL)
            if match:
                data = json.loads(match.group())
                # Generate improved reasoning format
                data["structured_reasoning"] = self._generate_structured_reasoning(data, visual, text_data)
                return data
        except Exception as e:
            print(f"[SynthesisAgent] Parse error: {e}")
        
        # Fallback: aggregate agent outputs
        fallback_data = self._aggregate_fallback(visual, text_data)
        fallback_data["structured_reasoning"] = self._generate_structured_reasoning(fallback_data, visual, text_data)
        return fallback_data

    def _generate_structured_reasoning(self, decision_data: Dict, visual: Dict, text_data: Dict) -> str:
        """Generate improved, scannable reasoning format."""
        
        # Extract case info from visual or text_data
        v_findings = visual.get("findings", {})
        t_findings = text_data.get("findings", {})
        
        # Get basic info (would normally come from case_data, but we'll extract from findings)
        decision = decision_data.get('final_decision', 'ESCALATE')
        confidence = decision_data.get('decision_confidence', 0.75)
        
        # Decision emoji and formatting
        decision_emoji = {
            'DENY_REFUND': '🔴',
            'APPROVE_REFUND': '🟢', 
            'ESCALATE': '🟡'
        }.get(decision, '🟡')
        
        decision_display = decision.replace('_', ' ')
        
        # Risk assessment
        overall_risk = decision_data.get('overall_risk_level', 'medium')
        agreement = decision_data.get('agent_agreement', 'medium')
        
        # Agent recommendations
        v_rec = visual.get('agent_recommendation', 'ESCALATE')
        t_rec = text_data.get('agent_recommendation', 'ESCALATE')
        v_conf = visual.get('confidence_score', 0.75)
        t_conf = text_data.get('confidence_score', 0.75)
        
        # Key signals
        visual_strength = decision_data.get('visual_signal_strength', 'moderate')
        behavioral_strength = decision_data.get('behavioral_signal_strength', 'moderate')
        conflicts = decision_data.get('conflicting_signals', [])
        
        # Extract specific metrics for better reasoning
        policy_triggers = decision_data.get('key_decision_factors', [])
        manual_review = decision_data.get('manual_review_recommended', False)
        
        # Build structured reasoning with better logic
        reasoning = f"""{decision_emoji} {decision_display}

📊 Quick Assessment
• Decision Confidence: {confidence:.0%}
• Agent Agreement: {agreement.title()}
• Overall Risk: {overall_risk.title()}

🔍 What Our AI Found

Visual Analysis ({v_conf:.0%} confidence)
{self._format_visual_findings(v_findings, v_rec)}

Behavioral Analysis ({t_conf:.0%} confidence)  
{self._format_behavioral_findings(t_findings, t_rec)}

⚖️ Decision Logic
{self._format_decision_logic(decision, agreement, policy_triggers, manual_review, v_rec, t_rec)}

🎯 Final Reasoning
{self._generate_enhanced_rationale(decision_data, decision, agreement, policy_triggers)}"""

        return reasoning

    def _format_visual_findings(self, v_findings: Dict, v_rec: str) -> str:
        """Format visual findings in a clear way."""
        similarity = v_findings.get('similarity', {})
        condition = v_findings.get('condition', {})
        authenticity = v_findings.get('authenticity', {})
        
        sim_score = similarity.get('overall_similarity', 0.8)
        cond_score = condition.get('condition_score', 0.8)
        auth_concerns = authenticity.get('authenticity_concerns', False)
        damage = condition.get('damage_detected', False)
        
        findings = []
        
        # Similarity
        if sim_score >= 0.8:
            findings.append(f"✅ High similarity to original ({sim_score:.0%})")
        elif sim_score >= 0.6:
            findings.append(f"⚠️ Moderate similarity to original ({sim_score:.0%})")
        else:
            findings.append(f"🚨 Low similarity to original ({sim_score:.0%})")
        
        # Condition
        if damage:
            findings.append(f"⚠️ Damage detected (condition: {cond_score:.0%})")
        elif cond_score >= 0.7:
            findings.append(f"✅ Good condition ({cond_score:.0%})")
        else:
            findings.append(f"⚠️ Poor condition ({cond_score:.0%})")
        
        # Authenticity
        if auth_concerns:
            findings.append("🚨 Authenticity concerns detected")
        else:
            findings.append("✅ No major authenticity red flags")
        
        findings.append(f"→ Visual Recommendation: {v_rec.replace('_', ' ')}")
        
        return '\n'.join(findings)

    def _format_behavioral_findings(self, t_findings: Dict, t_rec: str) -> str:
        """Format behavioral findings in a clear way with all 6 advanced metrics."""
        buyer_assessment = t_findings.get('buyer_assessment', {})
        fraud_propensity = t_findings.get('buyer_fraud_propensity', {})
        weight_consistency = t_findings.get('weight_consistency', {})
        item_identity = t_findings.get('item_identity_confidence', {})
        custody_anomaly = t_findings.get('custody_anomaly', {})
        policy_triggers = t_findings.get('policy_triggers', {})
        
        buyer_risk = buyer_assessment.get('buyer_risk_score', 0.2)
        fraud_score = fraud_propensity.get('propensity_score', 0.2)
        weight_score = weight_consistency.get('score', 0.1)
        identity_score = item_identity.get('confidence_score', 0.7)
        custody_score = custody_anomaly.get('anomaly_score', 0.1)
        trigger_count = policy_triggers.get('trigger_count', 0)
        
        findings = []
        
        # Metric 1: Buyer risk
        if buyer_risk >= 0.6:
            findings.append(f"🚨 High buyer risk profile ({buyer_risk:.0%})")
        elif buyer_risk >= 0.3:
            findings.append(f"⚠️ Moderate buyer risk ({buyer_risk:.0%})")
        else:
            findings.append(f"✅ Low buyer risk profile ({buyer_risk:.0%})")
        
        # Metric 2: Fraud propensity
        if fraud_score >= 0.6:
            findings.append(f"🚨 High fraud propensity ({fraud_score:.0%})")
        elif fraud_score >= 0.3:
            findings.append(f"⚠️ Moderate fraud indicators ({fraud_score:.0%})")
        else:
            findings.append(f"✅ Low fraud risk ({fraud_score:.0%})")
        
        # Metric 3: Weight consistency
        if weight_score >= 0.4:
            findings.append(f"🚨 Significant weight discrepancy ({weight_score:.0%})")
        elif weight_score >= 0.2:
            findings.append(f"⚠️ Minor weight inconsistency ({weight_score:.0%})")
        else:
            findings.append("✅ Weight consistent with original")
        
        # Metric 4: Item identity confidence
        if identity_score >= 0.7:
            findings.append(f"✅ High item identity confidence ({identity_score:.0%})")
        elif identity_score >= 0.4:
            findings.append(f"⚠️ Medium item identity confidence ({identity_score:.0%})")
        else:
            findings.append(f"🚨 Low item identity confidence ({identity_score:.0%})")
        
        # Metric 5: Custody anomaly
        if custody_score >= 0.6:
            findings.append(f"🚨 High custody anomaly ({custody_score:.0%})")
        elif custody_score >= 0.3:
            findings.append(f"⚠️ Moderate custody concerns ({custody_score:.0%})")
        else:
            findings.append(f"✅ Normal custody chain")
        
        # Metric 6: Policy triggers
        if trigger_count >= 2:
            findings.append(f"🚨 {trigger_count} policy triggers fired")
        elif trigger_count == 1:
            findings.append("⚠️ 1 policy trigger detected")
        else:
            findings.append("✅ No policy violations")
        
        findings.append(f"→ Behavioral Recommendation: {t_rec.replace('_', ' ')}")
        
        return '\n'.join(findings)

    def _format_decision_logic(self, decision: str, agreement: str, policy_triggers: list, manual_review: bool, v_rec: str, t_rec: str) -> str:
        """Explain the decision logic clearly."""
        logic = []
        
        if agreement == 'high':
            logic.append(f"✅ Both agents agree: {decision.replace('_', ' ')}")
        elif agreement == 'low':
            logic.append(f"⚖️ Agents disagree: Visual says {v_rec.replace('_', ' ')}, Behavioral says {t_rec.replace('_', ' ')}")
            
            if decision == 'DENY_REFUND':
                logic.append("🔴 Policy Override: Critical fraud patterns detected")
                logic.append("📋 Marketplace policy requires denial despite visual approval")
            elif decision == 'ESCALATE':
                logic.append("🟡 Escalation Required: Agent disagreement needs human review")
        
        if 'policy_enforcement' in policy_triggers:
            logic.append("⚡ Policy Enforcement: Automated rules triggered")
        
        if manual_review:
            logic.append("👤 Manual Review Flagged: Complex case requires human oversight")
        
        return '\n'.join(logic) if logic else "Standard decision process applied"

    def _generate_enhanced_rationale(self, data: Dict, decision: str, agreement: str, policy_triggers: list) -> str:
        """Generate enhanced decision rationale."""
        
        if decision == 'DENY_REFUND':
            if agreement == 'low':
                return """Policy enforcement overrides visual assessment. While the item appears visually similar, critical behavioral fraud patterns (weight discrepancy + policy triggers) indicate potential fraud. Marketplace policy requires denial when multiple fraud indicators align, even if visual analysis suggests legitimacy."""
            else:
                return "Multiple fraud indicators exceed approval threshold. Both visual and behavioral analysis confirm fraudulent return pattern."
                
        elif decision == 'APPROVE_REFUND':
            if agreement == 'high':
                return "All verification checks passed. Both visual and behavioral analysis confirm legitimate return with high confidence."
            else:
                return "Visual evidence strongly supports legitimacy, overriding minor behavioral concerns. Customer benefit of doubt applied."
                
        else:  # ESCALATE
            if agreement == 'low':
                return "Agent disagreement requires human judgment. Visual and behavioral analysis provide conflicting signals. Manual review needed to weigh evidence and make final determination."
            else:
                return "Moderate confidence and mixed signals require human oversight for final determination."

    def _format_key_signals(self, data: Dict, visual_strength: str, behavioral_strength: str, conflicts: list) -> str:
        """Format key signals in bullet points."""
        signals = []
        
        # Visual signals
        if visual_strength == 'critical':
            signals.append("• 🚨 Critical visual concerns detected")
        elif visual_strength == 'strong':
            signals.append("• ⚠️ Strong visual inconsistencies")
        elif visual_strength == 'moderate':
            signals.append("• 👁️ Moderate visual analysis completed")
        else:
            signals.append("• ✅ Visual analysis shows no major concerns")
        
        # Behavioral signals  
        if behavioral_strength == 'critical':
            signals.append("• 🚨 Critical fraud patterns detected")
        elif behavioral_strength == 'strong':
            signals.append("• 📈 High fraud risk indicators")
        elif behavioral_strength == 'moderate':
            signals.append("• 📊 Moderate behavioral risk detected")
        else:
            signals.append("• ✅ Low behavioral risk profile")
        
        # Agent conflicts
        if conflicts and len(conflicts) > 0:
            signals.append(f"• ⚖️ Agent disagreement detected")
        
        # Manual review flag
        if data.get('manual_review_recommended'):
            signals.append("• 👤 Manual review recommended")
        
        return '\n'.join(signals) if signals else "• ✅ No critical signals detected"

    def _generate_rationale(self, data: Dict, decision: str) -> str:
        """Generate concise decision rationale."""
        key_factors = data.get('key_decision_factors', [])
        
        if decision == 'DENY_REFUND':
            if 'policy_enforcement' in key_factors:
                return "Critical fraud indicators exceed approval threshold. Policy enforcement triggered."
            else:
                return "Multiple fraud signals detected. Risk profile exceeds refund approval criteria."
        elif decision == 'APPROVE_REFUND':
            return "All verification checks passed. Legitimate return confirmed with high confidence."
        else:  # ESCALATE
            if data.get('agent_agreement') == 'low':
                return "Agent disagreement requires manual review for final determination."
            else:
                return "Mixed signals and moderate confidence require human oversight."

    def _aggregate_fallback(self, visual: Dict, text_data: Dict) -> Dict:
        """Fallback aggregation with smart decision logic based on weight/identity data."""
        v_rec = visual.get("agent_recommendation", "ESCALATE")
        t_rec = text_data.get("agent_recommendation", "ESCALATE")
        v_conf = visual.get("confidence_score", 0.65)
        t_conf = text_data.get("confidence_score", 0.65)
        
        # Extract weight and identity data from text_data findings
        t_findings = text_data.get("findings", {})
        weight_consistency = t_findings.get('weight_consistency', {})
        item_identity = t_findings.get('item_identity_confidence', {})
        fraud_propensity = t_findings.get('buyer_fraud_propensity', {})
        policy_triggers = t_findings.get('policy_triggers', {})
        
        weight_score = weight_consistency.get('score', 0.5)
        identity_score = item_identity.get('confidence_score', 0.5)
        fraud_score = fraud_propensity.get('propensity_score', 0.5)
        trigger_count = policy_triggers.get('trigger_count', 0)
        
        # Smart decision logic based on weight/identity data
        # APPROVE: Low weight (<25%) AND high identity (>70%) AND low fraud (<20%)
        if weight_score < 0.25 and identity_score > 0.70 and fraud_score < 0.20:
            final_decision = "APPROVE_REFUND"
            avg_conf = 0.85
            agreement = "high"
        # DENY: High weight (>50%) OR low identity (<30%) OR high fraud (>60%) OR policy triggers
        elif weight_score > 0.50 or identity_score < 0.30 or fraud_score > 0.60 or trigger_count > 0:
            final_decision = "DENY_REFUND"
            avg_conf = 0.80
            agreement = "high"
        # ESCALATE: Mixed signals
        else:
            final_decision = "ESCALATE"
            avg_conf = round((v_conf + t_conf) / 2, 2)
            agreement = "medium"
        
        return {
            "agent_agreement": agreement,
            "agreement_detail": f"Visual: {v_rec}, Text/Data: {t_rec}, Weight: {weight_score:.0%}, Identity: {identity_score:.0%}",
            "visual_signal_strength": "strong" if v_conf > 0.75 else "moderate" if v_conf > 0.60 else "weak",
            "behavioral_signal_strength": "strong" if t_conf > 0.75 else "moderate" if t_conf > 0.60 else "weak",
            "overall_risk_level": "critical" if weight_score > 0.60 else "high" if weight_score > 0.40 else "medium" if identity_score < 0.50 else "low",
            "key_decision_factors": [f"weight_consistency: {weight_score:.0%}", f"item_identity: {identity_score:.0%}", f"fraud_propensity: {fraud_score:.0%}"],
            "conflicting_signals": [] if agreement == "high" else ["mixed_signals"],
            "decision_confidence": avg_conf,
            "final_decision": final_decision,
            "final_reasoning": f"Decision based on weight consistency ({weight_score:.0%}), item identity ({identity_score:.0%}), and fraud propensity ({fraud_score:.0%}).",
            "enforcement_action": final_decision,
            "manual_review_recommended": agreement == "medium",
            "review_priority": "high" if weight_score > 0.50 else "medium" if agreement == "medium" else "low",
        }
