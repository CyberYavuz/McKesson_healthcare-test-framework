import {
  request as playwrightRequest,
  type APIRequestContext,
  type APIResponse,
} from '@playwright/test';
import { env } from '../../config/env';

/**
 * Thin wrapper around Playwright's request context so auth headers, retries
 * and the base URL live in one place instead of being repeated per test.
 */
export class ApiClient {
  private constructor(private readonly context: APIRequestContext) {}

  static async create(baseURL: string = env.API_BASE_URL): Promise<ApiClient> {
    const context = await playwrightRequest.newContext({
      baseURL,
      extraHTTPHeaders: { Accept: 'application/json' },
      timeout: 15_000,
    });
    return new ApiClient(context);
  }

  get(path: string): Promise<APIResponse> {
    return this.context.get(path);
  }

  post(path: string, data: unknown): Promise<APIResponse> {
    return this.context.post(path, { data });
  }

  async dispose(): Promise<void> {
    await this.context.dispose();
  }
}
