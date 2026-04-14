from typing import Any, Dict, List


def _to_float(value: Any, default: float = 0.0) -> float:
    try:
        if value is None:
            return default
        return float(value)
    except Exception:
        return default


def _severity_from_impact(impact: float) -> str:
    if impact >= 30:
        return "critical"
    if impact >= 20:
        return "high"
    if impact >= 10:
        return "medium"
    return "low"


def build_structured_signals(case_row: Dict[str, Any], evidence_rows: List[Dict[str, Any]], visual_row: Dict[str, Any] | None) -> List[Dict[str, Any]]:
    signals: List[Dict[str, Any]] = []

    # Logistics signal: shipping weight mismatch
    shipped_weight = 920.0
    returned_weight = 680.0
    for item in evidence_rows:
        payload = item.get("data") or {}
        if item.get("type") == "shipping":
            shipped_weight = _to_float(payload.get("shipped_weight_g"), shipped_weight)
            returned_weight = _to_float(payload.get("returned_weight_g"), returned_weight)
    weight_delta_pct = abs(returned_weight - shipped_weight) / max(shipped_weight, 1.0)
    logistics_impact = min(40.0, round(weight_delta_pct * 120.0, 2))
    signals.append(
        {
            "signal_type": "logistics",
            "signal_name": "Weight mismatch",
            "value": f"{weight_delta_pct * 100:.1f}% delta",
            "impact_score": logistics_impact,
            "severity": _severity_from_impact(logistics_impact),
        }
    )

    # Visual signals
    similarity = _to_float((visual_row or {}).get("similarity_score"), 62.0)
    counterfeit = _to_float((visual_row or {}).get("counterfeit_score"), 55.0)
    missing = (visual_row or {}).get("missing_accessories") or []
    missing_count = len(missing) if isinstance(missing, list) else 0
    visual_impact = min(45.0, round((100.0 - similarity) * 0.35 + counterfeit * 0.35 + missing_count * 7.5, 2))
    signals.append(
        {
            "signal_type": "visual",
            "signal_name": "Visual anomaly score",
            "value": f"similarity {similarity:.0f}%, counterfeit {counterfeit:.0f}%",
            "impact_score": visual_impact,
            "severity": _severity_from_impact(visual_impact),
        }
    )

    # Behavioral signal (mocked but deterministic)
    buyer_disputes = 4
    behavioral_impact = 22.0 if buyer_disputes > 3 else 10.0
    signals.append(
        {
            "signal_type": "behavioral",
            "signal_name": "Buyer dispute frequency",
            "value": f"{buyer_disputes} prior disputes",
            "impact_score": behavioral_impact,
            "severity": _severity_from_impact(behavioral_impact),
        }
    )

    # Policy signal
    policy_impact = 20.0 if weight_delta_pct > 0.25 and missing_count > 0 else 8.0
    signals.append(
        {
            "signal_type": "policy",
            "signal_name": "Return fraud policy trigger",
            "value": "RETURN_FRAUD_LIKELY" if policy_impact > 10 else "MANUAL_REVIEW",
            "impact_score": policy_impact,
            "severity": _severity_from_impact(policy_impact),
        }
    )

    return signals


def aggregate_risk(signals: List[Dict[str, Any]]) -> Dict[str, Any]:
    behavioral = sum(abs(_to_float(s.get("impact_score"))) for s in signals if s.get("signal_type") == "behavioral")
    logistics = sum(abs(_to_float(s.get("impact_score"))) for s in signals if s.get("signal_type") == "logistics")
    visual = sum(abs(_to_float(s.get("impact_score"))) for s in signals if s.get("signal_type") == "visual")
    policy = sum(abs(_to_float(s.get("impact_score"))) for s in signals if s.get("signal_type") == "policy")
    total = min(100, round(behavioral * 0.30 + logistics * 0.25 + visual * 0.25 + policy * 0.20))

    if total >= 80:
        recommendation = "DENY_REFUND"
    elif total >= 65:
        recommendation = "ESCALATE"
    elif total >= 40:
        recommendation = "MANUAL_REVIEW"
    else:
        recommendation = "APPROVE_REFUND"

    confidence = min(98, max(60, int(total * 0.9 + 20)))
    return {
        "risk_score": total,
        "confidence": confidence,
        "recommended_action": recommendation,
        "breakdown": {
            "behavioral": round(behavioral, 2),
            "logistics": round(logistics, 2),
            "visual": round(visual, 2),
            "policy": round(policy, 2),
        },
    }
