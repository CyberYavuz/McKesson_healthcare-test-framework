import { Pool, type PoolConfig } from 'pg';
import { env } from '../config/env';

let pool: Pool | undefined;

function buildConfig(): PoolConfig {
  return {
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    ssl: env.DB_SSL ? { rejectUnauthorized: false } : undefined,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  };
}

/** Returns the shared connection pool, creating it lazily on first use. */
export function getPool(): Pool {
  if (!pool) {
    pool = new Pool(buildConfig());
  }
  return pool;
}

/** Closes the shared pool. Call this in test teardown (afterAll) to avoid dangling handles. */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
}
