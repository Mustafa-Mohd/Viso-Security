import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.trim() !== '' && 
  supabaseAnonKey.trim() !== ''
);

if (!isSupabaseConfigured) {
  console.warn('Supabase URL or Anon Key is missing. Check your .env file or deployment environment variables.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

