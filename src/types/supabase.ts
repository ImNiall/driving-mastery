export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      achievements: {
        Row: {
          criteria: Json | null;
          description: string | null;
          id: string;
          key: string;
          name: string;
        };
        Insert: {
          criteria?: Json | null;
          description?: string | null;
          id?: string;
          key: string;
          name: string;
        };
        Update: {
          criteria?: Json | null;
          description?: string | null;
          id?: string;
          key?: string;
          name?: string;
        };
        Relationships: [];
      };
      bookmarks: {
        Row: {
          created_at: string;
          id: string;
          lesson_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          lesson_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          lesson_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bookmarks_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
        ];
      };
      dvsa_categories: {
        Row: {
          display_name: string;
          key: string;
          sort_order: number | null;
        };
        Insert: {
          display_name: string;
          key: string;
          sort_order?: number | null;
        };
        Update: {
          display_name?: string;
          key?: string;
          sort_order?: number | null;
        };
        Relationships: [];
      };
      lessons: {
        Row: {
          category_key: string;
          content: string | null;
          excerpt: string | null;
          id: string;
          slug: string;
          status: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          category_key: string;
          content?: string | null;
          excerpt?: string | null;
          id?: string;
          slug: string;
          status?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          category_key?: string;
          content?: string | null;
          excerpt?: string | null;
          id?: string;
          slug?: string;
          status?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lessons_category_key_fkey";
            columns: ["category_key"];
            isOneToOne: false;
            referencedRelation: "dvsa_categories";
            referencedColumns: ["key"];
          },
        ];
      };
      module_mastery: {
        Row: {
          category: string;
          mastered_at: string;
          points: number;
          user_id: string;
        };
        Insert: {
          category: string;
          mastered_at?: string;
          points?: number;
          user_id: string;
        };
        Update: {
          category?: string;
          mastered_at?: string;
          points?: number;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string | null;
          id: string;
          name: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id?: string;
          name?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: string;
          name?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      progress: {
        Row: {
          category: string;
          correct: number;
          id: string;
          total: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          category: string;
          correct?: number;
          id?: string;
          total?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          category?: string;
          correct?: number;
          id?: string;
          total?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      purchases: {
        Row: {
          created_at: string;
          current_period_end: string | null;
          id: string;
          plan: string | null;
          status: string | null;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          current_period_end?: string | null;
          id?: string;
          plan?: string | null;
          status?: string | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          current_period_end?: string | null;
          id?: string;
          plan?: string | null;
          status?: string | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      quiz_answers: {
        Row: {
          answer: Json;
          attempt_id: string;
          category: string | null;
          created_at: string | null;
          is_correct: boolean | null;
          q_index: number;
          question_id: number | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          answer: Json;
          attempt_id: string;
          category?: string | null;
          created_at?: string | null;
          is_correct?: boolean | null;
          q_index: number;
          question_id?: number | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          answer?: Json;
          attempt_id?: string;
          category?: string | null;
          created_at?: string | null;
          is_correct?: boolean | null;
          q_index?: number;
          question_id?: number | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "quiz_answers_attempt_id_fkey";
            columns: ["attempt_id"];
            isOneToOne: false;
            referencedRelation: "quiz_attempts";
            referencedColumns: ["id"];
          },
        ];
      };
      quiz_attempts: {
        Row: {
          correct: number | null;
          created_at: string | null;
          current_index: number;
          duration_sec: number | null;
          finished_at: string | null;
          id: string;
          module_slug: string | null;
          questions: Json;
          score_percent: number | null;
          source: string | null;
          started_at: string | null;
          state: string;
          total: number | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          correct?: number | null;
          created_at?: string | null;
          current_index?: number;
          duration_sec?: number | null;
          finished_at?: string | null;
          id?: string;
          module_slug?: string | null;
          questions?: Json;
          score_percent?: number | null;
          source?: string | null;
          started_at?: string | null;
          state?: string;
          total?: number | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          correct?: number | null;
          created_at?: string | null;
          current_index?: number;
          duration_sec?: number | null;
          finished_at?: string | null;
          id?: string;
          module_slug?: string | null;
          questions?: Json;
          score_percent?: number | null;
          source?: string | null;
          started_at?: string | null;
          state?: string;
          total?: number | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      quiz_history: {
        Row: {
          created_at: string;
          details: Json | null;
          id: string;
          score: number;
          total: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          details?: Json | null;
          id?: string;
          score: number;
          total: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          details?: Json | null;
          id?: string;
          score?: number;
          total?: number;
          user_id?: string;
        };
        Relationships: [];
      };
      quiz_sessions: {
        Row: {
          answers: Json;
          created_at: string | null;
          current_index: number;
          id: string;
          module_slug: string;
          questions: Json;
          quiz_id: string;
          state: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          answers?: Json;
          created_at?: string | null;
          current_index?: number;
          id?: string;
          module_slug: string;
          questions?: Json;
          quiz_id?: string;
          state?: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          answers?: Json;
          created_at?: string | null;
          current_index?: number;
          id?: string;
          module_slug?: string;
          questions?: Json;
          quiz_id?: string;
          state?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      study_plan_state: {
        Row: {
          plan_key: string;
          steps: Json | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          plan_key: string;
          steps?: Json | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          plan_key?: string;
          steps?: Json | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      usage_limits: {
        Row: {
          feature: string;
          id: string;
          used_on: string;
          user_id: string;
        };
        Insert: {
          feature: string;
          id?: string;
          used_on?: string;
          user_id: string;
        };
        Update: {
          feature?: string;
          id?: string;
          used_on?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_achievements: {
        Row: {
          achievement_key: string;
          id: string;
          unlocked_at: string;
          user_id: string;
        };
        Insert: {
          achievement_key: string;
          id?: string;
          unlocked_at?: string;
          user_id: string;
        };
        Update: {
          achievement_key?: string;
          id?: string;
          unlocked_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_key_fkey";
            columns: ["achievement_key"];
            isOneToOne: false;
            referencedRelation: "achievements";
            referencedColumns: ["key"];
          },
        ];
      };
    };
    Views: {
      v_category_performance: {
        Row: {
          category: string | null;
          correct: number | null;
          total: number | null;
          user_id: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      _drop_policy_if_exists: {
        Args: { pol_name: string; tbl: unknown };
        Returns: undefined;
      };
      increment_progress: {
        Args: {
          p_category: string;
          p_correct: number;
          p_total: number;
          p_user_id: string;
        };
        Returns: undefined;
      };
    };
    Enums: {
      plan_t: "free" | "pro";
      sub_status_t: "trialing" | "active" | "canceled" | "past_due";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      plan_t: ["free", "pro"],
      sub_status_t: ["trialing", "active", "canceled", "past_due"],
    },
  },
} as const;
