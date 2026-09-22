import { afterAll, describe, expect, it } from 'vitest';
import { closePool, getPool } from '../client';

describe('Database connectivity', () => {
  afterAll(async () => {
    await closePool();
  });

  it('connects and responds to a basic query', async () => {
    const pool = getPool();
    const result = await pool.query<{ ok: number }>('SELECT 1 AS ok');

    expect(result.rows[0]?.ok).toBe(1);
  });
});
