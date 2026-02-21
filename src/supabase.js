import { createClient } from '@supabase/supabase-js';

// ⚠️ REPLACE with your Supabase project credentials
// Go to Supabase Dashboard → Project Settings → API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

// Check if Supabase is configured with real credentials
export const isSupabaseConfigured = !supabaseUrl.includes('YOUR_');

let supabase = null;

if (isSupabaseConfigured) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
export default supabase;
