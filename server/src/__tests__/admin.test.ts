import request from 'supertest'
import app from '../index'
import prisma from '../utils/db'
import { generateToken } from '../utils/auth'

describe('Admin Workflows', () => {
  let adminToken: string
  let testApplicationId: string

  beforeAll(async () => {
    const admin = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        password: 'hashedPassword',
        role: 'ADMIN',
      },
    })
    adminToken = generateToken(admin)

    const application = await prisma.application.create({
      data: {
        userId: 'testUserId',
        status: 'SUBMITTED',
      },
    })
    testApplicationId = application.id
  })

  afterAll(async () => {
    await prisma.application.deleteMany()
    await prisma.user.deleteMany()
  })

  describe('Application Review', () => {
    it('should allow admin to review application', async () => {
      const response = await request(app)
        .post(`/api/admin/applications/${testApplicationId}/review`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'UNDER_REVIEW', notes: 'Documents verified' })

      expect(response.status).toBe(200)
      expect(response.body.status).toBe('UNDER_REVIEW')
    })

    it('should prevent non-admin from reviewing', async () => {
      const userToken = generateToken({ id: 'user', role: 'USER' })
      const response = await request(app)
        .post(`/api/admin/applications/${testApplicationId}/review`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'UNDER_REVIEW' })

      expect(response.status).toBe(403)
    })
  })

  describe('Batch Processing', () => {
    it('should process multiple applications', async () => {
      const response = await request(app)
        .post('/api/admin/applications/batch')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          applicationIds: [testApplicationId],
          action: 'APPROVE',
        })

      expect(response.status).toBe(200)
      expect(response.body.processed).toBe(1)
    })
  })
})
