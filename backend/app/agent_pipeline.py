"""
Agent Pipeline v2 - 3-Agent Specialization with Groq
Orchestrates specialized agents: Vision → Text/Data → Synthesis
"""

import time
from typing import Dict, Any
from .agents.visual_agent import VisualAgent
from .agents.text_data_agent import TextDataAgent
from .agents.synthesis_agent import SynthesisAgent


class AgentPipeline:
    """Executes 3 specialized agents sequentially with Groq"""
    
    def __init__(self):
        self.visual_agent = VisualAgent()
        self.text_data_agent = TextDataAgent()
        self.synthesis_agent = SynthesisAgent()
    
    def execute(self, case_data: Dict[str, Any], images: list, behavioral_metrics: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute 3-agent specialization pipeline:
        1. Visual Agent (vision-only): image comparison, condition, authenticity
        2. Text/Data Agent (text-only): behavioral, shipping, account history
        3. Synthesis Agent (synthesis): reads both outputs, makes final decision
        
        Returns:
        - visual_results: Visual agent findings
        - text_data_results: Text/Data agent findings
        - synthesis_results: Final synthesis decision
        - total_execution_time: Total time in ms
        """
        
        pipeline_start = time.time()
        
        try:
            print(f"[Pipeline] Starting 3-agent analysis for case {case_data.get('case_id')}")
            
            # ── Agent 1: Vision-Only ──────────────────────────────────────
            print("[Pipeline] Agent 1: Running Vision Agent (image analysis)...")
            visual_start = time.time()
            visual_results = self.visual_agent.analyze(case_data, images)
            visual_time = int((time.time() - visual_start) * 1000)
            print(f"[Pipeline] Vision Agent completed in {visual_time}ms")
            print(f"  → Recommendation: {visual_results.get('agent_recommendation')}")
            print(f"  → Confidence: {visual_results.get('confidence_score'):.0%}")
            
            # ── Agent 2: Text/Data-Only ───────────────────────────────────
            print("[Pipeline] Agent 2: Running Text/Data Agent (behavioral analysis)...")
            text_data_start = time.time()
            text_data_results = self.text_data_agent.analyze(case_data, behavioral_metrics)
            text_data_time = int((time.time() - text_data_start) * 1000)
            print(f"[Pipeline] Text/Data Agent completed in {text_data_time}ms")
            print(f"  → Recommendation: {text_data_results.get('agent_recommendation')}")
            print(f"  → Confidence: {text_data_results.get('confidence_score'):.0%}")
            
            # ── Agent 3: Synthesis ────────────────────────────────────────
            print("[Pipeline] Agent 3: Running Synthesis Agent (decision synthesis)...")
            synthesis_start = time.time()
            synthesis_results = self.synthesis_agent.analyze(visual_results, text_data_results, case_data)
            synthesis_time = int((time.time() - synthesis_start) * 1000)
            print(f"[Pipeline] Synthesis Agent completed in {synthesis_time}ms")
            print(f"  → Final Decision: {synthesis_results.get('agent_recommendation')}")
            print(f"  → Confidence: {synthesis_results.get('confidence_score'):.0%}")
            
            total_time = int((time.time() - pipeline_start) * 1000)
            
            print(f"[Pipeline] 3-Agent analysis complete in {total_time}ms")
            print(f"[Pipeline] Final Recommendation: {synthesis_results.get('agent_recommendation')}")
            print(f"[Pipeline] Final Confidence: {synthesis_results.get('confidence_score'):.0%}")
            
            return {
                "status": "success",
                "visual_results": visual_results,
                "text_data_results": text_data_results,
                "synthesis_results": synthesis_results,
                "execution_times": {
                    "visual_agent": visual_time,
                    "text_data_agent": text_data_time,
                    "synthesis_agent": synthesis_time,
                    "total": total_time
                },
                "pipeline_version": "3-agent-specialization-v2"
            }
            
        except Exception as e:
            print(f"[Pipeline] Error: {str(e)}")
            import traceback
            traceback.print_exc()
            return {
                "status": "failed",
                "error": str(e),
                "synthesis_results": {
                    "agent_recommendation": "MANUAL_REVIEW",
                    "confidence_score": 0.0,
                    "reasoning": f"Pipeline error: {str(e)}"
                }
            }
