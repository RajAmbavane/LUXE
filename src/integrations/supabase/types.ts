export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cases: {
        Row: {
          id: string
          case_id: string
          transaction_id: string
          brand: string
          item_title: string
          price: number
          dispute_type: 'Return Fraud' | 'Counterfeit' | 'Item Not Received' | 'Misrepresentation' | 'Shipping Damage' | 'Authenticity'
          status: 'pending' | 'under_review' | 'approved' | 'denied' | 'escalated'
          risk_score: number
          recommended_action: 'APPROVE_REFUND' | 'DENY_REFUND' | 'ESCALATE' | 'MANUAL_REVIEW' | null
          confidence: number | null
          assigned_to: string | null
          buyer_id: string
          seller_id: string
          buyer_name: string
          seller_name: string
          weight_consistency_score: number | null
          weight_consistency_status: string | null
          weight_consistency_detail: string | null
          item_identity_confidence: number | null
          item_identity_level: string | null
          item_identity_detail: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['cases']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['cases']['Insert']>
      }
      risk_signals: {
        Row: {
          id: string
          case_id: string | null
          signal_type: 'behavioral' | 'logistics' | 'visual' | 'policy'
          signal_name: string
          value: string
          impact_score: number
          severity: 'low' | 'medium' | 'high' | 'critical' | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['risk_signals']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['risk_signals']['Insert']>
      }
      visual_analysis: {
        Row: {
          id: string
          case_id: string | null
          similarity_score: number | null
          counterfeit_score: number | null
          missing_accessories: Json
          color_match: boolean | null
          hardware_match: boolean | null
          stitching_match: boolean | null
          notes: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['visual_analysis']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['visual_analysis']['Insert']>
      }
      evidence: {
        Row: {
          id: string
          case_id: string | null
          type: 'image' | 'shipping' | 'metadata' | 'communication'
          label: string | null
          data: Json
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['evidence']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['evidence']['Insert']>
      }
      decisions: {
        Row: {
          id: string
          case_id: string | null
          recommended_action: string
          final_action: string | null
          approved_by: string | null
          ai_explanation: string | null
          notes: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['decisions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['decisions']['Insert']>
      }
      audit_logs: {
        Row: {
          id: string
          case_id: string | null
          event_type: string
          actor: string | null
          actor_name: string | null
          details: Json
          timestamp: string
        }
        Insert: Omit<Database['public']['Tables']['audit_logs']['Row'], 'id' | 'timestamp'>
        Update: Partial<Database['public']['Tables']['audit_logs']['Insert']>
      }
      users: {
        Row: {
          id: string
          auth_id: string | null
          name: string
          email: string
          role: 'analyst' | 'manager' | 'authenticator'
          avatar_url: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
