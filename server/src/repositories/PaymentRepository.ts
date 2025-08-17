// src/repositories/PaymentRepository.ts

import { Op } from 'sequelize'
import Payment, { PaymentStatus, PaymentCreationAttributes } from '../models/Payment'
import { User } from '../models'
import BaseRepository from './BaseRepository'

interface PaymentWithApplicant extends Payment {
  applicantUser: User
}

class PaymentRepository extends BaseRepository<Payment> {
  constructor() {
    super(Payment)
  }

  async createPayment(data: PaymentCreationAttributes): Promise<Payment> {
    return await this.create(data)
  }

  async findPaymentsByApplicantUserId(applicantUserId: number): Promise<Payment[]> {
    const result = await this.findAll({
      where: { applicantUserId },
    })
    return result.data
  }

  async findPaymentsByDateRange(
    startDate: Date,
    endDate: Date,
    limit?: number,
    offset?: number
  ): Promise<Payment[]> {
    const where = {
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    }

    const options: any = { where }
    if (limit) options.limit = limit
    if (offset) options.offset = offset

    const result = await this.findAll(options)
    return result.data
  }
  async findPaymentsByUserAndSession(applicantUserId:string, sessionId:number): Promise<Payment[]>{
    return (await this.findAll({where:{applicantUserId,sessionId}})).data
  }
  async findPaymentByReference(reference: string): Promise<Payment | null> {
    return await this.findOne({ reference })
  }

  async updatePaymentByReference(reference: string, updates: Partial<Payment>): Promise<Payment | null> {
    return await this.updateWhere({ reference }, updates)
  }

  async updatePaymentById(id: number, updates: Partial<Payment>): Promise<Payment | null> {
    return await this.updateById(id, updates)
  }

  async findPaymentWithApplicant(reference: string): Promise<PaymentWithApplicant | null> {
    const include = [{ model: User, as: 'applicantUser' }]
    return await this.findOne({ reference }, { include }) as PaymentWithApplicant | null
  }

  async paymentExists(reference: string): Promise<boolean> {
    const payment = await this.findPaymentByReference(reference)
    return !!payment
  }
}

export default new PaymentRepository()