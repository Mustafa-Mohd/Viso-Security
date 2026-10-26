import { createSupabaseClient } from "./createSupabaseClient";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && supabaseUrl.trim() !== "" && supabaseAnonKey.trim() !== "",
);

const configHint =
  "Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to frontend/.env, then restart Vite.";

if (!isSupabaseConfigured) {
  console.warn(`Supabase URL or Anon Key is missing. ${configHint}`);
}

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, configHint);
