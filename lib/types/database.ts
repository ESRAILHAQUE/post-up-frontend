export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: "user" | "admin"
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: "user" | "admin"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: "user" | "admin"
          created_at?: string
          updated_at?: string
        }
      }
      sites: {
        Row: {
          id: string
          name: string
          url: string
          domain_authority: number
          domain_rating: number | null
          monthly_traffic: number
          price: number
          category: string
          description: string | null
          turnaround_days: number
          is_active: boolean
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          url: string
          domain_authority: number
          domain_rating?: number | null
          monthly_traffic: number
          price: number
          category: string
          description?: string | null
          turnaround_days?: number
          is_active?: boolean
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          url?: string
          domain_authority?: number
          domain_rating?: number | null
          monthly_traffic?: number
          price?: number
          category?: string
          description?: string | null
          turnaround_days?: number
          is_active?: boolean
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          site_id: string
          status: "pending" | "in_progress" | "completed" | "cancelled"
          customer_name: string
          customer_email: string
          target_url: string
          article_topic: string | null
          special_instructions: string | null
          total_amount: number
          stripe_payment_intent_id: string | null
          stripe_charge_id: string | null
          paid_at: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          site_id: string
          status?: "pending" | "in_progress" | "completed" | "cancelled"
          customer_name: string
          customer_email: string
          target_url: string
          article_topic?: string | null
          special_instructions?: string | null
          total_amount: number
          stripe_payment_intent_id?: string | null
          stripe_charge_id?: string | null
          paid_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          site_id?: string
          status?: "pending" | "in_progress" | "completed" | "cancelled"
          customer_name?: string
          customer_email?: string
          target_url?: string
          article_topic?: string | null
          special_instructions?: string | null
          total_amount?: number
          stripe_payment_intent_id?: string | null
          stripe_charge_id?: string | null
          paid_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          order_id: string
          user_id: string
          amount: number
          currency: string
          stripe_payment_intent_id: string
          stripe_charge_id: string | null
          status: "pending" | "succeeded" | "failed" | "refunded"
          payment_method: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          user_id: string
          amount: number
          currency?: string
          stripe_payment_intent_id: string
          stripe_charge_id?: string | null
          status: "pending" | "succeeded" | "failed" | "refunded"
          payment_method?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          user_id?: string
          amount?: number
          currency?: string
          stripe_payment_intent_id?: string
          stripe_charge_id?: string | null
          status?: "pending" | "succeeded" | "failed" | "refunded"
          payment_method?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          order_id: string
          user_id: string
          invoice_number: string
          amount: number
          issued_at: string
          due_at: string | null
          paid_at: string | null
          status: "unpaid" | "paid" | "cancelled"
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          user_id: string
          invoice_number: string
          amount: number
          issued_at?: string
          due_at?: string | null
          paid_at?: string | null
          status?: "unpaid" | "paid" | "cancelled"
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          user_id?: string
          invoice_number?: string
          amount?: number
          issued_at?: string
          due_at?: string | null
          paid_at?: string | null
          status?: "unpaid" | "paid" | "cancelled"
          created_at?: string
        }
      }
    }
  }
}
