export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      barbers: {
        Row: {
          created_at: string
          id: string
          name: string
          phone: string | null
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          phone?: string | null
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          phone?: string | null
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      body_metrics: {
        Row: {
          created_at: string
          id: string
          member_id: string
          recorded_at: string
          weight_kg: number
        }
        Insert: {
          created_at?: string
          id?: string
          member_id: string
          recorded_at?: string
          weight_kg: number
        }
        Update: {
          created_at?: string
          id?: string
          member_id?: string
          recorded_at?: string
          weight_kg?: number
        }
        Relationships: [
          {
            foreignKeyName: "body_metrics_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          clearance_level: string
          created_at: string
          department: string
          employee_id: string
          id: string
          name: string
          organization: string
          position: string
          updated_at: string
        }
        Insert: {
          clearance_level: string
          created_at?: string
          department: string
          employee_id: string
          id?: string
          name: string
          organization: string
          position: string
          updated_at?: string
        }
        Update: {
          clearance_level?: string
          created_at?: string
          department?: string
          employee_id?: string
          id?: string
          name?: string
          organization?: string
          position?: string
          updated_at?: string
        }
        Relationships: []
      }
      gym_settings: {
        Row: {
          gym_name: string
          id: string
          monthly_fee: number
          updated_at: string
        }
        Insert: {
          gym_name?: string
          id?: string
          monthly_fee?: number
          updated_at?: string
        }
        Update: {
          gym_name?: string
          id?: string
          monthly_fee?: number
          updated_at?: string
        }
        Relationships: []
      }
      members: {
        Row: {
          active: boolean
          created_at: string
          emergency_contact: string | null
          full_name: string
          gender: string
          height_cm: number | null
          id: string
          notes: string | null
          phone: string | null
          starting_date: string
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          emergency_contact?: string | null
          full_name: string
          gender?: string
          height_cm?: number | null
          id?: string
          notes?: string | null
          phone?: string | null
          starting_date?: string
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          active?: boolean
          created_at?: string
          emergency_contact?: string | null
          full_name?: string
          gender?: string
          height_cm?: number | null
          id?: string
          notes?: string | null
          phone?: string | null
          starting_date?: string
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          expires_at: string
          id: string
          member_id: string
          paid_date: string
        }
        Insert: {
          amount: number
          created_at?: string
          expires_at?: string
          id?: string
          member_id: string
          paid_date?: string
        }
        Update: {
          amount?: number
          created_at?: string
          expires_at?: string
          id?: string
          member_id?: string
          paid_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      service_records: {
        Row: {
          barber_id: string
          confirmed: boolean
          created_at: string
          id: string
          service_date: string
          service_type_id: string
        }
        Insert: {
          barber_id: string
          confirmed?: boolean
          created_at?: string
          id?: string
          service_date?: string
          service_type_id: string
        }
        Update: {
          barber_id?: string
          confirmed?: boolean
          created_at?: string
          id?: string
          service_date?: string
          service_type_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_records_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barbers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_records_service_type_id_fkey"
            columns: ["service_type_id"]
            isOneToOne: false
            referencedRelation: "service_types"
            referencedColumns: ["id"]
          },
        ]
      }
      service_types: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          price: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
          price: number
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "barber"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "barber"],
    },
  },
} as const
