import AcademicSession from '../models/AcademicSession'
import { AppError } from '../utils/error/AppError'
import logger from '../utils/logger/logger'

class AcademicSessionService {
  // CREATE
  static async createSession(data: {
    sessionName: string
    reportingDate: Date
    isCurrent?: boolean
  }) {
    try {
      const session = await AcademicSession.create(data)
      logger.info('Created academic session', { id: session.id })
      return session
    } catch (error) {
      logger.error('Error creating academic session', { error })
      throw new AppError('Failed to create academic session', 500)
    }
  }

  // READ ALL
  static async getAllSessions() {
    try {
      return await AcademicSession.findAll({
        order: [['createdAt', 'DESC']],
      })
    } catch (error) {
      logger.error('Error fetching academic sessions', { error })
      throw new AppError('Could not retrieve academic sessions', 500)
    }
  }

  // READ ONE
  static async getSessionById(id: number) {
    try {
      const session = await AcademicSession.findByPk(id)
      if (!session) {
        throw new AppError('Academic session not found', 404)
      }
      return session
    } catch (error) {
      logger.error(`Error fetching academic session with id ${id}`, { error })
      throw error instanceof AppError ? error : new AppError('Could not fetch session', 500)
    }
  }

  // GET CURRENT SESSION
  static async getCurrentSession() {
    try {
      const session = await AcademicSession.findOne({
        where: { isCurrent: true },
      })
      if (!session) {
        throw new AppError('No current academic session found', 404)
      }
      return session
    } catch (error) {
      logger.error('Error fetching current academic session', { error })
      throw error instanceof AppError ? error : new AppError('Could not fetch current session', 500)
    }
  }

  // UPDATE
  static async updateSession(
    id: number,
    updates: Partial<{
      sessionName: string
      reportingDate: Date
      isCurrent: boolean
    }>
  ) {
    try {
      const session = await AcademicSession.findByPk(id)
      if (!session) {
        throw new AppError('Academic session not found', 404)
      }

      // If setting this session as current, first unset all other sessions
      if (updates.isCurrent === true) {
        await AcademicSession.update({ isCurrent: false }, { where: { isCurrent: true } })
      }

      await session.update(updates)
      logger.info(`Updated academic session with id ${id}`)
      return session
    } catch (error) {
      logger.error(`Error updating academic session with id ${id}`, { error })
      throw error instanceof AppError ? error : new AppError('Could not update session', 500)
    }
  }

  // SET AS CURRENT SESSION
  static async setCurrentSession(id: number) {
    try {
      const session = await AcademicSession.findByPk(id)
      if (!session) {
        throw new AppError('Academic session not found', 404)
      }

      // First, unset all current sessions
      await AcademicSession.update({ isCurrent: false }, { where: { isCurrent: true } })

      // Set the specified session as current
      await session.update({ isCurrent: true })
      logger.info(`Set academic session with id ${id} as current`)
      return session
    } catch (error) {
      logger.error(`Error setting academic session with id ${id} as current`, { error })
      throw error instanceof AppError
        ? error
        : new AppError('Could not set session as current', 500)
    }
  }

  // DELETE
  static async deleteSession(id: number) {
    try {
      const session = await AcademicSession.findByPk(id)
      if (!session) {
        throw new AppError('Academic session not found', 404)
      }

      // Prevent deletion of current session
      if (session.isCurrent) {
        throw new AppError('Cannot delete current academic session', 400)
      }

      await session.destroy()
      logger.info(`Deleted academic session with id ${id}`)
      return { message: 'Academic session deleted successfully' }
    } catch (error) {
      logger.error(`Error deleting academic session with id ${id}`, { error })
      throw error instanceof AppError ? error : new AppError('Could not delete session', 500)
    }
  }
}

export default AcademicSessionService
