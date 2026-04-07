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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      game_state: {
        Row: {
          aihim_balance: number
          created_at: string
          history: Json
          id: string
          phase_timer: number
          prev_layer: number
          prev_level: number
          prev_rank: string
          regen_timer: number
          selected_reality_level: number
          updated_at: string
          user_uid: string
          world_phase: string
        }
        Insert: {
          aihim_balance?: number
          created_at?: string
          history?: Json
          id?: string
          phase_timer?: number
          prev_layer?: number
          prev_level?: number
          prev_rank?: string
          regen_timer?: number
          selected_reality_level?: number
          updated_at?: string
          user_uid: string
          world_phase?: string
        }
        Update: {
          aihim_balance?: number
          created_at?: string
          history?: Json
          id?: string
          phase_timer?: number
          prev_layer?: number
          prev_level?: number
          prev_rank?: string
          regen_timer?: number
          selected_reality_level?: number
          updated_at?: string
          user_uid?: string
          world_phase?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_state_user_uid_fkey"
            columns: ["user_uid"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["uid"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          balance: number
          created_at: string
          display_name: string
          email: string | null
          level: number
          referral_code: string | null
          referral_count: number
          referral_earnings: number
          referred_by: string | null
          referred_code: string | null
          role: string
          telegram_id: string | null
          telegram_profile_url: string | null
          uid: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          balance?: number
          created_at?: string
          display_name?: string
          email?: string | null
          level?: number
          referral_code?: string | null
          referral_count?: number
          referral_earnings?: number
          referred_by?: string | null
          referred_code?: string | null
          role?: string
          telegram_id?: string | null
          telegram_profile_url?: string | null
          uid: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          balance?: number
          created_at?: string
          display_name?: string
          email?: string | null
          level?: number
          referral_code?: string | null
          referral_count?: number
          referral_earnings?: number
          referred_by?: string | null
          referred_code?: string | null
          role?: string
          telegram_id?: string | null
          telegram_profile_url?: string | null
          uid?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          bonus_amount: number
          created_at: string
          id: string
          referred_uid: string
          referrer_uid: string
          source: string
        }
        Insert: {
          bonus_amount?: number
          created_at?: string
          id?: string
          referred_uid: string
          referrer_uid: string
          source?: string
        }
        Update: {
          bonus_amount?: number
          created_at?: string
          id?: string
          referred_uid?: string
          referrer_uid?: string
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_uid_fkey"
            columns: ["referred_uid"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "referrals_referrer_uid_fkey"
            columns: ["referrer_uid"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["uid"]
          },
        ]
      }
      user_elements: {
        Row: {
          complexity: number
          created_at: string
          description: string | null
          discovered_at: number
          element_id: string
          essences: string[]
          icon: string
          id: string
          is_favorite: boolean
          is_mutation: boolean
          last_decay_at: number | null
          last_temp_decay_at: number | null
          name: string
          parents: string[] | null
          rarity: string
          reality_level: number
          stability: number
          state: string
          target_temperature: number
          temperature: number
          type: string
          updated_at: string
          user_uid: string
        }
        Insert: {
          complexity?: number
          created_at?: string
          description?: string | null
          discovered_at?: number
          element_id: string
          essences?: string[]
          icon?: string
          id?: string
          is_favorite?: boolean
          is_mutation?: boolean
          last_decay_at?: number | null
          last_temp_decay_at?: number | null
          name: string
          parents?: string[] | null
          rarity?: string
          reality_level?: number
          stability?: number
          state?: string
          target_temperature?: number
          temperature?: number
          type?: string
          updated_at?: string
          user_uid: string
        }
        Update: {
          complexity?: number
          created_at?: string
          description?: string | null
          discovered_at?: number
          element_id?: string
          essences?: string[]
          icon?: string
          id?: string
          is_favorite?: boolean
          is_mutation?: boolean
          last_decay_at?: number | null
          last_temp_decay_at?: number | null
          name?: string
          parents?: string[] | null
          rarity?: string
          reality_level?: number
          stability?: number
          state?: string
          target_temperature?: number
          temperature?: number
          type?: string
          updated_at?: string
          user_uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_elements_user_uid_fkey"
            columns: ["user_uid"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["uid"]
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
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["uid"]
          },
        ]
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
      app_role: "superadmin" | "admin" | "player"
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
      app_role: ["superadmin", "admin", "player"],
    },
  },
} as const
