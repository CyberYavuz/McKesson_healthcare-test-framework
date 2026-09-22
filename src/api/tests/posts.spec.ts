import { expect, test } from '@playwright/test';
import { ApiClient } from '../clients/ApiClient';
import { postSchema } from '../schemas/post.schema';

test.describe('Posts API @smoke', () => {
  let client: ApiClient;

  test.beforeAll(async () => {
    client = await ApiClient.create();
  });

  test.afterAll(async () => {
    await client.dispose();
  });

  test('GET /posts/:id returns a schema-valid post', async () => {
    const response = await client.get('/posts/1');
    expect(response.status()).toBe(200);

    const body = await response.json();
    const result = postSchema.safeParse(body);

    expect(result.success).toBe(true);
    expect(body.id).toBe(1);
  });

  test('GET /posts/:id returns 404 for a non-existent post', async () => {
    const response = await client.get('/posts/999999');

    expect(response.status()).toBe(404);
  });
});
