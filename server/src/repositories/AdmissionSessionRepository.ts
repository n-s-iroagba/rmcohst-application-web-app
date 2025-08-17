// src/repositories/AdmissionSessionRepository.ts

import AdmissionSession, { AdmissionSessionCreationAttributes } from '../models/AdmissionSession'
import BaseRepository from './BaseRepository'

class AdmissionSessionRepository extends BaseRepository<AdmissionSession> {
  constructor() {
    super(AdmissionSession)
  }

  async createSession(sessionData: AdmissionSessionCreationAttributes): Promise<AdmissionSession> {
    return await this.create(sessionData)
  }

  async findAllSessions() {
    const result = await this.findAll({
      order: [['createdAt', 'DESC']],
    })
    return result.data
  }

  async findSessionById(id: number): Promise<AdmissionSession | null> {
    return await this.findById(id)
  }

  async findCurrentSession(): Promise<AdmissionSession | null> {
    return await this.findOne({ isCurrent: true })
  }

  async updateSession(id: number, updates: Partial<AdmissionSession>): Promise<AdmissionSession | null> {
    return await this.updateById(id, updates)
  }

  async unsetAllCurrentSessions(): Promise<void> {
    await this.updateWhere({ isCurrent: true }, { isCurrent: false })
  }

  async deleteSession(id: number): Promise<boolean> {
    return await this.deleteById(id)
  }

  async sessionExists(id: number): Promise<boolean> {
    return await this.existsById(id)
  }
}

export default new AdmissionSessionRepository()