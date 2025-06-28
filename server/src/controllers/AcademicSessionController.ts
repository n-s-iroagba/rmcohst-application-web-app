import { Request, Response, NextFunction } from 'express'
import AcademicSessionService from '../services/AcademicSessionService'
import { logger } from '../utils/logger'
import { ApiResponseUtil } from '../utils/response'

class AcademicSessionController {
  // GET ALL ACADEMIC SESSIONS WITH PAGINATION
  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page = 1, limit = 10 } = req.query
      
      logger.info('Get all academic sessions endpoint called', { 
        page: Number(page), 
        limit: Number(limit) 
      })

      const result = await AcademicSessionService.getAllSessions(
        // Number(page), 
        // Number(limit)
      )

      res.status(200).json(result)
    } catch (error) {
      logger.error('Error fetching academic sessions', { error })
      next(error)
    }
  }



  // CREATE SINGLE ACADEMIC SESSION
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      logger.info('Create academic session endpoint called', { 
        name: req.body.name 
      })

      const session = await AcademicSessionService.createSession(req.body)

      res.status(201).json(
        ApiResponseUtil.success(
          session,
          'Academic session created successfully',
          201
        )
      )
    } catch (error) {
      logger.error('Error creating academic session', { 
        error, 
        sessionData: req.body 
      })
      next(error)
    }
  }



  // UPDATE ACADEMIC SESSION
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      
      logger.info('Update academic session endpoint called', { 
        id: Number(id),
        updates: req.body 
      })

      const updatedSession = await AcademicSessionService.updateSession(
        Number(id), 
        req.body
      )

      res.status(200).json(
        ApiResponseUtil.success(
          updatedSession,
          'Academic session updated successfully',
          200
        )
      )
    } catch (error) {
      logger.error('Error updating academic session', { 
        error, 
        id: req.params.id,
        updates: req.body 
      })
      next(error)
    }
  }

  // SET AS CURRENT SESSION
  setCurrent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      
      logger.info('Set current academic session endpoint called', { 
        id: Number(id) 
      })

      const session = await AcademicSessionService.setCurrentSession(Number(id))

      res.status(200).json(
        ApiResponseUtil.success(
          session,
          'Academic session set as current successfully',
          200
        )
      )
    } catch (error) {
      logger.error('Error setting current academic session', { 
        error, 
        id: req.params.id 
      })
      next(error)
    }
  }

  // DELETE ACADEMIC SESSION
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      
      logger.info('Delete academic session endpoint called', { 
        id: Number(id) 
      })

      const result = await AcademicSessionService.deleteSession(Number(id))

      res.status(200).json(
        ApiResponseUtil.success(
          result,
          'Academic session deleted successfully',
          200
        )
      )
    } catch (error) {
      logger.error('Error deleting academic session', { 
        error, 
        id: req.params.id 
      })
      next(error)
    }
  }
}

export default AcademicSessionController