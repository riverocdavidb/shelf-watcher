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
      audits: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          created_by: string | null
          department: string
          end_date: string | null
          id: string
          start_date: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string | null
          department: string
          end_date?: string | null
          id?: string
          start_date: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string | null
          department?: string
          end_date?: string | null
          id?: string
          start_date?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      department_shrinkage: {
        Row: {
          avg_rate: number
          id: string
          month: string
          name: string
          shrinkage_rate: number
          year: number
        }
        Insert: {
          avg_rate: number
          id?: string
          month: string
          name: string
          shrinkage_rate: number
          year: number
        }
        Update: {
          avg_rate?: number
          id?: string
          month?: string
          name?: string
          shrinkage_rate?: number
          year?: number
        }
        Relationships: []
      }
      high_risk_items: {
        Row: {
          created_at: string | null
          id: string
          item_id: string
          risk_score: number
          updated_at: string | null
          value_at_risk: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id: string
          risk_score: number
          updated_at?: string | null
          value_at_risk: number
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string
          risk_score?: number
          updated_at?: string | null
          value_at_risk?: number
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          cost_price: number | null
          department: string | null
          expected_stock: number | null
          id: string
          last_updated: string
          name: string
          quantity: number
          retail_price: number | null
          sku: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          cost_price?: number | null
          department?: string | null
          expected_stock?: number | null
          id?: string
          last_updated?: string
          name: string
          quantity?: number
          retail_price?: number | null
          sku?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          cost_price?: number | null
          department?: string | null
          expected_stock?: number | null
          id?: string
          last_updated?: string
          name?: string
          quantity?: number
          retail_price?: number | null
          sku?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      inventory_status: {
        Row: {
          department: string
          discrepancies: number
          id: string
          shrinkage_rate: number
          status: string
          total_items: number
          tracked_items: number
          updated_at: string | null
        }
        Insert: {
          department: string
          discrepancies?: number
          id?: string
          shrinkage_rate?: number
          status: string
          total_items?: number
          tracked_items?: number
          updated_at?: string | null
        }
        Update: {
          department?: string
          discrepancies?: number
          id?: string
          shrinkage_rate?: number
          status?: string
          total_items?: number
          tracked_items?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      investigations: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          created_by: string | null
          department: string | null
          description: string | null
          id: string
          loss_amount: number | null
          priority: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string | null
          department?: string | null
          description?: string | null
          id?: string
          loss_amount?: number | null
          priority?: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string | null
          department?: string | null
          description?: string | null
          id?: string
          loss_amount?: number | null
          priority?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      loss_alerts: {
        Row: {
          amount: number | null
          assigned_to: string | null
          description: string | null
          id: string
          item_id: string | null
          reported_at: string | null
          reported_by: string | null
          severity: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          assigned_to?: string | null
          description?: string | null
          id?: string
          item_id?: string | null
          reported_at?: string | null
          reported_by?: string | null
          severity: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          assigned_to?: string | null
          description?: string | null
          id?: string
          item_id?: string | null
          reported_at?: string | null
          reported_by?: string | null
          severity?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      monthly_shrinkage: {
        Row: {
          id: string
          month: string
          sales: number
          shrinkage: number
          year: number
        }
        Insert: {
          id?: string
          month: string
          sales: number
          shrinkage: number
          year?: number
        }
        Update: {
          id?: string
          month?: string
          sales?: number
          shrinkage?: number
          year?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
          user_id: string | null
          username: string | null
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
          user_id?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id?: string | null
          username?: string | null
        }
        Relationships: []
      }
      recommended_actions: {
        Row: {
          action: string
          high_risk_item_id: string
          id: string
        }
        Insert: {
          action: string
          high_risk_item_id: string
          id?: string
        }
        Update: {
          action?: string
          high_risk_item_id?: string
          id?: string
        }
        Relationships: []
      }
      risk_factors: {
        Row: {
          factor: string
          high_risk_item_id: string
          id: string
        }
        Insert: {
          factor: string
          high_risk_item_id: string
          id?: string
        }
        Update: {
          factor?: string
          high_risk_item_id?: string
          id?: string
        }
        Relationships: []
      }
      shrinkage_reasons: {
        Row: {
          id: string
          month: string | null
          name: string
          value: number
          year: number
        }
        Insert: {
          id?: string
          month?: string | null
          name: string
          value: number
          year?: number
        }
        Update: {
          id?: string
          month?: string | null
          name?: string
          value?: number
          year?: number
        }
        Relationships: []
      }
      stock_movements: {
        Row: {
          created_at: string | null
          employee_id: string | null
          id: string
          item_id: string
          notes: string | null
          quantity: number
          type: string
        }
        Insert: {
          created_at?: string | null
          employee_id?: string | null
          id?: string
          item_id: string
          notes?: string | null
          quantity: number
          type: string
        }
        Update: {
          created_at?: string | null
          employee_id?: string | null
          id?: string
          item_id?: string
          notes?: string | null
          quantity?: number
          type?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          auto_sync: boolean
          created_at: string
          id: string
          store_name: string
          theme: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_sync?: boolean
          created_at?: string
          id?: string
          store_name?: string
          theme?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_sync?: boolean
          created_at?: string
          id?: string
          store_name?: string
          theme?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
