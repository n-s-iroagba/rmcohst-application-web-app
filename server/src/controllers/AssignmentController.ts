// import { Request, Response, NextFunction } from 'express'
// import { body, param, query, validationResult } from 'express-validator'
// import ApplicationAssignmentService, { AssignmentType, AssignmentRequest } from '../services/ApplicationAssignmentService'
// import { AppError } from '../utils/errors'
// import logger from '../utils/logger'

// interface AuthenticatedRequest extends Request {
//   user?: {
//     id: number
//     role: string
//     staffId?: string
//   }
// }

// class AssignmentController {
//   private assignmentService: ApplicationAssignmentService

//   constructor() {
//     this.assignmentService = new ApplicationAssignmentService()
//   }

//   /**
//    * Get all available admission officers
//    */
//   public getAvailableOfficers = async (
//     req: AuthenticatedRequest,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       const officers = await this.assignmentService.getAvailableOfficers()

//       res.status(200).json({
//         success: true,
//         data: officers,
//         message: 'Officers retrieved successfully'
//       })
//     } catch (error) {
//       next(error)
//     }
//   }

//   /**
//    * Get assignment preview
//    */
//   public getAssignmentPreview = async (
//     req: AuthenticatedRequest,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       const errors = validationResult(req)
//       if (!errors.isEmpty()) {
//         throw new AppError('Validation failed', 400, errors.array())
//       }

//       const { assignmentType, targetId, academicSessionId } = req.query

//       const preview = await this.assignmentService.getAssignmentPreview(
//         assignmentType as AssignmentType,
//         targetId as string,
//         academicSessionId as string
//       )

//       res.status(200).json({
//         success: true,
//         data: preview,
//         message: 'Preview retrieved successfully'
//       })
//     } catch (error) {
//       next(error)
//     }
//   }

//   /**
//    * Assign applications to officer
//    */
//   public assignApplications = async (
//     req: AuthenticatedRequest,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       const errors = validationResult(req)
//       if (!errors.isEmpty()) {
//         throw new AppError('Validation failed', 400, errors.array())
//       }

//       const assignmentRequest: AssignmentRequest = {
//         officerId: req.body.officerId,
//         assignmentType: req.body.assignmentType,
//         count: req.body.count,
//         targetId: req.body.targetId,
//         academicSessionId: req.body.academicSessionId
//       }

//       const result = await this.assignmentService.assignApplications(assignmentRequest)

//       const statusCode = result.success ? 200 : 207 // 207 for partial success

//       res.status(statusCode).json({
//         success: result.success,
//         data: result,
//         message: result.success
//           ? `Successfully assigned ${result.assignedCount} applications`
//           : `Partially assigned ${result.assignedCount} of ${result.totalRequested} applications`
//       })

//       // Log the assignment action
//       logger.info('Application assignment completed', {
//         performedBy: req.user?.id,
//         officerId: assignmentRequest.officerId,
//         assignmentType: assignmentRequest.assignmentType,
//         requestedCount: assignmentRequest.count,
//         actuallyAssigned: result.assignedCount
//       })
//     } catch (error) {
//       next(error)
//     }
//   }

//   /**
//    * Get officer assignments with pagination
//    */
//   public getOfficerAssignments = async (
//     req: AuthenticatedRequest,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       const errors = validationResult(req)
//       if (!errors.isEmpty()) {
//         throw new AppError('Validation failed', 400, errors.array())
//       }

//       const { officerId } = req.params
//       const { status, academicSessionId, page, limit } = req.query

//       const assignments = await this.assignmentService.getOfficerAssignments(
//         officerId,
//         {
//           status: status as any,
//           academicSessionId: academicSessionId as string,
//           page: page ? parseInt(page as string) : undefined,
//           limit: limit ? parseInt(limit as string) : undefined
//         }
//       )

//       res.status(200).json({
//         success: true,
//         data: assignments,
//         message: 'Officer assignments retrieved successfully'
//       })
//     } catch (error) {
//       next(error)
//     }
//   }

//   /**
//    * Reassign application to different officer
//    */
//   public reassignApplication = async (
//     req: AuthenticatedRequest,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       const errors = validationResult(req)
//       if (!errors.isEmpty()) {
//         throw new AppError('Validation failed', 400, errors.array())
//       }

//       const { applicationId } = req.params
//       const { newOfficerId, reason } = req.body

//       // This would be implemented in ApplicationService
//       // const result = await this.applicationService.reassignApplication(
//       //   applicationId,
//       //   newOfficerId,
//       //   reason,
//       //   req.user?.id
//       // )

//       res.status(200).json({
//         success: true,
//         message: 'Application reassigned successfully'
//       })
//     } catch (error) {
//       next(error)
//     }
//   }

//   /**
//    * Get assignment statistics
//    */
//   public getAssignmentStatistics = async (
//     req: AuthenticatedRequest,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       const { academicSessionId } = req.query

//       // This would aggregate assignment data
//       const stats = {
//         totalApplications: 0,
//         assignedApplications: 0,
//         unassignedApplications: 0,
//         officerWorkload: [],
//         assignmentsByType: {},
//         recentAssignments: []
//       }

//       res.status(200).json({
//         success: true,
//         data: stats,
//         message: 'Assignment statistics retrieved successfully'
//       })
//     } catch (error) {
//       next(error)
//     }
//   }
// }

// export default AssignmentController
