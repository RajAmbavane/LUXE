#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Show all decisions for all cases
"""

import os
import sys
from dotenv import load_dotenv
from supabase import create_client

# Fix encoding for Windows
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("=" * 80)
print("ALL CASE DECISIONS")
print("=" * 80)

# Get all cases
cases_response = supabase.table("cases").select("id, case_id").execute()

approve_count = 0
deny_count = 0
escalate_count = 0

for case in cases_response.data:
    case_uuid = case["id"]
    case_id = case["case_id"]
    
    # Get synthesis_agent
    synthesis_response = supabase.table("agent_analysis").select("*").eq("case_id", case_uuid).eq("agent_name", "synthesis_agent").execute()
    if not synthesis_response.data:
        print(f"❌ {case_id}: No synthesis_agent found")
        continue
    
    synthesis = synthesis_response.data[0]
    decision = synthesis.get("agent_recommendation")
    confidence = synthesis.get("confidence_score", 0)
    
    # Get signals for context
    signals_response = supabase.table("risk_signals").select("*").eq("case_id", case_uuid).execute()
    weight_score = 0
    identity_score = 0
    for signal in signals_response.data:
        if signal.get("signal_name") == "Weight Consistency":
            weight_score = signal.get("impact_score", 0)
        elif signal.get("signal_name") == "Item Identity Confidence":
            identity_score = 100 - signal.get("impact_score", 0)
    
    # Count decisions
    if decision == "APPROVE_REFUND":
        approve_count += 1
        emoji = "🟢"
    elif decision == "DENY_REFUND":
        deny_count += 1
        emoji = "🔴"
    else:
        escalate_count += 1
        emoji = "🟡"
    
    print(f"{emoji} {case_id}: {decision:15} ({confidence:.0%}) | Weight={weight_score:.0f}%, Identity={identity_score:.0f}%")

print("\n" + "=" * 80)
print("SUMMARY")
print("=" * 80)
print(f"🟢 APPROVE:  {approve_count} cases")
print(f"🔴 DENY:     {deny_count} cases")
print(f"🟡 ESCALATE: {escalate_count} cases")
print(f"   TOTAL:    {approve_count + deny_count + escalate_count} cases")
