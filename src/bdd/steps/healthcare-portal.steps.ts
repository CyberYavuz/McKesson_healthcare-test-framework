import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { getPool } from '../../db/client';
import type { HealthcareWorld } from '../support/world';

Given('I open the healthcare portal', async function (this: HealthcareWorld) {
  await this.page.goto('/', { waitUntil: 'domcontentloaded' });
});

Then(
  'the page title contains {string}',
  async function (this: HealthcareWorld, expectedTitle: string) {
    await expect(this.page).toHaveTitle(new RegExp(expectedTitle));
  }
);

Then('the database is reachable', async function () {
  const pool = getPool();
  const result = await pool.query<{ ok: number }>('SELECT 1 AS ok');

  expect(result.rows[0]?.ok).toBe(1);
});
