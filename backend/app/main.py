import os
import json
import base64
import asyncio
import threading
import time as _time
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from .agent_pipeline import AgentPipeline
import numpy as np

load_dotenv()

app = FastAPI(title="LuxeResolve Intelligence", description="AI-powered fraud detection for luxury marketplace disputes")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files (frontend) if they exist
static_dir = Path(__file__).parent / "static"
if static_dir.exists():
    app.mount("/static", StaticFiles(directory=static_dir), name="static")
    
    # Serve frontend at root
    @app.get("/")
    async def serve_frontend():
        return FileResponse(static_dir / "index.html")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ── JSON serialisation helper ─────────────────────────────────────────────

def make_json_serializable(obj):
    if isinstance(obj, dict):
        return {k: make_json_serializable(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [make_json_serializable(i) for i in obj]
    elif isinstance(obj, (bool, np.bool_)):
        return bool(obj)
    elif isinstance(obj, (int, np.integer)):
        return int(obj)
    elif isinstance(obj, (float, np.floating)):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    return obj


# ── Core case processor ───────────────────────────────────────────────────

def _process_one(case_id: str) -> dict:
    """Run the full 3-agent pipeline for a single case and persist results."""

    # Fetch case
    case = supabase.table("cases").select("*").eq("id", case_id).single().execute().data
    if not case:
        raise ValueError(f"Case {case_id} not found")

    # Fetch images
    images = supabase.table("case_images").select("*").eq("case_id", case_id).execute().data or []

    # Fetch / create behavioral metrics
    beh_resp = supabase.table("behavioral_metrics").select("*").eq("case_id", case_id).execute()
    beh = beh_resp.data[0] if beh_resp.data else {}
    if not beh:
        beh = {
            "case_id": case_id,
            "buyer_return_pattern": "normal", "buyer_dispute_pattern": "none",
            "buyer_refund_seeking_behavior": 0.15, "buyer_communication_quality": "professional",
            "buyer_response_time_hours": 24, "buyer_evidence_provided": True,
            "buyer_evidence_quality": "high", "seller_response_time_hours": 12,
            "seller_dispute_resolution_rate": 0.95, "seller_refund_acceptance_rate": 0.92,
            "seller_communication_quality": "professional", "seller_evidence_provided": True,
            "seller_evidence_quality": "high", "return_initiated_days_after_delivery": 5,
            "dispute_initiated_days_after_return": 2, "buyer_risk_level": "low", "seller_risk_level": "low",
        }
        supabase.table("behavioral_metrics").insert(beh).execute()

    # Fetch weight/identity data from risk_signals
    print(f"[Pipeline] Fetching weight/identity data from database...")
    signals_response = supabase.table("risk_signals").select("*").eq("case_id", case_id).execute()
    weight_identity_data = {}
    
    for signal in signals_response.data or []:
        if signal.get("signal_name") == "Weight Consistency":
            weight_identity_data["weight_consistency"] = {
                "score": signal.get("impact_score", 0) / 100.0,
                "status": signal.get("severity", "medium"),
                "value": signal.get("value", "")
            }
            print(f"[Pipeline] Found Weight Consistency: {weight_identity_data['weight_consistency']['score']:.0%}")
        elif signal.get("signal_name") == "Item Identity Confidence":
            weight_identity_data["item_identity"] = {
                "score": 1.0 - (signal.get("impact_score", 0) / 100.0),
                "status": signal.get("severity", "medium"),
                "value": signal.get("value", "")
            }
            print(f"[Pipeline] Found Item Identity: {weight_identity_data['item_identity']['score']:.0%}")

    # Run 3-agent pipeline
    pipeline = AgentPipeline()
    results  = pipeline.execute(case, images, beh)

    if results.get("status") == "failed":
        raise RuntimeError(results.get("error", "Pipeline failed"))

    vr = results["visual_results"]
    tr = results["text_data_results"]
    sr = results["synthesis_results"]

    # Persist agent analysis — delete old records first to avoid duplicates
    sb_del = supabase.table("agent_analysis").delete().eq("case_id", case_id)
    sb_del.execute()

    # Persist all 3 agents
    for agent_name, res, atype in [
        ("visual_agent",     vr, "visual"),
        ("text_data_agent",  tr, "behavioral"),
        ("synthesis_agent",  sr, "synthesis"),
    ]:
        findings = make_json_serializable(res.get("findings", {}))
        
        # Extract weight and identity data if available
        weight_data = findings.get("weight_consistency", {})
        identity_data = findings.get("item_identity_confidence", {})
        
        supabase.table("agent_analysis").insert({
            "case_id":                case_id,
            "agent_name":             agent_name,
            "agent_version":          res.get("agent_version", "1.0.0"),
            "analysis_type":          atype,
            "findings":               findings,
            "confidence_score":       res.get("confidence_score", 0),
            "reasoning":              res.get("reasoning", ""),
            "agent_recommendation":   res.get("agent_recommendation", ""),
            "recommendation_confidence": res.get("confidence_score", 0),
            "execution_time_ms":      res.get("execution_time_ms", 0),
            "status":                 res.get("status", "completed"),
        }).execute()
        
        # Log weight/identity data for behavioral agent
        if agent_name == "text_data_agent":
            print(f"[Pipeline] Text/Data Agent findings:")
            print(f"  Weight Consistency: {weight_data.get('score', 0):.0%} ({weight_data.get('status', 'unknown')})")
            print(f"  Item Identity: {identity_data.get('confidence_score', 0):.0%} ({identity_data.get('level', 'unknown')})")

    # Compute risk score from synthesis agent findings
    rec_action = sr.get("agent_recommendation", "ESCALATE")
    confidence = sr.get("confidence_score", 0)
    findings = sr.get("findings", {})
    risk_level = findings.get("overall_risk_level", "medium")
    
    # Map risk level to score
    risk_map = {"low": 20, "medium": 50, "high": 75, "critical": 95}
    risk_score = risk_map.get(risk_level, 50)

    # Update case
    supabase.table("cases").update({
        "risk_score":         risk_score,
        "confidence":         int(confidence * 100),
        "recommended_action": rec_action,
        "ai_explanation":     sr.get("reasoning", ""),
        "status":             "under_review",
    }).eq("id", case_id).execute()

    return {
        "case_id":            case_id,
        "recommended_action": rec_action,
        "risk_score":         risk_score,
        "confidence":         int(confidence * 100),
    }


# ── Background processor ──────────────────────────────────────────────────

_processing_lock = threading.Lock()
_is_processing   = False


def _background_process_pending():
    """
    Runs in a background thread on startup.
    Processes all pending cases with a delay between each to respect rate limits.
    """
    global _is_processing

    with _processing_lock:
        if _is_processing:
            return
        _is_processing = True

    try:
        # Process pending cases immediately with fresh API key

        pending = supabase.table("cases").select("id,case_id").eq("status", "pending").execute().data or []

        if not pending:
            print("[Processor] No pending cases.")
            return

        print(f"[Processor] Found {len(pending)} pending case(s) — starting background processing...")

        ok = fail = 0
        for i, case in enumerate(pending):
            cid  = case["id"]
            cnum = case["case_id"]
            print(f"[Processor] ({i+1}/{len(pending)}) Processing {cnum}...", end=" ", flush=True)
            try:
                result = _process_one(cid)
                print(f"✓ {result['recommended_action']}  risk={result['risk_score']}")
                ok += 1
                # Process cases efficiently with fresh API key
                pass
            except Exception as e:
                print(f"✗ {str(e)[:80]}")
                fail += 1

        print(f"[Processor] Done — {ok} succeeded, {fail} failed.")

    finally:
        with _processing_lock:
            _is_processing = False


# ── Startup event ─────────────────────────────────────────────────────────

@app.on_event("startup")
async def startup_event():
    """Kick off background processing of pending cases when server starts."""
    thread = threading.Thread(target=_background_process_pending, daemon=True)
    thread.start()
    print("[Startup] Background case processor started.")


# ── Request models ────────────────────────────────────────────────────────

class DecisionRequest(BaseModel):
    final_action: str
    notes: str | None = None


# ── Endpoints ─────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "processing": _is_processing}


@app.post("/process-case/{case_id}")
def process_case(case_id: str):
    """Process a single case on demand."""
    try:
        return _process_one(case_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/trigger-processing")
def trigger_processing():
    """
    Manually trigger background processing of all pending cases.
    Safe to call from frontend — returns immediately, processing runs in background.
    """
    global _is_processing
    if _is_processing:
        return {"status": "already_running", "message": "Processing is already in progress."}

    thread = threading.Thread(target=_background_process_pending, daemon=True)
    thread.start()
    return {"status": "started", "message": "Background processing started."}


@app.get("/processing-status")
def processing_status():
    """Check if background processing is running and how many cases are pending."""
    pending = supabase.table("cases").select("id", count="exact").eq("status", "pending").execute()
    return {
        "is_processing": _is_processing,
        "pending_cases": pending.count or 0,
    }


@app.post("/finalize-decision/{case_id}")
def finalize_decision(case_id: str, request: DecisionRequest):
    """Record human decision and update case status."""
    try:
        final_action = request.final_action
        if not final_action:
            raise HTTPException(status_code=400, detail="final_action is required")

        case = supabase.table("cases").select("*").eq("id", case_id).single().execute().data
        if not case:
            raise HTTPException(status_code=404, detail="Case not found")

        status_map = {
            "APPROVE_REFUND": "approved",
            "DENY_REFUND":    "denied",
            "ESCALATE":       "escalated",
            "MANUAL_REVIEW":  "escalated",
        }
        new_status = status_map.get(final_action, "under_review")

        supabase.table("decisions").insert({
            "case_id":            case_id,
            "recommended_action": case.get("recommended_action"),
            "final_action":       final_action,
            "notes":              request.notes,
        }).execute()

        supabase.table("cases").update({"status": new_status}).eq("id", case_id).execute()

        supabase.table("audit_logs").insert({
            "case_id":    case_id,
            "event_type": "HUMAN_DECISION",
            "actor_name": "Analyst",
            "details":    {"final_action": final_action, "new_status": new_status, "notes": request.notes},
        }).execute()

        return {"case_id": case_id, "final_action": final_action, "new_status": new_status}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ── SPA Routing for Frontend ──────────────────────────────────────────────

@app.get("/{path:path}")
async def catch_all(path: str):
    """Catch-all route for SPA routing - serves frontend for non-API routes"""
    static_dir = Path(__file__).parent / "static"
    
    # If static directory doesn't exist, return API info
    if not static_dir.exists():
        if path == "":
            return {
                "message": "LuxeResolve Intelligence API",
                "version": "1.0.0",
                "status": "running",
                "frontend": "not_deployed",
                "endpoints": ["/health", "/process-case/{case_id}", "/trigger-processing"]
            }
        else:
            raise HTTPException(status_code=404, detail="Frontend not deployed")
    
    # If it's an API route, let it pass through to 404
    if path.startswith("api/"):
        raise HTTPException(status_code=404, detail="API endpoint not found")
    
    # For all other routes, try to serve the file or return index.html for SPA routing
    file_path = static_dir / path
    if file_path.exists() and file_path.is_file():
        return FileResponse(file_path)
    else:
        # Return index.html for SPA routing
        return FileResponse(static_dir / "index.html")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))