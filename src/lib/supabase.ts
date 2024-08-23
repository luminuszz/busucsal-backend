import { createClient } from "@supabase/supabase-js";
import { env } from "../utils/env.ts";
import type { Database } from "../@types/database";

export const supabase = createClient<Database>(
  env.SUPABASE_URL,
  env.SUPABASE_PRIVATE_KEY,
);
