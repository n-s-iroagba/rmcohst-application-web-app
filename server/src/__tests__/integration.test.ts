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

    // Test acceptance fee payment and upgrade
    const paymentResponse = await request(app)
      .post(`/api/applications/${applicationId}/acceptance-fee`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        amount: 50000,
        paymentMethod: 'card',
        transactionId: 'test_transaction'
      });

    expect(paymentResponse.status).toBe(200);
    expect(paymentResponse.body.status).toBe('paid');

    // Test student upgrade
    const upgradeResponse = await request(app)
      .post(`/api/applications/${applicationId}/upgrade`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(upgradeResponse.status).toBe(200);
    expect(upgradeResponse.body.studentId).toBeDefined();
    expect(upgradeResponse.body.status).toBe('enrolled');
  });
});
