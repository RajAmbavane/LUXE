from http.server import BaseHTTPRequestHandler
import json
import os
from urllib.parse import parse_qs

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        # Mock response for now - in production, this would connect to Supabase
        cases = [
            {
                "id": "LX-2101",
                "brand": "Rolex",
                "item_title": "Submariner Date",
                "price": 12500,
                "dispute_type": "Return Fraud",
                "status": "under_review",
                "risk_score": 85,
                "recommended_action": "DENY_REFUND"
            }
        ]
        
        self.wfile.write(json.dumps({"cases": cases}).encode())
        return