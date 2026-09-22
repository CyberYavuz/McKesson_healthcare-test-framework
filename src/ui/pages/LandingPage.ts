import type { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Placeholder page object against example.com so the suite has something
 * runnable out of the box. Replace with real page objects once BASE_URL
 * points at the actual application under test.
 */
export class LandingPage extends BasePage {
  readonly heading = this.page.getByRole('heading', { level: 1 });

  constructor(page: Page) {
    super(page);
  }
}
