import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  // Named APP_BASE_URL (not BASE_URL) because Vite/Vitest reserves the
  // BASE_URL env var for its own use (import.meta.env.BASE_URL, default "/"),
  // and dotenv.config() does not override an already-set process.env value.
  APP_BASE_URL: z.string().url().default('https://example.com'),
  API_BASE_URL: z.string().url().default('https://jsonplaceholder.typicode.com'),

  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().int().positive().default(5432),
  DB_NAME: z.string().default('healthcare_test'),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('postgres'),
  DB_SSL: z
    .string()
    .default('false')
    .transform((value) => value === 'true'),

  HEADED: z
    .string()
    .default('false')
    .transform((value) => value === 'true'),
  CI: z
    .string()
    .default('false')
    .transform((value) => value === 'true'),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables. Check your .env against .env.example.');
  }

  return parsed.data;
}

export const env = loadEnv();
