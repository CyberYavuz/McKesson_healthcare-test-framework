import { expect, test } from '@playwright/test';
import { LandingPage } from '../pages/LandingPage';

test.describe('Landing page @smoke', () => {
  test('displays the expected title and heading', async ({ page }) => {
    const landingPage = new LandingPage(page);
    await landingPage.goto('/');

    await expect(page).toHaveTitle(/Example/);
    await expect(landingPage.heading).toBeVisible();
  });
});
