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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      allowed_admin_emails: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      event_gallery: {
        Row: {
          caption: string | null
          created_at: string
          event_id: string
          gallery_type: string
          id: string
          image_url: string
          sort_order: number
        }
        Insert: {
          caption?: string | null
          created_at?: string
          event_id: string
          gallery_type?: string
          id?: string
          image_url: string
          sort_order?: number
        }
        Update: {
          caption?: string | null
          created_at?: string
          event_id?: string
          gallery_type?: string
          id?: string
          image_url?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "event_gallery_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_schedule: {
        Row: {
          created_at: string
          date: string
          event_id: string
          format: string
          id: string
          phase: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          date: string
          event_id: string
          format: string
          id?: string
          phase: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          date?: string
          event_id?: string
          format?: string
          id?: string
          phase?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "event_schedule_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_videos: {
        Row: {
          created_at: string
          description: string | null
          event_id: string
          id: string
          sort_order: number
          title: string
          video_type: string
          youtube_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_id: string
          id?: string
          sort_order?: number
          title: string
          video_type?: string
          youtube_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_id?: string
          id?: string
          sort_order?: number
          title?: string
          video_type?: string
          youtube_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_videos_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_winners: {
        Row: {
          created_at: string
          event_id: string
          id: string
          prize: string | null
          rank: number
          team_name: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          prize?: string | null
          rank: number
          team_name: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          prize?: string | null
          rank?: number
          team_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_winners_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          coming_soon_video_id: string | null
          created_at: string
          description: string | null
          end_date: string
          entry_amount: number
          game: string
          id: string
          image_url: string | null
          is_registration_open: boolean
          name: string
          prize_pool: string
          registration_end: string
          registration_override: string | null
          registration_start: string
          rules: string[] | null
          slug: string
          start_date: string
          status: Database["public"]["Enums"]["event_status"]
          tags: string[] | null
          team_slots: number
          updated_at: string
          youtube_stream_id: string | null
        }
        Insert: {
          coming_soon_video_id?: string | null
          created_at?: string
          description?: string | null
          end_date: string
          entry_amount?: number
          game: string
          id?: string
          image_url?: string | null
          is_registration_open?: boolean
          name: string
          prize_pool?: string
          registration_end: string
          registration_override?: string | null
          registration_start: string
          rules?: string[] | null
          slug: string
          start_date: string
          status?: Database["public"]["Enums"]["event_status"]
          tags?: string[] | null
          team_slots?: number
          updated_at?: string
          youtube_stream_id?: string | null
        }
        Update: {
          coming_soon_video_id?: string | null
          created_at?: string
          description?: string | null
          end_date?: string
          entry_amount?: number
          game?: string
          id?: string
          image_url?: string | null
          is_registration_open?: boolean
          name?: string
          prize_pool?: string
          registration_end?: string
          registration_override?: string | null
          registration_start?: string
          rules?: string[] | null
          slug?: string
          start_date?: string
          status?: Database["public"]["Enums"]["event_status"]
          tags?: string[] | null
          team_slots?: number
          updated_at?: string
          youtube_stream_id?: string | null
        }
        Relationships: []
      }
      legal_documents: {
        Row: {
          content: string
          created_at: string
          id: string
          is_published: boolean
          slug: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_published?: boolean
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_published?: boolean
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      prize_distribution: {
        Row: {
          created_at: string
          event_id: string
          id: string
          place: string
          prize: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          place: string
          prize: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          place?: string
          prize?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "prize_distribution_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      registration_rate_limits: {
        Row: {
          attempt_count: number | null
          email: string | null
          first_attempt_at: string | null
          id: string
          ip_address: string
          last_attempt_at: string | null
        }
        Insert: {
          attempt_count?: number | null
          email?: string | null
          first_attempt_at?: string | null
          id?: string
          ip_address: string
          last_attempt_at?: string | null
        }
        Update: {
          attempt_count?: number | null
          email?: string | null
          first_attempt_at?: string | null
          id?: string
          ip_address?: string
          last_attempt_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      team_registrations: {
        Row: {
          captain_college_branch: string | null
          captain_college_name: string | null
          captain_college_year: string | null
          captain_education_type: string | null
          captain_email: string
          captain_ingame_name: string | null
          captain_name: string
          captain_phone: string | null
          captain_school_class: string | null
          captain_school_name: string | null
          created_at: string
          event_id: string
          id: string
          notes: string | null
          paid_at: string | null
          payment_amount: number | null
          payment_id: string | null
          payment_signature: string | null
          payment_status: string | null
          player_discord_ids: string[] | null
          player_education_details: Json | null
          player_emails: string[] | null
          player_ingame_names: string[] | null
          player_names: string[]
          razorpay_order_id: string | null
          status: Database["public"]["Enums"]["registration_status"]
          team_name: string
          updated_at: string
        }
        Insert: {
          captain_college_branch?: string | null
          captain_college_name?: string | null
          captain_college_year?: string | null
          captain_education_type?: string | null
          captain_email: string
          captain_ingame_name?: string | null
          captain_name: string
          captain_phone?: string | null
          captain_school_class?: string | null
          captain_school_name?: string | null
          created_at?: string
          event_id: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          payment_amount?: number | null
          payment_id?: string | null
          payment_signature?: string | null
          payment_status?: string | null
          player_discord_ids?: string[] | null
          player_education_details?: Json | null
          player_emails?: string[] | null
          player_ingame_names?: string[] | null
          player_names: string[]
          razorpay_order_id?: string | null
          status?: Database["public"]["Enums"]["registration_status"]
          team_name: string
          updated_at?: string
        }
        Update: {
          captain_college_branch?: string | null
          captain_college_name?: string | null
          captain_college_year?: string | null
          captain_education_type?: string | null
          captain_email?: string
          captain_ingame_name?: string | null
          captain_name?: string
          captain_phone?: string | null
          captain_school_class?: string | null
          captain_school_name?: string | null
          created_at?: string
          event_id?: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          payment_amount?: number | null
          payment_id?: string | null
          payment_signature?: string | null
          payment_status?: string | null
          player_discord_ids?: string[] | null
          player_education_details?: Json | null
          player_emails?: string[] | null
          player_ingame_names?: string[] | null
          player_names?: string[]
          razorpay_order_id?: string | null
          status?: Database["public"]["Enums"]["registration_status"]
          team_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      cleanup_old_rate_limits: { Args: never; Returns: undefined }
      get_approved_team_count: { Args: { event_uuid: string }; Returns: number }
      get_approved_teams: {
        Args: { p_event_id: string }
        Returns: {
          created_at: string
          event_id: string
          id: string
          team_name: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_registration_open: { Args: { event_uuid: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
      event_status: "upcoming" | "live" | "past" | "closed"
      registration_status: "pending" | "approved" | "rejected"
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
      app_role: ["admin", "user"],
      event_status: ["upcoming", "live", "past", "closed"],
      registration_status: ["pending", "approved", "rejected"],
    },
  },
} as const
