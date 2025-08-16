// src/types/supabase.ts
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
          role: string | null;
        };
        Insert: {
          id: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          role?: string | null;
        };
        Update: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          role?: string | null;
        };
      };
      community_posts: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          discipline: string;
          category: string;
          tags: string[] | null;
          likes_count: number | null;
          comments_count: number | null;
          is_pinned: boolean | null;
          created_at: string;
          updated_at: string;
          is_published: boolean | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          discipline: string;
          category?: string;
          tags?: string[] | null;
          likes_count?: number | null;
          comments_count?: number | null;
          is_pinned?: boolean | null;
          created_at?: string;
          updated_at?: string;
          is_published?: boolean | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          discipline?: string;
          category?: string;
          tags?: string[] | null;
          likes_count?: number | null;
          comments_count?: number | null;
          is_pinned?: boolean | null;
          created_at?: string;
          updated_at?: string;
          is_published?: boolean | null;
        };
      };
      academy_content: {
        Row: {
          id: string;
          discipline: string;
          content_type: string;
          title: string;
          description: string | null;
          content: string | null;
          parent_id: string | null;
          order_index: number | null;
          is_active: boolean | null;
          created_at: string | null;
          updated_at: string | null;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          discipline: string;
          content_type: string;
          title: string;
          description?: string | null;
          content?: string | null;
          parent_id?: string | null;
          order_index?: number | null;
          is_active?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          discipline?: string;
          content_type?: string;
          title?: string;
          description?: string | null;
          content?: string | null;
          parent_id?: string | null;
          order_index?: number | null;
          is_active?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
          created_by?: string | null;
        };
      };
      content_notifications: {
        Row: {
          id: string;
          content_id: string | null;
          notification_title: string;
          notification_message: string;
          target_discipline: string | null;
          scheduled_at: string | null;
          sent_at: string | null;
          created_at: string | null;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          content_id?: string | null;
          notification_title: string;
          notification_message: string;
          target_discipline?: string | null;
          scheduled_at?: string | null;
          sent_at?: string | null;
          created_at?: string | null;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          content_id?: string | null;
          notification_title?: string;
          notification_message?: string;
          target_discipline?: string | null;
          scheduled_at?: string | null;
          sent_at?: string | null;
          created_at?: string | null;
          created_by?: string | null;
        };
      };
      videos: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          description: string | null;
          category: string | null;
          type: string | null;
          duration: number | null;
          difficulty: string | null;
          rating: number | null;
          views: number | null;
          thumbnail_url: string | null;
          video_url: string | null;
          storage_path: string | null;
          instructor_name: string | null;
          tags: string[] | null;
          upload_date: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title: string;
          description?: string | null;
          category?: string | null;
          type?: string | null;
          duration?: number | null;
          difficulty?: string | null;
          rating?: number | null;
          views?: number | null;
          thumbnail_url?: string | null;
          video_url?: string | null;
          storage_path?: string | null;
          instructor_name?: string | null;
          tags?: string[] | null;
          upload_date?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title?: string;
          description?: string | null;
          category?: string | null;
          type?: string | null;
          duration?: number | null;
          difficulty?: string | null;
          rating?: number | null;
          views?: number | null;
          thumbnail_url?: string | null;
          video_url?: string | null;
          storage_path?: string | null;
          instructor_name?: string | null;
          tags?: string[] | null;
          upload_date?: string | null;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          message: string;
          type: string | null;
          read: boolean | null;
          link: string | null;
          is_global: boolean | null;
          priority: number | null;
          category: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title?: string;
          message?: string;
          type?: string | null;
          read?: boolean | null;
          link?: string | null;
          is_global?: boolean | null;
          priority?: number | null;
          category?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title?: string;
          message?: string;
          type?: string | null;
          read?: boolean | null;
          link?: string | null;
          is_global?: boolean | null;
          priority?: number | null;
          category?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          service_id: string;
          booking_date: string;
          status: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          service_id: string;
          booking_date: string;
          status?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          service_id?: string;
          booking_date?: string;
          status?: string;
          notes?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

// Type definitions for your components
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type CommunityPost = Database['public']['Tables']['community_posts']['Row'];
export type AcademyContent = Database['public']['Tables']['academy_content']['Row'];
export type ContentNotification = Database['public']['Tables']['content_notifications']['Row'];
export type VideoData = Database['public']['Tables']['videos']['Row'];
export type NotificationData = Database['public']['Tables']['notifications']['Row'];
export type Booking = Database['public']['Tables']['bookings']['Row'];

// Insert types
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type CommunityPostInsert = Database['public']['Tables']['community_posts']['Insert'];
export type AcademyContentInsert = Database['public']['Tables']['academy_content']['Insert'];
export type ContentNotificationInsert = Database['public']['Tables']['content_notifications']['Insert'];
export type VideoInsert = Database['public']['Tables']['videos']['Insert'];
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert'];
export type BookingInsert = Database['public']['Tables']['bookings']['Insert'];

// Update types
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type CommunityPostUpdate = Database['public']['Tables']['community_posts']['Update'];
export type AcademyContentUpdate = Database['public']['Tables']['academy_content']['Update'];
export type ContentNotificationUpdate = Database['public']['Tables']['content_notifications']['Update'];
export type VideoUpdate = Database['public']['Tables']['videos']['Update'];
export type NotificationUpdate = Database['public']['Tables']['notifications']['Update'];
export type BookingUpdate = Database['public']['Tables']['bookings']['Update'];