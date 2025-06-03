import request from 'supertest';
import app from '../index';

describe('Health Check API', () => {
  it('should return health status', async () => {
    const res = await request(app)
      .get('/api/health')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toHaveProperty('status', 'healthy');
  });
});
