import { env } from "../env.mjs";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  env.SUPABASE_PROJECT_URL,
  env.SUPABASE_PROJECT_ANON_KEY
);
