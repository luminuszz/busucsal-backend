import { z } from "zod";

export const envSchema = z.object({
  API_PORT: z.coerce.number(),
  SUPABASE_PRIVATE_KEY: z.string(),
  SUPABASE_PUBLIC_KEY: z.string(),
  SUPABASE_URL: z.string(),
});

export type EnvType = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
