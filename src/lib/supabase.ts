// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Use Next.js environment variables (process.env.NEXT_PUBLIC_*)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xrysvrwvmrqmavkdvbvn.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyeXN2cnd2bXJxbWF2a2R2YnZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNjAxMjMsImV4cCI6MjA2ODYzNjEyM30.gWyPGxs-WNKPtcHYisPgbO9gyy_BDkGta6SnXG2bUAo';

if (!supabaseUrl) {
    throw new Error('Missing Supabase URL. Please set NEXT_PUBLIC_SUPABASE_URL in your environment variables.');
}

if (!supabaseAnonKey) {
    throw new Error('Missing Supabase Anon Key. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});