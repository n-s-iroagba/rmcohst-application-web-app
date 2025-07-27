import { Request, Response } from 'express'
import ProgramService from '../services/ProgramService'
import logger from '../utils/logger'

export default class ProgramController {
  static async createBulk(req: Request, res: Response) {
    try {
      const programs = await ProgramService.createBulk(req.body)
       res.status(201).json(programs)
    } catch (error) {
      logger.error('Create bulk program failed:', error)
       res.status(500).json({ error: 'Internal server error' })
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query
      const programs = await ProgramService.getAll(+page, +limit)
       res.json(programs)
    } catch (error) {
      logger.error('Fetch all programs failed:', error)
       res.status(500).json({ error: 'Internal server error' })
    }
  }

  static async getByFaculty(req: Request, res: Response) {
    try {
      const facultyId = +req.params.facultyId
      const programs = await ProgramService.getByFaculty(facultyId)
       res.json(programs)
    } catch (error) {
      logger.error('Fetch by faculty failed:', error)
       res.status(500).json({ error: 'Internal server error' })
    }
  }

  static async getByDepartment(req: Request, res: Response) {
    try {
      const departmentId = +req.params.departmentId
      const programs = await ProgramService.getByDepartment(departmentId)
       res.json(programs)
    } catch (error) {
      logger.error('Fetch by department failed:', error)
       res.status(500).json({ error: 'Internal server error' })
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = +req.params.id
      const updated = await ProgramService.update(id, req.body)
       res.json(updated)
    } catch (error) {
      logger.error('Update program failed:', error)
       res.status(500).json({ error: 'Internal server error' })
    }
  }

  static async makeInactive(req: Request, res: Response) {
    try {
      const id = +req.params.id
      await ProgramService.makeInactive(id)
       res.sendStatus(204)
    } catch (error) {
      logger.error('Make inactive failed:', error)
       res.status(500).json({ error: 'Internal server error' })
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = +req.params.id
      await ProgramService.delete(id)
       res.sendStatus(204)
    } catch (error) {
      logger.error('Delete program failed:', error)
       res.status(500).json({ error: 'Internal server error' })
    }
  }
}