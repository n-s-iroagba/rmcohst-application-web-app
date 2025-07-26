import AdmissionSession, { AdmissionSessionCreationAttributes } from '../models/AdmissionSession'
import { AppError, BadRequestError, NotFoundError } from '../utils/errors'
import logger from '../utils/logger'

class AdmissionSessionService {
  // CREATE
  static async createSession(data: AdmissionSessionCreationAttributes) {
    try {
      const session = await AdmissionSession.create(data)
      logger.info('Created academic session', { id: session.id })
      return session
    } catch (error) {
      logger.error('Error creating academic session', { error })
      throw error
    }
  }

  // READ ALL
  static async getAllSessions() {
    try {
      return await AdmissionSession.findAll({
        order: [['createdAt', 'DESC']],
      })
    } catch (error) {
      logger.error('Error fetching academic sessions', { error })
      throw error
    }
  }

  // READ ONE
  static async getSessionById(id: number) {
    try {
      const session = await AdmissionSession.findByPk(id)
      if (!session) {
        throw new NotFoundError('Academic session not found')
      }
      return session
    } catch (error) {
      logger.error(`Error fetching academic session with id ${id}`, { error })
      throw error
    }
  }

  // GET CURRENT SESSION
  static async getCurrentSession() {
    try {
      const session = await AdmissionSession.findOne({
        where: { isCurrent: true },
      })
      if (!session) {
        throw new NotFoundError('No current academic session found')
      }
      return session
    } catch (error) {
      logger.error('Error fetching current academic session', { error })
      throw error
    }
  }

  // UPDATE
  static async updateSession(
    id: number,
    updates: Partial<{
      name: string
      reportingDate: Date
      isCurrent: boolean
    }>
  ) {
    try {
      const session = await AdmissionSession.findByPk(id)
      if (!session) {
        throw new NotFoundError('Academic session not found')
      }

      // If setting this session as current, first unset all other sessions
      if (updates.isCurrent === true) {
        await AdmissionSession.update({ isCurrent: false }, { where: { isCurrent: true } })
      }

      await session.update(updates)
      logger.info(`Updated academic session with id ${id}`)
      return session
    } catch (error) {
      logger.error(`Error updating academic session with id ${id}`, { error })
      throw error
    }
  }

  // SET AS CURRENT SESSION
  static async setCurrentSession(id: number) {
    try {
      const session = await AdmissionSession.findByPk(id)
      if (!session) {
        throw new NotFoundError('Academic session not found')
      }

      // First, unset all current sessions
      await AdmissionSession.update({ isCurrent: false }, { where: { isCurrent: true } })

      // Set the specified session as current
      await session.update({ isCurrent: true })
      logger.info(`Set academic session with id ${id} as current`)
      return session
    } catch (error) {
      logger.error(`Error setting academic session with id ${id} as current`, { error })
      throw error
    }
  }

  // DELETE
  static async deleteSession(id: number) {
    try {
      const session = await AdmissionSession.findByPk(id)
      if (!session) {
        throw new NotFoundError('Academic session not found')
      }

      // Prevent deletion of current session
      if (session.isCurrent) {
        throw new BadRequestError('Cannot delete current academic session')
      }

      await session.destroy()
      logger.info(`Deleted academic session with id ${id}`)
      return { message: 'Academic session deleted successfully' }
    } catch (error) {
      logger.error(`Error deleting academic session with id ${id}`, { error })
      throw error
    }
  }
}

export default AdmissionSessionService
