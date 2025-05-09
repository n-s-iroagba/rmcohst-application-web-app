
import request from 'supertest';
import app from '../index';
import { createTestUser, cleanupTestUser } from '../test/helpers';

describe('Integration Tests', () => {
  let authToken: string;
  let applicationId: string;

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

  it('should complete full application workflow', async () => {
    // Create application
    const applicationResponse = await request(app)
      .post('/api/applications')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        firstName: 'John',
        lastName: 'Doe',
        program: 'Medical Assistant'
      });
    
    applicationId = applicationResponse.body.applicationId;
    expect(applicationId).toBeDefined();

    // Upload documents
    const documentResponse = await request(app)
      .post(`/api/applications/${applicationId}/documents`)
      .set('Authorization', `Bearer ${authToken}`)
      .attach('waec', 'test/fixtures/test-waec.pdf')
      .attach('birthCertificate', 'test/fixtures/test-birth-cert.pdf');
    
    expect(documentResponse.status).toBe(200);

    // Check status
    const statusResponse = await request(app)
      .get(`/api/applications/${applicationId}/status`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(statusResponse.body.status).toBe('Under Review');

    // Get decision
    const decisionResponse = await request(app)
      .get(`/api/applications/${applicationId}/decision`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(decisionResponse.body.status).toBeDefined();

    // Get admission letter
    const letterResponse = await request(app)
      .get(`/api/applications/${applicationId}/admission-letter`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(letterResponse.body.letterUrl).toBeDefined();
  });
});
