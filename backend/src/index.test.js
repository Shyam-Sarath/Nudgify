const request = require('supertest');
const app = require('./index');

describe('Nudgify API', () => {
  it('responds to the root endpoint', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      message: 'Welcome to the Nudgify API',
      version: '1.0.0',
    });
  });

  it('responds to the health endpoint', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Server is running');
    expect(response.body.timestamp).toBeDefined();
  });

  it('returns 404 for unknown routes', async () => {
    const response = await request(app).get('/missing-route');

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      success: false,
      message: 'Route not found',
      path: '/missing-route',
    });
  });
});
