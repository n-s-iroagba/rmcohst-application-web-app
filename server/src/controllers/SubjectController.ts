import { Request, Response, NextFunction } from 'express'
import SubjectService from '../services/SubjectService'

class SubjectController {
  public static async bulkCreate(req: Request, res: Response, next: NextFunction) {
    try {
      const subjects = await SubjectService.bulkCreate(req.body)
      res.status(201).json(subjects)
    } catch (err) {
      next(err)
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const subject = await SubjectService.getById(Number(req.params.id))
      res.json(subject)
    } catch (err) {
      next(err)
    }
  }

  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const subjects = await SubjectService.getAll()
      res.json(subjects)
    } catch (err) {
      next(err)
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const subject = await SubjectService.update(Number(req.params.id), req.body)
      res.json(subject)
    } catch (err) {
      next(err)
    }
  }

  public static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await SubjectService.delete(Number(req.params.id))
      res.status(204).send()
    } catch (err) {
      next(err)
    }
  }
}

export default SubjectController
