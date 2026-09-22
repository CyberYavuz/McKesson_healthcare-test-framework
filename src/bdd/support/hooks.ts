import {
  After,
  AfterAll,
  Before,
  BeforeAll,
  Status,
  type ITestCaseHookParameter,
} from '@cucumber/cucumber';
import { chromium, type Browser } from 'playwright';
import { env } from '../../config/env';
import { closePool } from '../../db/client';
import type { HealthcareWorld } from './world';

let browser: Browser;

// Launching a browser is expensive, so it happens once for the whole run.
// Isolation between scenarios comes from a fresh BrowserContext per scenario,
// not from relaunching the browser.
BeforeAll(async () => {
  browser = await chromium.launch({ headless: !env.HEADED });
});

AfterAll(async () => {
  await browser?.close();
  await closePool();
});

Before(async function (this: HealthcareWorld) {
  this.browser = browser;
  this.context = await browser.newContext({ baseURL: env.APP_BASE_URL });
  this.page = await this.context.newPage();
});

After(async function (this: HealthcareWorld, { result }: ITestCaseHookParameter) {
  if (result?.status === Status.FAILED && this.page) {
    const screenshot = await this.page.screenshot();
    await this.attach(screenshot, 'image/png');
  }
  await this.context?.close();
});
