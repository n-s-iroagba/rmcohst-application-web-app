import { Router } from 'express'

const router = Router()

// // Apply authentication to all routes
// router.use(authenticate)

// /**
//  * @route   GET /api/assignments/officers
//  * @desc    Get all available admission officers
//  * @access  Head of Admissions, Admin
//  */
// router.get(
//   '/officers',
//   authorize(['HEAD_OF_ADMISSIONS', 'ADMIN']),
//   assignmentController.getAvailableOfficers
// )

// /**
//  * @route   GET /api/assignments/preview
//  * @desc    Get assignment preview based on criteria
//  * @access  Head of Admissions, Admin
//  */
// router.get(
//   '/preview',
//   authorize(['HEAD_OF_ADMISSIONS', 'ADMIN']),
//   assignmentValidation.getPreview,
//   validateRequest,
//   assignmentController.getAssignmentPreview
// )

// /**
//  * @route   POST /api/assignments/assign
//  * @desc    Assign applications to an officer
//  * @access  Head of Admissions, Admin
//  */
// router.post(
//   '/assign',
//   authorize(['HEAD_OF_ADMISSIONS', 'ADMIN']),
//   assignmentValidation.assignApplications,
//   validateRequest,
//   assignmentController.assignApplications
// )

// /**
//  * @route   GET /api/assignments/officer/:officerId
//  * @desc    Get assignments for a specific officer
//  * @access  Head of Admissions, Admin, Admission Officer (own assignments only)
//  */
// router.get(
//   '/officer/:officerId',
//   authorize(['HEAD_OF_ADMISSIONS', 'ADMIN', 'ADMISSION_OFFICER']),
//   assignmentValidation.getOfficerAssignments,
//   validateRequest,
//   assignmentController.getOfficerAssignments
// )

// /**
//  * @route   PUT /api/assignments/reassign/:applicationId
//  * @desc    Reassign application to different officer
//  * @access  Head of Admissions, Admin
//  */
// router.put(
//   '/reassign/:applicationId',
//   authorize(['HEAD_OF_ADMISSIONS', 'ADMIN']),
//   assignmentValidation.reassignApplication,
//   validateRequest,
//   assignmentController.reassignApplication
// )

// /**
//  * @route   GET /api/assignments/statistics
//  * @desc    Get assignment statistics and analytics
//  * @access  Head of Admissions, Admin
//  */
// router.get(
//   '/statistics',
//   authorize(['HEAD_OF_ADMISSIONS', 'ADMIN']),
//   assignmentController.getAssignmentStatistics
// )

export default router
