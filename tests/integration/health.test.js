// NOTE: This integration test hits the real app but requires valid .env values
// (Supabase, JWT) to be set, since app.js validates env vars via config/env.js
// indirectly through server.js. For this simple health check we test the Express
// app object directly without needing a live Supabase connection.
const request = require('supertest');

describe('GET /api/health', () => {
  test('returns success response', async () => {
    process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key_for_jest_min_32_chars';
    const app = require('../../src/app');

    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
