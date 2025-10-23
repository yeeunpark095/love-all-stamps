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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      booths: {
        Row: {
          booth_id: number
          created_at: string
          description: string | null
          is_active: boolean | null
          location: string | null
          name: string
          staff_pin: string
          teacher: string | null
        }
        Insert: {
          booth_id?: number
          created_at?: string
          description?: string | null
          is_active?: boolean | null
          location?: string | null
          name: string
          staff_pin: string
          teacher?: string | null
        }
        Update: {
          booth_id?: number
          created_at?: string
          description?: string | null
          is_active?: boolean | null
          location?: string | null
          name?: string
          staff_pin?: string
          teacher?: string | null
        }
        Relationships: []
      }
      exhibitions: {
        Row: {
          club: string
          created_at: string
          description: string | null
          exhibition_id: number
          title: string
          type: string
        }
        Insert: {
          club: string
          created_at?: string
          description?: string | null
          exhibition_id?: number
          title: string
          type: string
        }
        Update: {
          club?: string
          created_at?: string
          description?: string | null
          exhibition_id?: number
          title?: string
          type?: string
        }
        Relationships: []
      }
      lucky_draw_entries: {
        Row: {
          completed_at: string | null
          id: string
          is_winner: boolean | null
          name: string
          student_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          is_winner?: boolean | null
          name: string
          student_id: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          is_winner?: boolean | null
          name?: string
          student_id?: string
          user_id?: string
        }
        Relationships: []
      }
      lucky_draw_tickets: {
        Row: {
          created_at: string
          id: string
          ticket_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ticket_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ticket_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      performances: {
        Row: {
          content: string
          created_at: string
          genre: string
          order_num: number
          performance_id: number
          team: string
          time: string
        }
        Insert: {
          content: string
          created_at?: string
          genre: string
          order_num: number
          performance_id?: number
          team: string
          time: string
        }
        Update: {
          content?: string
          created_at?: string
          genre?: string
          order_num?: number
          performance_id?: number
          team?: string
          time?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          name: string
          student_id: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          student_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          student_id?: string
        }
        Relationships: []
      }
      stamp_logs: {
        Row: {
          booth_id: number
          log_id: string
          method_used: string
          user_id: string
          verified_at: string
        }
        Insert: {
          booth_id: number
          log_id?: string
          method_used: string
          user_id: string
          verified_at?: string
        }
        Update: {
          booth_id?: number
          log_id?: string
          method_used?: string
          user_id?: string
          verified_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stamp_logs_booth_id_fkey"
            columns: ["booth_id"]
            isOneToOne: false
            referencedRelation: "booths"
            referencedColumns: ["booth_id"]
          },
          {
            foreignKeyName: "stamp_logs_booth_id_fkey"
            columns: ["booth_id"]
            isOneToOne: false
            referencedRelation: "booths_public"
            referencedColumns: ["booth_id"]
          },
        ]
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
      booths_public: {
        Row: {
          booth_id: number | null
          created_at: string | null
          description: string | null
          location: string | null
          name: string | null
          teacher: string | null
        }
        Insert: {
          booth_id?: number | null
          created_at?: string | null
          description?: string | null
          location?: string | null
          name?: string | null
          teacher?: string | null
        }
        Update: {
          booth_id?: number | null
          created_at?: string | null
          description?: string | null
          location?: string | null
          name?: string | null
          teacher?: string | null
        }
        Relationships: []
      }
      v_participant_progress: {
        Row: {
          completed: boolean | null
          last_stamp_at: string | null
          name: string | null
          required_total: number | null
          stamps: number | null
          student_id: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      admin_list_progress: {
        Args: {
          p_order?: string
          p_page?: number
          p_page_size?: number
          p_search?: string
        }
        Returns: {
          completed: boolean
          last_stamp_at: string
          name: string
          required_total: number
          stamps: number
          student_id: string
          user_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      ld_confirm_winners: { Args: { p_ids: string[] }; Returns: undefined }
      ld_list_eligible: {
        Args: never
        Returns: {
          completed_at: string
          id: string
          name: string
          student_id: string
          user_id: string
        }[]
      }
      ld_list_winners: {
        Args: never
        Returns: {
          completed_at: string
          id: string
          name: string
          student_id: string
          user_id: string
        }[]
      }
      ld_pick_random: {
        Args: { n: number }
        Returns: {
          completed_at: string
          id: string
          name: string
          student_id: string
          user_id: string
        }[]
      }
      ld_unset_winner: { Args: { p_id: string }; Returns: undefined }
      pick_random_winners: {
        Args: { n: number }
        Returns: {
          completed_at: string
          name: string
          student_id: string
        }[]
      }
      register_lucky_draw: { Args: { p_user_id: string }; Returns: undefined }
      update_lucky_draw_tickets: {
        Args: { p_user_id: string }
        Returns: number
      }
      verify_stamp: {
        Args: { p_booth_id: number; p_entered: string; p_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "admin"
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
      app_role: ["student", "admin"],
    },
  },
} as const
