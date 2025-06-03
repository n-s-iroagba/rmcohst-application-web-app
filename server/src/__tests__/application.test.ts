import request from 'supertest';
import app from '../index';
import { createTestUser, cleanupTestUser } from '../test/helpers';

describe('Application API', () => {
  let authToken: string;

  beforeAll(async () => {
    const user = await createTestUser();
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: 'testPassword123' });
    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await cleanupTestUser();
  });

  it('should create new application', async () => {
    const response = await request(app)
      .post('/api/applications')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        firstName: 'John',
        lastName: 'Doe',
        program: 'Medical Assistant',
        startDate: '2024-09-01'
      })
      .expect(201);

    expect(response.body).toHaveProperty('applicationId');
  });

  it('should reject incomplete application', async () => {
    const response = await request(app)
      .post('/api/applications')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        firstName: 'John'
      })
      .expect(400);

    expect(response.body).toHaveProperty('errors');
  });
});
